import sendgrid from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY || "");

const sendEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await sendgrid.send({
      to: "felixslheureux@gmail.com",
      from: "felixslheureux@gmail.com",
      subject: `${req.body.subject}`,
      html: `<div>You've got a mail</div>`,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message });
  }

  return res.status(200).json({ success: true });
};

export default sendEmail;
