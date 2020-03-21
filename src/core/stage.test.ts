import test from 'ava'
import { Stage } from '..'
import { Reporter } from './reporter'

const reporter = new Reporter()

interface Data {
   id: number
   name: string
}

test('methods `set()` and `get()` manages values', async (t) => {
   const stage = new Stage<Data>(reporter)
   stage.set('id', 100)
   stage.set('name', 'foo')
   const id = stage.get('id') // typescript should show `integer` type
   const name = stage.get('name') // typescript should show `string` type
   t.is(id, 100)
   t.is(name, 'foo')
})

test('method `sleep()` continues with timeout', async (t) => {
   const times = [0, 0, 0]
   const stage = new Stage<Data>(reporter)
   times[0] = Date.now()
   await stage.sleep(2000)
   times[1] = Date.now()
   await stage.sleep(2000)
   times[2] = Date.now()
   t.true(times[1] >= times[0] + 2000)
   t.true(times[2] >= times[0] + 4000)
})
