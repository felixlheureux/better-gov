import * as fs from "fs";
import * as path from "path";
import cities from "../data/parsed_cities.json";
import outlets from "../data/parsed_outlets_by_category.json";

const ENDPOINT =
  "https://saaq.gouv.qc.ca/en/find-service-outlet?tx_lbopointsdeservice_eid%5Baction%5D=getChildCategoriesByParent&tx_lbopointsdeservice_eid%5Bcontroller%5D=EId&type=1600174700&cHash=0b2aea94b9810b5bfccd5f1a32aa0efe";

const findServiceOptions = async () => {
  const city_uid_by_city_uid = {};
  for (const o of Object.values(outlets)) {
    for (const outlet of o) {
      city_uid_by_city_uid[outlet.city_uid] = outlet.city_uid;
    }
  }

  const cities_with_outlets = [];
  for (const city of cities) {
    if (city_uid_by_city_uid[city.uid]) {
      cities_with_outlets.push(city);
    }
  }

  console.log(cities_with_outlets.length);
  fs.writeFileSync(path.resolve("./src/data/cities_with_outlets.json"), JSON.stringify(cities_with_outlets));
};

export default findServiceOptions;
