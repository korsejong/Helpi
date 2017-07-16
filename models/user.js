const mongoose = require('mongoose');
//Encryption module
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    //User ID
    username : { type : String , required : true, unique : true },
    //User Password
    password : { type : String , required : true },
    //Encryption
    salt :{type :String, default:null}
});

userSchema.pre('save', function(next){
    if(this.password && this.salt == null) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'),'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

userSchema.methods = {
    hashPassword(password){
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
    },
    validPassword( password ) {
        return (this.password === this.hashPassword(password));
    },
    isExistPassword() {
        return (this.password !== undefined);
    },
}
module.exports = mongoose.model( 'User',userSchema);