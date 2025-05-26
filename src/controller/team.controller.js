const Team = require("../models/team.model")

async function createTeam(req,res) {
    const {team_title,team_members,created_by,manager,team_lead} = req.body;
    if(!team_title){
        return res.status(400).json({
            message:"Team title is required"
        })
    }
    if (!team_members?.length) {
        return res.status(400).json({
            message: "Team members are required"
        })
    }
    try {
        const team =  await Team.create({
            team_title,
            team_members,
            created_by,
            manager,
            team_lead
        })

        return res.status(201).json(team)
    }  catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = {
    createTeam
}