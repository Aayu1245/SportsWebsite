const mongoose = require('mongoose'); 



const footballTeamSchema= new mongoose.Schema({
    teamName: String,
    formation: String, // e.g. "4-4-2", "4-3-3", etc.
    players: [
      {
        roll: String, // Reference to players collection if normalized
        goals: Number,
        jerseyNumber: Number,
        name: String,
        position: {
          primary: String, // e.g. "Goalkeeper", "Center Back", "Striker"
          secondary: [String] // alternative positions
        },
        isCaptain: Boolean,
        isViceCaptain: Boolean,
        age: Number,
        foot: String, // "Right", "Left", or "Both"
      }
    ],
    teamColors: [String],
    createdAt: Date, // When this document was created
    updatedAt: Date // When this document was last updated
});

const FootballTeam = mongoose.model('FootballTeam', footballTeamSchema);

