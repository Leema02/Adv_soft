
const validateRole = (requiredRoles) => (req, res, next) => {
    if (!res.locals.user || !requiredRoles.includes(res.locals.user.role)) {
        return res.status(403).json({ error: "You do not have the required role to access this resource" });
    }
    next();
};


module.exports = validateRole;
