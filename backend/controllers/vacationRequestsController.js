const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { Employee } = require('../models/user');
const VacationRequest = require('../models/vacationRequest');
const ErrorHandler = require('../utils/errorHandler');

// Create Vacation Request
exports.createVacationRequest = catchAsyncErrors(async (req, res, next) => {
	const {
		author,
		status,
		author_email,
		resolved_by,
		resolved_by_name,
		request_created_at,
		vacation_start_date,
		vacation_end_date,
	} = req.body;

	const vacationRequest = await VacationRequest.create({
		author,
		author_email,
		status,
		resolved_by,
		resolved_by_name,
		request_created_at,
		vacation_start_date,
		vacation_end_date,
	});

	if (vacationRequest) {
		const totalReq = await VacationRequest.find({ author });
		let employee = await Employee.findOne({ user: author });
		if (totalReq?.length <= 30) {
			employee.remaining_vacation_days = 30 - totalReq.length;
		}

		await employee.save();
	}

	return res.status(201).json({
		success: true,
		vacationRequest,
		message: 'Request created successfully',
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
	const { id, status } = req.query;

	// if the status is not 'all' filter the result based on the status
	const filter = status !== 'all' ? { status } : {};
	// if id is provided , filter using both id and status
	if (id) {
		filter.author = id;
	}
	const vacationRequests = await VacationRequest.find(filter);
	if (!vacationRequests) {
		return next(new ErrorHandler('No Vacation Request found', 404));
	}
	res.status(200).json({
		success: true,
		vacationRequests,
	});
});

// get overlapping requests
exports.getOverlappingRequest = catchAsyncErrors(async (req, res, next) => {
	const vacationRequests = await VacationRequest.find({ status: 'pending' });

	// Loop through all vacation requests
	for (let i = 0; i < vacationRequests.length; i++) {
		for (let j = i + 1; j < vacationRequests.length; j++) {
			// Compare date ranges of current and next vacation request
			if (
				vacationRequests[i].vacation_start_date <=
					vacationRequests[j].vacation_end_date &&
				vacationRequests[j].vacation_start_date <=
					vacationRequests[i].vacation_end_date
			) {
				// Date ranges overlap, mark both requests as overlapping
				vacationRequests[i].overlapping = true;
				vacationRequests[j].overlapping = true;
			}
		}
	}

	let overlappingRequest = vacationRequests.map((row) => {
		if (row.overlapping) {
			return row;
		}
	});

	return res.status(200).json({
		success: true,
		request: overlappingRequest,
	});
});
