import { z } from "zod";

export const defaultOptions = {
	// https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#about-secondary-rate-limits
	// 1800 points per minute, or 30 points per second
	// 5 points per PATCH, POST, or, DELETE request
	// 30 points per second / 5 points per request = 6 requests per second
	bandwidth: 6,
};

export const zLabel = z.object({
	aliases: z.array(z.string()).optional(),
	color: z.string(),
	description: z.string(),
	name: z.string(),
});
