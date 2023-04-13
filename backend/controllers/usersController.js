const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken,js');
const catchAsyncErrors = require('./../middleware/catchAsyncErrors');
const { User } = require('./../models/user');

//Register the new user
exports.RegisterUser = catchAsyncErrors(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	const token = user.getJwtToken();
	res.status(201).json({
		success: true,
		message: 'User registered successfully !',
		token,
	});
});

//Login user
exports.LoginUser = catchAsyncErrors(async (req, res, next) => {
	const { email, password } = req.body;

	//check if email and password are provided
	if (!email || !password) {
		return next(new ErrorHandler('Please Enter Required Fields', 400));
	}
	//Check if user exists
	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(new ErrorHandler("User doesn't exits ", 401));
	}
	//Check if the password is correct
	const isPassswordMatched = await user.comparePassword(password);
	if (!isPassswordMatched) {
		return next(new ErrorHandler('Wrong password', 401));
	}

	sendToken(user, 200, res);
});
