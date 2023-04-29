import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import categories from "../data/parsed_categories.json";
import cities from "../data/parsed_cities.json";

const ENDPOINT =
  "https://saaq.gouv.qc.ca/en/find-service-outlet?tx_lbopointsdeservice_eid%5Baction%5D=getPointsDeService&tx_lbopointsdeservice_eid%5Bcontroller%5D=EId&type=1600174700&cHash=079b65ba53fd59edb59cbc7931f9b55f";

const log = (data) => {
  const file = fs.readFileSync(path.resolve("./src/data/logs.json"));

  const logs = JSON.parse(file.toString());

  logs.push(data);

  fs.writeFileSync(path.resolve("./src/data/logs.json"), JSON.stringify(logs));
};

const findOutlets = async () => {
  let count = 0;

  for (const category of categories) {
    const services = category.services;

    if (services.length < 1 && false) {
      for (const city of Object.values(cities)) {
        const outlets: any[] = [];

        count++;
        console.log(count);

        try {
          const response = await axios({
            method: "post",
            url: ENDPOINT,
            data: {
              tx_lbopointsdeservice_eid: {
                ville: city.uid,
                sujet: category.uid,
              },
            },
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (response.data.markers.length < 1) {
            continue;
          }

          for (const index in response.data.markers) {
            response.data.markers[index].city_uid = city.uid;
          }

          const renders = response.data.render.split(
            '<a href="https://saaq.gouv.qc.ca/prise-de-rendez-vous/?point-de-service=',
          );

          for (let i = 1; i < response.data.markers.length + 1; i++) {
            response.data.markers[i - 1].service_point = renders[i].split('"')[0];
          }

          outlets.push(...response.data.markers);

          const file = fs.readFileSync(path.resolve("./src/data/outlets_by_category.json"));

          const outlets_by_category = JSON.parse(file.toString());

          outlets_by_category[category.uid] = outlets_by_category[category.uid]
            ? [...outlets_by_category[category.uid], ...outlets]
            : outlets;

          fs.writeFileSync(
            path.resolve("./src/data/outlets_by_category.json"),
            JSON.stringify(outlets_by_category, null, 2),
          );
        } catch {
          log({
            city_uid: city.uid,
            category_uid: category.uid,
          });
        }
      }
    }

    for (const service of services) {
      if (service.options.length < 1 && false) {
        for (const city of cities) {
          const outlets: any[] = [];

          count++;
          console.log(count);

          try {
            const response = await axios({
              method: "post",
              url: ENDPOINT,
              data: {
                tx_lbopointsdeservice_eid: {
                  ville: city.uid,
                  sujet: category.uid,
                  service: service.uid,
                },
              },
              headers: { "Content-Type": "multipart/form-data" },
            });

            for (const index in response.data.markers) {
              response.data.markers[index].city_uid = city.uid;
            }

            outlets.push(...response.data.markers);

            const file = fs.readFileSync(path.resolve("./src/data/outlets_by_category.json"));

            const outlets_by_category = JSON.parse(file.toString());

            outlets_by_category[`${category.uid}:${service.uid}`] = outlets_by_category[
              `${category.uid}:${service.uid}`
            ]
              ? [...outlets_by_category[`${category.uid}:${service.uid}`], ...outlets]
              : outlets;

            fs.writeFileSync(
              path.resolve("./src/data/outlets_by_category.json"),
              JSON.stringify(outlets_by_category, null, 2),
            );
          } catch {
            log({
              city_uid: city.uid,
              category_uid: category.uid,
              sub_uid: service.uid,
            });
          }
        }
      }

      for (const option of service.options) {
        for (const city of cities) {
          const outlets: any[] = [];

          count++;
          console.log(count);

          try {
            const response = await axios({
              method: "post",
              url: ENDPOINT,
              data: {
                tx_lbopointsdeservice_eid: {
                  ville: city.uid,
                  sujet: category.uid,
                  service: service.uid,
                  options: option.uid,
                },
              },
              headers: { "Content-Type": "multipart/form-data" },
            });

            for (const index in response.data.markers) {
              response.data.markers[index].city_uid = city.uid;
            }

            outlets.push(...response.data.markers);

            const file = fs.readFileSync(path.resolve("./src/data/outlets_by_category.json"));

            const outlets_by_category = JSON.parse(file.toString());

            outlets_by_category[`${category.uid}:${service.uid}:${option.uid}`] = outlets_by_category[
              `${category.uid}:${service.uid}:${option.uid}`
            ]
              ? [...outlets_by_category[`${category.uid}:${service.uid}:${option.uid}`], ...outlets]
              : outlets;

            fs.writeFileSync(
              path.resolve("./src/data/outlets_by_category.json"),
              JSON.stringify(outlets_by_category, null, 2),
            );
          } catch {
            log({
              city_uid: city.uid,
              category_uid: category.uid,
              service_uid: service.uid,
              option_uid: option.uid,
            });
          }
        }
      }
    }
  }
};

export default findOutlets;
