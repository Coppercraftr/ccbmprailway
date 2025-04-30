const fs = require("fs");
const path = require("path");

const filePath = path.join("/tmp", "players.txt");

export default function handler(req, res) {
  const { id, position, rotation } = req.query;

  if (!id || !position || !rotation) {
    return res.status(400).send("Error: Missing parameters.");
  }

  let players = [];

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    players = content.split("|").filter(p => p.trim() !== "");
  }

  let updated = false;
  players = players.map(player => {
    const [pid] = player.split("*");
    if (pid === id) {
      updated = true;
      return `${id}*${position}~${rotation}`;
    }
    return player;
  });

  if (!updated) {
    players.push(`${id}*${position}~${rotation}`);
  }

  fs.writeFileSync(filePath, players.join("|"));
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send("OK");
}
