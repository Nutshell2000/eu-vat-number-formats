import assert from "node:assert/strict";
import { VAT_FORMATS, formatOf, looksLikeVat, normalizeVat } from "./index.js";

assert.equal(VAT_FORMATS.length, 28);
for (const f of VAT_FORMATS) {
  assert.ok(looksLikeVat(f.example), `${f.code}: its own example fits`);
  assert.ok(!looksLikeVat(`${f.code}1`), `${f.code}: a one-digit number does not fit`);
}
assert.equal(normalizeVat("se 556703-7485 01"), "SE556703748501");
assert.ok(looksLikeVat("SE556703748501"));
assert.ok(looksLikeVat("FR27552032534"));
assert.ok(looksLikeVat("GR123456789"));
assert.ok(!looksLikeVat("GB123456789"), "GB is not in VIES");
assert.ok(!looksLikeVat("DE12345"));
assert.equal(formatOf("gr").code, "EL");
console.log("ok");
