import { getDetailedUserData } from "../../../helpers/api/data/admin";
import { deleteUser, editUserData } from "../../../helpers/api/user/user";

export default async function handler(req, res) {
  const operation = req.query.o;
  const ids = req.query.ids.split(",");

  if (!ids) {
    res
      .status(400)
      .json({ success: false, errMessage: "id parameter is not provided" });
    return;
  }
  if (operation === "edit") {
    const { newRole, newName } = JSON.parse(req.body);
    const data = await editUserData(ids, newRole, newName);

    if (!data) {
      res
        .status(401)
        .json({ success: false, errMessage: "some error occurred" });
      return;
    }
    const userData = await getDetailedUserData();
    res.json({
      success: true,
      message: "changes made successfully",
      data: userData.data,
    });
  }

  if (operation === "delete") {
    const data = await deleteUser(ids);
    if (!data) {
      res
        .status(500)
        .json({ success: false, errMessage: "some error occurred" });
      return;
    }
    res.send(data);
  }
}
