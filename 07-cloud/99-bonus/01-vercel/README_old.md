# 05 Ver

Pre: Create account in vercel.com

Reference: https://www.eliostruyf.com/deploy-site-vercel-github-actions-releases/

# Steps

Install vercel CLI as global npm:

```
npm i -g vercel
```

Link current code with a new project in vercel:

```
vercel link
```

Get `projectId` and `orgId` from `.vercel` folder and create secrets on Github settins

Create `vercel.json` to disabled auto deploy on push with Github, we take over control and trigger deploys with Github Actions

_./vercel.json_

```json
{
  "github": {
    "enabled": false,
    "silent": true
  }
}
```


Create token in Account Settings (not project settings) > tokens
