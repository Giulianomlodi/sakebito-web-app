import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const SECRET_KEY = process.env.MOONPAY_SECRET_KEY!;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (typeof url !== "string") {
    return res
      .status(400)
      .json({ error: "URL parameter is required and must be a string" });
  }

  try {
    const parsedUrl = new URL(url);
    const urlWithoutSignature =
      parsedUrl.origin + parsedUrl.pathname + parsedUrl.search;

    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(urlWithoutSignature)
      .digest("base64");

    res.status(200).json({ signature });
  } catch (error) {
    console.error("Error generating signature:", error);
    res.status(500).json({ error: "Failed to generate signature" });
  }
}
