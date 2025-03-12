import { getExistingEquivalentLabels } from "./getExistingEquivalentLabels.js";
import { OutcomeLabel } from "./types.js";

export interface ExistingLabel {
	color?: null | string;
	description?: null | string;
	name: string;
}

export type LabelChange =
	| LabelChangeDelete
	| LabelChangePatch
	| LabelChangePost;

export interface LabelChangeDelete {
	name: string;
	type: "delete";
}

export interface LabelChangePatch {
	color: string;
	description: string;
	newName: string;
	originalName: string;
	type: "patch";
}

export interface LabelChangePost {
	color: string;
	description: string;
	name: string;
	type: "post";
}

export function determineLabelChanges(
	existingLabels: ExistingLabel[],
	outcomeLabels: OutcomeLabel[],
) {
	const changes: LabelChange[] = [];

	for (const outcomeLabel of outcomeLabels) {
		const existingEquivalents = getExistingEquivalentLabels(
			existingLabels,
			outcomeLabel,
		);
		const existingIdentical = existingLabels.find(
			(existing) => existing.name === outcomeLabel.name,
		);

		// Case: the repo has neither of the two label types
		if (!existingEquivalents.length) {
			changes.push({
				color: outcomeLabel.color.replace("#", ""),
				description: outcomeLabel.description,
				name: outcomeLabel.name,
				type: "post",
			});
			continue;
		}

		for (const existingEquivalent of existingEquivalents) {
			// Case: the repo already has both prefixed and non-prefixed label name types
			// E.g. both "area: documentation" and "documentation"
			if (existingEquivalent.name !== outcomeLabel.name && existingIdentical) {
				changes.push({ name: existingEquivalent.name, type: "delete" });
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
				changes.push({
					color: outcomeLabel.color.replace("#", ""),
					description: outcomeLabel.description,
					newName: outcomeLabel.name,
					originalName: existingEquivalent.name,
					type: "patch",
				});
			}
		}
	}

	return changes;
}
