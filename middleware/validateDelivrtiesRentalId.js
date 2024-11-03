const validateRentalId = (req, res, next) => {
  const { rentalId } = req.params;

  if (!rentalId || isNaN(rentalId)) {
    return res.status(400).json({ error: "Invalid rentalId parameter. It must be a number." });
  }

  next();
};

module.exports = validateRentalId;
