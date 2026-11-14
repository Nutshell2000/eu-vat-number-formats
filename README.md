# EU VAT number formats

The format of the VAT number in every country that the EU's VIES service covers (the 27 member states and Northern Ireland): prefix, length, a regular expression, the local name, and the country-specific things that trip people up. As a Markdown table, as JSON (`vat-formats.json`) and as a tiny zero-dependency JavaScript module.

A format check tells you a number is well formed. It does not tell you the number is registered: only a live VIES check does. See [Live check](#live-check).

## The table

Strip spaces, dots and hyphens and uppercase the input first. Examples show the shape only; they are not real registrations.

| Country | Prefix | After the prefix | Example shape | Regex |
|---|---|---|---|---|
| Austria | `AT` | the letter U and 8 digits | `ATU12345678` | `^ATU\d{8}$` |
| Belgium | `BE` | 10 digits, the first 0 or 1 | `BE0123456789` | `^BE[01]\d{9}$` |
| Bulgaria | `BG` | 9 or 10 digits | `BG123456789` | `^BG\d{9,10}$` |
| Cyprus | `CY` | 8 digits and a letter | `CY12345678X` | `^CY\d{8}[A-Z]$` |
| Czech Republic | `CZ` | 8, 9 or 10 digits | `CZ12345678` | `^CZ\d{8,10}$` |
| Germany | `DE` | 9 digits | `DE123456789` | `^DE\d{9}$` |
| Denmark | `DK` | 8 digits | `DK12345678` | `^DK\d{8}$` |
| Estonia | `EE` | 9 digits | `EE123456789` | `^EE\d{9}$` |
| Greece | `EL` | 9 digits | `EL123456789` | `^EL\d{9}$` |
| Spain | `ES` | 9 characters: a letter or digit, 7 digits, a letter or digit | `ESX1234567X` | `^ES[A-Z0-9]\d{7}[A-Z0-9]$` |
| Finland | `FI` | 8 digits | `FI12345678` | `^FI\d{8}$` |
| France | `FR` | a 2-character key (digits, or letters other than O and I) and the 9-digit SIREN | `FR12345678901` | `^FR[0-9A-HJ-NP-Z]{2}\d{9}$` |
| Croatia | `HR` | 11 digits | `HR12345678901` | `^HR\d{11}$` |
| Hungary | `HU` | 8 digits | `HU12345678` | `^HU\d{8}$` |
| Ireland | `IE` | 7 digits and 1 or 2 letters, or the older form: a digit, a letter or + or *, 5 digits and a letter | `IE1234567X` | `^IE(\d{7}[A-Z]{1,2}\|\d[A-Z+*]\d{5}[A-Z])$` |
| Italy | `IT` | 11 digits | `IT12345678901` | `^IT\d{11}$` |
| Lithuania | `LT` | 9 or 12 digits | `LT123456789` | `^LT(\d{9}\|\d{12})$` |
| Luxembourg | `LU` | 8 digits | `LU12345678` | `^LU\d{8}$` |
| Latvia | `LV` | 11 digits | `LV12345678901` | `^LV\d{11}$` |
| Malta | `MT` | 8 digits | `MT12345678` | `^MT\d{8}$` |
| Netherlands | `NL` | 9 digits, the letter B and 2 digits | `NL123456789B01` | `^NL\d{9}B\d{2}$` |
| Poland | `PL` | 10 digits | `PL1234567890` | `^PL\d{10}$` |
| Portugal | `PT` | 9 digits | `PT123456789` | `^PT\d{9}$` |
| Romania | `RO` | 2 to 10 digits | `RO12345678` | `^RO\d{2,10}$` |
| Sweden | `SE` | 12 digits: the 10-digit organisationsnummer followed by 01 | `SE123456789001` | `^SE\d{12}$` |
| Slovenia | `SI` | 8 digits | `SI12345678` | `^SI\d{8}$` |
| Slovakia | `SK` | 10 digits | `SK1234567890` | `^SK\d{10}$` |
| Northern Ireland | `XI` | 9 or 12 digits, or GD or HA and 3 digits | `XI123456789` | `^XI(\d{9}\|\d{12}\|(GD\|HA)\d{3})$` |

## Country notes

- **Belgium (BE):** Older 9-digit numbers are written with a leading 0.
- **Germany (DE):** Germany does not share the registered name and address through VIES: a check returns valid or not valid only. The USt-IdNr. is not the Steuernummer on German invoices; only the USt-IdNr. can be checked in VIES.
- **Greece (EL):** Greece's prefix in VIES is EL, not its ISO code GR. A number sent with GR is checked as EL.
- **Spain (ES):** Spain does not share the registered name and address through VIES: a check returns valid or not valid only. A Spanish NIF is valid in VIES only when the business is entered in the register of intra-Community operators (ROI).
- **Finland (FI):** It is the business ID (Y-tunnus) without the hyphen: 0112038-9 becomes FI01120389.
- **France (FR):** The last 9 digits are the company's SIREN, so the number also identifies it in the Sirene register.
- **Netherlands (NL):** Sole proprietors have a btw-id that differs from their older, citizen-number-based VAT number; the btw-id is the one to check.
- **Sweden (SE):** The first 10 digits are the organisationsnummer, so 556703-7485 becomes SE556703748501.
- **Northern Ireland (XI):** Since Brexit only Northern Ireland businesses trading in goods have an XI number in VIES. Numbers with the GB prefix are not in VIES.

## JavaScript

```js
import { looksLikeVat, normalizeVat, formatOf } from "./index.js";

normalizeVat("se 556703-7485 01");   // "SE556703748501"
looksLikeVat("DE 123 456 789");      // true  (well formed; says nothing about registration)
looksLikeVat("GR123456789");         // true  (GR is read as EL)
looksLikeVat("DE12345");             // false
formatOf("NL").format;               // "9 digits, the letter B and 2 digits"
```

`node test.js` runs the checks.

## Live check

VIES asks each member state's own tax database, and those backends go down or refuse concurrent requests independently (`MS_UNAVAILABLE`, `MS_MAX_CONCURRENT_REQ`). Treat an error as "no answer", never as "not valid", and retry with a short backoff.

This table is maintained by SpellzCode, and we also run a hosted check that does the retrying for you: a free check form and a page per country at [tools.funwords.eu/vat-number-check](https://tools.funwords.eu/vat-number-check), and an API (one GET request, JSON back) at [tools.funwords.eu/company-check-api](https://tools.funwords.eu/company-check-api). The data in this repository is free to use without it.

## Corrections

Tax authorities change formats now and then. If a pattern here is wrong or too strict, open an issue with a source and it will be fixed.

## Licence

MIT.
