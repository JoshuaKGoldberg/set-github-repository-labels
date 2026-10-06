import { afterEach, describe, expect, it, vi } from "vitest";

import { cli } from "./cli.js";

const mockSetGitHubRepositoryLabels = vi.fn();

vi.mock("./setGitHubRepositoryLabels", () => ({
	get setGitHubRepositoryLabels() {
		return mockSetGitHubRepositoryLabels;
	},
}));

const label = {
	color: "000000",
	description: "def ghi",
	name: "area: abc",
};

const validArgs = [
	"--owner",
	"TestOwner",
	"--repository",
	"TestRepository",
	"--labels",
	JSON.stringify([label]),
];

const error = vi.fn();
const log = vi.fn();

function getPrinted(mock: typeof error) {
	return mock.mock.calls.map((call) => call.join(" ")).join("\n");
}

async function run(args: string[]) {
	await cli(args, { error, log });
}

describe("cli", () => {
	afterEach(() => {
		process.exitCode = undefined;
	});

	it("passes parsed settings to setGitHubRepositoryLabels when args are valid", async () => {
		await run(validArgs);

		expect(mockSetGitHubRepositoryLabels.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    {
			      "labels": [
			        {
			          "color": "000000",
			          "description": "def ghi",
			          "name": "area: abc",
			        },
			      ],
			      "owner": "TestOwner",
			      "repository": "TestRepository",
			    },
			  ],
			]
		`);
		expect(error).not.toHaveBeenCalled();
		expect(process.exitCode).toBeUndefined();
	});

	it("passes auth to setGitHubRepositoryLabels when provided", async () => {
		await run([...validArgs, "--auth", "abc123"]);

		expect(mockSetGitHubRepositoryLabels).toHaveBeenCalledWith({
			auth: "abc123",
			labels: [label],
			owner: "TestOwner",
			repository: "TestRepository",
		});
	});

	it("concatenates labels when --labels is provided multiple times", async () => {
		const other = { color: "ffffff", description: "jkl", name: "other" };

		await run([...validArgs, "--labels", JSON.stringify([other])]);

		expect(mockSetGitHubRepositoryLabels).toHaveBeenCalledWith({
			labels: [label, other],
			owner: "TestOwner",
			repository: "TestRepository",
		});
	});

	it("reports missing required flags without calling setGitHubRepositoryLabels", async () => {
		await run([]);

		expect(getPrinted(error)).toMatchInlineSnapshot(`
			"--labels is required.
			--owner is required.
			--repository is required.
			Run 'set-github-repository-labels --help' for usage."
		`);
		expect(mockSetGitHubRepositoryLabels).not.toHaveBeenCalled();
		expect(process.exitCode).toBe(1);
	});

	it("reports a missing --labels when only it is missing", async () => {
		await run(["--owner", "TestOwner", "--repository", "TestRepository"]);

		expect(getPrinted(error)).toMatchInlineSnapshot(`
			"--labels is required.
			Run 'set-github-repository-labels --help' for usage."
		`);
		expect(mockSetGitHubRepositoryLabels).not.toHaveBeenCalled();
		expect(process.exitCode).toBe(1);
	});

	it("reports invalid JSON in --labels", async () => {
		await run([
			"--owner",
			"TestOwner",
			"--repository",
			"TestRepository",
			"--labels",
			"[{invalid",
		]);

		expect(getPrinted(error)).toMatchInlineSnapshot(`
			"--labels: Expected valid JSON, received "[{invalid".
			Run 'set-github-repository-labels --help' for usage."
		`);
		expect(mockSetGitHubRepositoryLabels).not.toHaveBeenCalled();
		expect(process.exitCode).toBe(1);
	});

	it("reports invalid label data in --labels", async () => {
		await run([
			"--owner",
			"TestOwner",
			"--repository",
			"TestRepository",
			"--labels",
			JSON.stringify([{ invalid: true }]),
		]);

		expect(getPrinted(error)).toMatchInlineSnapshot(`
			"--labels[0].color: Invalid input: expected string, received undefined
			--labels[0].description: Invalid input: expected string, received undefined
			--labels[0].name: Invalid input: expected string, received undefined
			Run 'set-github-repository-labels --help' for usage."
		`);
		expect(mockSetGitHubRepositoryLabels).not.toHaveBeenCalled();
		expect(process.exitCode).toBe(1);
	});

	it("reports unknown flags", async () => {
		await run([...validArgs, "--owners", "TestOwner"]);

		expect(getPrinted(error)).toMatchInlineSnapshot(`
			"Unknown flag: --owners (did you mean --owner?)
			Run 'set-github-repository-labels --help' for usage."
		`);
		expect(mockSetGitHubRepositoryLabels).not.toHaveBeenCalled();
		expect(process.exitCode).toBe(1);
	});

	it("reports an error message when setGitHubRepositoryLabels rejects", async () => {
		mockSetGitHubRepositoryLabels.mockRejectedValueOnce(
			new Error("Bad credentials"),
		);

		await run(validArgs);

		expect(getPrinted(error)).toMatchInlineSnapshot(`"Error: Bad credentials"`);
		expect(process.exitCode).toBe(1);
	});

	it("prints help text with --help", async () => {
		await run(["--help"]);

		expect(getPrinted(log)).toMatchInlineSnapshot(`
			"Usage: set-github-repository-labels [options]

			Sets labels for a GitHub repository, including renaming existing similar labels. 🏷️

			Options:
			      --auth <string>        Auth token for GitHub (default: process.env.GH_TOKEN or executing gh auth token)
			      --labels <json>        Outcome labels to end with on the repository, as a JSON array (required, repeatable)
			      --owner <string>       Owning organization or username for the repository (required)
			      --repository <string>  Title of the repository (required)
			  -h, --help                 Show this help message

			Examples:
			  set-github-repository-labels --labels "$(cat labels.json)" --owner JoshuaKGoldberg --repository create-typescript-app"
		`);
		expect(mockSetGitHubRepositoryLabels).not.toHaveBeenCalled();
		expect(process.exitCode).toBeUndefined();
	});
});
