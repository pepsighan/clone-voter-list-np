import fs from 'fs';
import { fetchRegion, regionType } from './region.mjs';

const content = fs.readFileSync('./data/districts.json');
const districts = JSON.parse(content.toString());

const allVDCs = [];
for (let dist of districts) {
  console.log('Fetch districts', dist.district);

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

fs.writeFileSync('./data/vdcs.json', JSON.stringify(allVDCs));
