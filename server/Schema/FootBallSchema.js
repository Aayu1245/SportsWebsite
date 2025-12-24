const mongoose = require('mongoose'); 



const footballTeamSchema= new mongoose.Schema({
    teamName: String,
    formation: String, 
    players: [
      {
        roll: String, 
        goals: Number,
        jerseyNumber: Number,
        name: String,
        position: {
          primary: String, 
          secondary: [String] 
        },
        isCaptain: Boolean,
        isViceCaptain: Boolean,
        age: Number,
        foot: String, 
      }
    ],
    teamColors: [String],
    createdAt: Date,
    updatedAt: Date 
});

const FootballTeam = mongoose.model('FootballTeam', footballTeamSchema);

