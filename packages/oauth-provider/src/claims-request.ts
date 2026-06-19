import * as z from "zod";

export const REQUESTED_USERINFO_CLAIMS_TOKEN_CLAIM =
	"better_auth_requested_userinfo_claims";

const claimRequestMemberSchema = z.union([
	z.null(),
	z.record(z.string(), z.unknown()),
]);

const claimsRequestObjectSchema = z
	.object({
		userinfo: z.record(z.string(), claimRequestMemberSchema).optional(),
		id_token: z.record(z.string(), claimRequestMemberSchema).optional(),
	})
	.passthrough();

function parseClaimsRequestValue(value: unknown) {
	if (typeof value === "string") {
		try {
			return JSON.parse(value) as unknown;
		} catch {
			return undefined;
		}
	}
	return value;
}

function parseClaimsRequestObject(value: unknown) {
	const parsed = parseClaimsRequestValue(value);
	const result = claimsRequestObjectSchema.safeParse(parsed);
	return result.success ? result.data : undefined;
}

export const claimsRequestParameterSchema = z
	.union([z.string(), z.record(z.string(), z.unknown())])
	.superRefine((value, ctx) => {
		if (!parseClaimsRequestObject(value)) {
			ctx.addIssue({
				code: "custom",
				message: "claims must be a JSON object",
			});
		}
	});

export function getRequestedUserInfoClaims(value: unknown) {
	const claimsRequest = parseClaimsRequestObject(value);
	const userInfoClaims = claimsRequest?.userinfo;
	if (!userInfoClaims) return [];
	return Array.from(new Set(Object.keys(userInfoClaims)));
}

function normalizeRequestedUserInfoClaims(value: unknown) {
	if (!Array.isArray(value)) return [];
	return Array.from(
		new Set(
			value.filter((claim): claim is string => typeof claim === "string"),
		),
	);
}

export function getRequestedUserInfoClaimsFromTokenPayload(
	payload: Record<string, unknown>,
) {
	return normalizeRequestedUserInfoClaims(
		payload[REQUESTED_USERINFO_CLAIMS_TOKEN_CLAIM],
	);
}
