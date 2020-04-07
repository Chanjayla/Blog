let hoverDetailFn: EventListener
let leaveDetailFn: EventListener
let detailTimer: NodeJS.Timeout
const DETAIL_TIME = 1000
export const textdetail = {
    inserted(el: HTMLElement): void {
        if (el.scrollHeight > el.clientHeight) {
            let detail: HTMLElement
            el.addEventListener('mouseover', hoverDetailFn = () => {
                const parent: HTMLElement | null = el.parentElement
                if (parent) {
                    if (!detail) {
                        parent.style.position = 'relative'
                        detail = document.createElement('span')
                        detail.style.cssText += `
                          box-sizing: border-box;
                          position: absolute;
                          left: 0;
                          top: ${el.offsetTop + el.offsetHeight + 5}px;
                          width: ${el.offsetWidth}px;
                          padding: 10px;
                          background-color: #fff;
                          border: 1px solid #eee;
                          border-radius: 5px;
                          transition: all .2s ease;
                          opacity: 0;
                          z-index: -1;                        `
                        detail.innerText = el.innerText
                        el.appendChild(detail)
                    }
                    detailTimer = setTimeout(() => {
                        detail.style.opacity = '1'
                        detail.style.zIndex = '2'
                    }, DETAIL_TIME)
                }
            })
            el.addEventListener('mouseleave', leaveDetailFn = () => {
                if (detail) {
                    clearTimeout(detailTimer)
                    detail.style.opacity = '0'
                    detail.style.zIndex = '-1'
                }
            })
        }
    },
    unbind(el: HTMLElement) {
        el.removeEventListener('mouseover', hoverDetailFn)
        el.removeEventListener('mouseleave', leaveDetailFn)
    }
}
