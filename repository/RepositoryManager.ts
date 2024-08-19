import type { Client as pgClient } from "pg";

import UserRepository from "./UserRepository";

export default class RepositoryManager {
	private _userRepository: UserRepository;

	constructor(dbclient: pgClient) {
		this._userRepository = new UserRepository(dbclient);
	}

	get userRepository(): UserRepository {
		return this._userRepository;
	}
}
