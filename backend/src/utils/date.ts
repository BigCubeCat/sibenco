const dayDurationInSeconds: number = 86400;

// Функция возвращает интервал времени вокруг заданой даты (от начала суток до последней миллисикунды включительно) - date с отступами назад по времени - shiftBack
// и отступами вперёд - shiftForward. Отступы считаются в днях.
export const getInterval = (
  date: number,
  shiftBack: number,
  shiftForward: number,
) => {
  const resultInterval: Array<number> = [getBeginOfDay(date - dayDurationInSeconds * shiftBack),
    getEndOfDay(date + dayDurationInSeconds * shiftForward)];

  return resultInterval;
};

//возвращает начало суток, к которым принадлежит date  в unixtime 
export const getBeginOfDay = (date: number) => {
  return date - date % dayDurationInSeconds;
}

//возвращает последнюю миллисекунду суток, к которым принадлежит date  в unixtime 
export const getEndOfDay = (date: number) => {
  return date - date % dayDurationInSeconds + dayDurationInSeconds - 1;
}


export const todayDate = () => {
  return Date.now() / 1000;
};