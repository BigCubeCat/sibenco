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