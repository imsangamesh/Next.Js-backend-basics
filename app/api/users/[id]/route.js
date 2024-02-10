import { users } from "@/app/util/db";
import fs from "fs";
import { NextResponse } from "next/server";

// 2. Get Specific User
export const GET = async (_, res) => {
  const { id } = await res.params;
  const filteredUsers = users.filter((each) => each.id === id);

  if (!filteredUsers.length)
    return NextResponse.json(
      { success: false, user: undefined },
      { status: 400 }
    );

  return NextResponse.json(
    { success: true, user: filteredUsers[0] },
    { status: 200 }
  );
};

// 3. Login
export const POST = async (req, res) => {
  const { name, email, password } = await req.json();
  const { id } = await res.params;

  const {
    name: dbName,
    email: dbEmail,
    password: dbPassword,
  } = users.find((each) => each.id === id);

  if (dbName === name && dbEmail === email && dbPassword === password) {
    return NextResponse.json({ result: "Successfull Logged In!" });
  } else if (!name || !email || !password) {
    return NextResponse.json({ result: "Please fill out all the fields" });
  } else {
    return NextResponse.json({ result: "Invalid Credentials" });
  }
};

// 6. Delete User
export const DELETE = async (req, res) => {
  const { id } = await res.params;

  const userIndex = users.findIndex((each) => each.id == id);

  if (userIndex === -1) {
    return NextResponse.json({ result: "User not found!" }, { status: 404 });
  }

  users.splice(userIndex, 1);

  const updatedUsersData = JSON.stringify(users, null, 2);
  fs.writeFileSync(
    "./app/util/db.js",
    `export const users = ${updatedUsersData}`,
    "utf-8"
  );

  return NextResponse.json({ success: "User deleted!" });
};
