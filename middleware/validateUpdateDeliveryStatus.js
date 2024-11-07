const validateUpdateDeliveryStatus = (req, res, next) => {
    const { deliveryId } = req.params;
    const { status } = req.body;

    if (!deliveryId || isNaN(deliveryId)) {
        return res.status(400).json({ error: "Invalid deliveryId parameter. It must be a number." });
    }

    const validStatuses = ['pending', 'in progress', 'completed'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status. Accepted values are 'pending', 'in progress', or 'completed'." });
    }

    next();
};

module.exports = validateUpdateDeliveryStatus;
