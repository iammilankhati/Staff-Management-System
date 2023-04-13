const express = require('express');
const {
	createVacationRequest,
	updateVacationRequest,
	getAllVacationRequest,
} = require('../controllers/vacationRequestsController');

const router = express.Router();

router.route('/request').post(createVacationRequest).get(getAllVacationRequest);
router.route('/request/:id').patch(updateVacationRequest);

module.exports = router;
