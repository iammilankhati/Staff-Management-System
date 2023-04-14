const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken,js');
const catchAsyncErrors = require('./../middleware/catchAsyncErrors');
const { User, Employee } = require('./../models/user');

//Register the new user
exports.RegisterUser = catchAsyncErrors(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		role,
	});
	if (user.role === 'employee') {
		await Employee.create({
			user: user._id,
		});
	}

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
	const employee = await Employee.findOne({ user: user?._id });
	remaining_vacation_days = employee?.remaining_vacation_days;

	if (!user) {
		return next(new ErrorHandler("User doesn't exits ", 401));
	}
	//Check if the password is correct
	const isPassswordMatched = await user.comparePassword(password);
	if (!isPassswordMatched) {
		return next(new ErrorHandler('Wrong password', 401));
	}
	let userWithVacationDays = {};
	if (user.role === 'employee') {
		userWithVacationDays = {
			_id: user._id,
			email: user.email,
			name: user.name,
			role: user.role,
			remaining_vacation_days: remaining_vacation_days,
		};
	} else {
		userWithVacationDays = {
			_id: user._id,
			email: user.email,
			name: user.name,
			role: user.role,
		};
	}

	sendToken(userWithVacationDays, 200, res);
});

//Get employee
exports.getEmployee = catchAsyncErrors(async (req, res, next) => {
	const { id: userId } = req.params;
	const employee = await Employee.findOne({ user: userId });
	if (!employee) {
		return next(new ErrorHandler('No employee found', 404));
	}

	return res.status(200).json({
		success: true,
		employee: employee,
	});
});

// get all employees
exports.getAllEmployee = catchAsyncErrors(async (req, res, next) => {
	const employees = await User.find({ role: 'employee' });
	if (!employees) {
		return next(new ErrorHandler('No employee found', 404));
	}

	return res.status(200).json({
		success: true,
		employee: employees,
	});
});

//Get user
exports.getUser = catchAsyncErrors(async (req, res, next) => {
	const { id: userId } = req.params;
	const user = await User.findOne({ user: userId });
	if (!user) {
		return next(new ErrorHandler('No user found', 404));
	}

	return res.status(200).json({
		success: true,
		user,
	});
});
