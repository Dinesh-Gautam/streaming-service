export default async function handler(req, res) {
  const { embedPath } = req.query;
  const url =
    `https://www.2embed.to/` +
    embedPath.join("/") +
    Object.keys(req.query)
      .filter((e) => e !== "embedPath")
      .map((e, i) => (i == 0 ? "?" : "&") + e + "=" + req.query[e]);

  if (url.includes("ajax")) {
    console.log(url);
    return;
  }
  console.log(url);
  let data = await fetch(url).then((e) => e.text());
  console.log(data);
  data = data.replaceAll("debugger", "");
  data = data.replaceAll("/ajax", "/api/ajax/");

  res.send(data);
}
