import { users } from "@/app/util/db";
import fs from "fs";
import { NextResponse } from "next/server";

// 1. Get All Users Data
export const GET = async () => {
  const data = users;
  return NextResponse.json({ data }, { status: 200 });
};

// 4. Create User
export const POST = async (req, res) => {
  let { id, name, email, password } = await req.json();

  // Check if the data is provided or not
  if (!id || !name || !email || !password) {
    return NextResponse.json(
      { result: "required field missing!" },
      { status: 400 }
    );
  } else {
    // Add new users in memory-array
    users.push({ id, name, email, password });

    // Extract just the user array from the updated data
    const updatedUsersArray = users;

    // Convert updated users array to JSON string
    const updatedData = JSON.stringify(updatedUsersArray, null, 2);

    // Write updated users array to JSON string
    fs.writeFileSync(
      "./app/util/db.js",
      `export const users = ${updatedData}`,
      "utf-8"
    );

    return NextResponse.json({ success: "User Successfully created" });
  }
};

// 5. Update User
export const PUT = async (req, res) => {
  let { id, name, email, password } = await req.json();

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return NextResponse.json({ result: "User not found" }, { status: 404 });
  }

  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  if (password) users[userIndex].password = password;

  const updatedUsersData = JSON.stringify(users, null, 2);
  fs.writeFileSync(
    "./app/util/db.js",
    `export const users = ${updatedUsersData}`,
    "utf-8"
  );

  return NextResponse.json({ success: "User details edited!" });
};
