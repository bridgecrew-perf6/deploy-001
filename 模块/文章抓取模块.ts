import { Page } from '@playwright/test';
import { sleep, 下拉滚动条, 网络请求处理 } from '../库/playwright';

export async function 在浏览器中运行代码(page: any, fn: Function) {
  try {
    console.log(fn)
    return await page.evaluate(fn);
  } catch (error) {
    throw new Error();
  }
}

export interface 文章页面抓取参数 {
  url: string;
  jsFn: Function;
  dropdownTimes: number;
  page: any;
  waitForSelector: string;
  允许注入脚本: boolean;
  过滤网络请求: boolean;
}

export type 文章抓取输入 = {
  page: Page;
  源语言: string;
  目标语言: string;
  网址: string;
  抓取函数: any;
  onBefore: any;
  下拉滚动条次数: number;
  waitForSelector: any;
  过滤网络请求: boolean;
  允许注入脚本: boolean;
}

export async function 获取文章页面数据(option: 文章抓取输入) {
  if (option.过滤网络请求) {
    await 网络请求处理(option.page, 8000);
  }
  //缺少内存到页面崩溃暂时无法解决:https://github.com/microsoft/playwright/issues/6202
  const response = await option.page.goto(option.网址, { timeout: 50000 });
  if (response.request().redirectedFrom()) {
    return false;
  }

  if (option.允许注入脚本) {
    await option.page.addScriptTag({
      path: './库/JavascriptFn.js'
    });
  }

  if (typeof option.onBefore != 'undefined') {
    console.log('onbefore')
    await option.onBefore(option.page)
  }

  await 下拉滚动条(option.page, option.下拉滚动条次数);
  
  await option.page.waitForLoadState("networkidle", {
    timeout: 99999999
  });

  if (option.waitForSelector) {
    await option.page.waitForSelector(option.waitForSelector, {
      timeout: 5000,
    });
  }

  return await 在浏览器中运行代码(option.page, option.抓取函数);
}