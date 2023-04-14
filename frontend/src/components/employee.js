import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { useFormik } from 'formik';
import 'react-tabs/style/react-tabs.css';
import { validate_vacation_request } from '../lib/validate';
import {
	getEmployee,
	getVacationRequest,
	vacationRequest,
} from '../services/apiServices';
import { Store } from 'react-notifications-component';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import store from '../redux/store';
import { Logout } from '../redux/actions';

const Employee = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [reqStatus, setStatus] = useState('all');

	// Getting the userid from localStorage
	const user = JSON.parse(localStorage.getItem('user'));
	const userId = user?._id;

	//get employee
	const {
		isLoading: employeeLoading,
		data: employee,
		error: employeeError,
	} = useQuery(['employee', userId], () => getEmployee(userId));
	//Fetching of Vacation of Vacation request
	const {
		isLoading,
		data: vacationRequests,
		error,
	} = useQuery(['vacationRequests', userId, reqStatus], () =>
		getVacationRequest(userId, reqStatus)
	);

	console.log(vacationRequests);

	// Using the formik to handle the form data
	const formik = useFormik({
		initialValues: {
			vacation_start_date: '',
			vacation_end_date: '',
		},
		validate: validate_vacation_request,
		onSubmit,
	});

	async function onSubmit(values) {
		const formData = {
			author: userId,
			author_email: user?.email,
			vacation_start_date: values.vacation_start_date,
			vacation_end_date: values.vacation_end_date,
		};
		vacationRequest(formData)
			.then((res) => {
				console.log(res);
				queryClient.invalidateQueries('vacationRequests');
				queryClient.invalidateQueries('employee');
				Store.addNotification({
					title: 'Success!',
					message: res.data.message,
					type: 'success',
					insert: 'top',
					container: 'top-right',
					animationIn: ['animate__animated', 'animate__fadeIn'],
					animationOut: ['animate__animated', 'animate__fadeOut'],
					dismiss: {
						duration: 3000,
						onScreen: true,
					},
				});
			})
			.catch((error) => {
				console.log(error);
				Store.addNotification({
					title: 'Failure!',
					message: 'Failed to Create Vacation Request !',
					type: 'danger',
					insert: 'top',
					container: 'top-right',
					animationIn: ['animate__animated', 'animate__fadeIn'],
					animationOut: ['animate__animated', 'animate__fadeOut'],
					dismiss: {
						duration: 3000,
						onScreen: true,
					},
				});
			});
	}

	if (isLoading) {
		return null;
	}

	const handleLogout = () => {
		localStorage.clear();
		store.dispatch(Logout());
		navigate('/login');
	};
	return (
		<div className='container'>
			<div className='user-info'>
				<div className='avatar'>
					<img src='avatar.png' alt='avatar-img' style={{ maxWidth: '80px' }} />
				</div>
				<div className='info'>
					<p>
						Name: <span>{user?.name}</span>
					</p>
					<p>
						Email: <span>{user?.email}</span>
					</p>
					<p>
						Role: <span>{user?.role}</span>
					</p>
					<p>
						Remaining Vacations:{' '}
						<span>{employee?.data?.employee?.remaining_vacation_days}</span>
					</p>

					<div className='button' onClick={() => handleLogout()}>
						<button>Logout</button>
					</div>
				</div>
			</div>

			<Tabs>
				<TabList>
					<Tab>
						<select
							name='request'
							id='request'
							onChange={(e) => setStatus(e.target.value)}
						>
							<option value='all'>All Requests</option>
							<option value='pending'>Pending</option>
							<option value='approved'>Approved</option>
							<option value='rejected'>Rejected</option>
						</select>
					</Tab>
					<Tab>
						<p>Make Request</p>
					</Tab>
				</TabList>

				<TabPanel>
					<ul className='items'>
						{vacationRequests?.data?.vacationRequests?.map((row, index) => {
							return (
								<li className='item' key={index}>
									<span>{index + 1}</span>
									<em
										className={
											(row?.status === 'approved' && 'green') ||
											(row?.status === 'pending' && 'warning') ||
											(row?.status === 'rejected' && 'danger')
										}
									>
										{row?.status.toUpperCase()}
									</em>
									<p>
										{row?.status !== 'pending'
											? ` by ${row?.resolved_by_name}`
											: 'Subject of Vacation Leave'}
									</p>
									<div className='date'>
										{new Date(row?.vacation_start_date).toLocaleDateString()} -{' '}
										{new Date(row?.vacation_end_date).toLocaleDateString()}
									</div>
								</li>
							);
						})}
					</ul>
				</TabPanel>
				<TabPanel>
					<form className='form' onSubmit={formik.handleSubmit}>
						<div className='input-group'>
							<input
								type='date'
								name='vacation_start_date'
								placeholder='Vacation Start Date'
								id='start-date'
								{...formik.getFieldProps('vacation_start_date')}
							/>
						</div>
						{formik.errors.vacation_start_date &&
						formik.touched.vacation_start_date ? (
							<span>{formik.errors.vacation_start_date}</span>
						) : (
							<></>
						)}
						<div className='input-group'>
							<input
								type='date'
								name='vacation_end_date'
								placeholder='Vacation End Date'
								id='end-date'
								{...formik.getFieldProps('vacation_end_date')}
							/>
						</div>

						{formik.errors.vacation_end_date &&
						formik.touched.vacation_end_date ? (
							<span>{formik.errors.vacation_end_date}</span>
						) : (
							<></>
						)}
						<div className='button'>
							<button
								type='submit'
								disabled={
									Number(employee?.data?.employee?.remaining_vacation_days) ===
									0
								}
								className={
									Number(employee?.data?.employee?.remaining_vacation_days) ===
									0
										? 'disabled'
										: ''
								}
							>
								Submit
							</button>
						</div>
					</form>
				</TabPanel>
			</Tabs>
		</div>
	);
};

export default Employee;
