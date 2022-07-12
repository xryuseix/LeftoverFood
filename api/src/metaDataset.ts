/** @format */

type PhoneMetaT = Readonly<
  { PHONE_OR_MAIL: "PHONE" } & Partial<{
    BEGIN_CHARS: number;
    END_CHARS: number;
    MIDDLE_CHARS: number[];
  }>
>;

type MailMetaT = Readonly<
  { PHONE_OR_MAIL: "MAIL" } & Partial<{
    USER_BEGIN: number;
    USER_END: number;
    USER_CHARS: boolean;
    DOMAIN_IS_ALL: boolean;
    DOMAIN_BEGIN: number;
    DOMAIN_DOT: boolean;
    DOMAIN_CHARS: boolean;
  }>
>;

type MetaDataResT = { [key: string]: PhoneMetaT | MailMetaT };

/**
 * マスクされた電話番号に対するメタデータを取得する
 * @param sheets スクリプトに紐づけられたスプレッドシート
 * @returns MetaResponse Schema
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMetaData = (
  sheets: GoogleAppsScript.Spreadsheet.Spreadsheet
): MetaDataResT => {
  // スプレットシートの値を取得
  const sheet = sheets.getSheetByName("UNIQUE");
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
      const contents = ((): [
        keyof PhoneMetaT | keyof MailMetaT,
        string | number | number[] | boolean
      ][] => {
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

class FormatTypeToMetaT<T extends keyof PhoneMetaT | keyof MailMetaT> {
  contents: [T, string | number | number[] | boolean][];
  constructor(contents: [T, string][]) {
    this.contents = contents;
  }
  getContent(): typeof this.contents {
    return this.contents;
  }
  /**
   * 値が空のプロパティをundefinedに変更する
   */
  addUndefiendProperty(): FormatTypeToMetaT<T> {
    this.contents = this.contents.map(([key, value]) => {
      return [key, value === "" ? undefined : value];
    });
    return this;
  }
  /**
   * 型がArrayのプロパティを作成する
   * 元々は半角スペース区切りで記入されている
   * 面倒なので雑にArrayに変換する
   */
  addArrayProperty(): FormatTypeToMetaT<T> {
    this.contents = this.contents.map(([key, val]) => {
      if (key === "MIDDLE_CHARS" && typeof val === "string") {
        return [key, val.split(" ").map((e) => parseInt(e))];
      } else {
        return [key, val];
      }
    });
    return this;
  }
  /**
   * 型がnumberのプロパティを作成する
   * スプレットシートの仕様上多くのプロパティはstring型で数値が入っている
   */
  addStr2NumProperty(): FormatTypeToMetaT<T> {
    this.contents = this.contents.map(([key, val]) => {
      // FIXME 本当は if(T[key] === number)みたいなことやりたかった
      // typeでnumberと定義している場合のみ、numberに変換すべき
      if (typeof val === "string") {
        try {
          return [key, parseInt(val)];
        } catch (_e) {
          return [key, val];
        }
      } else {
        return [key, val];
      }
    });
    return this;
  }
}
