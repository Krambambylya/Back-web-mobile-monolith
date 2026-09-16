import { NextFunction, Request, Response } from 'express';
import { unifiedResponse } from 'uni-response';
import { ZodType } from 'zod';

export const validateRequest = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      res.status(400).json(unifiedResponse(false, 'Validation error', null, errorMessages));

      return;
    }

    req.body = validationResult.data;

    next();
  };
};
