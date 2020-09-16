export * from "./optimize";

export function transScroll(
  top,
  speed = 100,
  element = document.documentElement
) {
  const scrollTop = element.scrollTop;
  const direct = scrollTop < top ? 1 : -1;
  function repeatScroll(tempTop) {
    if (direct * tempTop > direct * top) {
      return;
    }
    tempTop = tempTop + speed * direct;
    element.scrollTo(0, tempTop);
    setTimeout(() => {
      repeatScroll(tempTop);
    }, 16);
  }
  repeatScroll(scrollTop);
}

export function compileNuxtRouter(routes) {
  const result = {}
  routes.forEach((route) => {
    const res = route.path.match(/(?<=\/admin\/)[^:]+$/)
    if (!!res && res[0] !== 'login') {
      const list = res[0].split('/')
      const key = list[0]
      if (list.length > 1) {
        result[key] ? result[key].children.push({
          name: list[list.length - 1],
          path: route.path
        }) : (result[key] = {
          children: [{
            name: list[list.length - 1],
            path: route.path
          }]
        })
      } else {
        result[key] = {
          name: res[0],
          path: route.path
        }
      }
    }
  })
  // console.log(result)
}

export function transFileToText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = function(evt) {
      console.log('load text:', evt)
      resolve(evt.target.result)
    }
  })
}

