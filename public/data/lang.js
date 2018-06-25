"use strict";
const LNG = {
    "height": "Высота",
    "width": "Ширина",
    "reinforced": "Усиленный",
    "feigned_plank": "Притворная планка",
    "cornice_board": "Корнизная доска",
    "portal": "Портал",
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
