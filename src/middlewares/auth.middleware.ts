import { NextFunction, Request, Response } from "express";
import { getUserData, IUserToken } from "../utils/jwt";

export interface IRequestUser extends Request {
  user: IUserToken;
}

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({
        message: "Access token is required",
        error: "No authorization header provided",
      });
    }

    const [prefix, accessToken] = authorization.split(" ");

    if (prefix !== "Bearer") {
      return res.status(401).json({
        message: "Invalid token format",
        error: "Authorization header must start with 'Bearer '",
      });
    }

    if (!accessToken) {
      return res.status(401).json({
        message: "Access token is required",
        error: "No token provided after 'Bearer '",
      });
    }

    const user = getUserData(accessToken);
    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
        error: "Token verification failed",
      });
    }

    (req as IRequestUser).user = user;
    return next();
  } catch (error) {
    const errorMessage = (error as Error).message;
    let message = "Unauthorized";

    if (errorMessage.includes("jwt malformed")) {
      message = "Invalid token format";
    } else if (errorMessage.includes("jwt expired")) {
      message = "Token has expired";
    } else if (errorMessage.includes("invalid signature")) {
      message = "Invalid token signature";
    }

    return res.status(401).json({
      message,
      error: errorMessage,
    });
  }
};
