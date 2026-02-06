import { fetchRegion, regionType } from "./region";

const allDistricts: { district: number; districtName: string; state: number }[] = [];

for (let state = 1; state <= 7; state++) {
  const districts = await fetchRegion({
    state,
    list_type: regionType.district,
  });
  allDistricts.push(
    ...districts.map((it) => ({
      district: it.value,
      districtName: it.name,
      state,
    }))
  );
}

await Bun.write("./data/districts.json", JSON.stringify(allDistricts));
