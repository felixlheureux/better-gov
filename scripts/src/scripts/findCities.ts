import axios from "axios";
import * as fs from "fs";
import * as path from "path";

const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const ENDPOINT =
  "https://saaq.gouv.qc.ca/en/find-service-outlet?tx_lbopointsdeservice_eid%5Baction%5D=getCities&tx_lbopointsdeservice_eid%5Bcontroller%5D=EId&type=1600174700&cHash=1d41626598153483e9455f4416d14378";

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const findCities = async () => {
  const cities = {};
  for (const l of alphabet) {
    await sleep(1000);

    const response = await axios({
      method: "post",
      url: ENDPOINT,
      data: {
        tx_lbopointsdeservice_eid: {
          keywords: l,
        },
      },
      headers: { "Content-Type": "multipart/form-data" },
    });

    Object.entries(response.data).forEach(([key, value]) => {
      const v = value as any;
      cities[v.uid] = value;
    });
  }

  fs.writeFileSync(path.resolve("./src/data/cities.json"), JSON.stringify(cities));
};

export default findCities;
