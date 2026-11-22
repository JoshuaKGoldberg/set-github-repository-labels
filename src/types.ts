import { z } from "zod";

import { zLabel } from "./options.ts";

export interface GitHubRepositoryLabelsSettings {
	auth?: string;
	bandwidth?: number;
	labels: OutcomeLabel[];
	owner: string;
	repository: string;
}

export type OutcomeLabel = z.infer<typeof zLabel>;
