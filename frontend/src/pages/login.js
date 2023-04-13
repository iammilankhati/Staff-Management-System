import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { login_validate } from '../lib/validate';
import { login } from '../services/apiServices';
import { Store } from 'react-notifications-component';

const Login = () => {
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validate: login_validate,
		onSubmit,
	});
	async function onSubmit(values) {
		const formData = {
			email: values.email,
			password: values.password,
		};

		login(formData)
			.then((res) => {
				console.log(res);
				Store.addNotification({
					title: 'Success!',
					message: res.message,
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
				navigate('/home');
			})
			.catch((error) => {
				console.log(error);
				Store.addNotification({
					title: 'Failure!',
					message: 'Please enter the valid credentials',
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

				<h2>Login</h2>
				<form className='form' onSubmit={formik.handleSubmit}>
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
					<div className='button'>
						<button type='submit'>Login</button>
					</div>
					<p style={{ color: 'gray', fontSize: '14px' }}>
						Doesn't Have An Account ? <Link to='/register'>Register</Link>
					</p>
				</form>
			</main>
		</div>
	);
};

export default Login;
