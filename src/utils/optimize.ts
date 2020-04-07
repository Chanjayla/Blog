export function throttle(fn: Function, time: number): Function {
    let timeout:any = null
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn.call(null, arguments)
        },time)
    }
}

export function debounce(fn: Function, time: number): Function{
    let canRun: boolean = true
    return function() {
        if(canRun) {
            canRun = false
            setTimeout(() => {
                fn.call(null, arguments)
                canRun = true
            })
        }
    }
}