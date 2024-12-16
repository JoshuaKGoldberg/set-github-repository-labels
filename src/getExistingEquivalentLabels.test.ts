import { describe, expect, it } from "vitest";

import {
	getExistingEquivalentLabels,
	GitHubLabelData,
} from "./getExistingEquivalentLabels.js";
import { OutcomeLabel } from "./options.js";

const createGitHubLabelData = (overrides: Partial<GitHubLabelData>) => ({
	color: "#000000",
	description: "A good label.",
	name: "",
	...overrides,
});

const createOutcomeLabel = (overrides: Partial<OutcomeLabel>) => ({
	color: "#000000",
	description: "A good label.",
	name: "",
	...overrides,
});

describe("getExistingEquivalentLabels", () => {
	it("returns no labels when there are no existing labels", () => {
		const actual = getExistingEquivalentLabels([], { name: "abc" });

		expect(actual).toEqual([]);
	});

	it("returns no labels when no existing label matches", () => {
		const actual = getExistingEquivalentLabels(
			[createGitHubLabelData({ name: "abc" })],
			createOutcomeLabel({ name: "def" }),
		);

		expect(actual).toEqual([]);
	});

	it("returns an existing un-prefixed label when it matches by name", () => {
		const abcLabel = createGitHubLabelData({ name: "abc" });
		const actual = getExistingEquivalentLabels(
			[
				createGitHubLabelData({ name: "def" }),
				abcLabel,
				createGitHubLabelData({ name: "ghi" }),
			],
			createOutcomeLabel({ name: "abc" }),
		);

		expect(actual).toEqual([abcLabel]);
	});

	it("returns an existing prefixed label when it matches by name", () => {
		const abcDefLabel = createGitHubLabelData({ name: "abc: def" });
		const actual = getExistingEquivalentLabels([abcDefLabel], {
			name: "abc: def",
		});

		expect(actual).toEqual([abcDefLabel]);
	});

	it("returns the existing label when it matches excluding prefix", () => {
		const abcLabel = createGitHubLabelData({ name: "abc" });
		const actual = getExistingEquivalentLabels(
			[
				createGitHubLabelData({ name: "abc: def" }),
				abcLabel,
				createGitHubLabelData({ name: "ghi" }),
			],
			createOutcomeLabel({ name: "type: abc" }),
		);

		expect(actual).toEqual([abcLabel]);
	});

	it("returns the existing label when it matches an alias", () => {
		const enhancementLabel = createGitHubLabelData({ name: "enhancement" });
		const actual = getExistingEquivalentLabels(
			[
				createGitHubLabelData({ name: "abc: def" }),
				enhancementLabel,
				createGitHubLabelData({ name: "ghi" }),
			],
			createOutcomeLabel({ aliases: ["enhancement"], name: "type: feature" }),
		);

		expect(actual).toEqual([enhancementLabel]);
	});

	it("returns both existing labels when one matches on name and another matches an alias", () => {
		const enhancementLabel = createGitHubLabelData({ name: "enhancement" });
		const typeFeatureLabel = createGitHubLabelData({ name: "type: feature" });
		const actual = getExistingEquivalentLabels(
			[
				createGitHubLabelData({ name: "abc: def" }),
				enhancementLabel,
				createGitHubLabelData({ name: "ghi" }),
				typeFeatureLabel,
			],
			createOutcomeLabel({ aliases: ["enhancement"], name: "type: feature" }),
		);

		expect(actual).toEqual([enhancementLabel, typeFeatureLabel]);
	});
});
