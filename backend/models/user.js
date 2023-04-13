const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//Schema for User
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: [validator.isEmail, 'Please enter a valid email'],
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	role: {
		type: String,
		required: true,
		enum: ['worker', 'manager'],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

//hash the password before save
userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

//compare the entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJwtToken = function () {
	return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_TIME,
	});
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// Schema for Manager
const managerSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User,
		required: true,
	},
});

const Manager = mongoose.model('Manager', managerSchema);
module.exports = Manager;

// Schema for Employee
const employeeSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User,
		required: true,
	},
	remaining_vacation_days: {
		type: Number,
		default: 30,
	},
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
