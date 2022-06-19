import { test } from '@playwright/test';
import { Op } from "sequelize";
import moment from "moment";
import { 文章模型 } from '../../数据模型/文章模型';
import { 数据库连接_wenya } from '../../库/Mysql';
import { getTranslateText, 翻译方式, 获取网址 } from '../../模块/翻译模块';
import {DB, ID, KEY, LANG_FROM, LANG_TO, SHOULD_TRANSLATE, 滚动条下拉次数,} from "./config";
import { 获取文章页面数据 } from '../../模块/文章抓取模块';
import TencentCos from '../../库/TencentCos';
import { 标签模型 } from '../../数据模型/标签模型';
import { generateId } from '../../库/id';
import { 标签文章模型 } from '../../数据模型/标签文章模型';
import { sleep } from '../../库/playwright';


async function 抓取前需要运行的代码 (page: any) {
    await page.evaluate(() => {
        window.scrollTo(0, 30);
        window.scrollTo(0, 100);
        window.scrollTo(0, 150);
        window.scrollTo(0, 200);
        window.scrollTo(0, 300);
        window.scrollTo(0, 350);
        window.scrollTo(0, 450);
        window.scrollTo(0, document.body.scrollHeight);
    }, []);
}

function 抓取数据的代码() {
    window.scrollTo(0, 30);
    window.scrollTo(0, 100);
    window.scrollTo(0, 150);
    window.scrollTo(0, 200);
    window.scrollTo(0, 300);
    window.scrollTo(0, 350);
    window.scrollTo(0, 450);
    window.scrollTo(0, document.body.scrollHeight);
    //@ts-ignore
    function getAllComments() {
        const t = [],
            recurse = function (elem) {
                if (elem.nodeType == 8) {
                    t.push(elem);
                }
                if (elem.childNodes && elem.childNodes.length) {
                    for (let i = 0; i < elem.childNodes.length; i++) {
                        recurse(elem.childNodes[i]);
                    }
                }
            };
        recurse(document.getElementsByTagName('html')[0]);
        return t;
    }
    function filterContent(contentElement) {
        //删除注释
        getAllComments().forEach((i) => {
            i.remove();
        });

        const imgs = [];
        contentElement.querySelectorAll('*').forEach((ele) => {
            if (
                !['img', 'a', 'pre', 'code', 'span'].includes(
                    ele.tagName.toLowerCase(),
                )
            ) {
                while (ele.attributes.length > 0) {
                    ele.removeAttribute(ele.attributes[0].name);
                }
            } else {
                for (const e in ele.attributes) {
                    const name = ele.attributes[e].name;
                    if (
                        name &&
                        name.toLowerCase() == 'class' &&
                        ele.attributes[e].value.includes('hljs')
                    ) {
                        continue;
                    }
                    if (
                        name &&
                        name.toLowerCase() == 'class' &&
                        ele.attributes[e].value == 'copy-code-btn'
                    ) {
                        ele.remove();
                    }

                    if (
                        name &&
                        !['src', 'href', 'target', 'lang'].includes(name.toLowerCase())
                    ) {
                        ele.removeAttribute(name);
                    }
                }
            }

            if (ele.tagName.toLowerCase() == 'img') {
                const src = ele.getAttribute('src');
                if (src != null) {
                    imgs.push({
                        src,
                    });
                }
            }

            if (['style', 'script'].includes(ele.tagName.toLowerCase())) {
                ele.remove();
            }
        });
        return {
            imgs: imgs,
            html: contentElement.innerHTML,
        };
    }

    return {
        datatype: "post",
        title: '',
        body:filterContent(document.querySelector('.article-content')).html,
        tags:[],
    };
}

test(`文章内容`, async ({ page }) => {
    test.setTimeout(0);
    const tables = [
        0,
        // 1,
        // 2,
        // 3,
        // 4,
        // 5,
        // 6,
        // 7,
        // 8,
        // 9,
        // 'a',
        // 'b',
        // 'c',
        // 'd',
        // 'e',
        // 'f',
    ];
    //const tables = ['2'];
    for (const tbNumber of tables) {
        //待处理索引
        let postModel = await 文章模型(tbNumber, 数据库连接_wenya, DB)

        let option = {
            where: {
                site_id:ID,
                deletedAt: null,
            },
            limit: 2,
        }
        if (SHOULD_TRANSLATE) {
            option['where'][`has_${LANG_TO}`] = 0;
        } else {
            option['where'][`has_${LANG_FROM}`] = 0;
        }


        let 待处理索引 = await postModel.findAll(option);
        for (const post of 待处理索引) {

            let options = {
                page: page,
                源语言: LANG_FROM,
                目标语言: LANG_TO,
                //精华页面,讨论页面
                网址: 获取网址(post.source, LANG_FROM,LANG_TO),
                抓取函数: 抓取数据的代码,
                下拉滚动条次数: 20,
                onBefore: 抓取前需要运行的代码,
                waitForSelector: `` ,
                过滤网络请求: false,
                允许注入脚本: false,
            };
            console.log({
                源语言: LANG_FROM,
                目标语言: LANG_TO,
                //精华页面,讨论页面
                网址: 获取网址(post.source, LANG_FROM,LANG_TO),
                抓取函数: 抓取数据的代码,
                下拉滚动条次数: 10,
                onBefore: 抓取前需要运行的代码,
                waitForSelector: `html[lang="${LANG_TO}"]` ,
                过滤网络请求: false,
                允许注入脚本: false,
            })
            let 文章实体 = await postModel.findByPk(post.id);
            for(let i = 0 ; i< 10; i++){
                await  options.page.evaluate(function(){
                    window.scrollTo(0, document.body.scrollHeight);
                });
                await sleep(2000)
            }
          
            let 抓取结果 = await 获取文章页面数据(options);
            console.log(999, 抓取结果)
            // try {
            //     let 抓取结果 = await 获取文章页面数据(options);
            //     console.log(999, 抓取结果)

            //     console.log('抓取结果', 抓取结果)
            //     if (抓取结果) {
            //         const 文件内容 = JSON.stringify(抓取结果);
            //         const 文件存储地址 = `${DB}/${LANG_TO}/${文章实体.slug}.json`;
            //         let res = await TencentCos.putContent(文件存储地址, 文件内容);
            //         console.log(888,res,文件存储地址)
            //         文章实体[`has_${LANG_TO}`] = 1;
            //         await 文章实体.save();
            //         console.log(`抓取成功`, 文章实体)

            //         const keywordModel = await 标签模型(DB);
            //         for (const tag of 抓取结果.tags) {
            //             const option = {
            //                 where: {
            //                     name: tag.toLocaleLowerCase(),
            //                 },
            //                 defaults: {
            //                     slug: await generateId(),
            //                 },
            //             };
            //             const [keyword, created] = await keywordModel.findOrCreate(option);

            //             //标签与文章关系
            //             const KeywordPostModel = await 标签文章模型(DB);
            //             const [keywordPost, hasCreated] = await KeywordPostModel.findOrCreate({
            //                 where: {
            //                     keyword_slug: keyword.dataValues.slug,
            //                     post_slug: 文章实体.slug,
            //                 },
            //                 defaults: {
            //                     slug: await generateId(),
            //                 },
            //             });
            //         }

            //     } else {
            //         console.log(`抓取失败: ${post.source}`)
            //         await 文章实体.destroy();
            //     }
            // } catch (error) {
            //     // console.log(222,error)
            //     // await 文章实体.destroy();
            // }
        }
    }
});