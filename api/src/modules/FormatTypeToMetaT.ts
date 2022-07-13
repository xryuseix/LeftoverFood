/** @format */
import { PhoneMetaT, MailMetaT, MetaContentsT } from "../models/metaDataset";

class FormatTypeToMetaT<T extends keyof PhoneMetaT | keyof MailMetaT> {
  private contents: [T, MetaContentsT][];

  public constructor(contents: [T, string][]) {
    this.contents = contents;
  }

  public getContent(): [T, MetaContentsT][] {
    return this.contents;
  }

  /**
   * 値が空のプロパティをundefinedに変更する
   */
  addUndefiendProperty(): FormatTypeToMetaT<T> {
    this.contents = this.contents.map(([key, value]) => [
      key,
      value === "" ? undefined : value,
    ]);
    return this;
  }

  /**
   * 型がArrayのプロパティを作成する
   * 元々は半角スペース区切りで記入されている
   * 面倒なので雑にArrayに変換する
   */
  addArrayProperty(): FormatTypeToMetaT<T> {
    this.contents = this.contents.map(([key, val]) => {
      if (key === "MIDDLE_CHARS" && typeof val === "string" && val !== "") {
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
      if (typeof val === "string" && /^-?\d+$/.test(val)) {
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

export default FormatTypeToMetaT;
