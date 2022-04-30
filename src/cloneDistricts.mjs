import fs from 'fs';
import { fetchRegion, regionType } from './region.mjs';

const allDistricts = [];

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

fs.writeFileSync('./data/districts.json', JSON.stringify(allDistricts));
