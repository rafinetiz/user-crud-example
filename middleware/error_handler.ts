import type { NextFunction, Request, Response } from "express";

/**
 * Middleware ini untuk menangkap semua error yang dilempar oleh
 * middleware/handler sebelumnya.
 *
 * **note** untuk express versi < 5, semua operasi await di async handler **wajib** dibungkus dengan trycatch
 * terus gunakan errnya sebagai parameter next handler. jika tidak maka errornya tidak akan
 * terhandle.
 *
 * TODO: More logging
 * IDEA: buat fungsi sebagai fallback semua handle
 * @param err
 * @param req
 * @param res
 * @param next
 */
export default function errorHandler(
	err: any,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (res.headersSent) {
		console.error("header already sent!");
		return;
	}

	console.error("request crashed", err);

	res.status(500).json({
		message: "internal server error",
	});
}
