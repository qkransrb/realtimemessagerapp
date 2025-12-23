import "dotenv/config";
import http from "http";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

import { Env } from "./config/env.config";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/async-handler.middleware";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { initializeSocket } from "./lib/socket";
import connectDatabase from "./config/database.config";
import routes from "./routes";

import "./config/passport.config";

const app = express();
const httpServer = http.createServer(app);

// socket
initializeSocket(httpServer);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(passport.initialize());

app.get(
  "/health",
  asyncHandler(async (_req: Request, res: Response) => {
    return res
      .status(HTTPSTATUS.OK)
      .json({ message: "Server is healthy", status: "OK" });
  })
);

app.use("/api", routes);

app.use(errorHandler);

httpServer.listen(Env.PORT, async () => {
  await connectDatabase();
  console.log(`Server running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
