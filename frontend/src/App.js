import './App.css';
import Register from './pages/register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';

function App() {
	return (
		<div className='App'>
			<Router>
				<Routes>
					<Route path='/register' element={<Register />} />
					<Route path='/login' element={<Login />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
