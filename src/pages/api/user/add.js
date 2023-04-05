import { addUser } from "@/helpers/api/user/user";

export default async function handler(req, res) {
  const userData = JSON.parse(req.body);
  const data = await addUser(userData);
  res.status(200).send(data);
}
