import { Stage } from './stage'
import { AssertionNote } from './type'
import { throws } from '../assert/throws'
import { deepEqual } from '../assert/deepEqual'
import { sleep } from '../method/sleep'

let is = Object.is

/**
 *
 */
interface AssertionRecipe {
   assertion: string
   handler: () => boolean | Promise<boolean>
   message?: string
}

/**
 *
 */
export class Context<Data = {}> {
   protected data: Data = {} as any
   public stage: Stage<Data>

   /**
    *
    */
   public constructor(stage: Stage<Data>) {
      this.stage = stage
   }

   /**
    *
    */
   public get<Key extends keyof Data>(k: Key) {
      return this.data[k] || this.stage.get(k)
   }

   /**
    *
    */
   public set<Key extends string, Value>(k: Key, v: Value) {
      ;(this.data as any)[k] = v
   }

   /**
    *
    */
   public pass(message?: string) {
      return this.assert({
         assertion: 'pass',
         handler: () => true,
         message,
      })
   }

   /**
    *
    */
   public fail(message?: any) {
      return this.assert({
         assertion: 'fail',
         handler: () => false,
         message,
      })
   }

   /**
    *
    */
   public true(value: any, message?: string) {
      return this.assert({
         assertion: 'true',
         handler: () => !!value,
         message,
      })
   }

   /**
    *
    */
   public false(value: any, message?: string) {
      return this.assert({
         assertion: 'false',
         handler: () => !value,
         message,
      })
   }

   /**
    *
    */
   public is(value: any, expected: any, message?: string) {
      return this.assert({
         assertion: 'is',
         handler: () => Object.is(value, expected),
         message,
      })
   }

   /**
    *
    */
   public notIs(value: any, expected: any, message?: string) {
      return this.assert({
         assertion: 'not',
         handler: () => !Object.is(value, expected),
         message,
      })
   }

   /**
    *
    */
   public throws(fn: () => any, message?: string) {
      return this.assert({
         assertion: 'throws',
         handler: () => throws(fn),
         message,
      })
   }

   /**
    *
    */
   public notThrows(fn: () => any, message?: string) {
      return this.assert({
         assertion: 'notThrows',
         handler: () => {
            const res = throws(fn)
            if (res instanceof Promise) {
               return res.then((res) => !res)
            } else {
               return !res
            }
         },
         message,
      })
   }

   /**
    *
    */
   public regex(exp: RegExp, value: string, message?: string) {
      return this.assert({
         assertion: 'regex',
         handler: () => exp.test(value),
         message,
      })
   }

   /**
    *
    */
   public notRegex(exp: RegExp, value: string, message?: string) {
      return this.assert({
         assertion: 'notRegex',
         handler: () => !exp.test(value),
         message,
      })
   }

   /**
    *
    */
   public deepEqual(value: any, expected: any, message?: string) {
      return this.assert({
         assertion: 'deepEqual',
         handler: () => deepEqual(value, expected),
         message,
      })
   }

   /**
    *
    */
   public notDeepEqual(value: any, expected: any, message?: string) {
      return this.assert({
         assertion: 'notDeepEqual',
         handler: () => !deepEqual(value, expected),
         message,
      })
   }

   /**
    *
    */
   public async sleep(time: number) {
      return sleep(time)
   }

   /**
    *
    */
   protected assert(recipe: AssertionRecipe) {
      const success = recipe.handler()

      const buildResult = (success: boolean) => {
         return {
            type: 'AssertionNote',
            message: recipe.message,
            assertion: recipe.assertion,
            success: !!success,
         } as AssertionNote
      }
      const printResult = (result: AssertionNote) => {
         this.stage.reporter.note(result)
         return result
      }

      if (success instanceof Promise) {
         return success.then((success) => {
            const result = buildResult(success)
            return printResult(result)
         })
      } else {
         const result = buildResult(success)
         return printResult(result)
      }
   }
}
