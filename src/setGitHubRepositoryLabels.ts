import { octokitFromAuth } from "octokit-from-auth";
import throttledQueue from "throttled-queue";

import { determineLabelChanges } from "./determineLabelChanges.js";
import { defaultOptions } from "./options.js";
import { GitHubRepositoryLabelsSettings } from "./types.js";

// https://github.com/shaunpersad/throttled-queue/issues/21
type ThrottledQueue = (typeof import("throttled-queue"))["default"];

export async function setGitHubRepositoryLabels({
	auth,
	bandwidth = defaultOptions.bandwidth,
	labels: outcomeLabels,
	owner,
	repository,
}: GitHubRepositoryLabelsSettings) {
	const octokit = await octokitFromAuth({ auth });
	const requestData = {
		headers: {
			"X-GitHub-Api-Version": "2022-11-28",
		},
		owner,
		repo: repository,
	};

	const { data: existingLabels } = await octokit.request(
		"GET /repos/{owner}/{repo}/labels",
		requestData,
	);
	const throttle = (throttledQueue as unknown as ThrottledQueue)(
		bandwidth,
		1000,
	);

	const changes = determineLabelChanges(existingLabels, outcomeLabels);

	await Promise.all(
		changes.map(async (change) => {
			await throttle(async () => {
				switch (change.type) {
					case "delete": {
						await octokit.request(
							"DELETE /repos/{owner}/{repo}/labels/{name}",
							{
								...requestData,
								name: change.name,
							},
						);
						break;
					}
					case "patch": {
						await octokit.request("PATCH /repos/{owner}/{repo}/labels/{name}", {
							...requestData,
							color: change.color,
							description: change.description,
							name: change.originalName,
							new_name: change.newName,
						});
						break;
					}
					case "post": {
						await octokit.request("POST /repos/{owner}/{repo}/labels", {
							...requestData,
							color: change.color,
							description: change.description,
							name: change.name,
						});
						break;
					}
				}
			});
		}),
	);
}
