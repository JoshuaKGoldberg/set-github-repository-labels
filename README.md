<h1 align="center">Set GitHub Repository Labels</h1>

<p align="center">Sets labels for a GitHub repository, including renaming existing similar labels. 🏷️</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 1" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-1-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/set-github-repository-labels/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/set-github-repository-labels" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/set-github-repository-labels?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/set-github-repository-labels/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg"></a>
	<a href="http://npmjs.com/package/set-github-repository-labels"><img alt="📦 npm version" src="https://img.shields.io/npm/v/set-github-repository-labels?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

## Usage

Sets a collection of labels on a repository.

For each outcome label, if its name, the same words excluding its `prefix:`, or any of its aliases already exists, that existing label is updated.
Otherwise, a new label is created.

### Node.js API

```shell
npm i set-github-repository-labels
```

```ts
import { setGitHubRepositoryLabels } from "set-github-repository-labels";

await setGitHubRepositoryLabels({
	labels: [
		{
			color: "d73a4a",
			description: "Something isn't working 🐛",
			name: "type: bug",
		},
		{
			aliases: ["enhancement"],
			color: "a2eeef",
			description: "New enhancement or request 🚀",
			name: "type: feature",
		},
	],
	owner: "JoshuaKGoldberg",
	repository: "create-typescript-app",
});
```

### Shell

`set-github-repository-labels` can be run as an `npx` command.

| Option         | Type     | Default or Required                                 | Description                                                                                            |
| -------------- | -------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `--auth`       | `string` | `process.env.GH_TOKEN` or executing `gh auth token` | Auth token for GitHub from [`octokit-from-auth`](https://github.com/JoshuaKGoldberg/octokit-from-auth) |
| `--bandwidth`  | `number` | `6`                                                 | Maximum parallel requests to start at once                                                             |
| `--labels`     | `string` | _(required)_                                        | Raw JSON string                                                                                        |
| `--owner`      | `string` | _(required)_                                        | Owning organization or username for the repository                                                     |
| `--repository` | `string` | _(required)_                                        | Title of the repository                                                                                |

Because `labels` takes in data as a raw JSON string, so you'll most likely want to pipe data to it from a JSON source:

```shell
npx set-github-repository --labels "$(cat labels.json)" --owner JoshuaKGoldberg --repository "create-typescript-app"
```

To call it programmatically, you can use with something like [`execa`](https://www.npmjs.com/package/execa):

```ts
import $ from "execa";
import fs from "node:fs/promises";

const labels = (await fs.readFile("labels.json")).toString();

await $`npx set-github-repository --labels ${labels} -- --owner JoshuaKGoldberg --repository "create-typescript-app"`;
```

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 💖

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com/"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg ✨"/><br /><sub><b>Josh Goldberg ✨</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/set-github-repository-labels/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#content-JoshuaKGoldberg" title="Content">🖋</a> <a href="https://github.com/JoshuaKGoldberg/set-github-repository-labels/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#projectManagement-JoshuaKGoldberg" title="Project Management">📆</a> <a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

<!-- You can remove this notice if you don't want it 🙂 no worries! -->

> 💝 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) using the [`create` engine](https://github.com/JoshuaKGoldberg/create).
