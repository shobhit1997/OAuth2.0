const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env' });

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 6
    },
    createdAt: { type: Date, default: Date.now },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();
    user.tokens.push({ access, token });
    return user.save().then(function() {
        return token;
    });
};

UserSchema.methods.generateOAuthCode = function(project) {
    var user = this;
    var access = 'oauth'
    var token = jwt.sign({ access, _id: user._id.toHexString(), projectID: project.projectID, projectSecret: project.projectSecret, scope: project.scope }, process.env.JWT_SECRET).toString();
    user.tokens.push({ access, token });
    return user.save().then(function() {
        return token;
    });
};



UserSchema.statics.findByToken = async function(token) {
    var User = this;
    var decoded;

    try {

        decoded = jwt.verify(token, process.env.JWT_SECRET);

    } catch (e) {

        return new Promise(function(resolve, reject) {
            reject();
        });

    }
    user = await User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': decoded.access
    });
    return {
        token: decoded,
        user
    }
};

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    return User.findOne({ email }).then(function(user) {
        if (!user) {
            return Promise.reject();
        }
        return new Promise(function(resolve, reject) {
            bcrypt.compare(password, user.password, function(err, res) {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

UserSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.methods.removeToken = function(token) {
    var user = this;
    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};


module.exports = mongoose.model('User', UserSchema);