import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Authentication failed: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Authentication failed: Invalid token' });
  }
};
