const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materialSeriesSchema = new Schema({
    material: {type: Schema.Types.ObjectId, ref: 'Material'},
    series: {type: Schema.Types.ObjectId, ref: 'Series'}
});
materialSeriesSchema.index({material:1, series:1}, {unique: true});

mongoose.model('MaterialSeries', materialSeriesSchema);