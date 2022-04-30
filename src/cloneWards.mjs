import fs from 'fs';
import { fetchRegion, regionType } from './region.mjs';

const content = fs.readFileSync('./data/vdcs.json');
const vdcs = JSON.parse(content.toString());

const allWards = [];
for (let vdc of vdcs) {
  console.log('Fetch wards', vdc.vdc);

  const vdcs = await fetchRegion({
    vdc: vdc.vdc,
    list_type: regionType.ward,
  });
  allWards.push(
    ...vdcs.map((it) => ({
      ...vdc,
      ward: it.value,
    }))
  );
}

fs.writeFileSync('./data/wards.json', JSON.stringify(allWards));
