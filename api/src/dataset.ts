/** @format */
// https://script.google.com/macros/s/<Deploy ID>/exec

type APIResponse = {
  status: "success" | "error";
  content: object;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const doGet = (_event: GoogleAppsScript.Events.DoGet) => {
  const sheets = SpreadsheetApp.getActiveSpreadsheet();
  const content = getMetaData(sheets);
  return toResponseFormat("success", content);
};

/**
 * APIのレスポンスをGASのレスポンスフォーマットに変更する
 * @param status レスポンスステータス
 * @param content レスポンスコンテンツ
 * @returns GASのレスポンスフォーマットに従ったAPIレスポンス
 */
const toResponseFormat = (
  status: "success" | "error",
  content: object
): GoogleAppsScript.Content.TextOutput => {
  const response: APIResponse = { status, content };
  const output: GoogleAppsScript.Content.TextOutput =
    ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(response));
  return output;
};

/**
 * マスクされた電話番号に対するメタデータを取得する
 * @param sheets スクリプトに紐づけられたスプレッドシート
 * @returns MetaResponse Schema
 */
// TODO: 型定義を追加する
const getMetaData = (sheets: GoogleAppsScript.Spreadsheet.Spreadsheet) => {
  const sheet = sheets.getSheetByName("UNIQUE");
  const lastColChar = String.fromCharCode(
    "A".charCodeAt(0) + sheet.getLastColumn() - 1
  );
  const metaData: string[][] = sheet
    .getRange(`A1:${lastColChar}${sheet.getLastRow()}`)
    .getValues();

  const columnTitles = zip(metaData[0].slice(2), metaData[1].slice(2)).map(
    (col: string[]) => {
      return {
        phoneOrEmail: col[0],
        columnTitle: col[1],
      };
    }
  );
  const phoneColumnTitles = columnTitles.filter(
    (columnTitle) => columnTitle.phoneOrEmail === "PHONE"
  );
  const emailColumnTitles = columnTitles.filter(
    (columnTitle) => columnTitle.phoneOrEmail === "MAIL"
  );
  const metaResponse = metaData.slice(2).map((row: string[]) => {
    const leakedInfo = row[0];
    const phoneOrEmail = row[1] === "PHONE" ? "phone" : "email";
    const getContents = (): string[][] => {
      if (phoneOrEmail === "phone") {
        const phoneContents = zip(
          phoneColumnTitles.map((col) => col.columnTitle),
          row.slice(2)
        );
        return phoneContents;
      } else {
        const emailContents = zip(
          emailColumnTitles.map((col) => col.columnTitle),
          row.slice(2)
        );
        return emailContents;
      }
    };
    return [leakedInfo, Object.fromEntries(getContents())];
  });
  console.log(Object.fromEntries(metaResponse));
  return Object.fromEntries(metaResponse);
};
