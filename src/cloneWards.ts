import { fetchRegion, regionType } from "./region";

const vdcs = await Bun.file("./data/vdcs.json").json();

const allWards: (typeof vdcs[0] & { ward: number })[] = [];

for (const vdc of vdcs) {
  console.log("Fetch wards", vdc.vdc);

  const wards = await fetchRegion({
    vdc: vdc.vdc,
    list_type: regionType.ward,
  });
  allWards.push(
    ...wards.map((it) => ({
      ...vdc,
      ward: it.value,
    }))
  );
}

await Bun.write("./data/wards.json", JSON.stringify(allWards));
