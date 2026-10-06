import { type CliRunSettings, createCli } from "parse-standard-args";
import { z } from "zod";

import { zLabel } from "./options.js";
import { setGitHubRepositoryLabels } from "./setGitHubRepositoryLabels.js";

const options = z.object({
	auth: z.string().optional().meta({
		defaultDescription: "process.env.GH_TOKEN or executing gh auth token",
		description: "Auth token for GitHub",
	}),
	labels: z
		.array(zLabel)
		.describe("Outcome labels to end with on the repository, as a JSON array"),
	owner: z
		.string()
		.describe("Owning organization or username for the repository"),
	repository: z.string().describe("Title of the repository"),
});

const program = createCli({
	description:
		"Sets labels for a GitHub repository, including renaming existing similar labels. 🏷️",
	examples: [
		`set-github-repository-labels --labels "$(cat labels.json)" --owner JoshuaKGoldberg --repository create-typescript-app`,
	],
	name: "set-github-repository-labels",
	options,
});

export async function cli(
	args: string[],
	{
		error = console.error.bind(console),
		log = console.log.bind(console),
	}: CliRunSettings = {},
) {
	const parsed = await program.run(args, { error, log });
	if (!parsed) {
		return;
	}

	try {
		await setGitHubRepositoryLabels(parsed.values);
	} catch (caught) {
		error(
			`Error: ${caught instanceof Error ? caught.message : String(caught)}`,
		);
		process.exitCode = 1;
	}
}
