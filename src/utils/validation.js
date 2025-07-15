const validator = require("validator");


// validating signup data
const ValidateSignUpData = (req) => {
    const {FirstName, LastName, emailId, password}  = req.body;

    if (!FirstName || !LastName){
        throw new Error("Name is not Valid!");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    }
    else if (!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password!");
    }
};


const ValidateProfileData = (req) => {
    const AllowedEditFields = [
        "FirstName", 
        "LastName", 
        "gender", 
        "photoUrl",
        "emailId", 
        "age", 
        "about", 
        "skills",
        "techStack",
        "bioAnswers",
        "projects",
        "socialLinks",
        "availability",
        "location",
    ];
    const isEditAllowed = Object.keys(req.body).every(field => 
        AllowedEditFields.includes(field));

    return isEditAllowed;


};
module.exports = {
    ValidateSignUpData,ValidateProfileData,
};