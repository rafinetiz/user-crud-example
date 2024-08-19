import "dotenv/config";
import pg from "pg";
import express from "express";

import RepositoryManager from "./repository/RepositoryManager";
import UserRouter from "./services/user/router";
import AuthRouter from "./services/auth/router";
import errorHandler from "./middleware/error_handler";

const app = express();
const db = new pg.Client({
	user: process.env.POSTGRE_USER,
	password: process.env.POSTGRE_PASS,
});

const repo = new RepositoryManager(db);

app.use(express.json());
app.use("/user", UserRouter(repo));
app.use("/auth", AuthRouter(repo));

app.use(errorHandler);

const HOST = process.env.HOST || "localhost";
const PORT = Number.parseInt(process.env.PORT as string) || 3000;

(async () => {
	await db.connect();

	app.listen(PORT, HOST, () => {
		console.log(`[#] serving API at ${HOST}:${PORT}`);
	});
})();
