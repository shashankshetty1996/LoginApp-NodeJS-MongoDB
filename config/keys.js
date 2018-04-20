module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost/login-dev',
  secretOrKey: process.env.SECRET_OR_KEY || 'shashank'
};