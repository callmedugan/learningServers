import { hash, verify } from "argon2";

export async function hashPassword(password: string): Promise<string> {
	const result = await hash(password);
	return result;
}

export async function checkPasswordHash(
	rawPassword: string,
	hashedPassword: string,
): Promise<boolean> {
	const result = await verify(hashedPassword, rawPassword);
	return result;
}
