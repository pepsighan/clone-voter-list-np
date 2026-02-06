import { fetchRegion, regionType } from "./region";

const wards = await Bun.file("./data/wards.json").json();

const futures: Promise<{ value: number; name: string }[]>[] = [];

for (const ward of wards) {
  console.log("Fetch voting centres", ward.vdc, ward.ward);

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
const allCentres: (typeof wards[0] & { centre: number; centreName: string })[] = [];

resolved.forEach((centres, index) => {
  allCentres.push(
    ...centres.map((it) => ({
      ...wards[index],
      centre: it.value,
      centreName: it.name,
    }))
  );
});

await Bun.write("./data/votingCentres.json", JSON.stringify(allCentres));
