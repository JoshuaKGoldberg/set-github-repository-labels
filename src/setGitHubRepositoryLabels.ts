import { octokitFromAuth } from "octokit-from-auth";
import throttledQueue from "throttled-queue";

import { getExistingEquivalentLabels } from "./getExistingEquivalentLabels.js";
import { defaultOptions, GitHubRepositoryLabelsSettings } from "./options.js";

// https://github.com/shaunpersad/throttled-queue/issues/21
type ThrottledQueue = (typeof import("throttled-queue"))["default"];

export async function setGitHubRepositoryLabels({
	auth,
	bandwidth = defaultOptions.bandwidth,
	labels,
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

	await Promise.all(
		labels.map(async (outcomeLabel) => {
			await throttle(async () => {
				const existingEquivalents = getExistingEquivalentLabels(
					existingLabels,
					outcomeLabel,
				);
				const existingIdentical = existingLabels.find(
					(existing) => existing.name === outcomeLabel.name,
				);

				// Case: the repo has neither of the two label types
				if (!existingEquivalents.length) {
					await octokit.request("POST /repos/{owner}/{repo}/labels", {
						...requestData,
						color: outcomeLabel.color.replace("#", ""),
						description: outcomeLabel.description,
						name: outcomeLabel.name,
					});
					return;
				}

				for (const existingEquivalent of existingEquivalents) {
					// Case: the repo already has both prefixed and non-prefixed label name types
					// E.g. both "area: documentation" and "documentation"
					if (
						existingEquivalent.name !== outcomeLabel.name &&
						existingIdentical
					) {
						await octokit.request(
							"DELETE /repos/{owner}/{repo}/labels/{name}",
							{
								...requestData,
								name: existingEquivalent.name,
							},
						);

						continue;
					}

					// Case: the repo has one of the two label types, with >=1 different property
					// E.g. "documentation" and the same color and description
					// E.g. "area: documentation" but with a different color
					if (
						outcomeLabel.color !== existingEquivalent.color ||
						outcomeLabel.description !== existingEquivalent.description ||
						outcomeLabel.name !== existingEquivalent.name
					) {
						await octokit.request("PATCH /repos/{owner}/{repo}/labels/{name}", {
							...requestData,
							color: outcomeLabel.color.replace("#", ""),
							description: outcomeLabel.description,
							name: existingEquivalent.name,
							new_name: outcomeLabel.name,
						});
					}
				}
			});
		}),
	);
}
