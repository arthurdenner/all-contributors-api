import { NowRequest, NowResponse } from '@now/node';
import { getContributors } from '../_utils';

export default async (req: NowRequest, res: NowResponse) => {
  try {
    const { type } = req.query;
    const contributors = await getContributors(req, res);

    if (!contributors) {
      return;
    }

    const contributorsByType = !type
      ? contributors
      : contributors.filter((c) => c.contributions.includes(type as string));

    // https://vercel.com/docs/v2/serverless-functions/edge-caching#recommended-inlinecode
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=600');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(contributorsByType.map((c) => c.login));
  } catch (err) {
    if (err.statusCode === 404) {
      res.status(404).end();
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};
