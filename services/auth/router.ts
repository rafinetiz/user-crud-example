import express from "express";
import bcrypt from "@node-rs/bcrypt";
import jwt from "jsonwebtoken";

import type RepositoryManager from "../../repository/RepositoryManager";
import type * as ResponseType from "../../types/response";

import { is_string } from "../../utils/common";

interface AuthPayload {
	username?: string;
	password?: string;
}

interface LoginResponse {
	accessToken: string;
}

type RegisterResponse = ResponseType.Response<Omit<AuthPayload, "password">>;

async function register_handler(
	this: RepositoryManager,
	req: express.Request<null, RegisterResponse, AuthPayload>,
	res: express.Response<RegisterResponse>,
	next: express.NextFunction,
) {
	const { username, password } = req.body;

	if (
		!username ||
		!password ||
		!is_string(username) ||
		!is_string(password) ||
		username.length < 3 ||
		password.length < 6
	) {
		res.status(400).json({
			message: "bad request",
		});

		return;
	}

	try {
		if ((await this.userRepository.GetUserHash(username)) !== null) {
			res.json({
				message: `user '${username}' already exists`,
			});

			return;
		}

		const passwordHash = await bcrypt.hash(password);

		if (!(await this.userRepository.CreateUser(username, passwordHash))) {
			return next(new Error('CreateUser return unexpected value'));
		}

		res.json({ message: "ok", data: { username } });
	} catch (err: any) {
		next(err);
	}
}

async function login_handler(
	this: RepositoryManager,
	req: express.Request<null, any, AuthPayload>,
	res: express.Response<ResponseType.Response<LoginResponse>>,
	next: express.NextFunction,
) {
	const { username, password } = req.body;

	if (
		!username ||
		!password ||
		!is_string(username) ||
		!is_string(password) ||
		username.length < 3
	) {
		res.status(400).json({
			message: "bad request",
		});

		return;
	}

	try {
		const user = await this.userRepository.GetUserHash(username);

		if (user === null) {
			res.json({
				message: "user not registered",
			});

			return;
		}

		if (!(await bcrypt.compare(password, user.password))) {
			res.json({
				message: "invalid password!",
			});

			return;
		}

		const accessToken = jwt.sign(
			{
				user_id: user.uid,
			},
			process.env.JWT_PRIVATE_KEY as string,
			{
				expiresIn: "7d",
			},
		);

		res.json({
			message: "ok",
			data: {
				accessToken,
			},
		});
	} catch (err: any) {
		next(err);
	}
}

export default function AuthRouter(repo: RepositoryManager): express.Router {
	const router = express.Router();
	router.post("/register", register_handler.bind(repo));
	router.post("/login", login_handler.bind(repo));
	return router;
}
