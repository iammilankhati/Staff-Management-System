import './App.css';
import Register from './pages/register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';

function App() {
	return (
		<div className='App'>
			<Router>
				<Routes>
					<Route path='/home' element={<Home />} />
					<Route path='/register' element={<Register />} />
					<Route path='/login' element={<Login />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
