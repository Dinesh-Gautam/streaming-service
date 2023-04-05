import { config } from "@/helpers/api/data/config";
import fs from "fs";
import { getProgressData } from "../../../../helpers/api/data/movie";

export default async function handler(req, res) {
  const uid = req.query.id;

  if (!uid) {
    res.send("id parameter is missing");
    return;
  }
  try {
    const progressData = await getProgressData(uid);
    res.send(progressData);
  } catch (e) {
    res.send({ success: false, error: "some error occurred" });
  }
}
