const Team = require("../models/team.model")
const Users = require("../models/user.model")

async function createTeam(req, res) {
    const { team_title, team_members, created_by, manager, team_lead } = req.body;
    if (!team_title) {
        return res.status(400).json({
            message: "Team title is required"
        })
    }
    if (!team_members?.length) {
        return res.status(400).json({
            message: "Team members are required"
        })
    }
    try {
        const team = await Team.create({
            team_title,
            team_members,
            created_by,
            manager,
            team_lead
        })
        return res.status(201).json(team)
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


async function getTeams(req, res) {
    try {
        const { page, limit } = req.query;
        const teams = await Team.find({created_by:req.user.id})
            .populate("team_members")
            .populate("created_by")
            .populate("manager")
            .populate("team_lead")
            .skip((page - 1) * limit)
            .limit(limit);
        const totalRecords = await Team.countDocuments();
        const data = {
            data:teams,
            totalRecords:Number(totalRecords),
            page:Number(page),
            limit:Number(limit),
            totalPages:Math.ceil(totalRecords / limit),
            total:teams?.length,
        }
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}
async function deleteTeams(req,res) {
    try {
        const response = await Team.findByIdAndDelete(req.params.id);
        if(!response) {
            return res.status(400).json({message:"Teams does not exists."})
        }
        return res.status(200).json({
            message:"Teams has been deleted."
        })
    }catch (e) {
        console.log(e);
        return res.status(500).json({message:"Internal server error."})
    }
}

async function getUsersTeams (req,res) {
    try {
        const response = await Users.find({created_by:req.params.id});
        return res.status(200).json({data:response})
    }catch (e) {    
        console.log(e);
        return res.status(500).json({message:"Internal server error."})
    }
}
module.exports = {
    createTeam,
    getTeams,
    deleteTeams,
    getUsersTeams
}