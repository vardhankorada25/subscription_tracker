import {Router} from 'express';
import authorize from '../middleware/auth.middleware.js';
import { getUsers,getUser } from '../controller/user.controller.js';

const userrouter=Router();

userrouter.get('/',getUsers)
userrouter.get('/:id',authorize,getUser)
userrouter.post('/',(req,res)=> res.send({body:{title:'Create new user'}}))
userrouter.put('/:id',(req,res)=> res.send({body:{title:' update user'}}))
userrouter.delete('/:id',(req,res)=> res.send({body:{title:'Delete user'}}))


export default userrouter;