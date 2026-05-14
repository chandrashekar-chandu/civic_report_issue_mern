const Activity=require("../models/Activitymodel");

const logActivity = async (performedBy, action, issueId) => {
    try {
        const activity = await Activity.create({
            performedBy,
            action,
            issueId,
        });
        return activity;
    } catch (error) {
        console.error("Log Activity Error:", error.message);
    }           
};

const getActivitiesByIssue=async(req,res)=>{
    try {
        const activities = await Activity.find({issueId:req.params.issueId})    
        .populate("performedBy", "name email role")
        .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            activities, 
        });
    } catch (error) {
        console.error("Get Activities Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }   
};

const getActivitiesByUser=async(req,res)=>{
    try {
        const activities = await Activity.find({performedBy:req.user._id})
        .populate("issueId", "title description")
        .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            activities, 
        });
    } catch (error) {
        console.error("Get Activities Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }   
};

const getAllActivities=async(req,res)=>{
    try {
        const activities = await Activity.find()
        .populate("performedBy", "name email role")
        .populate("issueId", "title description")
        .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            activities, 
        });
    } catch (error) {
        console.error("Get Activities Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }   
};

module.exports={
    logActivity,
    getActivitiesByIssue,
    getActivitiesByUser,
    getAllActivities,
}