import * as fs from "fs";
import categories from "../data/categories.json";
import options_by_service from "../data/parsed_options_by_service.json";

const parseCategories = () => {
  const _new: any[] = [];

  for (const category of categories) {
    const temp = JSON.parse(JSON.stringify(category));
    delete temp.sub_categories;

    const sub_categories = [];
    for (const sub_category of Object.values(category.sub_categories)) {
      sub_categories.push({
        ...sub_category,
        options: options_by_service[sub_category.uid],
      });
    }

    _new.push({
      ...temp,
      services: sub_categories,
    });
  }

  fs.writeFileSync("src/data/parsed_categories_2.json", JSON.stringify(_new));
};

export default parseCategories;
