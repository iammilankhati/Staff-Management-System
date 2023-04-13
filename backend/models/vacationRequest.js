const mongoose = require('mongoose');
const User = require('./user');

const vacationRequestSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User,
		required: true,
	},
	status: {
		type: String,
		enum: ['approved', 'rejected', 'pending'],
		default: 'pending',
	},

	resolved_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User,
	},
	request_created_at: {
		type: Date,
		default: Date.now(),
	},
	vacation_start_date: {
		type: Date,
		required: true,
	},
	vacation_end_date: {
		type: Date,
		required: true,
	},
});

const VacationRequest = mongoose.model(
	'VacationRequest',
	vacationRequestSchema
);

module.exports = VacationRequest;
