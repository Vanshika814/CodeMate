const validator = require("validator");

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

module.exports = {
    ValidateSignUpData,
};