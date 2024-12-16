import { describe, expect, it, vi } from "vitest";

import { setGitHubRepositoryLabels } from "./setGitHubRepositoryLabels.js";

const mockRequest = vi.fn();

vi.mock("octokit-from-auth", () => ({
	octokitFromAuth: () =>
		Promise.resolve({
			request: mockRequest,
		}),
}));

const mockOutcomeLabel = {
	color: "000000",
	description: "def ghi",
	name: "area: abc",
};

const options = {
	labels: [mockOutcomeLabel],
	owner: "TestOwner",
	repository: "test-repository",
};

describe("migrateRepositoryLabels", () => {
	it("creates an outcome label when there are no existing labels", async () => {
		mockRequest.mockResolvedValue({
			data: [],
		});

		await setGitHubRepositoryLabels(options);

		expect(mockRequest.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "GET /repos/{owner}/{repo}/labels",
			    {
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			  [
			    "POST /repos/{owner}/{repo}/labels",
			    {
			      "color": "000000",
			      "description": "def ghi",
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "name": "area: abc",
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			]
		`);
	});

	it("creates a new outcome label when an existing label doesn't have an equivalent", async () => {
		mockRequest.mockResolvedValue({
			data: [
				{
					color: "111111",
					description: "jkl mno",
					name: "other",
				},
			],
		});

		await setGitHubRepositoryLabels(options);

		expect(mockRequest.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "GET /repos/{owner}/{repo}/labels",
			    {
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			  [
			    "POST /repos/{owner}/{repo}/labels",
			    {
			      "color": "000000",
			      "description": "def ghi",
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "name": "area: abc",
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			]
		`);
	});

	it("doesn't edit a outcome label when it already exists with the same information", async () => {
		mockRequest.mockResolvedValueOnce({
			data: [mockOutcomeLabel],
		});

		await setGitHubRepositoryLabels(options);

		expect(mockRequest.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "GET /repos/{owner}/{repo}/labels",
			    {
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			]
		`);
	});

	it("edits the outcome label when it already exists with different color", async () => {
		mockRequest.mockResolvedValueOnce({
			data: [
				{
					...mockOutcomeLabel,
					color: "111111",
				},
			],
		});

		await setGitHubRepositoryLabels(options);

		expect(mockRequest.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "GET /repos/{owner}/{repo}/labels",
			    {
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			  [
			    "PATCH /repos/{owner}/{repo}/labels/{name}",
			    {
			      "color": "000000",
			      "description": "def ghi",
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "name": "area: abc",
			      "new_name": "area: abc",
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			]
		`);
	});

	it("edits the outcome label when it already exists with a different description", async () => {
		mockRequest.mockResolvedValueOnce({
			data: [
				{
					...mockOutcomeLabel,
					description: "updated",
				},
			],
		});

		await setGitHubRepositoryLabels(options);

		expect(mockRequest.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "GET /repos/{owner}/{repo}/labels",
			    {
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			  [
			    "PATCH /repos/{owner}/{repo}/labels/{name}",
			    {
			      "color": "000000",
			      "description": "def ghi",
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "name": "area: abc",
			      "new_name": "area: abc",
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			]
		`);
	});

	it("deletes an existing non-outcome label when the equivalent outcome label already exists", async () => {
		mockRequest.mockResolvedValueOnce({
			data: [
				{
					color: "000000",
					description: "def ghi",
					name: "abc",
				},
				{
					color: "000000",
					description: "def ghi",
					name: "area: abc",
				},
			],
		});

		await setGitHubRepositoryLabels(options);

		expect(mockRequest.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "GET /repos/{owner}/{repo}/labels",
			    {
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			  [
			    "DELETE /repos/{owner}/{repo}/labels/{name}",
			    {
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "name": "abc",
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			]
		`);
	});

	it("doesn't delete a pre-existing label when it isn't a outcome label", async () => {
		mockRequest.mockResolvedValueOnce({
			data: [
				{
					color: "000000",
					description: "def ghi",
					name: "unknown",
				},
			],
		});

		await setGitHubRepositoryLabels(options);

		expect(mockRequest.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "GET /repos/{owner}/{repo}/labels",
			    {
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			  [
			    "POST /repos/{owner}/{repo}/labels",
			    {
			      "color": "000000",
			      "description": "def ghi",
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "name": "area: abc",
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			]
		`);
	});

	it("deletes the existing duplicate outcome label and edits the label with the outcome name and different color when both exist", async () => {
		mockRequest.mockResolvedValueOnce({
			data: [
				{
					color: "000000",
					description: "def ghi",
					name: "abc",
				},
				{
					color: "111111",
					description: "def ghi",
					name: "area: abc",
				},
			],
		});

		await setGitHubRepositoryLabels(options);

		expect(mockRequest.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "GET /repos/{owner}/{repo}/labels",
			    {
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			  [
			    "DELETE /repos/{owner}/{repo}/labels/{name}",
			    {
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "name": "abc",
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			  [
			    "PATCH /repos/{owner}/{repo}/labels/{name}",
			    {
			      "color": "000000",
			      "description": "def ghi",
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "name": "area: abc",
			      "new_name": "area: abc",
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			]
		`);
	});

	it("deletes the existing duplicate outcome label and does not edit the label with the outcome name and same information when both exist", async () => {
		mockRequest.mockResolvedValueOnce({
			data: [
				{
					color: "000000",
					description: "def ghi",
					name: "abc",
				},
				{
					color: "000000",
					description: "def ghi",
					name: "area: abc",
				},
			],
		});

		await setGitHubRepositoryLabels(options);

		expect(mockRequest.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "GET /repos/{owner}/{repo}/labels",
			    {
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			  [
			    "DELETE /repos/{owner}/{repo}/labels/{name}",
			    {
			      "headers": {
			        "X-GitHub-Api-Version": "2022-11-28",
			      },
			      "name": "abc",
			      "owner": "TestOwner",
			      "repo": "test-repository",
			    },
			  ],
			]
		`);
	});
});
