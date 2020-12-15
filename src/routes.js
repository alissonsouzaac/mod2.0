import { Router } from 'express';
import User from './app/models/User';

import UserController from './app/controllers/UserController';

const routes = new Router();


routes.post('/user', UserController.store);

/*routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Alisson Costa',
    email: 'alisson@hotmail.com',
    password_hash: '123456789'
  });

    return res.json(user);
});*/

export default routes;
