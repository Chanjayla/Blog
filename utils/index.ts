export * from './optimize'

export function transScroll(
  top: number,
  speed = 100,
  element = document.documentElement
) {
  const scrollTop = element.scrollTop
  const direct = scrollTop < top ? 1 : -1
  function repeatScroll(tempTop: number) {
    if (direct * tempTop > direct * top) {
      return
    }
    tempTop = tempTop + speed * direct
    element.scrollTo(0, tempTop)
    setTimeout(() => {
      repeatScroll(tempTop)
    }, 16)
  }
  repeatScroll(scrollTop)
}
