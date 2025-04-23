const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/sports")
  .then(() => console.log("Launched"))
  .catch(() => console.log("ERROR"));

const admin = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});


const footballTeamSchema = new mongoose.Schema({
  teamName: String,
  formation: String, // e.g. "4-4-2", "4-3-3", etc.
  players: [
    {
      roll: String,
      goals: Number,
      jerseyNumber: Number,
      name: String,
      position: {
        primary: String, // e.g. "Goalkeeper", "Center Back", "Striker"
      },
      isCaptain: Boolean,
      isViceCaptain: Boolean,
      age: Number,
      foot: String, // "Right", "Left", or "Both"
    },
  ],
  teamColors: [String],
  createdAt: Date, // When this document was created
  updatedAt: Date, // When this document was last updated
});

const FootballTeam = mongoose.model("FootballTeam", footballTeamSchema);
const admincred = mongoose.model("AdminID", admin);

app.get("/", (req, res) => res.send("hello world"));

app.post("/register-server-data", async (req, res) => {
  try {
    console.log("body is ");
    const body = req.body;
    console.log("body is ", body);
    const playersArray = Object.values(body.players);
    console.log("payers arra ", playersArray);
    if (body.sport === "Football") {
      await FootballTeam.create({
        teamName: body.teamname,
        players: playersArray.map((player) => {
          return {
            name: player.name,
            roll: player.role,
          };
        }),
      });
    }
    return res.status(200).json({
      success: true,
      message: "mitron safal hua",
    });
  } catch (error) {
    console.log(error);
    return res.status(502).json({
      message: "error is there",
    });
  }
});

const port = 8000;
app.listen(port, () => console.log("server started"));

app.post("/ADMIN-LOGIN-PAGE.html", async (req, res) => {
  const body = req.body;
  const a = await admincred.findOne({ username: body.Username });
  if (a != null) {
    if (body.Pass === a.password) {
      res.status(200).json({ status: "Good" });
    } else {
      res.json({ status: "Cooked" });
    }
  } else {
    res.json({ status: "Cooked" });
  }
});

// server.post('/ADMIN-DASHBOARD.js', async(req,res)=>{
//     const body = req.body;
//     const playersArray = Object.values(body.players)
//     if (body.sport === "Football"){
//         await FootballTeam.create({
//             teamName:body.teamname,
//             players: playersArray.map((player)=> {return {
//                 name: player.name,
//                 roll: player.role,
//             };
//             }),
//         })
//     }
// });
