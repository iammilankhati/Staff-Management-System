import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { register_validate } from '../lib/validate';

const Register = () => {
	const formik = useFormik({
		initialValues: {
			username: '',
			email: '',
			password: '',
			cpassword: '',
			role: 'Manager',
		},

		validate: register_validate,
		onSubmit,
	});

	async function onSubmit(values) {
		console.log(values);
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
							<option value='Employee'>Employee</option>
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
