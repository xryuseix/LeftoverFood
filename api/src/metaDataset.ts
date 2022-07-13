/** @format */
import { zip } from "./utils";
import FormatTypeToMetaT from "./modules/FormatTypeToMetaT";
import { PhoneMetaT, MailMetaT, MetaDataResT } from "./models/metaDataset";

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

  // タイトル行の値を取得
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
  const mailColumnTitles = columnTitles.filter(
    (columnTitle) => columnTitle.phoneOrEmail === "MAIL"
  );

  // Response formatに従ってシートのデータを整形
  // FIXME: Refactoring
  const metaResponse = metaData
    .slice(2)
    .map((row: string[]): [string, PhoneMetaT | MailMetaT] => {
      const leakedInfo = row[0];
      const phoneOrEmail = row[1] === "PHONE" ? "phone" : "email";
      const contents = (() => {
        switch (phoneOrEmail) {
          case "phone": {
            const phoneContents = zip(
              phoneColumnTitles.map((col) => col.columnTitle),
              row.slice(2)
            ) as [keyof PhoneMetaT, string][];
            return new FormatTypeToMetaT<keyof PhoneMetaT>(phoneContents)
              .addUndefiendProperty()
              .addArrayProperty()
              .addStr2NumProperty()
              .getContent();
          }
          case "email": {
            const mailContents = zip(
              mailColumnTitles.map((col) => col.columnTitle),
              row.slice(2)
            ) as [keyof MailMetaT, string][];
            return new FormatTypeToMetaT<keyof MailMetaT>(mailContents)
              .addUndefiendProperty()
              .addArrayProperty()
              .addStr2NumProperty()
              .getContent();
          }
        }
      })();
      // FIXME
      return [leakedInfo, Object.fromEntries(contents as string[][])];
    });
  console.log(Object.fromEntries(metaResponse));
  return Object.fromEntries(metaResponse) as MetaDataResT;
};
