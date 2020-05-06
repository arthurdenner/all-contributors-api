import { NowRequest, NowResponse } from '@now/node';
import { getContributors } from './_utils';

export default async (req: NowRequest, res: NowResponse) => {
  try {
    const { username } = req.query;

    if (!username) {
      res
        .status(400)
        .send({ message: 'Provide the `username` query parameter' });
      return;
    }

    const contributors = await getContributors(req, res);

    if (!contributors) {
      return;
    }

    // https://vercel.com/docs/v2/serverless-functions/edge-caching#recommended-inlinecode
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=600');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(contributors.some((c) => c.login === username));
  } catch (err) {
    if (err.statusCode === 404) {
      res.status(404).end();
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};
