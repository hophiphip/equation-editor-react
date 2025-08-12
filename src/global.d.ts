import { MathQuill } from "./types";

declare global {
  var MathQuill: MathQuill;

  interface Window {
    jQuery: JQueryStatic;
  }
}

export {};