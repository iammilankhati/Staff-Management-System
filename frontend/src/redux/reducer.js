import * as actions from './actionTypes';

export default function reducer(state = {}, action) {
	switch (action.type) {
		case actions.LOGIN:
			return {
				id: action.payload.id,
				name: action.payload.name,
				role: action.payload.role,
				email: action.payload.email,
				token: action.payload.token,
			};
		case actions.LOGOUT:
			return {
				id: action.payload.id,
				name: action.payload.name,
				role: action.payload.role,
				email: action.payload.email,
				token: action.payload.token,
			};
		default:
			return state;
	}
}
