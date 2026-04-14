import dayjs from 'dayjs';
import { createRequire } from "module";
import Subscription from "../models/subscription.model.js";
import "../models/user.model.js";
import { sendReminderEmail } from '../utils/send-email.js';


const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
const REMINDERS=[7,5,3,2,1];

export const sendReminders = serve(async (context)=>{

 const {subscriptionId}=context.requestPayload;

 const subscription=await fetchSubscription(context,subscriptionId);
//  console.log(`Fetched subscription with ID ${subscriptionId}:`, subscription);

 if (!subscription || subscription.status !== 'active') {
    console.log(`Subscription with ID ${subscriptionId} is not active or does not exist.`);
    return;
  }

    const renewalDate = dayjs(subscription.renewalDate);
    const today = dayjs();

    if (renewalDate.isBefore(today)) {
    console.log(`Subscription with ID ${subscriptionId} is past due for renewal.stop workflow.`);
    return;
  }

  for (const i of REMINDERS) {
    const reminderDate = renewalDate.subtract(i, 'day');

    if (reminderDate.isAfter(today)) {
      await sleepUntilReminder(context, `Reminder ${i} days before`, reminderDate);
    }
    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(context, `${i} days before reminder`, subscription);
    }
  }

});

  const fetchSubscription = async (context, subscriptionId) => {

    return await context.run('get subscription',async()=>{
        return Subscription.findById(subscriptionId).populate('user','name email');
    });
}

  const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder time...`);
    await context.sleepUntil(label, date.toDate());
}

    const triggerReminder = async (context, label,subscription) => {
    return await context.run(label,async()=>{
        console.log(`Triggering ${label} reminder...`);

      await sendReminderEmail({
        to: subscription.user.email,
        type: label,
        subscription,
      });
    });
}