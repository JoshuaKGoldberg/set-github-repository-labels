import { describe, expect, it } from "vitest";

import { determineLabelChanges } from "./determineLabelChanges.js";

const mockOutcomeLabel = {
	color: "000000",
	description: "def ghi",
	name: "area: abc",
};

describe("migrateRepositoryLabels", () => {
	it("creates an outcome label when there are no existing labels", () => {
		const actual = determineLabelChanges([], [mockOutcomeLabel]);

		expect(actual).toEqual([
			{
				color: "000000",
				description: "def ghi",
				name: "area: abc",
				type: "post",
			},
		]);
	});

	it("creates a new outcome label when an existing label doesn't have an equivalent", () => {
		const actual = determineLabelChanges(
			[
				{
					color: "111111",
					description: "jkl mno",
					name: "other",
				},
			],
			[mockOutcomeLabel],
		);

		expect(actual).toEqual([
			{
				color: "000000",
				description: "def ghi",
				name: "area: abc",
				type: "post",
			},
		]);
	});

	it("doesn't edit a outcome label when it already exists with the same information", () => {
		const actual = determineLabelChanges(
			[mockOutcomeLabel],
			[mockOutcomeLabel],
		);

		expect(actual).toEqual([]);
	});

	it("edits the outcome label when it already exists with different color", () => {
		const actual = determineLabelChanges(
			[
				{
					...mockOutcomeLabel,
					color: "111111",
				},
			],
			[mockOutcomeLabel],
		);

		expect(actual).toEqual([
			{
				color: "000000",
				description: "def ghi",
				newName: "area: abc",
				originalName: "area: abc",
				type: "patch",
			},
		]);
	});

	it("edits the outcome label when it already exists with a different description", () => {
		const actual = determineLabelChanges(
			[
				{
					...mockOutcomeLabel,
					description: "updated",
				},
			],
			[mockOutcomeLabel],
		);

		expect(actual).toEqual([
			{
				color: "000000",
				description: "def ghi",
				newName: "area: abc",
				originalName: "area: abc",
				type: "patch",
			},
		]);
	});

	it("deletes an existing non-outcome label when the equivalent outcome label already exists", () => {
		const actual = determineLabelChanges(
			[
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
			[mockOutcomeLabel],
		);

		expect(actual).toEqual([
			{
				name: "abc",
				type: "delete",
			},
		]);
	});

	it("doesn't delete a pre-existing label when it isn't a outcome label", () => {
		const actual = determineLabelChanges(
			[
				{
					color: "000000",
					description: "def ghi",
					name: "unknown",
				},
			],
			[mockOutcomeLabel],
		);

		expect(actual).toEqual([
			{
				color: "000000",
				description: "def ghi",
				name: "area: abc",
				type: "post",
			},
		]);
	});

	it("deletes the existing duplicate outcome label and edits the label with the outcome name and different color when both exist", () => {
		const actual = determineLabelChanges(
			[
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
			[mockOutcomeLabel],
		);

		expect(actual).toEqual([
			{
				name: "abc",
				type: "delete",
			},
			{
				color: "000000",
				description: "def ghi",
				newName: "area: abc",
				originalName: "area: abc",
				type: "patch",
			},
		]);
	});

	it("deletes the existing duplicate outcome label and does not edit the label with the outcome name and same information when both exist", () => {
		const actual = determineLabelChanges(
			[
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
			[mockOutcomeLabel],
		);

		expect(actual).toEqual([
			{
				name: "abc",
				type: "delete",
			},
		]);
	});
});
