import { z } from "zod";

import { zLabel } from "./options.js";

export interface GitHubRepositoryLabelsSettings {
	auth?: string;
	bandwidth?: number;
	labels: OutcomeLabel[];
	owner: string;
	repository: string;
}

export type OutcomeLabel = z.infer<typeof zLabel>;
