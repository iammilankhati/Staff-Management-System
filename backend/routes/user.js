const express = require('express');
const {
	RegisterUser,
	LoginUser,
	getEmployee,
	getAllEmployee,
	getUser,
} = require('../controllers/usersController');

const router = express.Router();

router.route('/register').post(RegisterUser);
router.route('/login').post(LoginUser);
router.route('/employee/:id').get(getEmployee);
router.route('/employee').get(getAllEmployee);
router.route('/user/:id').get(getUser);

module.exports = router;
