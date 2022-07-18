/** @format */
import { zip } from "./utils";
import FormatTypeToMetaT from "../modules/FormatTypeToMetaT";
import {
  PhoneMetaT,
  MailMetaT,
  MetaDataResT,
  ColumnTitleT,
} from "../models/metaDataset";

/**
 * マスクされた電話番号に対するメタデータを取得する
 * @param sheets スクリプトに紐づけられたスプレッドシート
 * @returns MetaResponse Schema
 */
export const getMetaData = (
  sheets: GoogleAppsScript.Spreadsheet.Spreadsheet
): MetaDataResT | null => {
  // スプレットシートの値を取得
  const sheet = sheets.getSheetByName("UNIQUE");
  if (!sheet) return null;
  const lastColChar = String.fromCharCode(
    "A".charCodeAt(0) + sheet.getLastColumn() - 1
  );
  const metaData: string[][] = sheet
    .getRange(`A1:${lastColChar}${sheet.getLastRow()}`)
    .getValues();

  const columnTitles = getTitles(metaData[0].slice(2), metaData[1].slice(2));
  const phoneColumnTitles = getFilterdColumnTitles(columnTitles, "PHONE");
  const mailColumnTitles = getFilterdColumnTitles(columnTitles, "MAIL");

  // Response formatに従ってシートのデータを整形
  // FIXME: Refactoring
  const metaResponse = metaData
    .slice(2)
    .map((row: string[]): [string, PhoneMetaT | MailMetaT] => {
      const leakedInfo = row[0];
      const isPhone = row[1] === "PHONE";
      const contents = (() => {
        if (isPhone) {
          const phoneContents = zip(
            phoneColumnTitles.map((col) => col.columnTitle),
            row.slice(2)
          ) as [keyof PhoneMetaT, string][];
          return new FormatTypeToMetaT(phoneContents)
            .addUndefiendProperty()
            .addArrayProperty()
            .addStr2NumProperty()
            .getContent();
        } else {
          const mailContents = zip(
            mailColumnTitles.map((col) => col.columnTitle),
            row.slice(2)
          ) as [keyof MailMetaT, string][];
          return new FormatTypeToMetaT(mailContents)
            .addUndefiendProperty()
            .addArrayProperty()
            .addStr2NumProperty()
            .getContent();
        }
      })();
      // FIXME
      return [leakedInfo, Object.fromEntries(contents as string[][])];
    });
  console.log(Object.fromEntries(metaResponse));
  return Object.fromEntries(metaResponse) as MetaDataResT;
};

/**
 * データセットのタイトルを取得する
 * @param row0 PHONE or MAIL, ...
 * @param row1 BEGIN_CHARS, END_CHARS
 * @returns {PHONE, BEGIN_CHARS}, ...
 */
export const getTitles = (row0: string[], row1: string[]): ColumnTitleT[] => {
  // タイトル行の値を取得
  const columnTitles = zip(row0, row1).map((col: string[]) => {
    return {
      phoneOrMail: col[0],
      columnTitle: col[1],
    };
  });
  return columnTitles;
};

/**
 * データセットのタイトルを"PHONE"または"MAIL"でフィルターする
 * @param columnTitles
 * @param phoneOrMail
 * @returns フィルターされたタイトル
 */
export const getFilterdColumnTitles = (
  columnTitles: ColumnTitleT[],
  phoneOrMail: "PHONE" | "MAIL"
) => {
  const FilterdColumnTitles = columnTitles.filter(
    (columnTitle) => columnTitle.phoneOrMail === phoneOrMail
  );
  return FilterdColumnTitles;
};
