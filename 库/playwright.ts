import { Page } from "@playwright/test";

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function 下拉滚动条(page: Page, times: number) {
    for (let i = 0; i < times; i++) {
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
            console.log('下拉滚动条')
        }, []);
        await sleep(1000);
    }
}

export async function 网络请求处理(context: any, ResponseWaitTime = 0) {
    await context.route('**/*', async (route: any) => {
      //html等文档类型的请求直接通过
      if (['document'].includes(route.request().resourceType())) {
        return route.continue();
      }
  
      //直接过滤不需要的类型
      if (
        [
          'stylesheet',
          'media',
          'font',
          'other',
          'texttrack',
          'eventsource',
          'websocket',
          'manifest',
        ].includes(route.request().resourceType())
      ) {
        return route.abort();
      }
  
      //超时的图片,JS等请求直接屏蔽
      const requestUrl = route.request().url();
      if (ResponseWaitTime) {
        try {
          await context.waitForResponse(requestUrl, {
            timeout: ResponseWaitTime,
          });
        } catch (error) {
          return route.abort();
        }
      }
  
      return route.continue();
  
      // if ([
      //     "https://pagead2.googlesyndication.com",
      //     "https://googleads.g.doubleclick.net",
      //     "https://tpc.googlesyndication.com",
      //     "https://googleads.g.doubleclick.net",
      //     "https://www.google-analytics.com",
      //     "https://partner.googleadservices.com",
      //     "https://adservice.google.com",
      //     "https://adservice.google.com.hk",
      //     "https://fonts.googleapis.com",
      //     "https://www.gstatic.com",
      //     "https://www.googletagmanager.com",
      //     "https://www.googletagservices.com",
      //     "https://www.gstatic.cn",
      //     "https://fonts.gstatic.com",
      //     "https://www.gravatar.com"
      // ].includes((new URL(route.request().url())).origin)) {
      //     return route.abort()
      // } else {
      //     return route.continue()
      // }
    });
    context.on('request', async (request: any) => {
      // await context.waitForResponse((request:any) => request.url() === 'https://example.com' && request.method() === 'GET')
    });
    context.on('requestfailed', (request: any) => {});
    context.on('requestfinished', (request: any) => {});
    context.on('response', (response: any) => {
      // if (
      //     response.request().resourceType() === "document" &&
      //     response.status() != 200
      // ) {
      //     // throw new Exceptio(JSON.stringify({
      //     //     action:'delete',
      //     //     msg:"status != 200"
      //     // }));
      // }
    });
  }