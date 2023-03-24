import { getDetails } from "@/tmdbapi/tmdbApi";

export default async function handler(req, res) {
  const season = req.query.season;
  const mediaType = req.query.media_type;
  const id = req.query.id;

  if (!season || !mediaType || !id) {
    console.log("season, mediaType, id is required when searching for season");
    res.status(401).json({
      success: false,
      errMessage: "season, mediaType, id is required when searching for season",
    });
  }

  if (mediaType === "movie") {
    console.log("movies don't have seasons");
    res
      .status(401)
      .json({ success: false, errMessage: "movies don't have seasons" });
  }

  const result = await getDetails(id, mediaType, { type: "season", season });

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(401).json({ success: false, errMessage: "some error occurred" });
  }
}
