/** @format */

import { doGet } from "./datasetServe";

declare const global: {
  [x: string]: unknown;
};

global.doGet = doGet;
