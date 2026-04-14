import {Router} from "express";
import { workflowClient } from "../config/upstash.js";
import { sendReminders } from "../controller/workflow.controller.js";


const workflowRouter=Router();

workflowRouter.post('/subscription/reminder',sendReminders);

export default workflowRouter;