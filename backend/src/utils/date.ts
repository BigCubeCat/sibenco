const dayDurationInMilliseconds = 86400000;

// Функция возвращает интервал времени вокруг заданой даты (от начала суток до последней миллисикунды включительно) - date с отступами назад по времени - shiftBack
// и отступами вперёд - shiftForward. Отступы считаются в днях.
export const getInterval = (
  date: number,
  shiftBack: number,
  shiftForward: number,
) => {
  const resultInterval: Array<number> = [getBeginOfDay(date - dayDurationInMilliseconds * shiftBack),
  getEndOfDay(date + dayDurationInMilliseconds * shiftForward)];

  return resultInterval;
};

//возвращает начало суток, к которым принадлежит date  в unixtime 
export const getBeginOfDay = (date: number) => {
  return date - date % dayDurationInMilliseconds;
}
//возвращает последнюю миллисекунду суток, к которым принадлежит date  в unixtime 
export const getEndOfDay = (date: number) => {
  return date - date % dayDurationInMilliseconds + dayDurationInMilliseconds - 1;
}

const addZero = (value: string) => {
  if (value.length < 2) {
    return '0' + value;
  }
  return value;
};

export const todayDate = () => {
  return Date.now() / 1000;
};