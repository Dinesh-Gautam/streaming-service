import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { config } from "../data/config";
import dbConnect from "../../../db/dbConnect";
import User from "../../../db/schemas/userSchema";
const connection = dbConnect();
const fileName = "db/userData.json";

export function readFile(fileName) {
  try {
    const fileData = JSON.parse(fs.readFileSync(fileName).toString()) || [];
    return fileData;
  } catch (e) {
    console.error(fileName, "does not exists");
    return [];
  }
}

function writeToFile(fileName, data) {
  fs.writeFileSync(fileName, JSON.stringify(data));
}

// export function addUser(data) {
//   if (!data) {
//     console.log("data is required when adding user");
//     return { success: false, errMessage: "data is not provided" };
//   }

//   const username = data.username;

//   const userData = readFile(fileName);
//   const alreadyExists = userData.find((e) => e.username === username);
//   if (alreadyExists) {
//     console.log("user already exists");
//     return { success: false, errMessage: "user already exists" };
//   }
//   data.role = "user";
//   data.id = uuidv4();
//   data.creationDate =
//     new Date().getMonth() +
//     "-" +
//     new Date().getDate() +
//     "-" +
//     new Date().getFullYear();
//   userData.push(data);

//   writeToFile(fileName, userData);

//   return { success: true, message: "user added successfully" };
// }

export async function addUser(data) {
  if (!data) {
    console.log("data is required when adding user");
    return { success: false, errMessage: "data is not provided" };
  }
  console.log(data);

  const user = new User({
    name: data.name,
    username: data.username,
    password: data.password,
    role: "user",
    creationDate: new Date(),
  });

  try {
    await user.save();
  } catch (e) {
    if (e.code === 11000) {
      return { success: false, errMessage: "User already exists." };
    } else {
      return { success: false, errMessage: e.message };
    }
  }

  return { success: true, message: "user added successfully" };
}

export async function deleteUser(ids) {
  if (!ids) {
    console.log("id is require when delete user data");
    return { success: false, errMessage: "User id is not provided" };
  }
  const deleted = await User.deleteMany({ _id: { $in: ids } });
  if (deleted) {
    return {
      success: true,
      message: deleted.deletedCount + " users deleted successfully",
    };
  }
  return { success: false, message: "Some error occurred" };
}

export function changeUserRole(id, newRole) {
  if (!id) {
    console.log("id is require when changing user role");
    return { success: false, errMessage: "User id is not provided" };
  }
  const userData = readFile(config.dir + config.userData);
  const user = userData.find((e) => e.id === id);
  if (!user) {
    return {
      success: false,
      errMessage: "user does not exists",
    };
  }
  if (!newRole) {
    const defaultRole = "user";
    newRole = user.role || defaultRole;
  }
  const newData = userData.map((e) =>
    e.id == id ? { ...e, role: newRole } : e
  );

  writeToFile(fileName, newData);

  return { success: true, message: "User role changed successfully" };
}
export function changeUserName(id, newName) {
  if (!id) {
    console.log("id is require when changing user name");
    return { success: false, errMessage: "User id is not provided" };
  }
  const userData = readFile(fileName);
  const user = userData.find((e) => e.id === id);
  if (!user) {
    return {
      success: false,
      errMessage: "user does not exists",
    };
  }

  const newData = userData.map((e) =>
    e.id == id ? { ...e, name: newName } : e
  );

  writeToFile(fileName, newData);

  return { success: true, message: "User Name changed successfully" };
}
