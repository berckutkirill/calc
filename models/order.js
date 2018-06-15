const mongoose = require('mongoose');
const Config = mongoose.model('Config');
const Schema = mongoose.Schema;

const fields = {
    width: {type:Number, title:'Ширина',},
    height: {type:Number, title:'Высота'},
    cloth: {type: Schema.Types.ObjectId, ref: 'Cloth', title: "Полотно"},
    box: {type: Schema.Types.ObjectId, ref: 'Box', title: "Коробка"},
    jamb: {type: Schema.Types.ObjectId, ref: 'Jamb', title: "Наличник"},
    dock: {type: Schema.Types.ObjectId, ref: 'Dock', title: "Доборы"},
    feigned_plank: {type: Schema.Types.ObjectId, ref: 'FeignedPlank', title: "Притворная планка"},
    threshold: {type: Schema.Types.ObjectId, ref: 'Threshold',  title: "Порог"},
    portal: {type: Schema.Types.ObjectId, ref: 'Portal', title: "Портал"},
    cornice_board: {type: Schema.Types.ObjectId, ref: 'CorniceBoard', title: "Карнизная доска"},
    decorative_element: {type: Schema.Types.ObjectId, ref: 'DecorativeElement', title: "Декоративные элементы"},
    fourth: {type: Schema.Types.ObjectId, ref: 'Fourth', title: "Четверть"},
    prices: Array,
    totalPrice: Number
};
const orderSchema = new Schema(fields);
