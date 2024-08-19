import express from 'express';
import CheckJwt from '../../middleware/check_jwt'

import type RepositoryManager from '../../repository/RepositoryManager';
import type { UserLocals } from '../../types/locals';
import type { GetUserResponse } from '../../types/response';

async function user_handler(
  this: RepositoryManager,
  req: express.Request,
  res: express.Response<GetUserResponse, UserLocals>,
  next: express.NextFunction
) {
  try {
    const user = await this.userRepository.GetUser(res.locals.user_id, ['uid', 'username']);

    res.json({
      message: 'ok',
      data: {
        ...user
      }
    });
  } catch (err: any) {
    next(err);
  }
}

export default function UserRouter(repo: RepositoryManager): express.Router {
  const router = express.Router();

  router.use(CheckJwt);
  router.get('/', user_handler.bind(repo));

  return router;
}