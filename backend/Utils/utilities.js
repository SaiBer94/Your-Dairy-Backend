const jwt = require('jsonwebtoken');
const User = require('../Models/user.model');

const authToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        try {
            const user = await User.findById(decoded.userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            req.user = user;  // Attach the user to the request object
            console.log('User attached to request:', req.user);  // Debugging log
            next();
        } catch (error) {
            console.error('Error finding user:', error);  // Log error
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
};

module.exports = { authToken };
