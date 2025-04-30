const fs = require("fs");
const path = require("path");

const filePath = path.join("/tmp", "players.txt");

export default function handler(req, res) {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    res.status(200).send(data);
  } else {
    res.status(200).send("Error: File does not exist.");
  }
}
