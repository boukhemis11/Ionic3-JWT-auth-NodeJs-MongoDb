const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const MotoSchema = new Schema({
    userid: {type:String, required: true},
    motodate: {type:Date, required: true},
    motodate2: {type:Date, required: true},
    mototype: {type:String, required: true},
    motoamt: {type:Number, required: true},
    motodesc: {type:String}
});


MotoSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('motos', MotoSchema, 'motos');
