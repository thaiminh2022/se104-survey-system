export type ActionState<T> =
  | {
      error: unknown;
      message: string;
      success: false;
    }
  | {
      success: true;
      data: T;
    };
export function createError(
  error: unknown,
  message: string,
): ActionState<never> {
  return {
    error,
    message,
    success: false,
  };
}

export function createSuccess<T>(data: T): ActionState<T> {
  return {
    success: true,
    data,
  };
}
