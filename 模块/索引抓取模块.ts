import { test, Page } from '@playwright/test';
import { sleep, 下拉滚动条, 网络请求处理 } from '../库/playwright';
import { 获取网址 } from './翻译模块';
import { md5FirstChar } from '../库/hash'
import { AlpToNumber } from '../库/map'
import { generateId } from '../库/id'
import { 文章模型 } from '../数据模型/文章模型';
import { 数据库连接_wenya } from '../库/Mysql';
export enum 翻页方式 {
    '点击下一页' = '点击下一页',
    '点击页数' = '点击页数',
}

export type 索引抓取输入 = {
    page: Page;
    源语言: string;
    目标语言: string;
    网址: string;
    抓取函数: any;
    onBefore:any;
    下拉滚动条次数: number;
    waitForSelector: any;
    翻页配置: {
        是否有分页: boolean;
        翻页方式: 翻页方式;
        页数: number;
        页数模板?: string; //https://www.codenong.com/tag/python/page/__PAGE__/
        翻页选择器?: string;
        最大页数选择器?: string;
    };
    过滤网络请求: boolean;
    允许注入脚本: boolean;
}

export type 索引抓取输出 = Array<{
    title: string;
    href: string;
    summary: string;
    thumbnail: string;
}>

export async function 索引抓取(输入: 索引抓取输入): Promise<索引抓取输出> {
    let 索引抓取输出: 索引抓取输出 = [];
    let 翻页配置: any = {
        是否有分页: false,
        翻页方式: 翻页方式.点击下一页,
        页数: 1,
        页数模板: '',
        翻页选择器: '',
        最大页数选择器: '',
    };
    if (输入.翻页配置) {
        翻页配置 = {
            ...翻页配置,
            ...输入.翻页配置,
        }
    }

    let 索引抓取输入: 索引抓取输入 = {
        page: 输入.page,
        源语言: 输入.源语言,
        目标语言: 输入.目标语言,
        网址: 输入.网址,
        下拉滚动条次数: 输入.下拉滚动条次数,
        waitForSelector: 输入.waitForSelector,
        翻页配置: 翻页配置,
        过滤网络请求: 输入.过滤网络请求,
        允许注入脚本: 输入.允许注入脚本,
        抓取函数: 输入.抓取函数,
        onBefore:输入.onBefore
    };

    // console.log('索引抓取输入',{
    //     源语言: 输入.源语言,
    //     目标语言: 输入.目标语言,
    //     网址: 输入.网址,
    //     下拉滚动条次数: 输入.下拉滚动条次数,
    //     waitForSelector: 输入.waitForSelector,
    //     翻页配置: 翻页配置,
    //     过滤网络请求: 输入.过滤网络请求,
    //     允许注入脚本: 输入.允许注入脚本,
    //     抓取函数: 输入.抓取函数
    // })

    const 网址 = 获取网址(输入.网址,输入.源语言,输入.目标语言);
    console.log('网址', 网址)

    const response = await 索引抓取输入.page.goto(网址, { timeout: 50000 });
    if (response && response.request().redirectedFrom()) {
        return [];
    }

    await 索引抓取输入.page.waitForSelector(索引抓取输入.waitForSelector)

    if(索引抓取输入.过滤网络请求){
        await 网络请求处理(索引抓取输入.page);
    }

    if (索引抓取输入.允许注入脚本) {
        await 索引抓取输入.page.addScriptTag({
            path: './库/JavascriptFn.js'
        });
    }
    if(typeof 输入.onBefore  != 'undefined'){
        await 输入.onBefore(索引抓取输入.page)
    }
    await 下拉滚动条(索引抓取输入.page, 索引抓取输入.下拉滚动条次数);

    if (索引抓取输入.翻页配置.是否有分页) {
        //计算出最大页数
        const 分页节点数量 = await 输入.page.$$(索引抓取输入.翻页配置.翻页选择器);
        if (分页节点数量.length) {
            const 最大页数 = Math.max(
                1,
                parseInt(
                    await 索引抓取输入.page.$eval(
                        索引抓取输入.翻页配置.最大页数选择器,
                        (最大页数选择器: any) => {
                            return 最大页数选择器.innerText;
                        }
                    )
                )
            )

            for (let p = 1; p <= 最大页数; p++) {
                const 抓取结果: 索引抓取输出 = await 索引抓取输入.page.evaluate(索引抓取输入.抓取函数)
                索引抓取输出.push(...抓取结果);

                //翻页
                if (索引抓取输入.翻页配置.翻页方式 === 翻页方式.点击下一页) {
                    await 索引抓取输入.page.click(索引抓取输入.翻页配置.翻页选择器);
                } else {
                    //翻页方式为模板
                    const nextPage = 索引抓取输入.翻页配置.页数模板.replace(
                        '__PAGE__',
                        p.toString(),
                    );
                    await 索引抓取输入.page.goto(nextPage);
                }
            }

            await 索引抓取输入.page.waitForSelector(索引抓取输入.waitForSelector, {
                timeout: 50000
            });

        } else {
            const 抓取结果: 索引抓取输出 = await 索引抓取输入.page.evaluate(索引抓取输入.抓取函数)
            索引抓取输出.push(...抓取结果);
        }
    } else {
        const 抓取结果: 索引抓取输出 = await 索引抓取输入.page.evaluate(索引抓取输入.抓取函数)
        索引抓取输出.push(...抓取结果);
    }

    return 索引抓取输出;
}

export async function 索引入库(items: any,Site:any) {
    for (let href in items) {
        const tbNumber: any = md5FirstChar(href);
        const slug = `${AlpToNumber(tbNumber)}${await generateId()}`;

        const data = {
            slug: slug,
            site_id: Site.id,
            source: href,
            ...items[href]
        };
        const model = await 文章模型(
            tbNumber,
            数据库连接_wenya,
            Site.db
        );
        const res = await model.bulkCreate([data], {
            ignoreDuplicates: true,
        });
    }

}