import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import transporter, { accountEmail } from "../config/nodemailer.js";

export const sendReminderEmail=async({to,type,subscription, daysLeft})=>{
    if (!to || !type) throw new Error("Missing required parameters");
    const template=emailTemplates.find((t)=>t.label===type);

    if (!template) throw new Error("Invalid email type");

    const mailinfo={
        userName:subscription.user.name,
        subscriptionName:subscription.name,
        renewalDate:dayjs(subscription.renewalDate).format('MMMM D, YYYY'),
        planName:subscription.name,
        price: `${subscription.currency} ${subscription.price} ${subscription.frequency}`,
        paymentMethod:subscription.paymentMethod,
        daysLeft,
}
        
       const  message=template.generateBody(mailinfo);
       const subject=template.generateSubject(mailinfo);
       const mailOptions={
        from:accountEmail,
        to:to,
        subject:subject,
        html:message,
       }

       const info = await transporter.sendMail(mailOptions);
       console.log(`Email sent to ${to}: ${info.response}`);
       }
