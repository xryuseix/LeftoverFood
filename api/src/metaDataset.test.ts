/** @format */

import { getTitles, getFilterdColumnTitles } from "./metaDataset";
import { ColumnTitleT } from "./models/metaDataset";

test("getTitle", () => {
  const row0 = [
    "PHONE",
    "PHONE",
    "PHONE",
    "MAIL",
    "MAIL",
    "MAIL",
    "MAIL",
    "MAIL",
    "MAIL",
    "MAIL",
  ];
  const row1 = [
    "BEGIN_CHARS",
    "END_CHARS",
    "MIDDLE_IDX",
    "USER_BEGIN",
    "USER_END",
    "USER_CHARS",
    "DOMAIN_IS_ALL",
    "DOMAIN_BEGIN",
    "DOMAIN_DOT",
    "DOMAIN_CHARS",
  ];
  const expected = [
    { phoneOrMail: "PHONE", columnTitle: "BEGIN_CHARS" },
    { phoneOrMail: "PHONE", columnTitle: "END_CHARS" },
    { phoneOrMail: "PHONE", columnTitle: "MIDDLE_IDX" },
    { phoneOrMail: "MAIL", columnTitle: "USER_BEGIN" },
    { phoneOrMail: "MAIL", columnTitle: "USER_END" },
    { phoneOrMail: "MAIL", columnTitle: "USER_CHARS" },
    { phoneOrMail: "MAIL", columnTitle: "DOMAIN_IS_ALL" },
    { phoneOrMail: "MAIL", columnTitle: "DOMAIN_BEGIN" },
    { phoneOrMail: "MAIL", columnTitle: "DOMAIN_DOT" },
    { phoneOrMail: "MAIL", columnTitle: "DOMAIN_CHARS" },
  ];
  expect(getTitles(row0, row1)).toEqual(expected);
});

test("getFilterdColumnTitles", () => {
  const mixedColumnTitles = [
    { phoneOrMail: "PHONE", columnTitle: "END_CHARS" },
    { phoneOrMail: "MAIL", columnTitle: "USER_BEGIN" },
    { phoneOrMail: "PHONE", columnTitle: "MIDDLE_IDX" },
    { phoneOrMail: "MAIL", columnTitle: "USER_END" },
  ];
  const phoneColumnTitles = [
    { phoneOrMail: "PHONE", columnTitle: "END_CHARS" },
    { phoneOrMail: "PHONE", columnTitle: "MIDDLE_IDX" },
  ];
  const mailColumnTitles = [
    { phoneOrMail: "MAIL", columnTitle: "USER_BEGIN" },
    { phoneOrMail: "MAIL", columnTitle: "USER_END" },
  ];
  const mailExpected = [
    { phoneOrMail: "MAIL", columnTitle: "USER_BEGIN" },
    { phoneOrMail: "MAIL", columnTitle: "USER_END" },
  ];
  const phoneExpected = [
    { phoneOrMail: "PHONE", columnTitle: "END_CHARS" },
    { phoneOrMail: "PHONE", columnTitle: "MIDDLE_IDX" },
  ];
  const noneColumnTitles: ColumnTitleT[] = [];
  const noneExpected: ColumnTitleT[] = [];
  expect(getFilterdColumnTitles(mixedColumnTitles, "PHONE")).toEqual(
    phoneExpected
  );
  expect(getFilterdColumnTitles(mixedColumnTitles, "MAIL")).toEqual(
    mailExpected
  );
  expect(getFilterdColumnTitles(phoneColumnTitles, "PHONE")).toEqual(
    phoneExpected
  );
  expect(getFilterdColumnTitles(mailColumnTitles, "MAIL")).toEqual(
    mailExpected
  );
  expect(getFilterdColumnTitles(noneColumnTitles, "PHONE")).toEqual(
    noneExpected
  );
});
