import { createDecorator } from 'vue-class-component'

export const Detail = createDecorator((options, key) => {
    console.log(options)
    console.log(`key:${key}`)
})
