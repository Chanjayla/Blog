let hoverDetailFn: EventListener
let leaveDetailFn: EventListener
let detailTimer: number|undefined
const DETAIL_TIME: number = 1000
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
                        detail.style.boxSizing = 'border-box'
                        detail.innerText = el.innerText
                        detail.style.position = 'absolute'
                        detail.style.left = '0'
                        detail.style.top = `${el.offsetTop + el.offsetHeight + 5}px`
                        detail.style.width = `${el.offsetWidth}px`
                        detail.style.padding = '10px'
                        detail.style.background = '#fff'
                        detail.style.zIndex = '-1'
                        detail.style.border = '1px solid #eee'
                        detail.style.borderRadius = '5px'
                        detail.style.transition = 'opacity .5s ease'
                        detail.style.opacity = '0'
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
