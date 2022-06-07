import { 索引抓取输出 } from "../../模块/索引抓取模块";
import { 标签模型 } from "../../数据模型/标签模型";
import { Op } from "sequelize";
import moment from "moment";
import { 翻译方式 } from "../../模块/翻译模块";
//站点描述语言-> 统一解析器 -> 存储
export const Site = {
    id: 11,
    key: 'zhihu',//站点标志,用于标签表字段名等地方
    db: 'content-social',
    翻译文章:true,
    源语言: 'zh',
    默认目标语言: 'en',
    需要支持的语言: [],//默认目标语言除外
    规则: {//支持文章也，标签页，列表页
        标签页规则: {
            翻译方式: 翻译方式.翻译文本段落,
            滚动条下拉次数: 20,
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
            翻译方式: 翻译方式.翻译文本段落,
            抓取前需要运行的代码: async function (page: any) {
                await page.evaluate(() => {
                    (<HTMLElement>document.querySelector('.Modal-closeButton')).click();
                    window.scrollTo(0, document.body.scrollHeight);
                    window.scrollTo(0, document.body.scrollHeight);
                    window.scrollTo(0, document.body.scrollHeight);
                    window.scrollTo(0, document.body.scrollHeight);
                    window.scrollTo(0, document.body.scrollHeight);
                    window.scrollTo(0, document.body.scrollHeight);
                    window.scrollTo(0, document.body.scrollHeight);
                    window.scrollTo(0, document.body.scrollHeight);
                }, []);
            },
            滚动条下拉次数: 20,
            抓取数据的代码: function () {
                document.querySelectorAll("img,svg,noscript").forEach((item)=>{
                    item.remove()
                })
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
                //@ts-ignore
                function getTranslatableContent(wrapperNode, nodeSelector) {
                    const content = [];
                    const contentNode = wrapperNode;
                    const contentWordCount = contentNode.innerHTML.length;
                    if (contentWordCount < 4000) {
                        const div = document.createElement('div');
                        div.innerHTML = contentNode.innerHTML.trim();
                        const txt = filterContent(div).html;
                        if (txt) {
                            content.push(txt);
                        }
                    } else {
                        contentNode.querySelectorAll(nodeSelector).forEach((node, i) => {
                            const div = document.createElement('div');
                            div.innerHTML = node.innerHTML.trim();
                            const txt = filterContent(div).html;
                            if (txt) {
                                content.push(`<p>${txt}</p>`);
                            }
                        });
                    }
                    return content;
                }

                //@ts-ignore
                const contents = [];
                document
                    .querySelectorAll('.AnswersNavWrapper .List-item')
                    .forEach((item, index) => {
                        if (index < 3) {
                            const authorNode = <HTMLLinkElement>(
                                item.querySelector('.AuthorInfo-name .UserLink-link')
                            );
                            let author = {
                                name: '',
                                href: '',
                            };
                            if (authorNode) {
                                author = {
                                    name: authorNode.innerText,
                                    href: authorNode.href,
                                };
                            }
                            contents.push({
                                author: author,
                                sections: getTranslatableContent(
                                    item.querySelector('.RichContent-inner span.RichText'),
                                    'span.RichText > *',
                                ),
                            });
                        }
                    });

                const tags = [];
                document.querySelectorAll('.QuestionHeader-topics a').forEach((item) => {
                    tags.push((<HTMLElement>item).innerText);
                });

                return {
                    title: '',
                    content: contents,
                    articleList: [],
                    imgs: [],
                    tags,
                };
            }

        }
    }

}