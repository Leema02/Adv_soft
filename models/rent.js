const { DataTypes } = require("sequelize");
const { sequelize } = require("./config.js");

const Rental = sequelize.define("rent", {
  rentalId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  itemtId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Items",
      key: "itemId",
    },
   
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },

  customerId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "UID",
    },

    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },

  expertId: {
    type: DataTypes.INTEGER,
    references: {
      model: "experts",
      key: "expertId",
    },

    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  damageFee:{
    type: DataTypes.DOUBLE,
    defaultValue:0.0,
  },
  lateDays:{
    type: DataTypes.INTEGER,
    defaultValue:0,
  },
  Status: {
    type: DataTypes.STRING,//good (owner) inspect(expert --> damaged good) owner(rented) returned
  }

});


const findRentalById=async(id)=>{
  const sqlQuery = `SELECT * from rents where rentalId =:id `;

  const result = await sequelize.query(sqlQuery, {
      replacements: { id },
      type: QueryTypes.SELECT,
  });
  console.log("Query result:", result);

  return result[0];
}

const findAllRentalItemIn=async(itemId, currentEndDate, newEndDate)=>{

  const sqlQuery = `SELECT * FROM rents
   WHERE itemId = :itemId  AND status = 'accepted'
   AND ((startDate < :newEndDate AND endDate > :currentEndDate)
   OR (startDate >= :currentEndDate AND endDate <= :newEndDate)); `;

  const result = await sequelize.query(sqlQuery, {
      replacements: { itemId,newEndDate,currentEndDate },
      type: QueryTypes.SELECT,
  });
  console.log("Query result:", result);

  return result;
}

const updateEndDate=async(rentalId,newEndDate)=>{
    const sqlQuery = `UPDATE rents SET endDate = :newEndDate, WHERE rentalId= :rentalId; `;

    const result = await sequelize.query(sqlQuery, {
    replacements: { newEndDate,rentalId },
    type: QueryTypes.UPDATE,
    });
    console.log("Query result:", result);

    return result;
}

const rentAdd = async (customerId,itemId,expertId,startDate,endDate) => {

  const result=await sequelize.query(
    `INSERT INTO Rents (customerId, itemtId, expertId, startDate, endDate, Status)
     VALUES (:customerId, :itemId, :expertId, :startDate, :endDate, 'pending')`,
    { replacements: {customerId,itemId,expertId,startDate,endDate,},
    type: sequelize.QueryTypes.INSERT,});

  console.log("Rental successfully added");
  return result;
};



const fetchConflictingRentals = async (itemId, startDate, endDate) => {
  const sqlQuery = `
      SELECT startDate, endDate
      FROM Rents
      WHERE itemtId = :itemId
      AND Status != 'rejected'
      AND (
          (startDate < :endDate AND endDate > :startDate)
      )
      ORDER BY startDate;
  `;

  return await sequelize.query(sqlQuery, {
      replacements: { itemId, startDate, endDate },
      type: sequelize.QueryTypes.SELECT,
  });
};

const hasConflictingRentals = (conflictingRentals) => {
  return conflictingRentals.length > 0;
};

const calculateAvailablePeriods = (conflictingRentals, startDate, endDate) => {
  const availablePeriods = [];
  let previousEnd = new Date(startDate); 

  for (const rental of conflictingRentals) {
      const rentalStart = new Date(rental.startDate);
      const rentalEnd = new Date(rental.endDate);

      if (previousEnd < rentalStart) {
          availablePeriods.push({
              availableStart: previousEnd,
              availableEnd: rentalStart,
          });
      }
      previousEnd = rentalEnd > previousEnd ? rentalEnd : previousEnd;
  }

  if (previousEnd < new Date(endDate)) {
      availablePeriods.push({
          availableStart: previousEnd,
          availableEnd: new Date(endDate),
      });
  }

  return {availablePeriods,previousEnd};
};

const checkAvailableRent = async (itemId, startDate, endDate) => {
  const conflictingRentals = await fetchConflictingRentals(itemId, startDate, endDate);

  if (!hasConflictingRentals(conflictingRentals)) {
      return { available: true }; 
  }

  const { availablePeriods, previousEnd } = calculateAvailablePeriods(conflictingRentals, startDate, endDate);

  if (availablePeriods.length === 0) {
      return {
          available: false,
          availablePeriods: [],
          futureRentals: "You can rent the item after the last conflicting rental, starting from " + previousEnd.toISOString(),
      };
  }

  return {
      available: false,
      availablePeriods,
      futureRentals: "You can rent the item after the last conflicting rental, starting from " + previousEnd.toISOString(),
  };
};



module.exports = {Rental,findRentalById,findAllRentalItemIn,updateEndDate,rentAdd,checkAvailableRent};
