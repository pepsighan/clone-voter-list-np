import { JSDOM } from "jsdom";

const indexProcessUrl =
  "https://voterlist.election.gov.np/index_process.php";

export const regionType = {
  district: "district",
  vdc: "vdc",
  ward: "ward",
  regCentre: "reg_centre",
};

export async function fetchRegion(arg: Record<string, string | number>) {
  const response = await fetch(indexProcessUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(
      Object.entries(arg).map(([k, v]) => [k, String(v)])
    ),
  });
  const parsed = await response.json();
  const dom = new JSDOM(parsed.result);
  const options = dom.window.document.querySelectorAll("option");

  const regions: { value: number; name: string }[] = [];
  options.forEach((element) => {
    if (element.value) {
      regions.push({
        value: parseInt(element.value),
        name: element.textContent ?? "",
      });
    }
  });
  return regions;
}
