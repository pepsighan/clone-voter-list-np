import fs from 'fs';
import { fetchVoters } from './voters.mjs';

const content = fs.readFileSync('./data/votingCentres.json');
const votingCentres = JSON.parse(content.toString());

let counter = 0;
let allVoters = [];
for (let vc of votingCentres) {
  console.log('Fetch voters', vc.vdc, vc.centre);

  const voters = await fetchVoters({
    state: vc.state,
    district: vc.district,
    vdc: vc.vdc,
    ward: vc.ward,
    regCentre: vc.centre,
  });
  allVoters.push(
    ...voters.map((it) => ({
      ...vc,
      ...it,
    }))
  );

  // Flush all the voters once 10,000.
  if (allVoters.length >= 10000) {
    fs.writeFileSync(
      `./data/voterList${counter}.json`,
      JSON.stringify(allVoters)
    );
    counter++;
    allVoters = [];
  }
}

// Flush any remaining voters.
fs.writeFileSync(`./data/voterList${counter}.json`, JSON.stringify(allVoters));
