import { deleteUser } from "../../../helpers/api/user/user";

export default async function handler(req, res) {
  const operation = req.query.o;
  const id = req.query.id;

  if (!id) {
    res
      .status(400)
      .json({ success: false, errMessage: "id parameter is not provided" });
    return;
  }
  if (operation === "changeRole") {
    const { newRole } = JSON.parse(req.body);
    const data = changeRole(id, newRole);
    if (!data) {
      res
        .status(401)
        .json({ success: false, errMessage: "some error occurred" });
    }
    res.send(data);
  }

  if (operation === "delete") {
    const data = deleteUser(id);
    if (!data) {
      res
        .status(500)
        .json({ success: true, errMessage: "some error occurred" });
    }
    res.send(data);
  }
}
