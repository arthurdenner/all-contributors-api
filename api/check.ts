import { NowRequest, NowResponse } from '@now/node';
import { get } from 'httpie';
import { Contributor } from './_types';

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

    // https://vercel.com/docs/v2/serverless-functions/edge-caching#recommended-inlinecode
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=600');
    res.status(200).send(contributors.some((c) => c.login === username));
  } catch (err) {
    if (err.statusCode === 404) {
      res.status(404).end();
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};
