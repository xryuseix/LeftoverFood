/** @format */

export type LeakedInfoInputT =
  | "mail"
  | "phone"
  | "userName"
  | "realName"
  | "unknown";

export type LeakedInputMappingT = {
  [key: string]: LeakedInfoInputT;
};

export type LeakedInfoT = {
  input: LeakedInfoInputT;
  output: string[];
};

export type WebDataColT = {
  domain: string;
  data: string;
  isNotifications: boolean;
  leakedInfo: LeakedInfoT[];
};

export type WebDataResT = WebDataColT[];
