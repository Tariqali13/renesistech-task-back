const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String,
	},
	google_id: {
		type: String,
	}
});

userSchema.set('timestamps', true);
module.exports = mongoose.model('users', userSchema);
