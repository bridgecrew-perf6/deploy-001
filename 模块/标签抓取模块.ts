import moment from "moment";
import { Op } from "sequelize";
import { 标签模型 } from "../数据模型/标签模型";
import { 索引入库, 索引抓取, 翻页方式 } from "./索引抓取模块";
function 标签页的网址(siteKey: string, tagId: any) {
    let map = {
        'zhihu': `https://www.zhihu.com/topic/${tagId}/hot`,
        'quora': `https://www.quora.com/search?q=${tagId}&type=question`
    }
    return map[siteKey]
}
export async function 抓取标签(page: any, Site: any, tagConfig:any, where: object) {

    let 标签Model = await 标签模型(Site.db);
    let 标签列表 = await 标签Model.findAll({
        where: {
            fetched_at: {
                [Op.lt]: moment().subtract(7, 'days').toDate()
            },
            deletedAt: null,
            ...where
        },
        limit: 1
    });

    for (let tagInfo of 标签列表) {
        let tagId = tagInfo.dataValues[`${Site.key}_id`];
        let response = {};

        let options = {
            page: page,
            源语言: Site.源语言,
            目标语言: tagConfig.lang,
            //精华页面,讨论页面
            网址: tagConfig.getUrl(tagId),
            抓取函数: Site.索引抓取函数,
            下拉滚动条次数: Site.下拉滚动条次数,
            waitForSelector: `html[lang="${tagConfig.lang}"]`,
            onBefore:Site.onBefore,
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
        console.log(options)
        let 抓取结果 = await 索引抓取(options);
        console.log(`-------->标签: ${tagInfo.dataValues['name']}`);
        console.log(`-------->抓取量: ${抓取结果.length}`);
        for (let item of 抓取结果) {
            if (typeof response[item.href] == 'undefined') {
                response[item.href] = {};
            }
            response[item.href][`title_${tagConfig.lang}`] = item.title;
        }

        await 索引入库(response, Site)
        let tagModel = await 标签Model.findByPk(tagInfo.dataValues.id);
        tagModel.fetchedAt = new Date();
        await tagModel.save()
    }
}
