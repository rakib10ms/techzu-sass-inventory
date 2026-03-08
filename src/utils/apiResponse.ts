export interface FieldError {
  field: string | number;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors: FieldError[] | null;
}

export const sendResponse = <T>(
  res: Response,
  {
    statusCode,
    success,
    message,
    data,
    errors,
  }: {
    statusCode: number;
    success: boolean;
    message?: string;
    data?: T | null;
    errors?: FieldError[] | null;
  }
): void => {
  const body: ApiResponse<T> = {
    success,
    message: message ?? (success ? 'Request successful' : 'Request failed'),
    data: data ?? null,
    errors: errors ?? null,
  };

  res.status(statusCode).json(body);
};
