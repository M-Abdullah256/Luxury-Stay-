const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET || 'secret123',
    {
      expiresIn: '30d' // Token 30 din tak valid rahega
    }
  );
};

module.exports = generateToken;