/** @format */
// https://script.google.com/macros/s/<Deploy ID>/exec

type APIResponse = {
  status: "success" | "error";
  content: object;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const doGet = (_event: GoogleAppsScript.Events.DoGet) => {
  const sheets = SpreadsheetApp.getActiveSpreadsheet();
  const content = { data: getMetaData(sheets) };
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
 * @returns メタデータ
 */
const getMetaData = (sheets: GoogleAppsScript.Spreadsheet.Spreadsheet) => {
  const sheet = sheets.getSheetByName("UNIQUE");
  const lastColChar = String.fromCharCode(
    "A".charCodeAt(0) + sheet.getLastColumn() - 1
  );
  const metaData: string[][] = sheet
    .getRange(`A1:${lastColChar}${sheet.getLastRow()}`)
    .getValues();
  return metaData;
};
