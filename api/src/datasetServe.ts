/** @format */
// https://script.google.com/macros/s/<Deploy ID>/exec

import { getMetaData } from "./metaDataset";
import {
  APIResponse,
  APISuccessResponse,
  APIErrorResponse,
} from "./models/APIResponse";

export const doGet = (_event: GoogleAppsScript.Events.DoGet) => {
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
export const toResponseFormat = (
  response: APIResponse
): GoogleAppsScript.Content.TextOutput => {
  // NOTE: ContentServiceはGASのみで使用可能なので、ローカルでテストができない
  const output: GoogleAppsScript.Content.TextOutput =
    ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(response));
  return output;
};
