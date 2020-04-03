
function numAddZero(num) {
  return num < 10 ? `0${num}` : `${num}`
}

export const timestampFilter = (timestamp: string) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = numAddZero(date.getMonth() + 1)
  const day = numAddZero(date.getDate())
  const hour = numAddZero(date.getHours())
  const minute = numAddZero(date.getMinutes())
  const second = numAddZero(date.getSeconds())
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
