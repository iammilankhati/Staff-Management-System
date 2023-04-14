const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CronJob = require('cron').CronJob;

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
		enum: ['employee', 'manager'],
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
		ref: 'User',
		required: true,
	},
});

const Manager = mongoose.model('Manager', managerSchema);

// Schema for Employee
const employeeSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	remaining_vacation_days: {
		type: Number,
		default: 30,
		min: 0,
	},
});

const Employee = mongoose.model('Employee', employeeSchema);

// Define a function to reset the remaining_vacation_days field to 30 every year
employeeSchema.statics.resetVacationDays = async function () {
	const employees = await this.find();
	const currentYear = new Date().getFullYear();

	for (const employee of employees) {
		const employeeYear = employee.createdAt.getFullYear();
		if (employeeYear < currentYear) {
			employee.remaining_vacation_days = 30;
			await employee.save();
		}
	}
};

// Set up a cron job to run the resetVacationDays function every year on January 1st
const job = new CronJob('0 0 1 1 *', () => {
	Employee.resetVacationDays();
});

job.start();

module.exports = {
	User,
	Manager,
	Employee,
};
