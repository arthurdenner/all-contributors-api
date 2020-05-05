import { NowRequest, NowResponse } from '@now/node';
import { get } from 'httpie';
import { Contributor } from './_types';

export const getContributors = async (
  req: NowRequest,
  res: NowResponse
): Promise<Contributor[] | undefined> => {
  const { repo } = req.query;

  if (!repo) {
    res.status(400).send({ message: 'Provide the `repo` parameter' });
    return;
  }

  const uri = `https://raw.githubusercontent.com/${repo}/master/.all-contributorsrc`;

  return get<string>(uri).then(({ data }) => JSON.parse(data).contributors);
};
