import { getVideosOfMovie } from "@/helpers/api/search/tmdb";

export default async function handler(req, res) {
  const id = req.query.id;
  const media_type = req.query.type;
  if (!id) {
    res.status(400).json({
      success: false,
      errMessage: "id is required when getting videos data",
    });
    return;
  }

  if (!media_type) {
    res.status(400).json({
      success: false,
      errMessage: "media_type is required when getting videos data",
    });
    return;
  }

  const videos = await getVideosOfMovie(id, media_type);
  if (videos) {
    res.status(200).json({ success: true, data: videos });
  } else {
    res
      .status(500)
      .json({ success: false, errMessage: "some error occurred." });
  }
}
