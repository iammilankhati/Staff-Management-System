export function register_validate(values) {
	const errors = {};
	//validation for username
	if (!values.username) {
		errors.username = 'Required';
	}
	//validation for email
	if (!values.email) {
		errors.email = 'Required';
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
		errors.email = 'Invalid email address';
	}

	//validation for password
	if (!values.password) {
		errors.password = 'Required';
	} else if (values.password.length < 8 || values.password.length > 20) {
		errors.password = 'Must be at least 8 characters and at most 20 characters';
	} else if (values.password.includes(' ')) {
		errors.password = 'Invalid password';
	}

	//validation for confirm password
	if (!values.cpassword) {
		errors.cpassword = 'Required';
	} else if (values.cpassword !== values.password) {
		errors.cpassword = 'Passwords donot match !';
	}

	return errors;
}
// Validation for login
export function login_validate(values) {
	const errors = {};
	//validation for email
	if (!values.email) {
		errors.email = 'Required';
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
		errors.email = 'Invalid email address';
	}

	//validation for password
	if (!values.password) {
		errors.password = 'Required';
	}

	return errors;
}

export function validate_vacation_request(values) {
	const errors = {};
	if (!values.vacation_start_date) {
		errors.vacation_start_date = 'Required';
	}
	if (!values.vacation_end_date) {
		errors.vacation_end_date = 'Required';
	} else if (
		values.vacation_start_date &&
		values.vacation_end_date &&
		new Date(values.vacation_end_date) <= new Date(values.vacation_start_date)
	) {
		errors.vacation_end_date = 'End Date Must be greater than start date';
	}
	return errors;
}
