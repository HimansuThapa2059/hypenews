export const getErrorMessage = (error: unknown) => {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  if (Array.isArray(error)) return error[0]?.message;
  if (typeof error === "object" && "message" in error) {
    return (error as { message?: string }).message;
  }
  return undefined;
};
