// imports
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    artikkelnummer : {
        type : Number,
        unique : true,
        required : true
    },
    modell : {
        type : String,
        required : true
    },
    merke : {
        type : String,
        required : true
    },
    pris : {
        type : Number,
        required : true
    },
    tittel : {
        type : String,
        unique : true,
        required : true
    },
    dato : {
        type : Date,
        required : true
    },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;