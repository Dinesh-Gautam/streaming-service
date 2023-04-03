// export default async function handler(req, res) {
//   let id = req.query.id;
//   if (!id) {
//     id = 278;
//   }
//   const watchUrl = "https://www.2embed.to/embed/tmdb/movie?id=" + id;

//   let data = await fetch(watchUrl).then((e) => e.text());
//   data = data.replaceAll(`href="/`, `href="/api/`);
//   data = data.replaceAll(`src="/`, `src="/api/`);
//   // console.log(data);
//   res.send(data);
// }
