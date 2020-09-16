export function throttle(fn, time){
  let timeout
  return (...arg) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...arg)
    }, time)
  }
}

export function fnDebounce(fn, time) {
  let canRun = true
  return (...arg) => {
    if (canRun) {
      canRun = false
      fn(...arg)
      setTimeout(() => {
        canRun = true
      }, time)
    }
  }
}
export function debounce(fn, time) {
  let canRun = true
  return (...arg) => {
    if (canRun) {
      canRun = false
      setTimeout(() => {
        fn(...arg)
        canRun = true
      }, time)
    }
  }
}
