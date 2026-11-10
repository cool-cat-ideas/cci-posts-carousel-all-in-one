# Build from source

Use Node.js 23.7 or later and npm 11.7 or later. From this repository:

```sh
npm ci
npm run build
```

The lockfile pins public CCI Admin UI release archives and integrity hashes.
The source and build tools for those packages are maintained at
[CCI Admin UI on GitHub](https://github.com/cool-cat-ideas/cci-admin-ui).
A private framework checkout and Pro sources are not required to build this product.

For a shared component change, contribute to the UI repository. Build its candidate
release, then use its `scripts/prepare-product.mjs /absolute/path/to/this/product`
command to install the candidate and update the product lockfile. Run this product's
normal build afterwards. Do not edit installed files under `node_modules`.

These commands build assets only; they do not publish or create an installable ZIP.
