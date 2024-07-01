import { connect, connection } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const passwordDB = process.env.PASSWORD_DB

const conn = {
  isConnected: false,
};

export async function connectDB() {
  if (conn.isConnected) return;

  const db = await connect(
    `mongodb+srv://alditomiralles3:${passwordDB}@aldo.l3up4qv.mongodb.net/lea_blog?retryWrites=true&w=majority`
  );
  console.log(db.connection.db.databaseName);
  conn.isConnected = db.connections[0].readyState === 1;
}

connection.on("connected", () => {
  console.log("Mongoose is connected");
});

connection.on("error", (err) => {
  console.log("Mongoose connected error", err);
});
