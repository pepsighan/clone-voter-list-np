import { appendFileSync, writeFileSync } from "node:fs";
import { fetchRegion, regionType } from "./region";

const vdcs = (await Bun.file("./data/vdcs.csv").text())
  .trim()
  .split("\n")
  .slice(1)
  .map((line) => {
    const [state, district, districtName, vdc, vdcName] = line.split(",");
    return {
      state: state!,
      district: district!,
      districtName: districtName!,
      vdc: vdc!,
      vdcName: vdcName!,
    };
  });

const file = "./data/wards.csv";
writeFileSync(file, "state,district,districtName,vdc,vdcName,ward\n");

for (const vdc of vdcs) {
  console.log("Fetch wards", vdc.vdc);

  const wards = await fetchRegion({
    vdc: Number(vdc.vdc),
    list_type: regionType.ward,
  });
  for (const it of wards) {
    appendFileSync(
      file,
      `${vdc.state},${vdc.district},${vdc.districtName},${vdc.vdc},${vdc.vdcName},${it.value}\n`
    );
  }
}
