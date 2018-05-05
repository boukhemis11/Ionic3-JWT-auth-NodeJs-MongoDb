const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const VoitureSchema = new Schema({
    userid: {type:String, required: true},
    voituredate: {type:Date, required: true},
    voituredate2: {type:Date, required: true},
    voituretype: {type:String, required: true},
    voitureamt: {type:Number, required: true},
    voituredesc: {type:String}
});


VoitureSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('voitures', VoitureSchema, 'voitures');
