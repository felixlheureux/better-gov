import sendgrid from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.SENDGRID_API_KEY || "";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "";

sendgrid.setApiKey(API_KEY);

const sendEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await sendgrid.send({
      to: CONTACT_EMAIL,
      from: CONTACT_EMAIL,
      subject: `${req.body.subject}`,
      html: `<div>You've got a mail</div>`,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message });
  }

  return res.status(200).json({ success: true });
};

export default sendEmail;
