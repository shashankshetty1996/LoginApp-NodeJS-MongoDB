const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const UserScheme = new Scheme({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  registered_on: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model('user', UserScheme);