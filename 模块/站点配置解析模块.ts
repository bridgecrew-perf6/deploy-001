import { test } from '@playwright/test';
import { 数据库连接_wenya } from '../库/Mysql';
import { 文章模型 } from '../数据模型/文章模型';
import { 标签模型 } from '../数据模型/标签模型';
import { 索引入库, 索引抓取, 翻页方式 } from "../模块/索引抓取模块";
import { 获取文章页面数据 } from './文章抓取模块';
import { 获取网址, 翻译方式, getTranslateText } from './翻译模块';
import TencentCos from '../库/TencentCos';
import { generateId } from '../库/id';
import { 标签文章模型 } from '../数据模型/标签文章模型';
export function 站点配置解析(Site: any) {
  test.describe(`标签页`, () => {
      for (const 标签页面 of Site.规则.标签页规则.页面) {
          test(`${标签页面.名称}`, async ({ page }) => {
              let 标签列表 = await Site.规则.标签页规则.标签列表();
              console.log(标签列表)
              for (let tagInfo of 标签列表) {
                  let tagId = tagInfo.dataValues[`${Site.key}_id`];
                  let response = {};

                  let options = {
                      page: page,
                      源语言: Site.源语言,
                      目标语言: Site.默认目标语言,
                      //精华页面,讨论页面
                      网址: 标签页面.网址(tagId),
                      抓取函数: Site.规则.标签页规则.抓取数据的代码,
                      下拉滚动条次数: Site.规则.标签页规则.滚动条下拉次数,
                      waitForSelector: `html[lang="${Site.默认目标语言}"]`,
                      onBefore: Site.规则.标签页规则.抓取前需要运行的代码,
                      翻页配置: {
                          是否有分页: false,
                          翻页方式: 翻页方式.点击下一页,
                          页数: 1,
                          页数模板: '',
                          翻页选择器: '',
                          最大页数选择器: '',
                      },
                      过滤网络请求: false,
                      允许注入脚本: false,
                  };
                  console.log({
                      源语言: Site.源语言,
                      目标语言: Site.默认目标语言,
                      //精华页面,讨论页面
                      网址: 标签页面.网址(tagId),
                      抓取函数: Site.规则.标签页规则.抓取数据的代码,
                      下拉滚动条次数: Site.规则.标签页规则.滚动条下拉次数,
                      waitForSelector: `html[lang="${Site.默认目标语言}"]`,
                      onBefore: Site.规则.标签页规则.抓取前需要运行的代码,
                      翻页配置: {
                          是否有分页: false,
                          翻页方式: 翻页方式.点击下一页,
                          页数: 1,
                          页数模板: '',
                          翻页选择器: '',
                          最大页数选择器: '',
                      },
                      过滤网络请求: false,
                      允许注入脚本: false,
                  })

                  let 抓取结果 = await 索引抓取(options);
                  console.log(`-------->标签: ${tagInfo.dataValues['name']}`);
                  console.log(`-------->抓取量: ${抓取结果.length}`);
                  for (let item of 抓取结果) {
                      if (typeof response[item.href] == 'undefined') {
                          response[item.href] = {};
                      }
                      response[item.href][`title_${Site.默认目标语言}`] = item.title;
                  }
                  console.log(`抓取结果`, response)
                  await 索引入库(response, Site)

                  let 标签Model = await 标签模型(Site.db);
                  let tagModel = await 标签Model.findByPk(tagInfo.dataValues.id);
                  tagModel.fetchedAt = new Date();
                  await tagModel.save()
              }
          });
      }
  });

  test.describe('文章页', () => {
    test(`知乎文章内容`, async ({ page }) => {
      test.setTimeout(0);
      const tables = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
      ];
      //const tables = ['2'];
      for (const tbNumber of tables) {
        //待处理索引
        let postModel = await 文章模型(tbNumber, 数据库连接_wenya, Site.db)

        let 待处理索引 = await postModel.findAll({
          where: {
            site_id: Site.id,
            deletedAt: null,
            has_en: 0,
          },
          limit: 1,
        });

        for (const post of 待处理索引) {

          let options = {
            page: page,
            源语言: Site.源语言,
            目标语言: Site.默认目标语言,
            //精华页面,讨论页面
            网址: (Site.规则.文章页规则.翻译方式 == 翻译方式.翻译文本段落) ? post.source : 获取网址(post.source, Site.源语言, Site.默认目标语言),
            抓取函数: Site.规则.文章页规则.抓取数据的代码,
            下拉滚动条次数: 10,
            onBefore: Site.规则.文章页规则.抓取前需要运行的代码,
            waitForSelector: (Site.规则.文章页规则.翻译方式 == 翻译方式.翻译文本段落) ? '' : `html[lang="${Site.默认目标语言}"]`,
            过滤网络请求: false,
            允许注入脚本: false,
          };
          let 文章实体 = await postModel.findByPk(post.id);
          console.log('options', {
            源语言: Site.源语言,
            目标语言: Site.默认目标语言,
            //精华页面,讨论页面
            网址: (Site.规则.文章页规则.翻译方式 == 翻译方式.翻译文本段落) ? post.source : 获取网址(post.source, Site.源语言, Site.默认目标语言),
            抓取函数: Site.规则.文章页规则.抓取数据的代码,
            下拉滚动条次数: 10,
            onBefore: Site.规则.文章页规则.抓取前需要运行的代码,
            waitForSelector: (Site.规则.文章页规则.翻译方式 == 翻译方式.翻译文本段落) ? '' : `html[lang="${Site.默认目标语言}"]`,
            过滤网络请求: false,
            允许注入脚本: false,
          })
          try {
            let 抓取结果 = await 获取文章页面数据(options);
            console.log(999, 抓取结果.content[1].sections)
            //翻译
            if (Site.翻译文章 && Site.规则.文章页规则.翻译方式 == 翻译方式.翻译文本段落) {

              for (let [key, value] of Object.entries(抓取结果.content)) {
                let body = '';
                if (typeof value.sections != 'undefined') {
                  for (let p of value.sections) {
                    body += await getTranslateText(p, Site.默认目标语言)
                  }
                }
                抓取结果.content[key].body = body
                delete 抓取结果.content[key].sections
              }
            }

            console.log('抓取结果', 抓取结果)
            if (抓取结果) {
              const 文件内容 = JSON.stringify(抓取结果);
              const 文件存储地址 = `${Site.db}/${Site.默认目标语言}/${文章实体.slug}.json`;
              await TencentCos.putContent(文件存储地址, 文件内容);
              文章实体[`has_${Site.默认目标语言}`] = 1;
              await 文章实体.save();
              console.log(`抓取成功`, 文章实体)

              const keywordModel = await 标签模型(Site.db);
              for (const tag of 抓取结果.tags) {
                const option = {
                  where: {
                    name: tag.toLocaleLowerCase(),
                  },
                  defaults: {
                    slug: await generateId(),
                  },
                };
                const [keyword, created] = await keywordModel.findOrCreate(option);
                
                //标签与文章关系
                const KeywordPostModel = await 标签文章模型(Site.db);
                const [keywordPost, hasCreated] = await KeywordPostModel.findOrCreate({
                  where: {
                    keyword_slug: keyword.dataValues.slug,
                    post_slug: 文章实体.slug,
                  },
                  defaults: {
                    slug: await generateId(),
                  },
                });
              }

            } else {
              console.log(`抓取失败: ${post.source}`)
              await 文章实体.destroy();
            }
          } catch (error) {
            await 文章实体.destroy();
          }
        }
      }
    });
  });

}
