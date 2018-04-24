const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seriesModelSchema = new Schema({
    series: {type: Schema.Types.ObjectId, ref: 'Series'},
    model: {type: Schema.Types.ObjectId, ref: 'Model'}
});
seriesModelSchema.index({series:1, model:1}, {unique: true});

mongoose.model('SeriesModel', seriesModelSchema);