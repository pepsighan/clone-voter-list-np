import { fetchRegion, regionType } from "./region";

const districts = await Bun.file("./data/districts.json").json();

const allVDCs: (typeof districts[0] & { vdc: number; vdcName: string })[] = [];

for (const dist of districts) {
  console.log("Fetch districts", dist.district);

  const vdcs = await fetchRegion({
    district: dist.district,
    list_type: regionType.vdc,
  });
  allVDCs.push(
    ...vdcs.map((it) => ({
      ...dist,
      vdc: it.value,
      vdcName: it.name,
    }))
  );
}

await Bun.write("./data/vdcs.json", JSON.stringify(allVDCs));
