import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { useFormik } from 'formik';
import 'react-tabs/style/react-tabs.css';
import { validate_vacation_request } from '../lib/validate';
import {
	getAllEmployee,
	getOverlapping,
	getUser,
	getVacationRequest,
	updateVacationRequest,
	vacationRequest,
} from '../services/apiServices';
import { Store } from 'react-notifications-component';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

const Manager = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [reqStatus, setStatus] = useState('all');

	// Getting the userid from localStorage
	const user = JSON.parse(localStorage.getItem('user'));
	const userId = '';

	//get all employee
	const {
		isLoading: employeeLoading,
		data: employee,
		error: employeeError,
	} = useQuery('employee', () => getAllEmployee());

	function getSingleUser(userId) {}
	//Fetching of Vacation of Vacation request
	const {
		isLoading: vacationLoading,
		data: vacationRequests,
		error: vacationError,
	} = useQuery(['vacationRequests', userId, reqStatus], () =>
		getVacationRequest(userId, reqStatus)
	);

	//get overlapping requests

	const {
		isLoading: overlappingLoading,
		data: overlappingRequests,
		error: overlappingError,
	} = useQuery('overlappingRequests', getOverlapping);

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

	const handleLogout = () => {
		localStorage.clear();
		navigate('/login');
	};

	const approveHandler = (author) => {
		console.log(author);
		const body = {
			resolved_by: user._id,
			resolved_by_name: user.email,
			status: 'approved',
		};
		updateVacationRequest(author, body)
			.then((res) => {
				console.log(res);
				queryClient.invalidateQueries('vacationRequests');
				queryClient.invalidateQueries('employee');
				queryClient.invalidateQueries('overlappingRequests');
				Store.addNotification({
					title: 'Success!',
					message: 'Approved successfully !',
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
					message: 'Failed to Approved',
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
	};
	const rejectHandler = (author) => {
		const body = {
			resolved_by: user?._id,
			resolved_by_name: user?.email,
			status: 'rejected',
		};
		updateVacationRequest(author, body)
			.then((res) => {
				console.log(res);
				queryClient.invalidateQueries('vacationRequests');
				queryClient.invalidateQueries('employee');
				queryClient.invalidateQueries('overlappingRequests');

				Store.addNotification({
					title: 'Success!',
					message: 'Rejected Successfully!',
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
					message: 'Failed to reject !',
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
						<p>All Employee</p>
					</Tab>
					<Tab>
						<p>Overlapping Request</p>
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
									<p>{row?.author_email}</p>
									<div className='date'>
										{new Date(row?.vacation_start_date).toLocaleDateString()} -{' '}
										{new Date(row?.vacation_end_date).toLocaleDateString()}
									</div>
									{row?.status === 'pending' && (
										<div className='button-groups'>
											<button onClick={() => approveHandler(row?._id)}>
												Approve
											</button>
											<button onClick={() => rejectHandler(row?._id)}>
												Reject
											</button>
										</div>
									)}
								</li>
							);
						})}
					</ul>
				</TabPanel>
				<TabPanel>
					<ul className='items'>
						{employee?.data?.employee?.map((row, index) => {
							return (
								<li className='item' key={index}>
									<span>{index + 1}</span>
									<span>{row?._id}</span>
									<strong>{row?.email}</strong>
								</li>
							);
						})}
					</ul>
				</TabPanel>
				<TabPanel>
					<ul className='items'>
						{overlappingRequests?.data?.request?.map((row, index) => {
							if (row?.overlapping && row.status === 'pending') {
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
										<p>{row?.author_email}</p>
										<span>(ol)</span>
										<div className='date'>
											{new Date(row?.vacation_start_date).toLocaleDateString()}{' '}
											- {new Date(row?.vacation_end_date).toLocaleDateString()}
										</div>
										{row?.status === 'pending' && (
											<div className='button-groups'>
												<button onClick={() => approveHandler(row?._id)}>
													Approve
												</button>
												<button onClick={() => rejectHandler(row?._id)}>
													Reject
												</button>
											</div>
										)}
									</li>
								);
							} else {
								return null;
							}
						})}
					</ul>
				</TabPanel>
			</Tabs>
		</div>
	);
};

export default Manager;
