import { appendFileSync, writeFileSync } from "node:fs";
import { fetchRegion, regionType } from "./region";

const file = "./data/districts.csv";
writeFileSync(file, "state,district,districtName\n");

for (let state = 1; state <= 7; state++) {
  const districts = await fetchRegion({
    state,
    list_type: regionType.district,
  });
  for (const it of districts) {
    appendFileSync(file, `${state},${it.value},${it.name}\n`);
  }
}
