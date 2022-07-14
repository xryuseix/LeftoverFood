/** @format */

export type APISuccessResponse = {
  status: "success";
  content: object;
};
export type APIErrorResponse = { status: "error"; content: string };
export type APIResponse = APISuccessResponse | APIErrorResponse;
