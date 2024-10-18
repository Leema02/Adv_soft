const Rent = require('../models/rent');


const calculateLateDays=async(rental)=>{

    if(rental.Status=='returned'){
    const currentDate = new Date();
    const endDate = new Date(rental.endDate);

    if (currentDate > endDate) {
        const lateDays = Math.ceil((currentDate - endDate) / (1000 * 60 * 60 * 24)); 
        rental.lateDays=lateDays;
        await rental.save();
      }
    }

}



module.exports={calculateLateDays}