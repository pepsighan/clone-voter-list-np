import { appendFileSync, writeFileSync } from "node:fs";
import { fetchVoters } from "./voters";
import { runInBatches } from "./batch";

const votingCentres = (await Bun.file("./data/votingCentres.csv").text())
  .trim()
  .split("\n")
  .slice(1)
  .map((line) => {
    const [state, district, districtName, vdc, vdcName, ward, centre, centreName] =
      line.split(",");
    return {
      state: state!,
      district: district!,
      districtName: districtName!,
      vdc: vdc!,
      vdcName: vdcName!,
      ward: ward!,
      centre: centre!,
      centreName: centreName!,
    };
  });

const file = "./data/voterList.csv";
writeFileSync(
  file,
  "state,district,districtName,vdc,vdcName,ward,centre,centreName,voterId,name,age,gender,spouse,parents\n"
);

await runInBatches(
  votingCentres,
  (vc) => {
    console.log("Fetch voters", vc.vdc, vc.centre);
    return fetchVoters({
      state: Number(vc.state),
      district: Number(vc.district),
      vdc: Number(vc.vdc),
      ward: Number(vc.ward),
      regCentre: Number(vc.centre),
    });
  },
  (vc, voters) => {
    for (const v of voters) {
      appendFileSync(
        file,
        `${vc.state},${vc.district},${vc.districtName},${vc.vdc},${vc.vdcName},${vc.ward},${vc.centre},${vc.centreName},${v.voterId},${v.name},${v.age},${v.gender},${v.spouse},${v.parents}\n`
      );
    }
  }
);
