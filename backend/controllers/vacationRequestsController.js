const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const VacationRequest = require('../models/vacationRequest');
const ErrorHandler = require('../utils/errorHandler');

// Create Vacation Request
exports.createVacationRequest = catchAsyncErrors(async (req, res, next) => {
	const {
		author,
		status,
		resolved_by,
		request_created_at,
		vacation_start_date,
		vacation_end_date,
	} = req.body;

	const vacationRequest = await VacationRequest.create({
		author,
		status,
		resolved_by,
		request_created_at,
		vacation_start_date,
		vacation_end_date,
	});

	return res.status(201).json({
		success: true,
		vacationRequest,
	});
});

// Update vacation Request by manager
exports.updateVacationRequest = catchAsyncErrors(async (req, res, next) => {
	const { id: requestId } = req.params;
	//update the vacation request based on id
	const vacationRequest = await VacationRequest.findOneAndUpdate(
		{ _id: requestId },
		req.body,
		{
			new: true,
			runValidators: true,
		}
	);

	//check if no vacationRequest
	if (!vacationRequest) {
		return next(new ErrorHandler("Request Doesn't Exists !", 404));
	}

	return res.status(200).json({ success: true, vacationRequest });
});

// get All vaction requests
exports.getAllVacationRequest = catchAsyncErrors(async (req, res, next) => {
	const vacationRequests = await VacationRequest.find({});
	if (!vacationRequests) {
		return next(new ErrorHandler('No Vacation Request found', 404));
	}
	res.status(200).json({
		success: true,
		vacationRequests,
	});
});
