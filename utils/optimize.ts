export function throttle(fn: Function, time: number): Function {
  let timeout: NodeJS.Timeout
  return (...arg: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...arg)
    }, time)
  }
}

export function fnDebounce(fn: Function, time: number): Function {
  let canRun = true
  return (...arg: any) => {
    if (canRun) {
      canRun = false
      fn(...arg)
      setTimeout(() => {
        canRun = true
      }, time)
    }
  }
}
export function debounce(fn: Function, time: number): Function {
  let canRun = true
  return (...arg: any) => {
    if (canRun) {
      canRun = false
      setTimeout(() => {
        fn(...arg)
        canRun = true
      }, time)
    }
  }
}
