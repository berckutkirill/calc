"use strict";
const LNG = {
    "height": "Высота",
    "width": "Ширина",
    "reinforced": "Усиленный",
    "patina": "Патина",
    "model": "Модель",
    "color": "Цвет",
    "glass": "Стекло",
    "lacobel": "Лакобель",
    "type": "Тип",
    "furnish": "Отделка",
    "dop": "Дополнительно",
    translate(key) {
        return this[key] ? this[key] : key;
    }
};
