import { OutcomeLabel } from "./types.js";

export interface GitHubLabelData {
	color?: null | string;
	description?: null | string;
	name: string;
}

export function getExistingEquivalentLabels(
	existingLabels: GitHubLabelData[],
	outcomeLabel: Pick<OutcomeLabel, "aliases" | "name">,
) {
	const outcomeTrimmed = outcomeLabel.name.replace(/\w+: (\w+)/, "$1");

	return existingLabels.filter(({ name: existingName }) => {
		return !!(
			(existingName === outcomeLabel.name ||
				existingName === outcomeTrimmed ||
				outcomeLabel.aliases?.includes(existingName)) ??
			existingName.replace(/\w+: (\w+)/, "$1") === outcomeLabel.name
		);
	});
}
