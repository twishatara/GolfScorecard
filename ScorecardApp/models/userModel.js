// User Model
const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true, 
    }, 
    email: {
        type: String, 
        required: true, 
        unique: true, 
    }, 
    password: {
        type: String, 
        required: true, 
    }, 
}); 

// middleware function for Mongoose
userSchema.pre('save', async function (next){ // set up a pre save middleware in Mongoose
    if (!this.isModified('password')) { // checks if password field is in the document has been modified, you dont want to re-hasg if it hasnt changed
        return next(); // rehashing a already hashed password would corrupt the password field
    }
    const salt = await bcrypt.genSalt(10); // generate salt to use for hashing 
    this.password = await bcrypt.hash(this.password, salt); // take the plain text password and generated salt and hash the password, result is secure hashed password
    next(); // tells Mongoose to proceed with the save operation
}); 

userSchema.methods.matchPassword = async function (enteredPassword) { // funcition that takes the user entered password and compares it to the secure hashed one in the database
    return await bcrypt.compare(enteredPassword, this.password); 
}; 

const User = mongoose.model('User', userSchema); // creates a mongoose model called User

module.exports = User; // exports the mongoose model so it can be used in other parts of the application