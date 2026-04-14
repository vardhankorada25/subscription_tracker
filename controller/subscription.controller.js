import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";
const subscribe = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

  const { workflowRunId } = await workflowClient.trigger({
  url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
  body: { subscriptionId: subscription._id },
  headers: { "Content-Type": "application/json" },
  retries: 0,
});
    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      workflowRunId,
      data: subscription,
    });
  } catch (err) {
    next(err);
  }
};

export default subscribe;

export const getUserSubscriptions = async (req, res, next) => {
  try{

    if (req.user.id !== req.params.id){
      return res.status(403).json({message:"your are not the owner of this subscription"});
    }
    const subscriptions=await Subscription.find({user:req.params.id})
    return res.status(200).json({success:true,data:subscriptions})
  }
  catch(err){
    next(err);
  }
}

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You are not the owner of this subscription" });
    }

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: updatedSubscription,
    });
  } catch (err) {
    next(err);
  }
};