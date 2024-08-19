import type { Client as pgClient } from "pg";

interface GetUserHashData {
	uid: number;
	username: string;
	/** hashed password */
	password: string;
}

export default class UserRepository {
	private db: pgClient;

	constructor(db: pgClient) {
		this.db = db;
	}

	/**
	 * ambil data user (username, hashed password) dari database
	 *
	 * @param username username
	 * @returns
	 */
	async GetUserHash(username: string): Promise<GetUserHashData | null> {
		return await this.db
			.query(
				"SELECT uid, username, password FROM tbl_users WHERE username=$1 LIMIT 1",
				[username],
			)
			.then((result) => {
				return result.rowCount && result.rowCount > 0 ? result.rows[0] : null;
			});
	}

	/**
	 * Buat user baru ke database
	 *
	 * fungsi akan me-return **true** jika operasi sukses.\
	 * fungsi ini akan melemparkan error jika operasi gagal!.\
	 * jangan lupa try-catch di handlernya :).\
	 * seharusnya fungsi ini tidak akan me-return **false**.
	 *
	 * @param username user username
	 * @param password user generate hashed password
	 * @returns
	 */
	async CreateUser(username: string, password: string): Promise<boolean> {
		return await this.db
			.query("INSERT INTO tbl_users(username, password) VALUES($1, $2)", [
				username,
				password,
			])
			.then((result) => {
				return result.rowCount !== null;
			});
	}

	async GetUser(user_id: number, fields: string[] = []) {
		return await this.db
			.query(
				`SELECT ${fields.length > 0 ? fields.join(", ") : "*"} FROM tbl_users WHERE uid=$1`,
				[user_id],
			)
			.then((result) => {
				return result.rows[0];
			});
	}
}
