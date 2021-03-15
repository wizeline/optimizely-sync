# Optimizely Sync

Infrustructure as code for your Optimizely configuration.

## Getting started

1. Install as a devDependency:
   ```bash
   npm i --save-dev @wizeline/optimizely-sync
   ```
2. Create your configuration. This can either be done in a single JSON file or in a directory of JSON files:

   - A single JSON file:
     **config.json**

     ```json
     {
       "development": {
         "feature-one": 10000,
         "other-feature": 10000
       },
       "production": {
         "feature-one": 0,
         "other-feature": 10000
       }
     }
     ```

   - A directory of JSON files, where each file is the key of an environment:

     **config/development.json**

     ```json
     {
       "created-by-js": 10000,
       "feature-one": 10000,
       "other-feature": 10000
     }
     ```

     **config/production.json**

     ```json
     {
       "created-by-js": 0,
       "feature-one": 0,
       "other-feature": 10000
     }
     ```

     **Note:** This option allows you to control who can edit configuration for various environments via a [CODEOWNERS][codeowners] file.

3. Create an [Optimizely Personal Token](https://app.optimizely.com/v2/profile/api).
4. Run `npx optimizely-sync -d config/ -p 12345678901 -t "your-token-here" --dry-run`

## CLI Flags

| Flag                                                  | Description                                                                                                |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `--dry-run`                                           | Log what would be done                                                                                     |
| `-c <path>` or <br /> `--config-file <path>`          | The path to the file that contains your desired configuration.                                             |
| `-d <path>` or <br /> `--config-dir <path>`           | The path to the directory that contains json files with your desired configurations.                       |
| `-p <projectId>` or <br /> `--project-id <projectId>` | The id of the Optimizely project. Can also be set via the OPTIMIZELY_PROJECT_ID environment variable.      |
| `-t <token>` or <br />`--access-token <token>`        | An Optimizely Personal Access Token. Can also be set via the OPTIMIZELY_ACCESS_TOKEN environment variable. |
| `-h` or <br />`--help`                                | display help for command                                                                                   |

## TODO

- [ ] Improve README
- [ ] Add tests
- [ ] Add support for creating/deleting environments

<!-- Reference Links: -->

[codeowners]: https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners
