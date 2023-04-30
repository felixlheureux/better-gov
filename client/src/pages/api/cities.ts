import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //Find the absolute path of the json directory
  const directory = path.join(process.cwd(), "/data");
  //Read the json data file data.json
  const file = await fs.readFile(directory + "/parsed_cities.json", "utf8");
  //Return the content of the data file in json format
  res.status(200).json(JSON.parse(file));
};

export default handler;
