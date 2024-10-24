const { createDelivery } = require('../models/delivery');

const requestDeliveryOrPickup = async (req, res) => {
  const { rentalId, method, estimatedDeliveryTime } = req.body;

  try {
    const [result] = await createDelivery(rentalId, method, estimatedDeliveryTime);

    res.status(200).json({
      message: `Logistics request for ${method === 'd' ? 'delivery' : 'pickup'} created successfully`,
      deliveryId: result
    });
  } catch (error) {
    console.error('Error creating delivery:', error);
    res.status(500).json({ error: 'Failed to create delivery or pickup request' });
  }
};

module.exports = {requestDeliveryOrPickup};