import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            index: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            // required: true,
        },
        avatarId: {
            type: String,
            default: '',
        },
        avatarUrl: {
            type: String,
            default: '',
        },
        facebookId: {
            type: String,
            default: '',
        },
        googleId: {
            type: String,
            default: '',
        },
        confirmed: {
            type: Boolean,
            default: false,
        },
        confirmationToken: {
            type: String,
            default: '',
        },
        resetPasswordToken: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.isValidPassword = function isValidPassword(password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.methods.setPassword = function setPassword(password) {
    this.passwordHash = bcrypt.hashSync(password, 12);
};

userSchema.methods.generateJWT = function generateJWT() {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            confirmed: this.confirmed,
            name: this.name,
            avatarId: this.avatarId,
            avatarUrl: this.avatarUrl,
        },
        process.env.JWT_SECRET
    );
};

userSchema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h',
        }
    );
};

userSchema.methods.setConfirmationToken = function setConfirmationToken() {
    this.confirmationToken = this.generateJWT();
};

userSchema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
    return `${process.env.HOST}/confirmation/${this.confirmationToken}`;
};

userSchema.methods.setResetPasswordToken = function setResetPasswordToken() {
    this.resetPasswordToken = this.generateResetPasswordToken();
};

userSchema.methods.generateForgotPasswordLink = function generateForgotPasswordLink() {
    return `${process.env.HOST}/reset-password/${this.resetPasswordToken}`;
};

// this function return to client with format User in typeDefs
userSchema.methods.toAuthJSON = function toAuthJSON() {
    return {
        id: this.id,
        email: this.email,
        name: this.name,
        avatarId: this.avatarId,
        avatarUrl: this.avatarUrl,
        createdAt: this.createdAt,
        token: this.generateJWT(),
        confirmed: this.confirmed,
    };
};

userSchema.plugin(uniqueValidator, { message: 'This email is already taken' });

const User = model('User', userSchema);

export default User;
