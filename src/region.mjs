import got from 'got';
import { JSDOM } from 'jsdom';

const indexProcessUrl =
  'https://voterlist.election.gov.np/bbvrs1/index_process_1.php';

export const regionType = {
  district: 'district',
  vdc: 'vdc',
  ward: 'ward',
  regCentre: 'reg_centre',
};

export async function fetchRegion(arg) {
  const { body } = await got.post(indexProcessUrl, {
    form: arg,
  });
  const parsed = JSON.parse(body);
  const dom = new JSDOM(parsed.result);
  const options = dom.window.document.querySelectorAll('option');

  const regions = [];
  options.forEach((element) => {
    if (element.value) {
      regions.push({
        value: parseInt(element.value),
        name: element.textContent,
      });
    }
  });
  return regions;
}
