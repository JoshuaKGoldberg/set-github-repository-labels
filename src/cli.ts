import { parseArgs } from "node:util";
import { z } from "zod";

import { zLabel } from "./options.js";
import { setGitHubRepositoryLabels } from "./setGitHubRepositoryLabels.js";

const schema = z.object({
	auth: z.string().optional(),
	labels: z.array(zLabel),
	owner: z.string(),
	repository: z.string(),
});

export async function cli(args: string[]) {
	const { values } = parseArgs({
		args,
		options: {
			auth: {
				type: "string",
			},
			labels: {
				type: "string",
			},
			owner: {
				type: "string",
			},
			repository: {
				type: "string",
			},
		},
		strict: true,
	});

	if (!values.labels) {
		throw new Error("Missing required arg: --labels");
	}

	const settings = schema.parse({
		...values,
		labels: JSON.parse(values.labels ?? "") as unknown,
	});

	await setGitHubRepositoryLabels(settings);
}
