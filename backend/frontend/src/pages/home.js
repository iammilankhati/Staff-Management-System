import React from 'react';
import Employee from './../components/employee';
import Manager from '../components/manager';
import Login from './login';

const Home = () => {
	// Getting the role from localStorage
	const user = JSON.parse(localStorage.getItem('user'));
	const role = user?.role;
	return (
		<div>
			{role ? role === 'manager' ? <Manager /> : <Employee /> : <Login />}
		</div>
	);
};

export default Home;
