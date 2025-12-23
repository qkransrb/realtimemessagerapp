import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { sendMessageSchema } from "../validators/message.validator";
import { HTTPSTATUS } from "../config/http.config";
import { sendMessageService } from "../services/message.service";

export const sendMessageController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const body = sendMessageSchema.parse(req.body);

    const { userMessage, chat } = await sendMessageService(userId, body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Message sent successfully",
      userMessage,
      chat,
    });
  }
);
