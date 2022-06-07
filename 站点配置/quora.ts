import { 索引抓取输出 } from "../模块/索引抓取模块";
import { 标签模型 } from "../数据模型/标签模型";
import { Op } from "sequelize";
import moment from "moment";
//站点描述语言-> 统一解析器 -> 存储

export const Site = {
    id: 12,
    key: 'quora',//站点标志,用于标签表字段名等地方
    db: 'content-social',
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
                        quora_id: {
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
                    名称: '标签搜索结果页面',
                    网址: function (tagId: any) {
                        return `https://www-quora-com.translate.goog/search?q=india&type=answer&_x_tr_sl=en&_x_tr_tl=zh-CN&_x_tr_hl=zh-CN&_x_tr_pto=wapp`
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
                for (const item of document.querySelectorAll('#mainContent a')) {
                    if ((<HTMLElement>item).innerText) {
                        items.push({
                            title: (<HTMLElement>item).innerText,
                            href: (<HTMLElement>item).href,
                            summary: '',
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