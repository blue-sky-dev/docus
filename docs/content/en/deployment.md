---
title: Deployment
category: More
description: 'Deploy your documentation with Docus to any static hosting 🪶'
position: 16
---

To generate the documentation for production, run the following command:

<code-group>
  <code-block label="Yarn" active>

```bash
yarn build
```

</code-block>
<code-block label="NPM">

```bash
npm run build
```

</code-block>
</code-group>

A `dist/` directory will be generated, ready to be deployed on any static hosting (GitHub pages, Vercel, Netlify, Surge, etc).