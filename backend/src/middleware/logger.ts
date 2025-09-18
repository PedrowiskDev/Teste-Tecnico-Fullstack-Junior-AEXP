import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("📥 REQUEST:", {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body,
    headers: {
      "content-type": req.headers["content-type"],
      "user-agent": req.headers["user-agent"],
    },
  });

  next();
};
