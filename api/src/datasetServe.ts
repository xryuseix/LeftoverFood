/** @format */
// https://script.google.com/macros/s/<Deploy ID>/exec

import { getMetaData } from "./metaDataset";

type APISuccessResponse = {
  status: "success";
  content: object;
};
type APIErrorResponse = { status: "error"; content: string };
type APIResponse = APISuccessResponse | APIErrorResponse;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const doGet = (_event: GoogleAppsScript.Events.DoGet) => {
  const sheets = SpreadsheetApp.getActiveSpreadsheet();
  const content = getMetaData(sheets);
  if (content) {
    const success: APISuccessResponse = { status: "success", content };
    return toResponseFormat(success);
  } else {
    const error: APIErrorResponse = {
      status: "error",
      content: "unexpected error",
    };
    return toResponseFormat(error);
  }
};

/**
 * APIのレスポンスをGASのレスポンスフォーマットに変更する
 * @param status レスポンスステータス
 * @param content レスポンスコンテンツ
 * @returns GASのレスポンスフォーマットに従ったAPIレスポンス
 */
const toResponseFormat = (
  response: APIResponse
): GoogleAppsScript.Content.TextOutput => {
  const output: GoogleAppsScript.Content.TextOutput =
    ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(response));
  return output;
};
