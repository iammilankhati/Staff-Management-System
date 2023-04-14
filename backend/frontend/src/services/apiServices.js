import { axiosInstance } from './../helpers/axiosInstance';

// Register
export const register = async (formData) => {
	const response = await axiosInstance.post('/register', formData);
	return response;
};

//Login
export const login = async (formData) => {
	const response = await axiosInstance.post('/login', formData);
	return response;
};

// Create Vacation Request
export const vacationRequest = async (formData) => {
	console.log(formData);
	const response = axiosInstance.post('/request', formData);
	return response;
};
// Get Vacation Request
export const getVacationRequest = async (userId, reqStatus) => {
	const response = axiosInstance.get(
		`/request?id=${userId}&&status=${reqStatus}`
	);
	return response;
};
//update vacation request
export const updateVacationRequest = async (author, body) => {
	console.log(body);
	const response = axiosInstance.patch(`/request/${author}`, body);
	return response;
};
// get employee

export const getEmployee = async (userId) => {
	const response = axiosInstance.get(`/employee/${userId}`);
	return response;
};
// get all employee

export const getAllEmployee = async () => {
	const response = axiosInstance.get(`/employee`);
	return response;
};

//get user
export const getUser = async (userId) => {
	const response = axiosInstance.get(`/user/${userId}`);
	return response;
};
//get overlapping
export const getOverlapping = async () => {
	const response = axiosInstance.get(`/overlapping`);
	return response;
};
