import { appendFileSync, writeFileSync } from "node:fs";
import { fetchRegion, regionType } from "./region";
import { runInBatches } from "./batch";

const file = "./data/districts.csv";
writeFileSync(file, "state,district,districtName\n");

const states = Array.from({ length: 7 }, (_, i) => i + 1);

await runInBatches(
  states,
  (state) => fetchRegion({ state, list_type: regionType.district }),
  (state, districts) => {
    for (const it of districts) {
      appendFileSync(file, `${state},${it.value},${it.name}\n`);
    }
  }
);
