module.exports = (req, res, next) => {
    if (req.user && req.user.role === 'staff') {
        next();
    } else {
        res.status(403).json({ message: 'Staff only.' });
    }
}; 