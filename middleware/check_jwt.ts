import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { get_jwt_private_key } from "../utils/common";

export default function CheckJwt(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const auth_headers = req.headers.authorization;

  if (!auth_headers) {
    res.status(403).json({
      message: 'access denied'
    });

    return;
  }

  const [ prefix, token ] = auth_headers.split(' ');

  if (prefix.toLowerCase() !== 'bearer') {
    res.status(400).json({
      message: 'bad request'
    });

    return;
  }

  const tokeninfo = jwt.verify(token, get_jwt_private_key(), {
    // cegah jsonwebtoken melemparkan error untuk token yang expired supaya kita bisa handle manual
    ignoreExpiration: true,
  });

  if (typeof tokeninfo === 'string') {
    return next(new Error('return value of tokeninfo is a string'));
  }

  /**
   * Field exp akan selalu ada di token authorization kita.
   * aneh jika tidak ada.
   * 
   * TODO: more validation
   */
  if (!tokeninfo.exp) {
    res.status(400).json({
      message: 'bad request'
    });

    return;
  }

  if (Date.now() > (tokeninfo.exp * 1000)) {
    res.json({
      message: 'need re-authenticate'
    });

    return;
  }

  // TODO idea: buat context-like objek di res.locals
  res.locals.user_id = tokeninfo.user_id;

  next()
}