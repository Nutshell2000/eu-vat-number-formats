// EU VAT number formats: zero-dependency helpers over vat-formats.json.
import { readFileSync } from "node:fs";

/** @type {{code:string,country:string,localName:string,format:string,example:string,pattern:string,notes:string[]}[]} */
export const VAT_FORMATS = JSON.parse(readFileSync(new URL("./vat-formats.json", import.meta.url), "utf8"));
const BY_CODE = new Map(VAT_FORMATS.map((f) => [f.code, { ...f, regex: new RegExp(f.pattern) }]));

/** Uppercase, without spaces, dots or hyphens; a GR prefix becomes EL (the prefix VIES uses for Greece). */
export function normalizeVat(input) {
  return String(input).toUpperCase().replace(/[\s.\-]/g, "").replace(/^GR/, "EL");
}

/** The format record for a 2-letter prefix (GR is read as EL), or undefined. */
export function formatOf(code) {
  const key = String(code).toUpperCase();
  return BY_CODE.get(key === "GR" ? "EL" : key);
}

/** True when the number is well formed for its country. It says nothing about whether the number is registered. */
export function looksLikeVat(input) {
  const vat = normalizeVat(input);
  const format = BY_CODE.get(vat.slice(0, 2));
  return Boolean(format && format.regex.test(vat));
}
