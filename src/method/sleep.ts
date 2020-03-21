/**
 * Generate a promise which resolves after the specified time (in ms)
 */
export async function sleep(time): Promise<void> {
   return new Promise((resolve) => {
      setTimeout(() => resolve(), time)
   }) as any
}
