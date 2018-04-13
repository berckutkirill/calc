const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fields = {
    material: {type: Schema.Types.ObjectId, ref: 'Material'},
    series: {type: Schema.Types.ObjectId, ref: 'Series'},
    model: {type: Schema.Types.ObjectId, ref: 'Model'},
    cloth: {type: Schema.Types.ObjectId, ref: 'Cloth'},
    box: {type: Schema.Types.ObjectId, ref: 'Box'},
    jamb: {type: Schema.Types.ObjectId, ref: 'Jamb'},
    dock: {type: Schema.Types.ObjectId, ref: 'Dock'},
    threshold: {type: Schema.Types.ObjectId, ref: 'Threshold'},
    portal: {type: Schema.Types.ObjectId, ref: 'Portal'},
    cornice_board: {type: Schema.Types.ObjectId, ref: 'CorniceBoard'},
    decorative_element: {type: Schema.Types.ObjectId, ref: 'DecorativeElement'},
    feigned_plank: {type: Schema.Types.ObjectId, ref: 'FeignedPlank'},
    fourth: {type: Schema.Types.ObjectId, ref: 'Fourth'},
};
const baseDoorSchema = new Schema(fields);

mongoose.model('baseDoor', baseDoorSchema);