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
