// Charm the Commuter: Forecast a City That Isn't — make.fun competition entry.
// The entry is exactly one line of weather, 123 characters, for a city that
// does not exist:
// "Good morning, Drizzlewick: 12 degrees, sideways rain, and the 7:40 bus is
// running on hope and one working windscreen wiper."
// Why this one: it opens exactly like broadcast weather ("Good morning,
// Drizzlewick"), names an invented city up front, gives concrete weather
// (12 degrees, sideways rain), and lands its joke on the bus the bored
// commuter is waiting for — the 7:40 is "running on hope and one working
// windscreen wiper". The wiper is a specific, visual detail; the judge's own
// brief puts the reader at a rainy bus stop, so the bus is the right vehicle
// for the joke. One line, ASCII only, no trailing newline.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FORECAST =
  "Good morning, Drizzlewick: 12 degrees, sideways rain, and the 7:40 bus is running on hope and one working windscreen wiper.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 140 characters,
// not only whitespace. One line, 123 characters, ASCII only.
const chars = [...FORECAST];
if (chars.length < 1 || chars.length > 140 || FORECAST.trim().length === 0) {
  throw new Error("entry must be 1 to 140 characters of non-whitespace text");
}
if (FORECAST !== FORECAST.trim() || FORECAST.includes("\n")) {
  throw new Error("entry must be a single line with no surrounding whitespace");
}
// The judge's first criterion is the forecast's whole point: it must name an
// invented city and give it weather. Guard both explicitly — a forecast that
// lost the city name or the temperature in a later edit must fail loudly
// here, never reach the judge as a generic line.
if (!FORECAST.includes("Drizzlewick")) {
  throw new Error("entry must name the invented city Drizzlewick");
}
if (!/\d+ degrees/.test(FORECAST)) {
  throw new Error("entry must give the city a temperature");
}

// The harness points MAKEFUN_OUTPUT_DIR at the writable /output; write there
// when it is set, and to /output directly as well, so the gate finds the file
// either way. No trailing newline: the file is the forecast, byte for byte.
const targets = [process.env.MAKEFUN_OUTPUT_DIR, "/output"].filter(
  (d): d is string => Boolean(d),
);
const landed: string[] = [];
for (const dir of targets) {
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "entry.txt"), FORECAST, "utf8");
    landed.push(dir);
  } catch {
    // One target may be read-only in some sandboxes; the other still lands.
  }
}
if (landed.length === 0) {
  throw new Error("could not write entry.txt to any output directory");
}

// Read back what landed and prove it is the forecast, byte for byte — a silent
// partial write must fail loudly here, never at the grader's gate.
const written = readFileSync(join(landed[0], "entry.txt"), "utf8");
if (written !== FORECAST) {
  throw new Error("entry.txt does not contain exactly the chosen forecast");
}

console.log(FORECAST);
