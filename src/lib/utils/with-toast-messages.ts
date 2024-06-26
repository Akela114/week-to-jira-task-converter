import { toast } from "react-toastify";

export const withToastMessages =
  <T, T2>(
    callback: (...params: T[]) => Promise<T2>,
    messages: {
      pending: string;
      success: string;
      error: string;
    }
  ) =>
    (...params: T[]) =>
      toast.promise(callback(...params), {
        ...messages,
        error: {
          render: ({ data }: { data?: { message?: unknown } }) => {
            const message = data?.message;
            return typeof message === "string" ? message : messages.error;
          },
        },
      });