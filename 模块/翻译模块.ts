import { chromium } from '@playwright/test';
export const 谷歌翻译语言映射 = new Map();
谷歌翻译语言映射.set('zh', 'zh-CN');
谷歌翻译语言映射.set('en', 'en');
谷歌翻译语言映射.set('ja', 'ja');
谷歌翻译语言映射.set('ru', 'ru');
谷歌翻译语言映射.set('es', 'es');
谷歌翻译语言映射.set('ko', 'ko');
谷歌翻译语言映射.set('ar', 'ar');
谷歌翻译语言映射.set('id', 'id');
谷歌翻译语言映射.set('fr', 'fr');
谷歌翻译语言映射.set('pt', 'pt');
谷歌翻译语言映射.set('tr', 'tr');
谷歌翻译语言映射.set('vi', 'vi');
谷歌翻译语言映射.set('de', 'de');
谷歌翻译语言映射.set('fa', 'fa');//波斯语
谷歌翻译语言映射.set('th', 'th');//泰语
谷歌翻译语言映射.set('it', 'it');

export enum 翻译方式 {
  "翻译文本段落" = "翻译文本段落",
  "翻译网址" = "翻译网址"
}

export function 获取网址(网址: string, 源语言: string, 目标语言: string) {
  return 网址;
  if (源语言 === 目标语言) {
    return 网址;
  }
  源语言 = 谷歌翻译语言映射.get(源语言);
  目标语言 = 谷歌翻译语言映射.get(目标语言);
  //https://www-zhihu-com.translate.goog/question/279561312?_x_tr_sl=en&_x_tr_tl=zh-CN&_x_tr_hl=zh-CN&_x_tr_pto=wapp
  //https://www-huati365-com.translate.goog/article/1111652954608483
  const queryString =
    `?_x_tr_sl=${源语言}&_x_tr_tl=${目标语言}&_x_tr_hl=${源语言}&_x_tr_pto=wapp`;
  const urlObj = new URL(网址);
  let host = urlObj.origin.replace('.', '-');
  host = host.replace('.', '-');
  const path = urlObj.pathname;
  return `${host}.translate.goog${path}${queryString}`;
}


export async function getTranslateText(text: string, lang = 'en') {
  const browser = await chromium.launch({
    headless: true,
    args: [],
  });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  const url = `https://translate.google.cn/?sl=zh-CN&tl=${lang}&text=${encodeURIComponent(
    text,
  )}&op=translate`;
console.log('url',url)
  await page.goto(url, {timeout: 10000});

  const selector = `span[data-language-for-alternatives]`;
  await page.waitForSelector(selector, { timeout: 50000 });
  const translation = await page.evaluate(
    () =>
      (<HTMLElement>(
        document.querySelector(`span[data-language-for-alternatives]`)
      )).innerText,
  );
  console.log('翻译中....',translation);
  await page.close();
  await context.close();
  await browser.close();
  return translation;
}
