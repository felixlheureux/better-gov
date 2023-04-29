import fs from "fs";
import cities from "../data/cities.json";

const parseCities = () => {
  fs.writeFileSync("src/data/parsed_cities.json", JSON.stringify(Object.values(cities)));
};

export default parseCities;
