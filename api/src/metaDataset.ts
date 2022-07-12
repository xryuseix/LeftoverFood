/** @format */

type PhoneMetaT = Readonly<
  { PHONE_OR_MAIL: "PHONE" } & Partial<{
    BEGIN_CHARS: number;
    END_CHARS: number;
    MIDDLE_CHARS: Array<number>;
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
  const emailColumnTitles = columnTitles.filter(
    (columnTitle) => columnTitle.phoneOrEmail === "MAIL"
  );

  // Response formatに従ってシートのデータを整形
  // FIXME: Refactoring
  const metaResponse = metaData
    .slice(2)
    .map((row: string[]): [string, PhoneMetaT | MailMetaT] => {
      const leakedInfo = row[0];
      const phoneOrEmail = row[1] === "PHONE" ? "phone" : "email";
      const contents = ((): [keyof PhoneMetaT | keyof MailMetaT, string][] => {
        switch (phoneOrEmail) {
          case "phone": {
            const phoneContents = zip(
              phoneColumnTitles.map((col) => col.columnTitle),
              row.slice(2)
            ) as [keyof PhoneMetaT, string][];
            return addUndefiendProperty<keyof PhoneMetaT>(phoneContents);
          }
          case "email": {
            const emailContents = zip(
              emailColumnTitles.map((col) => col.columnTitle),
              row.slice(2)
            ) as [keyof MailMetaT, string][];
            return addUndefiendProperty<keyof MailMetaT>(emailContents);
          }
        }
      })();
      // FIXME
      return [leakedInfo, Object.fromEntries(contents as string[][])];
    });
  console.log(Object.fromEntries(metaResponse));
  return Object.fromEntries(metaResponse) as MetaDataResT;
};

/**
 * 値空のプロパティをundefinedに変更する
 * @param 空文字が入ったsheet contents
 * @returns 空文字がundefiendになったsheet contents
 */
const addUndefiendProperty = <T extends keyof PhoneMetaT | keyof MailMetaT>(
  contents: [T, string][]
): [T, string][] => {
  return contents.map(([key, val]) => {
    if (val === "") {
      return [key, undefined];
    } else {
      return [key, val];
    }
  });
};
