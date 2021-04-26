# Contributing

When contributing to this repository, please follow the following rules to keep a standard and allow safe contributions.

## Test coverage

- The project uses [Jest](https://jestjs.io/) as it's Testing Framework
- All new changes should have relevant test coverage

## Commits

- Commit messages should be created using `npm run commit`.

  This uses [Commitizen](http://commitizen.github.io/cz-cli/) to format the commit messages in a way that is compatible with [SemanticRelease](https://github.com/semantic-release/semantic-release).

  1. Stage files needed for the commit
  2. Run `npm run commit`.
  3. Follow the instructions

- Commit messages should be [signed](https://docs.github.com/en/github/authenticating-to-github/about-commit-signature-verification).

  If needed, you can installed and configure `gpg` by following these steps:

  1. Install `gpg`. If you are on a Mac, you can use:

     ```bash
     brew install gpg
     ```

  2. Generate `GPG key`. See [Generating a new GPG key](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-gpg-key) for reference.

     ```bash
     gpg --full-generate-key
     ```

  3. Link your Github account with your GPG key. For reference follow [Tell git about your signing key](https://docs.github.com/en/github/authenticating-to-github/telling-git-about-your-signing-key).

     ```bash
     gpg --list-secret-keys --keyid-format LONG
     ```

     From the result of that command you'll get the `KeyID` (`sec` string after `rsa{keysize}/` )

     In a case with RSA of 4096 bits we would see `rsa4096/3AA5C34371567BD2` and should take `3AA5C34371567BD2`

     Copy public key from running

     ```bash
     gpg --armor --export {KeyID}
     ```

     Create a new `GPG key` in [Github](https://github.com/settings/keys) and paste the copied public key

  4. Configure `git` to sign your commits
     ```bash
     git config --global user.signingkey {KeyID}
     git config --global commit.gpgSign true
     ```
