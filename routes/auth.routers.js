import {Router} from 'express';

import { signin ,signout,signup} from '../controller/auth.controller.js';
const authrouter=Router();
authrouter.post('/login',signin);
authrouter.post('/register',signup);
authrouter.post('/logout',signout);

export default authrouter;