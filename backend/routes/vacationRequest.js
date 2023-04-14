const express = require('express');
const {
	createVacationRequest,
	updateVacationRequest,
	getAllVacationRequest,
	getOverlappingRequest,
} = require('../controllers/vacationRequestsController');

const router = express.Router();

router.route('/request').post(createVacationRequest).get(getAllVacationRequest);
router.route('/request/:id').patch(updateVacationRequest);
router.route('/overlapping').get(getOverlappingRequest);

module.exports = router;
