const express = require("express");
const profileRouter = express.Router();
const { requireClerkAuth } = require("../middleware/auth");
const {ValidateProfileData} = require("../utils/validation")

profileRouter.get("/profile/view", requireClerkAuth, async (req, res) =>{
    try{
        const user = req.user;
        if (!user) {
            return res.status(404).json({
                error: "User not found in MongoDB. Please sync your account.",
                action: "Call /auto-sync after Clerk signup."
            });
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

profileRouter.patch("/profile/edit", requireClerkAuth, async (req, res) =>{
    try{

       if(!ValidateProfileData (req)){
        throw new Error( "Invalid edit request!");
       }

       const loggedInuser = req.user;

       Object.keys(req.body).forEach((key) => (loggedInuser[key]=req.body[key]));

       await loggedInuser.save();
       res.json({
        message: `${loggedInuser.FirstName} your profile is  edited successfully`,
        data: loggedInuser
    });

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = profileRouter;