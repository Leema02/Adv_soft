
const validateRole = (requiredRole) => (req, res, next) => {
    if (!res.locals.user || res.locals.user.role !== requiredRole) {
        return res.status(403).json({ error: "You do not have the required role to access this resource" });
    }
    next();
};

module.exports = validateRole;
