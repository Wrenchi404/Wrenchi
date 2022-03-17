const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
    userID: {
        type: mongoose.SchemaTypes.String,
    },
    money: {
        type: mongoose.SchemaTypes.Number,
        default: 1000
    },
    inventory: [{
        food: [{
            id: { type: mongoose.SchemaTypes.Number },
            name: { type: mongoose.SchemaTypes.String },
            amount: { type: mongoose.SchemaTypes.Number },
        }]
    }]
});

module.exports = mongoose.model("inventory", InventorySchema);