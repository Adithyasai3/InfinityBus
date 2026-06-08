import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request,res:Response,next: NextFunction)=>{
    const token = req.headers.authorization ;

    if(!token){
        return res.status(401).json({
            message : "No token provided",
        });
    }

    try{
        console.log("TOKEN:", token);

        console.log("VERIFY SECRET:", "mysecretkey");

        const decoded = jwt.verify(
            token,
            "mysecretkey"
        )as {userId: string
            role : string;
        };
        (req as any).userId = decoded.userId;
        (req as any).role = decoded.role;

        console.log(decoded);

        next();

    }catch(error){
             console.log(error);
        return res.status(401).json({
           
            message:"Invalid token",
        });
    }
}

export const requireRole = (requiredRole:string)=>{
    return(req:any,res:any,next:any)=>{
        if(req.role !== requiredRole){
            return res.status(403).json({
                message:"Access Denied"
            });
        }
        next();
    }
}

