import got from 'got';
import { JSDOM } from 'jsdom';

const voterListUrl = 'https://voterlist.election.gov.np/bbvrs1/view_ward_1.php';

export async function fetchVoters({ state, district, vdc, ward, regCentre }) {
  const { body } = await got.post(voterListUrl, {
    form: {
      state,
      district,
      vdc_mun: vdc,
      ward,
      reg_centre: regCentre,
    },
  });
  const dom = new JSDOM(body);
  const records = dom.window.document.querySelectorAll(
    '.div_bbvrs_data > table > tbody > tr'
  );

  const voters = [];

  records.forEach((record) => {
    const cells = record.querySelectorAll('td');
    const values = cells.values();

    const next = () => values.next().value.textContent;

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
