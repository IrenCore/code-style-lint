# code-style-lint
Code style lint config for front-end project.

### How to use

- For javascript project

  ```js
  //npm
  npm install eslint-config-code-style-lint eslint prettier -D
  //pnpm 
  pnpm install eslint-config-code-style-lint eslint prettier -D
  //yarn
  yarn add eslint-config-code-style-lint eslint prettier -D
  ```

  Create a '.eslintrc' file to your project root

  ```javascript
  {
    //...
    "extends": ["code-style-lint"]
    //...
  }
  ```