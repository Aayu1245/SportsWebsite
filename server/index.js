const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());
const path = require("path");

app.use(
  express.static(
    path.join(__dirname, "../client")
  )
);
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
  teamname: String,
  formation: String,
  players: [
    {
      role: String,
      goals: Number,
      jerseyNumber: Number,
      name: String,
      position: {
        primary: String, 
      },
      isCaptain: Boolean,
      isViceCaptain: Boolean,
      age: Number,
      foot: String, 
    },
  ],
  teamColors: [String],
  createdAt: Date, 
  updatedAt: Date,
});
const basketballTeamSchema = new mongoose.Schema({
  teamname: String,
  players: [
    {
      role: String,
      score: Number,
      jerseyNumber: Number,
      name: String,
      isCaptain: Boolean,
      isViceCaptain: Boolean,
      age: Number,
    },
  ],
  teamColors: [String],
  createdAt: Date, 
  updatedAt: Date, 
})
const kabaddiTeamSchema = new mongoose.Schema({
  teamname: String,
  players: [
    {
      role: String,
      points: Number,
      jerseyNumber: Number,
      name: String,
      isCaptain: Boolean,
      isViceCaptain: Boolean,
      age: Number,
      foot: String, 
    },
  ],
  teamColors: [String],
  createdAt: Date, 
  updatedAt: Date, 

})

const footballmatchschema = new mongoose.Schema({
  team1: {
    name: String,
    score: Number,
  },
  team2: {
    name: String,
    score: Number,
  },
  status: String,
})
const basketballmatchschema = new mongoose.Schema({
  team1: {
    name: String,
    score: Number,
  },
  team2: {
    name: String,
    score: Number,
  },
  status: String,
})
const kabaddimatchschema = new mongoose.Schema({
  team1: {
    name: String,
    score: Number,
  },
  team2: {
    name: String,
    score: Number,
  },
  status: String,
})


const FootballTeam = mongoose.model("FootballTeam", footballTeamSchema);
const BasketBallTeam = mongoose.model("BasketBallTeam", basketballTeamSchema);
const KabaddiTeam = mongoose.model("KabaddiTeam", kabaddiTeamSchema);
const FootballMatches = mongoose.model("FootballMatches", footballmatchschema);
const KabaddiMatches = mongoose.model("KabaddiMatches", kabaddimatchschema);
const BasketballMatches = mongoose.model("BasketballMatches", basketballmatchschema);

const admincred = mongoose.model("AdminID", admin);

let curf1 = 0;
let curf2 = 0;
let curb1 = 0;
let curb2 = 0;
let curk1 = 0;
let curk2 = 0;
let curid = 0;


app.get("/cur-match-f", async (req, res) => {
  try{
    const t1 = await FootballTeam.findById(curf1);
    const t2 = await FootballTeam.findById(curf2);
    curf1 = 0;
    curf2 = 0;
    res.json([t1,t2,curid]);
    curid = 0;
  }
  catch(err){console.log(err)}
});
app.get("/cur-match-b", async (req, res) => {
  try{
    const t1 = await BasketBallTeam.findById(curb1);
    const t2 = await BasketBallTeam.findById(curb2);
    curb1 = 0;
    curb2 = 0;
    res.json([t1,t2,curid]);
    curid = 0;
    
  }
  catch(err){console.log(err)}
});
app.get("/cur-match-k", async (req, res) => {
  try{
    const t1 = await KabaddiTeam.findById(curk1);
    const t2 = await KabaddiTeam.findById(curk2);
    curk1 = 0;
    curk2 = 0;
    res.json([t1,t2,curid]);
    curid = 0;
  }
  catch(err){console.log(err)}
});

app.post("/register-server-data", async (req, res) => {
  try {
    const body = req.body;
    const playersArray = Object.values(body.players);
    if (body.sport === "Football") {
      const foobo = await FootballTeam.create({
        teamname: body.teamname,
        players: playersArray.map((player) => {
          return {
            name: player.name,
            role: player.role,
            goals: 0,
          };
        }),
      });
      if (curf1 === 0){
        curf1 = foobo._id;
      }
      else{
        curf2 = foobo._id;
      }
    }
    if (body.sport === "Basketball") {
      const bak = await BasketBallTeam.create({
        teamname: body.teamname,
        players: playersArray.map((player) => {
          return {
            name: player.name,
            role: player.role,
            score: 0,
          };
        }),
      });
      if (curb1 === 0){
        curb1 = bak._id;
      }
      else{
        curb2 = bak._id;
      }
    }
    if (body.sport === "Kabbadi") {
      const kab = await KabaddiTeam.create({
        teamname: body.teamname,
        players: playersArray.map((player) => {
          return {
            name: player.name,
            role: player.role,
            points: 0,
          };
        }),
      });
      if (curk1 === 0){
        curk1 = kab._id;
      }
      else{
        curk2 = kab._id;
      }
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
app.post("/register-match-data", async(req,res)=>{
  const body = req.body;
  try{
    if (body.sport === "Football"){
      const dat = await FootballMatches.create({
        team1 : {
          name: body.team1,
          score:0,
        },
        team2 : {
          name: body.team2,
          score:0,
        },
        status: "Upcoming",
      })
      curid = dat._id;
    }
    if (body.sport === "Kabbadi"){
      const dat = await KabaddiMatches.create({
        team1 : {
          name: body.team1,
          score:0,
        },
        team2 : {
          name: body.team2,
          score:0,
        },
        status: "Upcoming",
      })
      curid = dat._id;
    }
    if (body.sport === "Basketball"){
      const dat = await BasketballMatches.create({
        team1 : {
          name: body.team1,
          score:0,
        },
        team2 : {
          name: body.team2,
          score:0,
        },
        status: "Upcoming",
      })
      curid = dat._id;
    }
    return res.status(200).json({status:"Success"});
  }
  catch(err){
    res.status(502).json({status:"err"})
  };
})
app.post("/status", async (req,res)=>{
  body = req.body;
  
  if (body.sportName === "Football"){
    try{
      await FootballMatches.findByIdAndUpdate(body.matchid, {status: body.gameStatus});
    }
    catch(err){console.log(err)};
  }
  if (body.sportName === "Kabaddi"){
    try{
      await KabaddiMatches.findByIdAndUpdate(body.matchid, {status: body.gameStatus});
    }
    catch(err){console.log(err)};
  }
  if (body.sportName === "Basketball"){
    try{
      await BasketballMatches.findByIdAndUpdate(body.matchid, {status: body.gameStatus});
    }
    catch(err){console.log(err)};
  }

  res.json(["yeah"])
})
app.post('/score-update', async(req,res)=>{
  body = req.body;
  console.log(body);
  if (body.sportName === "Football"){
    const dat = await FootballMatches.findById(body.matchid);
    if (dat.team1.name === body.team){
      await FootballMatches.findByIdAndUpdate(
        body.matchid,
        { $inc: { "team1.score": 1 } },
        { new: true }
      );
    }
    else{
      await FootballMatches.findByIdAndUpdate(
        body.matchid,
        { $inc: { "team2.score": 1 } },
        { new: true }
      );
    }
  }
  if (body.sportName === "Basketball"){
    const dat = await BasketballMatches.findById(body.matchid);
    if (dat.team1.name === body.teamName){
      await BasketballMatches.findByIdAndUpdate(
        body.matchid,
        { $inc: { "team1.score": body.points } },
        { new: true }
      );
    }
    else{
      await BasketballMatches.findByIdAndUpdate(
        body.matchid,
        { $inc: { "team2.score": body.points } },
        { new: true }
      );
    }
  }
  if (body.sportName === "Kabaddi"){
    const dat = await KabaddiMatches.findById(body.matchId);
    console.log(dat);
    if (dat.team1.name === body.teamName){
      await KabaddiMatches.findByIdAndUpdate(
        body.matchId,
        { $inc: { "team1.score": body.pointsScored } },
        { new: true }
      );
    }
    else{
      await KabaddiMatches.findByIdAndUpdate(
        body.matchId,
        { $inc: { "team2.score": body.pointsScored } },
        { new: true }
      );
    }
  }
  res.json(["ok"]);
});
app.get('/loadcardsf', async(req,res)=>{
  const matches = await FootballMatches.find();
  res.json(matches);
})
app.get('/loadcardsb', async(req,res)=>{
  const matches = await BasketballMatches.find();
  res.json(matches);
})
app.get('/loadcardsk', async(req,res)=>{
  const matches = await KabaddiMatches.find();
  res.json(matches);
})
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


