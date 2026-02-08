import { appendFileSync, writeFileSync } from "node:fs";
import { fetchRegion, regionType } from "./region";
import { runInBatches } from "./batch";

const wards = (await Bun.file("./data/wards.csv").text())
  .trim()
  .split("\n")
  .slice(1)
  .map((line) => {
    const [state, district, districtName, vdc, vdcName, ward] = line.split(",");
    return {
      state: state!,
      district: district!,
      districtName: districtName!,
      vdc: vdc!,
      vdcName: vdcName!,
      ward: ward!,
    };
  });

const file = "./data/votingCentres.csv";
writeFileSync(
  file,
  "state,district,districtName,vdc,vdcName,ward,centre,centreName\n"
);

await runInBatches(
  wards,
  (ward) => {
    console.log("Fetch voting centres", ward.vdc, ward.ward);
    return fetchRegion({
      vdc: Number(ward.vdc),
      ward: Number(ward.ward),
      list_type: regionType.regCentre,
    });
  },
  (ward, centres) => {
    for (const it of centres) {
      appendFileSync(
        file,
        `${ward.state},${ward.district},${ward.districtName},${ward.vdc},${ward.vdcName},${ward.ward},${it.value},${it.name}\n`
      );
    }
  }
);
