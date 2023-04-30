import * as fs from "fs";
import * as path from "path";
import cities from "../data/parsed_cities.json";
import outlets from "../data/parsed_outlets_by_category.json";

const findCitiesWithOutlets = async () => {
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

export default findCitiesWithOutlets;
