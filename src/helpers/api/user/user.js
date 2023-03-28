import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { config } from "../data/config";
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

export function addUser(data) {
  if (!data) {
    console.log("data is required when adding user");
    return { success: false, errMessage: "data is not provided" };
  }

  const username = data.username;

  const userData = readFile(fileName);
  const alreadyExists = userData.find((e) => e.username === username);
  if (alreadyExists) {
    console.log("user already exists");
    return { success: false, errMessage: "user already exists" };
  }
  data.role = "user";
  data.id = uuidv4();
  data.creationDate =
    new Date().getMonth() +
    "-" +
    new Date().getDate() +
    "-" +
    new Date().getFullYear();
  userData.push(data);

  writeToFile(fileName, userData);

  return { success: true, message: "user added successfully" };
}

export function deleteUser(id) {
  if (!id) {
    console.log("id is require when delete user data");
    return { success: false, errMessage: "User id is not provided" };
  }
  const userData = readFile(fileName);
  if (!id) {
    console.log("Only one user left, can't be deleted");
    return { success: false, errMessage: "Only one user left" };
  }
  const user = userData.find((e) => e.id === id);
  console.log(user);
  if (!user) {
    return {
      success: false,
      errMessage: "user does not exists",
    };
  }
  const newData = userData.filter((e) => e.id !== id);

  writeToFile(fileName, newData);

  return { success: true, message: "User deleted successfully" };
}

export function changeUserRole(id, newRole) {
  if (!id) {
    console.log("id is require when delete user data");
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

  writeToFile(config.dir, config.userData, newData);

  return { success: true, message: "User role changed successfully" };
}
