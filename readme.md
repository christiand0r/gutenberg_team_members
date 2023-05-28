# Gutenberg block template

This template is configured to use:

-   Eslint and prettier as a linter and formatter
-   Stylelint to format styles.
-   Configuration based on ".scss" files
-   Wordpress stubs to work inside the folder and avoid using the entire Wordpress folder

In case of using VSCode, you can edit .vscode/settings.json to modify editor behaviors and change style settings to use ".css" or another extension

## How use?

You need to run the following commands to use this template correctly:

```
// Install NPM dependecies
npm install

// Install Composer dependecies (this is the stub)
composer install

// Run the build for generate the folder
npm build
```
