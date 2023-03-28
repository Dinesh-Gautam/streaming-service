import { getDetailedUserData } from "../../../helpers/api/data/admin";
import {
  changeUserName,
  changeUserRole,
  deleteUser,
} from "../../../helpers/api/user/user";

export default async function handler(req, res) {
  const operation = req.query.o;
  const id = req.query.id;

  if (!id) {
    res
      .status(400)
      .json({ success: false, errMessage: "id parameter is not provided" });
    return;
  }
  if (operation === "edit") {
    const { newRole, newName } = JSON.parse(req.body);
    const results = [];
    if (newRole) {
      const roleData = changeUserRole(id, newRole);
      results.push(roleData);
    }
    if (newName) {
      const nameData = changeUserName(id, newName);
      results.push(nameData);
    }
    if (results.some((e) => !e.success)) {
      res
        .status(401)
        .json({ success: false, errMessage: "some error occurred" });
      return;
    }
    const userData = getDetailedUserData();
    res.json({
      success: true,
      message: "changes made successfully",
      data: userData.data,
    });
  }

  if (operation === "delete") {
    const data = deleteUser(id);
    if (!data) {
      res
        .status(500)
        .json({ success: true, errMessage: "some error occurred" });
      return;
    }
    res.send(data);
  }
}
