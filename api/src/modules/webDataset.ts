/** @format */
import {
  WebDataResT,
  WebDataColT,
  LeakedInfoT,
  LeakedInfoInputT,
  LeakedInputMappingT,
} from "../models/webDataset";

export const getWebsiteData = (
  sheets: GoogleAppsScript.Spreadsheet.Spreadsheet
): WebDataResT | null => {
  const sheet = sheets.getSheetByName("Web");
  if (!sheet) return null;
  const lastColChar = String.fromCharCode(
    "A".charCodeAt(0) + sheet.getLastColumn() - 1
  );
  const webData: (string | boolean)[][] = sheet
    .getRange(`A2:${lastColChar}${sheet.getLastRow()}`)
    .getValues();

  const surveyedWebData = removeNotSurveyedWebData(webData);
  const formattedWebData = formatToWebDataColumnT(surveyedWebData);
  return removeNonLeakedData(formattedWebData);
};

/**
 * 調査していないデータを削除する
 * 日付カラムが空白のデータを未調査として判断する
 * @param webData Webデータ
 * @returns 調査済みのWebデータ
 */
export const removeNotSurveyedWebData = (webData: (string | boolean)[][]) => {
  return webData.filter((row) => row[1] !== "");
};

/**
 * ドメイン, 日付, 通知が届くかどうか, リーク情報をWebDataColT型に変換する
 * @param webData 調査済みのWebデータ
 * @returns
 */
export const formatToWebDataColumnT = (
  webData: (string | boolean)[][]
): WebDataColT[] => {
  return webData.map((row) => {
    return {
      domain: `${row[0]}`,
      data: `${row[1]}`,
      isNotifications: row[13] === true,
      leakedInfo: formatToLeakedInfo(row.slice(4, 13).map((col) => `${col}`)),
    };
  });
};

/**
 * string[]のリーク情報をLeakedInfoT[]に変換する
 * @param leakedInfo string[]のリーク情報
 * @returns LeakedInfoT[]のリーク情報
 */
export const formatToLeakedInfo = (leakedInfo: string[]): LeakedInfoT[] => {
  const leakedInfos = [
    leakedInfo.slice(0, 3),
    leakedInfo.slice(3, 6),
    leakedInfo.slice(6, 9),
  ];
  return leakedInfos
    .map((leakedInfoCol) => {
      if (leakedInfoCol[0] === "") {
        return null;
      } else {
        const leakedInfo: LeakedInfoT = {
          input: FormatToLeakedInput(leakedInfoCol[0]),
          output: leakedInfoCol.slice(1).filter((col) => col !== ""),
        };
        return leakedInfo;
      }
    })
    .filter(
      (leakedInfo): leakedInfo is NonNullable<typeof leakedInfo> =>
        leakedInfo != null
    );
};

/**
 * スプレッドシートのリーク情報の入力値フォーマットをプログラム上で識別しやすいように変換する
 * @param leakedInput リーク情報の入力値
 * @returns 変換後のリーク情報の入力値
 */
export const FormatToLeakedInput = (leakedInput: string): LeakedInfoInputT => {
  const mapping: LeakedInputMappingT = {
    Mail: "mail",
    "User Name": "userName",
    "Phone Number": "phone",
    氏名: "realName",
  };
  if (leakedInput in mapping) {
    return mapping[leakedInput];
  } else {
    return "unknown";
  }
};

/**
 * リークされないデータを削除する
 * @param webData
 * @returns リークされるデータのみを残す
 */
export const removeNonLeakedData = (webData: WebDataResT) => {
  return webData.filter((webData) => webData.leakedInfo.length > 0);
};
