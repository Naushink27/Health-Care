const validator = require("validator");
const signupValidation = (data) => {
    const errors = {};
    data.firstName = data.firstName ? data.firstName : "";
  data.lastName = data.lastName ? data.lastName : "";
  data.email = data.email ? data.email : "";
  data.password = data.password ? data.password : "";
  data.userRole= data.userRole ? data.userRole : "";


    if (validator.isEmpty(data.firstName)) {
        errors.firstName = "First name is required";
    }
    else if (!validator.isLength(data.firstName, { min: 4, max: 30 })) {
        errors.firstName = "First name must be between 4 and 30 characters";
    }
    
    else if (!validator.isAlpha(data.firstName)) {
        errors.firstName = "First name must contain only letters";
    }
    if (validator.isEmpty(data.lastName)) {
        errors.lastName = "Last name is required";
    }
    else if (!validator.isLength(data.lastName, { min: 4, max: 30 })) {
        errors.lastName = "Last name must be between 4 and 30 characters";
    }
    else if (!validator.isAlpha(data.lastName)) {
        errors.lastName = "Last name must contain only letters";
    }
    if (validator.isEmpty(data.email)) {
        errors.email = "Email is required";
    }
    else if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    if (validator.isEmpty(data.password)) {
        errors.password = "Password is required";
    }
    else if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be between 6 and 30 characters";
    }
    else if(!validator.isStrongPassword(data.password)){
        errors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    if(validator.isEmpty(data.userRole)) {
        errors.userRole = "Role is required";
    }
    else if (![ "patient", "doctor"].includes(data.userRole)) {
        errors.userRole = "Role must be either 'admin', 'patient', or 'doctor'";
    }
    const isValid = Object.keys(errors).length === 0;
    return { errors, isValid };

}

module.exports = signupValidation;