import fs from "fs";
import { v4 as uuidv4 } from "uuid";
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
  userData.push(data);

  writeToFile(fileName, userData);

  return { success: true, message: "user added successfully" };
}
