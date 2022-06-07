/**
 * 浏览器中运行的Javascript 代码
 * @param {*} number 
 */
//下拉3次滚动条
function dropDownScrollbar(number) {
    window.scrollTo(0, document.body.scrollHeight);
    window.scrollTo(0, document.body.scrollHeight);
    window.scrollTo(0, document.body.scrollHeight);
    window.scrollTo(0, document.body.scrollHeight);
    window.scrollTo(0, document.body.scrollHeight);
    window.scrollTo(0, document.body.scrollHeight);
}
/**
 * @typedef {Object} Food
 * @property {string} name - What the food should be called
 * @property {('meat' | 'veggie' | 'other')} type - The food's type
 */
function getAllComments() {
    var t = [],
        recurse = function (elem) {
            if (elem.nodeType == 8) {
                t.push(elem);
            };
            if (elem.childNodes && elem.childNodes.length) {
                for (var i = 0; i < elem.childNodes.length; i++) {
                    recurse(elem.childNodes[i]);
                };
            };
        };
    recurse(document.getElementsByTagName("html")[0]);
    return t;
};

//文章内容去除杂质
function filterContent(selector) {

    //删除注释
    getAllComments().forEach((i) => { i.remove() })

    let contentElement = document.querySelector(selector);
    let imgs = [];
    contentElement.querySelectorAll("*").forEach((ele) => {
        if (!["img", "a", "pre", "code", 'span'].includes(ele.tagName.toLowerCase())) {
            while (ele.attributes.length > 0) {
                ele.removeAttribute(ele.attributes[0].name);
            }
        } else {
            for (let e in ele.attributes) {
                let name = ele.attributes[e].name;
                if (name && name.toLowerCase() == 'class' && ele.attributes[e].value.includes('hljs')) {
                    continue;
                }
                if (name && name.toLowerCase() == 'class' && ele.attributes[e].value == 'copy-code-btn') {
                    ele.remove()
                }

                if (name && !["src", "href", "target", 'lang'].includes(name.toLowerCase())) {
                    ele.removeAttribute(name);
                }
            }
        }

        if (ele.tagName.toLowerCase() == "img") {
            let src = ele.getAttribute("src");
            if (src != null) {
                imgs.push({
                    src,
                });
            }
        }

        if (["style", "script"].includes(ele.tagName.toLowerCase())) {
            ele.remove();
        }

    });
    return {
        imgs:imgs,
        html:contentElement.innerHTML
    };
}