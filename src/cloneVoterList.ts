import { fetchVoters } from "./voters";

const votingCentres = await Bun.file("./data/votingCentres.json").json();

let counter = 0;
let allVoters: (typeof votingCentres[0] & {
  voterId: string;
  name: string;
  age: string;
  gender: string;
  spouse: string;
  parents: string;
})[] = [];

for (const vc of votingCentres) {
  console.log("Fetch voters", vc.vdc, vc.centre);

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
    await Bun.write(
      `./data/voterList${counter}.json`,
      JSON.stringify(allVoters)
    );
    counter++;
    allVoters = [];
  }
}

// Flush any remaining voters.
await Bun.write(`./data/voterList${counter}.json`, JSON.stringify(allVoters));
