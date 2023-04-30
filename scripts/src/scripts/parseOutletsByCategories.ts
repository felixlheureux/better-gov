// import * as fs from "fs";
// import outlets_by_categories from "../data/outlets_by_category.json";

// const parseOutletsByCategories = () => {
//   const _new = {};

//   for (const [key, outlets] of Object.entries(outlets_by_categories)) {
//     const map = outlets.reduce((prev, curr) => {
//       prev[curr.uid] = curr;
//       return prev;
//     }, {} as any);

//     _new[key] = Object.values(map);
//   }

//   fs.writeFileSync("src/data/parsed_outlets_by_category.json", JSON.stringify(_new));
// };

// export default parseOutletsByCategories;
