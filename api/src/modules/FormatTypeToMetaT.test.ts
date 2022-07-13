/** @format */
import { PhoneMetaT, MailMetaT } from "../models/metaDataset";
import FormatTypeToMetaT from "./FormatTypeToMetaT";

test("FormatTypeToMetaT.addUndefiendProperty.phoneContent", () => {
  const phoneContents: [keyof PhoneMetaT, string][] = [
    ["PHONE_OR_MAIL", "PHONE"],
    ["BEGIN_CHARS", ""],
  ];
  const phoneContentsExpect: [keyof PhoneMetaT, string | undefined][] = [
    ["PHONE_OR_MAIL", "PHONE"],
    ["BEGIN_CHARS", undefined],
  ];
  const format = new FormatTypeToMetaT(phoneContents);
  expect(format.addUndefiendProperty().getContent()).toEqual(
    phoneContentsExpect
  );
});

test("FormatTypeToMetaT.addUndefiendProperty.mailContent", () => {
  const mailContents: [keyof MailMetaT, string][] = [
    ["PHONE_OR_MAIL", "PHONE"],
    ["USER_BEGIN", ""],
    ["USER_END", ""],
    ["USER_CHARS", "A"],
  ];
  const phoneContentsExpect: [keyof MailMetaT, string | undefined][] = [
    ["PHONE_OR_MAIL", "PHONE"],
    ["USER_BEGIN", undefined],
    ["USER_END", undefined],
    ["USER_CHARS", "A"],
  ];
  const format = new FormatTypeToMetaT(mailContents);
  expect(format.addUndefiendProperty().getContent()).toEqual(
    phoneContentsExpect
  );
});

test("FormatTypeToMetaT.addArrayProperty", () => {
  const phoneContents: [keyof PhoneMetaT, string][] = [
    ["PHONE_OR_MAIL", "PHONE"],
    ["BEGIN_CHARS", ""],
    ["BEGIN_CHARS", "1 2 3"],
    ["MIDDLE_CHARS", "1 2 3"],
    ["MIDDLE_CHARS", ""],
  ];
  const format1 = new FormatTypeToMetaT(phoneContents);
  const phoneContentsExpect1: [keyof PhoneMetaT, string | number[]][] = [
    ["PHONE_OR_MAIL", "PHONE"],
    ["BEGIN_CHARS", ""],
    ["BEGIN_CHARS", "1 2 3"],
    ["MIDDLE_CHARS", [1, 2, 3]],
    ["MIDDLE_CHARS", ""],
  ];
  expect(format1.addArrayProperty().getContent()).toEqual(phoneContentsExpect1);

  const format2 = new FormatTypeToMetaT(phoneContents);
  const phoneContentsExpect2: [
    keyof PhoneMetaT,
    string | undefined | number[]
  ][] = [
    ["PHONE_OR_MAIL", "PHONE"],
    ["BEGIN_CHARS", undefined],
    ["BEGIN_CHARS", "1 2 3"],
    ["MIDDLE_CHARS", [1, 2, 3]],
    ["MIDDLE_CHARS", undefined],
  ];
  expect(
    format2.addUndefiendProperty().addArrayProperty().getContent()
  ).toEqual(phoneContentsExpect2);
});

test("FormatTypeToMetaT.addStr2NumProperty", () => {
  const phoneContents: [keyof PhoneMetaT, string][] = [
    ["PHONE_OR_MAIL", "PHONE"],
    ["BEGIN_CHARS", ""],
    ["BEGIN_CHARS", "1 2 3"],
    ["MIDDLE_CHARS", "1 2 3"],
    ["MIDDLE_CHARS", ""],
    ["END_CHARS", "1"],
  ];

  const format1 = new FormatTypeToMetaT(phoneContents);
  const phoneContentsExpect1: [keyof PhoneMetaT, string | number][] = [
    ["PHONE_OR_MAIL", "PHONE"],
    ["BEGIN_CHARS", ""],
    ["BEGIN_CHARS", "1 2 3"],
    ["MIDDLE_CHARS", "1 2 3"],
    ["MIDDLE_CHARS", ""],
    ["END_CHARS", 1],
  ];
  expect(format1.addStr2NumProperty().getContent()).toEqual(
    phoneContentsExpect1
  );

  const format2 = new FormatTypeToMetaT(phoneContents);
  const phoneContentsExpect2: [
    keyof PhoneMetaT,
    string | number | undefined
  ][] = [
    ["PHONE_OR_MAIL", "PHONE"],
    ["BEGIN_CHARS", undefined],
    ["BEGIN_CHARS", "1 2 3"],
    ["MIDDLE_CHARS", "1 2 3"],
    ["MIDDLE_CHARS", undefined],
    ["END_CHARS", 1],
  ];
  expect(
    format2.addUndefiendProperty().addStr2NumProperty().getContent()
  ).toEqual(phoneContentsExpect2);

  const format3 = new FormatTypeToMetaT(phoneContents);
  const phoneContentsExpect3: [keyof PhoneMetaT, string | number | number[]][] =
    [
      ["PHONE_OR_MAIL", "PHONE"],
      ["BEGIN_CHARS", ""],
      ["BEGIN_CHARS", "1 2 3"],
      ["MIDDLE_CHARS", [1, 2, 3]],
      ["MIDDLE_CHARS", ""],
      ["END_CHARS", 1],
    ];
  expect(format3.addArrayProperty().addStr2NumProperty().getContent()).toEqual(
    phoneContentsExpect3
  );

  const phoneContentsExpect4: [
    keyof PhoneMetaT,
    string | number | number[] | undefined
  ][] = [
    ["PHONE_OR_MAIL", "PHONE"],
    ["BEGIN_CHARS", undefined],
    ["BEGIN_CHARS", "1 2 3"],
    ["MIDDLE_CHARS", [1, 2, 3]],
    ["MIDDLE_CHARS", undefined],
    ["END_CHARS", 1],
  ];

  const format41 = new FormatTypeToMetaT(phoneContents);
  expect(
    format41
      .addUndefiendProperty()
      .addArrayProperty()
      .addStr2NumProperty()
      .getContent()
  ).toEqual(phoneContentsExpect4);

  const format42 = new FormatTypeToMetaT(phoneContents);
  expect(
    format42
      .addUndefiendProperty()
      .addStr2NumProperty()
      .addArrayProperty()
      .getContent()
  ).toEqual(phoneContentsExpect4);

  const format43 = new FormatTypeToMetaT(phoneContents);
  expect(
    format43
      .addArrayProperty()
      .addUndefiendProperty()
      .addStr2NumProperty()
      .getContent()
  ).toEqual(phoneContentsExpect4);

  const format44 = new FormatTypeToMetaT(phoneContents);
  expect(
    format44
      .addArrayProperty()
      .addStr2NumProperty()
      .addUndefiendProperty()
      .getContent()
  ).toEqual(phoneContentsExpect4);

  const format45 = new FormatTypeToMetaT(phoneContents);
  expect(
    format45
      .addStr2NumProperty()
      .addUndefiendProperty()
      .addArrayProperty()
      .getContent()
  ).toEqual(phoneContentsExpect4);

  const format46 = new FormatTypeToMetaT(phoneContents);
  expect(
    format46
      .addStr2NumProperty()
      .addArrayProperty()
      .addUndefiendProperty()
      .getContent()
  ).toEqual(phoneContentsExpect4);
});
