const fs = require("fs");
const path = require("path");

const filePath = path.join("/tmp", "players.txt");

export default function handler(req, res) {
  const playerID = `id_${Date.now().toString(36)}`;
  const newEntry = `${playerID}*0,0,0~0`;

  let data = "";
  if (fs.existsSync(filePath)) {
    data = fs.readFileSync(filePath, "utf-8").trim();
    data = data ? data + "|" + newEntry : newEntry;
  } else {
    data = newEntry;
  }

  fs.writeFileSync(filePath, data);
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(playerID);
}
