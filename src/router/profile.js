const express = require("express");
const profileRouter = express.Router();
const {UserAuth} = require("../middleware/auth");
const {ValidateProfileData} = require("../utils/validation")

profileRouter.get("/profile/view",UserAuth, async (req, res) =>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

profileRouter.patch("/profile/edit", UserAuth, async (req, res) =>{
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