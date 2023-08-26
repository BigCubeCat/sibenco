import {months} from "../properties/durations";
//функция переводит время из формата 'дд.мм.гг' в массив чисел [д,м,г]
const transformDateToNumber = (date: string) => Array.from(date.split("."), Number);

const transformDateToString = (date: Array<number>) => {
    let result = "";
    for (let i = 0; i < 3; i++)
        result = (date[i] < 10) ? result + "0" + String(date[i]) + "." : result + String(date[i]) + ".";
    return result.substring(0, result.length - 1);
}

const isLeap = (year: number) => {
    return year % 4 == 0 && year % 100 != 0;
}


// Функция считает следующий от данного дня, date в формате массива чисел [д,м,г]
const getNextDay = (date: Array<number>) => {
    if (date[0] == 31 && date[1] == 12) return [1, 1, date[2] + 1];
    else if (date[0] == 28 && date[1] == 2 && isLeap(date[2])) return [29,2,date[2]];
    else if (date[0] >= months[date[1]-1]) return [1,date[1]+1,date[2]];
    else return [date[0]+1,date[1],date[2]];
}

// Функция считает предыдущий от данного дня, date в формате массива чисел [д,м,г]
const getPreviousDay = (date: Array<number>) => {
    if (date[0] == 1 && date[1] == 1) return [31, 12, date[2] - 1];
    else if (date[0] == 1 && date[1] == 3 && isLeap(date[2])) return [29,2,date[2]];
    else if (date[0] == 1) return [months[date[1]-2],date[1]-1,date[2]];
    else return [date[0]-1,date[1],date[2]];
}

// Функция возвращает интервал времени вокруг заданой даты - date с отступами назад по времени - shiftBack
// и отступами вперёд - shiftForward. Отступы считаются в днях.
export const getInterval = (date: string, shiftBack: number, shiftForward: number) => {
    const resultInterval: Array<string> = [];
    const currentDateNumber = transformDateToNumber(date);
    let lastDate = currentDateNumber;
    for(let i = shiftBack; i > 0; i--) {
        const newDate = getPreviousDay(lastDate);
        resultInterval.push(transformDateToString(newDate));
        lastDate = newDate;
    }
    resultInterval.reverse();
    resultInterval.push(date);
    lastDate = currentDateNumber;
    for(let i = shiftForward; i > 0; i--) {
        const newDate = getNextDay(lastDate);
        resultInterval.push(transformDateToString(newDate));
        lastDate = newDate;
    }
    return resultInterval;
}


const addZero = (value: string)  => {
  if (value.length < 2) {
    return "0" + value;
  }
  return value;
}

export const todayDate = () => {
  const date = new Date();
  const day = addZero("" + date.getDate());
  const month = addZero("" + date.getMonth());
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

