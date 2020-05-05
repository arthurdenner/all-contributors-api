# all-contributors-api

Serverless functions to check data according to the [all-contributors spec](https://allcontributors.org).

Powered by [Vercel](https://vercel.com). Every response is cached for 10min (600s).

Available on [https://all-contributors.now.sh](https://all-contributors.now.sh).

## API

### Base URL

`https://all-contributors.now.sh/api`

### Check if user is contributor on a repo

- URL: `/check?repo=OWNER/REPO&username=GITHUB_USER`
- Response: `true` or `false`

### Get contributions of user on a repo

- URL: `/contributions?repo=OWNER/REPO&username=GITHUB_USER`
- Response: `string[]`

## License

MIT © Arthur Denner
