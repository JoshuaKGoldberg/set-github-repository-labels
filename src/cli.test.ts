import { describe, expect, it, vi } from "vitest";

import { cli } from "./cli.js";

const mockSetGitHubRepositoryLabels = vi.fn();

vi.mock("./setGitHubRepositoryLabels", () => ({
	get setGitHubRepositoryLabels() {
		return mockSetGitHubRepositoryLabels;
	},
}));

describe("migrateRepositoryLabels", () => {
	it("throws an error when args have no labels data", async () => {
		await expect(async () => {
			await cli(["--owner", "TestOwner", "--repository", "TestRepository"]);
		}).rejects.toMatchInlineSnapshot(`[Error: Missing required arg: --labels]`);
	});

	it("throws an error when args have invalid labels data", async () => {
		await expect(async () => {
			await cli([
				"--owner",
				"TestOwner",
				"--repository",
				"TestRepository",
				"--labels",
				JSON.stringify([{ invalid: true }]),
			]);
		}).rejects.toMatchInlineSnapshot(`
			[ZodError: [
			  {
			    "code": "invalid_type",
			    "expected": "string",
			    "received": "undefined",
			    "path": [
			      "labels",
			      0,
			      "color"
			    ],
			    "message": "Required"
			  },
			  {
			    "code": "invalid_type",
			    "expected": "string",
			    "received": "undefined",
			    "path": [
			      "labels",
			      0,
			      "description"
			    ],
			    "message": "Required"
			  },
			  {
			    "code": "invalid_type",
			    "expected": "string",
			    "received": "undefined",
			    "path": [
			      "labels",
			      0,
			      "name"
			    ],
			    "message": "Required"
			  }
			]]
		`);
	});

	it("passes parsed settings to setGitHubRepositoryLabels when args are valid", async () => {
		await cli([
			"--owner",
			"TestOwner",
			"--repository",
			"TestRepository",
			"--labels",
			JSON.stringify([
				{
					color: "000000",
					description: "def ghi",
					name: "area: abc",
				},
			]),
		]);
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
	});
});
