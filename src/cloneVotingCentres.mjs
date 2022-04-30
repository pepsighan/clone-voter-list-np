import fs from 'fs';
import { fetchRegion, regionType } from './region.mjs';

const content = fs.readFileSync('./data/wards.json');
const wards = JSON.parse(content.toString());

const futures = [];
for (let ward of wards) {
  console.log('Fetch voting centres', ward.vdc, ward.ward);

  futures.push(
    fetchRegion({
      vdc: ward.vdc,
      ward: ward.ward,
      list_type: regionType.regCentre,
    })
  );
  if (futures.length % 5 === 0) {
    await Promise.all(futures);
  }
}

const resolved = await Promise.all(futures);
const allCentres = [];
resolved.forEach((centres, index) => {
  allCentres.push(
    ...centres.map((it) => ({
      ...wards[index],
      centre: it.value,
      centreName: it.name,
    }))
  );
});

fs.writeFileSync('./data/votingCentres.json', JSON.stringify(allCentres));
