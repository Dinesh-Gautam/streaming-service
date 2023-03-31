import { getReviews } from "../../../helpers/api/search/tmdb";

export default async function handler(req, res) {
  const id = req.query.id;
  const media_type = req.query.media_type;
  if (!id || !media_type) {
    res.status(400).json({
      success: false,
      errMessage: "required parameters id and media_type are required",
    });
    return;
  }
  let requirements = req.query.r;
  if (!requirements) {
    res
      .status(400)
      .json({ success: false, errMessage: "requirements parameter is empty." });
    return;
  }

  requirements = requirements
    .split(",")
    .map((e) => e?.trim())
    .filter((e) => e);

  const promises = [];

  requirements.forEach((r) => {
    if (r === "reviews") {
      promises.push(getReviews(id, media_type));
    }
  });

  const data = await Promise.all(promises).then((res) => {
    console.log(res);
    let resObj = {};
    requirements.forEach((r, i) => {
      resObj = { ...resObj, [r]: res[i] };
    });
    return resObj;
  });

  if (!data) {
    res.status(401).json({ success: false, errMessage: "some error occurred" });
    return;
  }
  res.status(200).json({ success: true, data });
}
