const express = require("express");
const fs = require("fs");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app); // use manual HTTP server
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const filePath = "./players.txt";

// ─── GET ALL PLAYERS ───
app.get("/get_players", (req, res) => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    res.send(data);
  } else {
    res.send("Error: File does not exist.");
  }
});

// ─── JOIN NEW PLAYER ───
app.get("/join", (req, res) => {
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

  // ✅ Pure text response, behaves like your working server
  res.setHeader("Content-Type", "text/plain");
  res.end(playerID);
});

// ─── UPDATE PLAYER ───
app.get("/update", (req, res) => {
  const { id, position, rotation } = req.query;
  if (!id || !position || !rotation) return res.send("Error: Missing parameters.");

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
  res.end("OK");
});

// ✅ Start server using raw HTTP to avoid Express quirks
server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
