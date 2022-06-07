import { 索引抓取输出 } from "../../模块/索引抓取模块";
import { 标签模型 } from "../../数据模型/标签模型";
import { Op } from "sequelize";
import moment from "moment";
//站点描述语言-> 统一解析器 -> 存储
export const Site = {
    id: 13,
    key: 'devto',//站点标志,用于标签表字段名等地方
    db: 'content-computer',
    源语言: 'en',
    默认目标语言: 'zh',
    需要支持的语言: [],//默认目标语言除外
    规则: {//支持文章也，标签页，列表页
        标签页规则: {
            //网站有很多标签，需要一个获取标签的函数迭代
            标签列表: async function () {
                let 标签Model = await 标签模型(Site.db);
                return await 标签Model.findAll({
                    where: {
                        fetched_at: {
                            [Op.lt]: moment().subtract(7, 'days').toDate()
                        },
                        zhihu_id: {
                            [Op.ne]: ''
                        },
                        deletedAt: null,
                    },
                    limit: 10
                });
            },
            //一个网站会有多种标签页
            页面: [
                {
                    名称: '精华页面',
                    网址: function (tagId: any) {
                        return `https://www.zhihu.com/topic/${tagId}/top-answers`
                    },
                },
                {
                    名称: '讨论页面',
                    网址: function (tagId: any) {
                        return `https://www.zhihu.com/topic/${tagId}/hot`
                    },
                }
            ],
            滚动条下拉次数: 20,
            抓取前需要运行的代码: async function (page: any) {
                await page.evaluate(() => {
                    //(<HTMLElement>document.querySelector('.Modal-closeButton')).click();
                    window.scrollTo(0, document.body.scrollHeight);
                }, []);
            },
            抓取数据的代码: function () {
                const items: 索引抓取输出 = [];
                for (const item of document.querySelectorAll('.TopicFeedList .TopicFeedItem')) {
                    if (item.querySelector('.ContentItem-title a')) {
                        let href = (<HTMLLinkElement>item.querySelector('.ContentItem-title a')).href;
                        let newhref = href.split('/answer')
                        items.push({
                            title: (<HTMLElement>item.querySelector('.ContentItem-title a')).innerText,
                            href: newhref[0],
                            summary: (<HTMLLinkElement>item.querySelector('.RichText')).innerText,
                            thumbnail: '',
                        });
                    }
                }
                return items;
            }
        },
        文章页规则: {

        }
    }

}