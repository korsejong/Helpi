const mongoose = require('mongoose');
const Folder = require('./folder');
const Document = require('./document');
const Message = require('./message');
//Encryption module
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    //User ID
    username: { type: String , required: true, unique: true },
    //User Email
    useremail: { type: String, required: true, unique: true },
    //User Password
    password: { type: String , required : true },
    //User Docs,Files
    contents: {
        documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
        folders: [{ type: Schema.Types.ObjectId, ref: 'Folder' }]
    },
    profileImage: String,
    //message
    alarm: [{
        message: { type: Schema.Types.ObjectId, ref: 'Message' },
        status: { type: Boolean, default: false },
        deleted: { type: Boolean, default: false }
    }],
    //Encryption
    salt: { type :String, default:null },
    deleted: { type: Boolean, default: false }
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

userSchema.statics = {
    list(){
        return this.find({deleted:{$ne:true}});
    }
}
module.exports = mongoose.model( 'User',userSchema);