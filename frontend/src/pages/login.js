import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { login_validate } from '../lib/validate';

const Login = () => {
	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validate: login_validate,
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
