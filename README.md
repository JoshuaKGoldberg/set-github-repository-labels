<h1 align="center">Set GitHub Repository Labels</h1>

<p align="center">
	Sets labels for a GitHub repository, including renaming existing similar labels.
	🏷️
</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 1" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-1-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/set-github-repository-labels/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/set-github-repository-labels" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/set-github-repository-labels?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/set-github-repository-labels/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg" /></a>
	<a href="http://npmjs.com/package/set-github-repository-labels" target="_blank"><img alt="📦 npm version" src="https://img.shields.io/npm/v/set-github-repository-labels?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
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

`set-github-repository-labels` provides two functions:

- [`determineLabelChanges`](#determinelabelchanges): describes the changes a repository's labels would need to get to the outcome labels
- [`setGitHubRepositoryLabels`](#setgithubrepositorylabels): sends the API requests to the repository to set its labels

## `determineLabelChanges`

Takes two required parameters:

1. `existingLabels`: an array of the labels that currently exist on a repository
2. `outcomeLabels`: an array of the labels that you want to exist on the repository

Returns an array of change objects describing the network requests that would be needed to change the repository's existing labels to the outcome labels.

For example, determine label changes on an existing repository with only one label to having two:

```ts
import { determineLabelChanges } from "set-github-repository-labels";

const changes = determineLabelChanges(
	[{ color: "ff0000", description: "Something isn't working.", name: "bug" }],
	[
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
);

for (const change of changes) {
	switch (change.type) {
		case "delete":
			console.log(`DELETE: ${change.name}`);
			break;
		case "patch":
			console.log(`PATCH: ${change.originalName} to ${change.newName}`);
			break;
		case "post":
			console.log(`POST: ${change.name}`);
			break;
	}
}
```

See `src/types.ts` for the specific properties that exist on the change objects.

## `setGitHubRepositoryLabels`

Takes a parameters object with the following properties corresponding to [Shell options](#shell):

- `auth` _(optional)_: Auth token to create a new GitHub Octokit
- `bandwidth` _(optional)_: How many requests to send at once
- `labels` _(required)_: Outcome labels to end with on the repository
- `owner` _(required)_: Organization or user the repository is owned by
- `repository` _(required)_: Name of the repository

It returns a Promise for sending requests to the GitHub API to update the repository's labels.

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
npx set-github-repository-labels --labels "$(cat labels.json)" --owner JoshuaKGoldberg --repository "create-typescript-app"
```

To call it programmatically, you can use something like [`execa`](https://www.npmjs.com/package/execa):

```ts
import $ from "execa";
import fs from "node:fs/promises";

const labels = (await fs.readFile("labels.json")).toString();

await $`npx set-github-repository-labels --labels ${labels} --owner JoshuaKGoldberg --repository "create-typescript-app"`;
```

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 🏷

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="http://www.joshuakgoldberg.com/"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg ✨"/><br /><sub><b>Josh Goldberg ✨</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/set-github-repository-labels/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#content-JoshuaKGoldberg" title="Content">🖋</a> <a href="https://github.com/JoshuaKGoldberg/set-github-repository-labels/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#projectManagement-JoshuaKGoldberg" title="Project Management">📆</a> <a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

> 💝 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) using the [Bingo engine](https://create.bingo).
