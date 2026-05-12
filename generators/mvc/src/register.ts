// generators/mvc/src/register.ts

import {
    registerGenerator
} from '@arch/core'

import {
    mvcGenerator
} from './mvc-generator.js'

export function registerMvcGenerator(): void {

    registerGenerator(
        mvcGenerator
    )
}