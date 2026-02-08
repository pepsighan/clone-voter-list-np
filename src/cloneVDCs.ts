import { appendFileSync, writeFileSync } from "node:fs";
import { fetchRegion, regionType } from "./region";
import { runInBatches } from "./batch";

const districts = (await Bun.file("./data/districts.csv").text())
  .trim()
  .split("\n")
  .slice(1)
  .map((line) => {
    const [state, district, districtName] = line.split(",");
    return { state: state!, district: district!, districtName: districtName! };
  });

const file = "./data/vdcs.csv";
writeFileSync(file, "state,district,districtName,vdc,vdcName\n");

await runInBatches(
  districts,
  (dist) => {
    console.log("Fetch VDCs", dist.district);
    return fetchRegion({
      district: Number(dist.district),
      list_type: regionType.vdc,
    });
  },
  (dist, vdcs) => {
    for (const it of vdcs) {
      appendFileSync(
        file,
        `${dist.state},${dist.district},${dist.districtName},${it.value},${it.name}\n`
      );
    }
  }
);
