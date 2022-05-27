# 20 Pre-commit hook with husky and prettier

Git hooks allow us to run an script every time a certain event from git happen. Most important hooks are pre-commit, prepare-commit-msg, commit-msg, post-commit, pre-push, post-checkout and post-merge.

Husky is a tool that allows us to easily wrangle Git hooks and run the scripts we want at those stages.
In this example we will configure husky + prettier to format the code just before the commit.

We will start from sample \_19-hmr-2

Summary steps:

- Init a git repository
- Install and configure husky
- Install and configure prettier and pretty-quick.

# Steps to build it

## Prerequisites

Prerequisites, you will need to have nodejs installed in your computer. If you want to follow this step guides you will need to take as starting point sample \_19-hmr-2.

## Steps

- `npm install` to install previous sample packages:

```bash
npm install
```

Husky require by default to have .git and package.json in the same folder. If that is not your case you can configure following this [link](https://typicode.github.io/husky/#/?id=custom-directory).

- Init your git repository

```bash
git init
```

- Add prettier and pretty-quick to dev dependecies

```bash
npm install --save-dev prettier pretty-quick
```

- You can modify prettier default config adding a .prettierrc file in root directory. [More info](https://prettier.io/docs/en/configuration.html) about possible configurations. In this example we are going to use a basic one:

```json
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true
}
```

- Add husky to dev devepencies and install it

```bash
npx husky-init
```

- Create a pre-commit hook that run pretty quick only with staged files

```bash
npx husky set .husky/pre-commit "npx pretty-quick --staged"
```

- Next commit you run in console we will check modified files and apply prettier.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
