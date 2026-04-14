import {Router} from 'express';
import authorize from '../middleware/auth.middleware.js';
import subscribe, {getUserSubscriptions, updateSubscription} from '../controller/subscription.controller.js';
const subscriptionrouter=Router();

subscriptionrouter.get('/',(req,res)=> res.send({body:{title:'Get all subscriptions'}}));
subscriptionrouter.get('/:id',(req,res)=> res.send({body:{title:'Get subscription by id'}}));
subscriptionrouter.post('/',authorize,subscribe);
subscriptionrouter.put('/:id',authorize,updateSubscription);
subscriptionrouter.delete('/:id',(req,res)=> res.send({body:{title:'Delete subscription by id'}}));
subscriptionrouter.put('/',(req,res)=> res.send({body:{title:'update'}}));
subscriptionrouter.get('/users/:id',authorize,getUserSubscriptions);
subscriptionrouter.put('/:id/cancel',(req,res)=> res.send({body:{title:'cancel subscription by id'}}));
subscriptionrouter.put('/upcomming-renewlsl',(req,res)=> res.send({body:{title:'Get upcomming renewals'}}));

export default subscriptionrouter;