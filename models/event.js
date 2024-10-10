const {DataTypes, QueryTypes} = require("sequelize");
const { sequelize } = require("./config.js");

const event = sequelize.define('Event', {
    eventId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    catId: {
        type: DataTypes.INTEGER,
        references: {
            model: "categories",
            key: "catId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    eventName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    discountPercentage: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue:0,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: false,
});

const getEventsByCatId = async (catId) => {
    const currentTime = new Date(); 
    const sqlQuery = `
        SELECT * 
        FROM Events 
        WHERE catId = :catId 
        AND :currentTime BETWEEN startDate AND endDate
    `;

    const result = await sequelize.query(sqlQuery, {
        replacements: { 
            catId, 
            currentTime 
        },
        type: QueryTypes.SELECT,
    });

    console.log("Query result:", result);

    return result;
};

const addEvent=async(eventName, discountPercentage, startDate,endDate,catId)=>{
    const sqlQuery = `
     INSERT INTO
     Events (eventName, discountPercentage, startDate,endDate,catId)
      VALUES ( :eventName,:discountPercentage,:startDate,:endDate,:catId )`;

    const results = await sequelize.query(sqlQuery, {
    replacements: {eventName, discountPercentage, startDate,endDate,catId},
    type: QueryTypes.INSERT
    })
    
    return results;

}

const findEventByPk=async(id)=>{
    const sqlQuery = `SELECT * FROM Events WHERE eventId = :id `;

    const result = await sequelize.query(sqlQuery, {
    replacements: { id },
    type: QueryTypes.SELECT,
});

console.log("Query result:", result);

return result[0];
}

const updateEvent=async(id, updateData) => {
    const fields = [];
    const replacements = { id };

    if (updateData.catId) {
        fields.push(`catId = :catId`);
        replacements.catId = updateData.catId;
    }
    if (updateData.eventName) {
        fields.push(`eventName = :eventName`);
        replacements.eventName = updateData.eventName;
    }
    if (updateData.discountPercentage) {
        fields.push(`discountPercentage = :discountPercentage`);
        replacements.discountPercentage = updateData.discountPercentage;
    }
    if (updateData.startDate) {
        fields.push(`startDate = :startDate`);
        replacements.startDate = updateData.startDate;
    }
    if (updateData.endDate) {
        fields.push(`endDate = :endDate`);
        replacements.endDate = updateData.endDate;
    }
   

    const sqlQuery = `
        UPDATE events 
        SET 
            ${fields.join(', ')}
        WHERE eventId = :id
    `;

    await sequelize.query(sqlQuery, {
        replacements,
        type: QueryTypes.UPDATE
    });
};

const deleteEventById = async (id) => {
    const sqlQuery = `DELETE FROM events WHERE eventId=:id`;

    const results = await sequelize.query(sqlQuery, {
        replacements: {id},
        type: QueryTypes.DELETE
    });

    return results;
};
const listEvent=async()=>{
    const sqlQuery = `SELECT * FROM Events `;

    const result = await sequelize.query(sqlQuery, {
    type: QueryTypes.SELECT,
});

console.log("Query result:", result);

return result;

}

module.exports = {event,getEventsByCatId,addEvent,findEventByPk,updateEvent,deleteEventById,listEvent};
