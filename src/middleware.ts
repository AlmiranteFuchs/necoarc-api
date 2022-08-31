import { NextFunction, Request, Response } from "express";

export const createAuthorizationMiddleware = (secret: string) => (req: Request, res: Response, next: NextFunction) => {
    const auth_header = req.get("Authorization");

    if (auth_header == secret) {
        next();
    } else {
        res.status(401).send("Nya! You don't have access!! Go enlight yourself as you wait https://www.youtube.com/watch?v=XisJD8V1Rqw&t=28s");
    }
}