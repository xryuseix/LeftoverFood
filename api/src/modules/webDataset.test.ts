/** @format */

import {
  removeNotSurveyedWebData,
  FormatToLeakedInput,
  formatToLeakedInfo,
  removeNonLeakedData,
} from "./webDataset";
import {
  LeakedInputMappingT,
  LeakedInfoT,
  WebDataColT,
} from "../models/webDataset";

test("removeNotSurveyedWebData - normal", () => {
  const webData = [
    ["A1", "B1", "C1"],
    ["", "", "C2"],
    ["A3", "", "C3"],
    ["A4", "B4", ""],
    ["A5", "", "C5"],
  ];
  const expected = [
    ["A1", "B1", "C1"],
    ["A4", "B4", ""],
  ];
  expect(removeNotSurveyedWebData(webData)).toEqual(expected);
});

test("removeNotSurveyedWebData - no colmuns", () => {
  const webData = [[]];
  const expected = [[]];
  expect(removeNotSurveyedWebData(webData)).toEqual(expected);
});

test("FormatToLeakedInput", () => {
  const expected: LeakedInputMappingT = {
    Mail: "mail",
    "Phone Number": "phone",
    "User Name": "userName",
    氏名: "realName",
    unknown: "unknown",
    "": "unknown",
  };
  Object.keys(expected).forEach((key) => {
    expect(FormatToLeakedInput(key)).toBe(expected[key]);
  });
});

test("formatToLeakedInfo", () => {
  const leakedInfo = [
    "Mail",
    "***1",
    "***2",
    "User Name",
    "***3",
    "***4",
    "氏名",
    "***5",
    "***6",
  ];
  const expected: LeakedInfoT[] = [
    {
      input: "mail",
      output: ["***1", "***2"],
    },
    {
      input: "userName",
      output: ["***3", "***4"],
    },
    {
      input: "realName",
      output: ["***5", "***6"],
    },
  ];
  expect(formatToLeakedInfo(leakedInfo)).toEqual(expected);
});

test("removeNonLeakedData", () => {
  const webData: WebDataColT[] = [
    {
      domain: "AAA.com",
      data: "2022/22/11",
      isNotifications: true,
      leakedInfo: [],
    },
    {
      domain: "BBB.com",
      data: "2022/22/22",
      isNotifications: true,
      leakedInfo: [
        {
          input: "mail",
          output: ["***1", "***2"],
        },
        {
          input: "userName",
          output: ["***3", "***4"],
        },
      ],
    },
    {
      domain: "CCC.com",
      data: "2022/22/33",
      isNotifications: true,
      leakedInfo: [
        {
          input: "realName",
          output: ["***5", "***6"],
        },
      ],
    },
  ];
  const expected: WebDataColT[] = [
    {
      domain: "BBB.com",
      data: "2022/22/22",
      isNotifications: true,
      leakedInfo: [
        {
          input: "mail",
          output: ["***1", "***2"],
        },
        {
          input: "userName",
          output: ["***3", "***4"],
        },
      ],
    },
    {
      domain: "CCC.com",
      data: "2022/22/33",
      isNotifications: true,
      leakedInfo: [
        {
          input: "realName",
          output: ["***5", "***6"],
        },
      ],
    },
  ];
  expect(removeNonLeakedData(webData)).toEqual(expected);
});
