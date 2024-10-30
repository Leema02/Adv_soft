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


const { getDeliveryStatusByRentalId } = require('../models/delivery');
const trackDeliveryStatus = async (req, res) => {
  const { rentalId } = req.params;

  try {
    const deliveryStatus = await getDeliveryStatusByRentalId(rentalId);

    if (deliveryStatus.length === 0) {
      return res.status(404).json({ message: 'No delivery found for this rental ID.' });
    }

    res.status(200).json(deliveryStatus[0]);
  } catch (error) {
    console.error('Error fetching delivery status:', error);
    res.status(500).json({ error: 'Failed to retrieve delivery status.' });
  }
};


const { updateDeliveryStatusInDB } = require('../models/delivery');
const updateDeliveryStatus = async (req, res) => {
    const { deliveryId } = req.params;
    const { status } = req.body;

    try {
        const result = await updateDeliveryStatusInDB(deliveryId, status);

        if (result[0] === 0) { // If no rows were affected, it means deliveryId wasn't found
            return res.status(404).json({ error: 'Delivery not found or no changes made' });
        }

        res.status(200).json({ message: `Delivery status updated successfully to ${status}` });
    } catch (error) {
        console.error('Error updating delivery status:', error);
        res.status(500).json({ error: 'Failed to update delivery status' });
    }
};

module.exports = { requestDeliveryOrPickup, trackDeliveryStatus, updateDeliveryStatus };