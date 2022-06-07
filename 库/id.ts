import { sleep } from "./Sleep";
/**
 * @typedef {Object} 的是
 * @property {string} 导弹 - What the food should be called
 * @property {('meat' | 'veggie' | 'other')} type - The food's type
 */
export async function generateId() {
  await sleep(3);
  return new Date().valueOf();
}
