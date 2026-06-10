import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/*
|--------------------------------------------------------------------------
| Authentication Middleware
|--------------------------------------------------------------------------
| Purpose:
| - Checks whether a JWT token is present in the request.
| - Verifies the token using the secret key.
| - Extracts user information from the token.
| - Stores user data in req for later use.
|--------------------------------------------------------------------------
*/
export const auth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // Get Authorization header from request
  // Example:
  // Authorization: Bearer eyJhbGciOi...
  const authHeader = req.headers.authorization;

  // If no Authorization header is sent
  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Extract Token
  |--------------------------------------------------------------------------
  | Supports two formats:
  |
  | 1. Authorization: Bearer <token>
  | 2. Authorization: <token>
  |
  | If "Bearer" exists, extract only the token part.
  |--------------------------------------------------------------------------
  */
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {

    /*
    |--------------------------------------------------------------------------
    | Verify JWT Token
    |--------------------------------------------------------------------------
    | jwt.verify():
    | - Checks whether token is valid.
    | - Checks signature using secret key.
    | - Returns decoded payload if valid.
    |--------------------------------------------------------------------------
    */
    const decoded = jwt.verify(
      token,
      "mysecretkey"
    ) as {
      userId: string;
      role: string;
    };

    console.log("DECODED:", decoded);

    /*
    |--------------------------------------------------------------------------
    | Store User Data in Request Object
    |--------------------------------------------------------------------------
    | After verification, save user details in req.
    |
    | Example:
    | req.userId = "123";
    | req.role   = "operator";
    |
    | These values can be used in controllers
    | and other middleware.
    |--------------------------------------------------------------------------
    */
    (req as any).userId = decoded.userId;
    (req as any).role = decoded.role;

    console.log("USER ID:", (req as any).userId);
    console.log("ROLE:", (req as any).role);

    // Pass control to next middleware/controller
    next();

  } catch (error) {

    /*
    |--------------------------------------------------------------------------
    | Token Verification Failed
    |--------------------------------------------------------------------------
    | Possible reasons:
    | - Invalid token
    | - Expired token
    | - Wrong secret key
    |--------------------------------------------------------------------------
    */
    console.log(error);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Authorization Middleware (Role Based Access Control)
|--------------------------------------------------------------------------
| Purpose:
| - Restricts access based on user role.
|
| Example:
| router.post(
|   "/bus",
|   auth,
|   requireRole("operator"),
|   createBus
| );
|--------------------------------------------------------------------------
*/
export const requireRole = (requiredRole: string) => {

  // Return a middleware function
  return (req: any, res: any, next: any) => {

    console.log("REQUIRED ROLE:", requiredRole);
    console.log("REQUEST ROLE:", req.role);

    /*
    |--------------------------------------------------------------------------
    | Role Check
    |--------------------------------------------------------------------------
    | Compare role from JWT with required role.
    |
    | Example:
    | JWT Role      = operator
    | Required Role = operator
    | => Access Granted
    |
    | JWT Role      = passenger
    | Required Role = operator
    | => Access Denied
    |--------------------------------------------------------------------------
    */
    if (req.role !== requiredRole) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    // User has correct role
    next();
  };
};