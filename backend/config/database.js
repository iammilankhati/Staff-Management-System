const mongoose = require('mongoose');

const connectDatabase = () => {
	mongoose
		.connect(process.env.DB_URI)
		.then((con) => {
			console.log(
				`Mongodb datbase connected successfully with host ${con.connection.host}`
			);
		})
		.catch((error) => {
			console.log(error);
		});
};

module.exports = connectDatabase;
