import { JSDOM } from "jsdom";

const voterListUrl =
  "https://voterlist.election.gov.np/bbvrs1/view_ward_1.php";

interface FetchVotersArgs {
  state: number;
  district: number;
  vdc: number;
  ward: number;
  regCentre: number;
}

export async function fetchVoters({
  state,
  district,
  vdc,
  ward,
  regCentre,
}: FetchVotersArgs) {
  const response = await fetch(voterListUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      state: String(state),
      district: String(district),
      vdc_mun: String(vdc),
      ward: String(ward),
      reg_centre: String(regCentre),
    }),
  });
  const body = await response.text();
  const dom = new JSDOM(body);
  const records = dom.window.document.querySelectorAll(
    ".div_bbvrs_data > table > tbody > tr"
  );

  const voters: {
    voterId: string;
    name: string;
    age: string;
    gender: string;
    spouse: string;
    parents: string;
  }[] = [];

  records.forEach((record) => {
    const cells = record.querySelectorAll("td");
    const values = cells.values();

    const next = () => values.next().value?.textContent ?? "";

    next(); // The serial no.
    const voterId = next();
    const name = next();
    const age = next();
    const gender = next();
    const spouse = next();
    const parents = next();

    voters.push({
      voterId,
      name,
      age,
      gender,
      spouse,
      parents,
    });
  });

  return voters;
}
