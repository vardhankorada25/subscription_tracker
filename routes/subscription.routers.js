import {Router} from 'express';

const subscriptionrouter=Router();

subscriptionrouter.get('/',(req,res)=> res.send({body:{title:'Get all subscriptions'}}));
subscriptionrouter.get('/:id',(req,res)=> res.send({body:{title:'Get subscription by id'}}));
subscriptionrouter.post('/',(req,res)=> res.send({body:{title:'create subscriptions'}}));
subscriptionrouter.put('/:id',(req,res)=> res.send({body:{title:'Update subscription by id'}}));
subscriptionrouter.delete('/:id',(req,res)=> res.send({body:{title:'Delete subscription by id'}}));
subscriptionrouter.put('/',(req,res)=> res.send({body:{title:'update'}}));
subscriptionrouter.get('/users/:id',(req,res)=> res.send({body:{title:'Get subscriptions by user id'}}));
subscriptionrouter.put('/:id/cancel',(req,res)=> res.send({body:{title:'cancel subscription by id'}}));
subscriptionrouter.put('/upcomming-renewlsl',(req,res)=> res.send({body:{title:'Get upcomming renewals'}}));

export default subscriptionrouter;