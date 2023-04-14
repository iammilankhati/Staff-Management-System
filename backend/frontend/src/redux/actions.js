import * as actions from './actionTypes';

export function LoginRedux({ id, name, role, email, token }) {
	return {
		type: actions.LOGIN,
		payload: {
			id,
			name,
			role,
			email,
			token,
		},
	};
}

export function Logout() {
	return {
		type: actions.LOGOUT,
		payload: {
			id: null,
			name: null,
			role: null,
			email: null,
			token: null,
		},
	};
}
