import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import categories from "../data/parsed_categories.json";

const ENDPOINT =
  "https://saaq.gouv.qc.ca/en/find-service-outlet?tx_lbopointsdeservice_eid%5Baction%5D=getChildCategoriesByParent&tx_lbopointsdeservice_eid%5Bcontroller%5D=EId&type=1600174700&cHash=0b2aea94b9810b5bfccd5f1a32aa0efe";

const findServiceOptions = async () => {
  const options_by_service = {};
  let count = 0;

  for (const { services } of categories) {
    for (const s of services) {
      const response = await axios({
        method: "post",
        url: ENDPOINT,
        data: {
          tx_lbopointsdeservice_eid: {
            parentUid: s.uid,
          },
        },
        headers: { "Content-Type": "multipart/form-data" },
      });

      options_by_service[s.uid] = Object.values(response.data);
    }
  }

  fs.writeFileSync(path.resolve("./src/data/options_by_service.json"), JSON.stringify(options_by_service));
};

export default findServiceOptions;
