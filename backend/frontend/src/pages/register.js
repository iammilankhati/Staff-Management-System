import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { register_validate } from '../lib/validate';

import { Store } from 'react-notifications-component';
import { register } from '../services/apiServices';

const Register = () => {
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			name: '',
			email: '',
			password: '',
			cpassword: '',
			role: 'manager',
		},

		validate: register_validate,
		onSubmit,
	});

	async function onSubmit(values) {
		const formData = {
			name: values.username,
			email: values.email,
			password: values.password,
			role: values.role,
		};
		register(formData)
			.then((res) => {
				console.log(res);
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
				navigate('/login');
			})
			.catch((error) => {
				console.log(error);
				Store.addNotification({
					title: 'Failure!',
					message: 'Failed to register user !',
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
	return (
		<div className='container'>
			<main className='form-wrapper'>
				<img
					src='medex-fav.png'
					alt='medex-icon'
					style={{ maxWidth: '100px' }}
				/>

				<h2>Sign Up</h2>
				<form className='form' onSubmit={formik.handleSubmit}>
					<div className='input-group'>
						<input
							type='text'
							placeholder='Username'
							name='username'
							{...formik.getFieldProps('username')}
						/>
					</div>
					{formik.errors.username && formik.touched.username ? (
						<span>{formik.errors.username}</span>
					) : (
						<></>
					)}
					<div className='input-group'>
						<input
							type='email'
							placeholder='Email'
							name='email'
							{...formik.getFieldProps('email')}
						/>
					</div>

					{formik.errors.email && formik.touched.email ? (
						<span>{formik.errors.email}</span>
					) : (
						<></>
					)}
					<div className='input-group'>
						<input
							type='password'
							placeholder='Password'
							name='password'
							{...formik.getFieldProps('password')}
						/>
					</div>
					{formik.errors.password && formik.touched.password ? (
						<span>{formik.errors.password}</span>
					) : (
						<></>
					)}
					<div className='input-group'>
						<input
							type='password'
							placeholder='Confirm Password'
							name='cpassword'
							{...formik.getFieldProps('cpassword')}
						/>
					</div>
					{formik.errors.cpassword && formik.touched.cpassword ? (
						<span>{formik.errors.cpassword}</span>
					) : (
						<></>
					)}
					<div className='input-group'>
						<select name='role' id='role' {...formik.getFieldProps('role')}>
							<option value='manager'>Manager</option>
							<option value='employee'>Employee</option>
						</select>
					</div>
					<div className='button'>
						<button type='submit'>Register</button>
					</div>
					<p style={{ color: 'gray', fontSize: '14px' }}>
						Already Have An Account ? <Link to='/login'>Login</Link>
					</p>
				</form>
			</main>
		</div>
	);
};

export default Register;
