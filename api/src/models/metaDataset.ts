/** @format */

export type PhoneMetaT = Readonly<
  { PHONE_OR_MAIL: "PHONE" } & Partial<{
    BEGIN_CHARS: number;
    END_CHARS: number;
    MIDDLE_CHARS: number[];
  }>
>;

export type MailMetaT = Readonly<
  { PHONE_OR_MAIL: "MAIL" } & Partial<{
    USER_BEGIN: number;
    USER_END: number;
    USER_CHARS: boolean;
    DOMAIN_IS_ALL: boolean;
    DOMAIN_BEGIN: number;
    DOMAIN_DOT: boolean;
    DOMAIN_CHARS: boolean;
  }>
>;

export type MetaDataResT = { [key: string]: PhoneMetaT | MailMetaT };

export type MetaContentsT = string | number | number[] | boolean | undefined;
