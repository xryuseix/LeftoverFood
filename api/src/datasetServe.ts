/** @format */
// https://script.google.com/macros/s/AKfycby5Q9l3cAgvOoWRgxR0mCOvGFsrpd-7I4cGAscRFnVwgJLUa445Rj6d6WPMt3tv3vhmow/exec?source=meta

import { getMetaData } from "./metaDataset";
import {
  APIResponse,
  APISuccessResponse,
  APIErrorResponse,
} from "./models/APIResponse";

export const doGet = (event: GoogleAppsScript.Events.DoGet) => {
  if (typeof event.parameter === "undefined") {
    return toResponseFormat(makeErrorResponse("It works! but no parameter."));
  }
  const dataSource: string | undefined = event.parameter.source;
  if (["meta", "websites"].includes(dataSource)) {
    const sheets = SpreadsheetApp.getActiveSpreadsheet();
    if (dataSource === "meta") {
      const content = getMetaData(sheets);
      if (content !== null) {
        return toResponseFormat(makeSuccessResponse(content));
      } else {
        return toResponseFormat(makeErrorResponse("No data found."));
      }
    } else if (dataSource === "websites") {
      return toResponseFormat(makeSuccessResponse({ dataSource: "websites" }));
    }
  } else {
    return toResponseFormat(makeErrorResponse("Undefined data source :("));
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

const makeSuccessResponse = (content: object) => {
  const success: APISuccessResponse = {
    status: "success",
    content,
  };
  return success;
};

const makeErrorResponse = (errMsg: string) => {
  const error: APIErrorResponse = {
    status: "error",
    content: errMsg,
  };
  return error;
};
