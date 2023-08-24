"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterval = void 0;
var durations_1 = require("../properties/durations");
//функция переводит время из формата 'дд.мм.гг' в массив чисел [д,м,г]
var transformDateToNumber = function (date) { return Array.from(date.split("."), Number); };
var transformDateToString = function (date) {
    var result = "";
    for (var i = 0; i < 3; i++)
        result = (date[i] < 10) ? result + "0" + String(date[i]) + "." : result + String(date[i]) + ".";
    return result.substring(0, result.length - 1);
};
var isLeap = function (year) {
    return year % 4 == 0 && year % 100 != 0;
};
// Функция считает следующий от данного дня, date в формате массива чисел [д,м,г]
var getNextDay = function (date) {
    if (date[0] == 31 && date[1] == 12)
        return [1, 1, date[2] + 1];
    else if (date[0] == 28 && date[1] == 2 && isLeap(date[2]))
        return [29, 2, date[2]];
    else if (date[0] >= durations_1.months[date[1] - 1])
        return [1, date[1] + 1, date[2]];
    else
        return [date[0] + 1, date[1], date[2]];
};
// Функция считает предыдущий от данного дня, date в формате массива чисел [д,м,г]
var getPreviousDay = function (date) {
    if (date[0] == 1 && date[1] == 1)
        return [31, 12, date[2] - 1];
    else if (date[0] == 1 && date[1] == 3 && isLeap(date[2]))
        return [29, 2, date[2]];
    else if (date[0] == 1)
        return [durations_1.months[date[1] - 2], date[1] - 1, date[2]];
    else
        return [date[0] - 1, date[1], date[2]];
};
// Функция возвращает интервал времени вокруг заданой даты - date с отступами назад по времени - shiftBack
// и отступами вперёд - shiftForward. Отступы считаются в днях.
var getInterval = function (date, shiftBack, shiftForward) {
    var resultInterval = [];
    var currentDateNumber = transformDateToNumber(date);
    var lastDate = currentDateNumber;
    for (var i = shiftBack; i > 0; i--) {
        var newDate = getPreviousDay(lastDate);
        resultInterval.push(transformDateToString(newDate));
        lastDate = newDate;
    }
    resultInterval.reverse();
    resultInterval.push(date);
    lastDate = currentDateNumber;
    for (var i = shiftForward; i > 0; i--) {
        var newDate = getNextDay(lastDate);
        resultInterval.push(transformDateToString(newDate));
        lastDate = newDate;
    }
    return resultInterval;
};
exports.getInterval = getInterval;
console.log((0, exports.getInterval)('01.01.504', 4, 4));
