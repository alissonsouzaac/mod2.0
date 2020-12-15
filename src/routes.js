import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionsController from './app/controllers/SessionsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();


routes.post('/user', UserController.store);
routes.post('/sessions', SessionsController.store);

routes.use(authMiddleware);

routes.put('/user', UserController.update);

/*routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Alisson Costa',
    email: 'alisson@hotmail.com',
    password_hash: '123456789'
  });

    return res.json(user);
});*/

export default routes;
