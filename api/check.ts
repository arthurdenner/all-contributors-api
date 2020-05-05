import { NowRequest, NowResponse } from '@now/node';
import { get } from 'httpie';

interface Contributor {
  login: string;
  contributions: string[];
}

export default async (req: NowRequest, res: NowResponse) => {
  try {
    const { repo, username } = req.query;

    if (!repo) {
      res.status(400).send({ message: 'Provide the `repo` parameter' });
      return;
    }

    if (!username) {
      res.status(400).send({ message: 'Provide the `username` parameter' });
      return;
    }

    const uri = `https://raw.githubusercontent.com/${repo}/master/.all-contributorsrc`;

    const contributors: Contributor[] = await get<string>(uri).then(
      ({ data }) => JSON.parse(data).contributors
    );
    const userContributor = contributors.find((c) => c.login === username);

    // https://vercel.com/docs/v2/serverless-functions/edge-caching#recommended-inlinecode
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=600');

    if (!userContributor) {
      res.status(200).send({
        isContributor: false,
        contributions: [],
      });
    } else {
      res.status(200).send({
        isContributor: true,
        contributions: userContributor.contributions,
      });
    }
  } catch (err) {
    if (err.statusCode === 404) {
      res.status(404).end();
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};
