const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

// env variables path setup
dotenv.config({ path: 'backend/config/config.env' });

//Connecting to database
connectDatabase();
//Listen the server
app.listen(process.env.PORT, () => {
	console.log(
		`Server is listening on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
	);
});
