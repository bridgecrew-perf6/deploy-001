# 数据收藏家

## 需要考虑的问题
1. 模块
    - [ ] [数据抓取模块](文档/数据抓取.md)
    - [翻译模块](文档/翻译模块.md)
    - [对象存储模块]
2. 语言问题
同时抓取多语言速度太慢，因此默认只抓取一种语言。如果要补全其他语言，需要另外一套程序
## 收藏步骤

```mermaid
flowchart LR
    站点分析与配置 --> |datatype:数据抓取参数|数据抓取
    数据抓取 --> 数据翻译{是否需要翻译}
    数据翻译 --> 是 
    是 --> 翻译
    数据翻译 --> 否
    否 --> |datatype:数据入库参数|数据入库
    翻译 --> |datatype:数据入库参数|数据入库
    数据入库 --> 数据校验
```

## 数据抓取详细流程
```mermaid
graph TB
    A[知乎] --> B[要抓取的页面]
    subgraph 网站分析与提取
    B --> C[热榜索引 HotIndex]
    B --> D[话题页索引 TopicIndex]
    B --> E[文章页 Post]
    B --> 其他
    A --> F[config]
    F --> P[滚动条下拉次数]
    F --> K[可以翻译成的语言]
    K --> L[zh]
    K --> M[en]
    K --> N[jp]
    K --> O[..]
    C --> G[数据抓取函数]
    D --> H[数据抓取函数]
    E --> I[数据抓取函数]
    end
    subgraph 数据抓取
    G --> J[Playwright]
    H --> J
    I --> J
    J --> Q[初始化]
    Q --> R[选择语言]
    R --> S[zh]
    R --> T[en]
    Q --> U[滚动条下拉次数]
    U --> V[抓取数据]
    T --> W[URL]
    S --> W
    W --> V
    V --> 抓取结果
    end
    subgraph 数据入库
    抓取结果 --> 翻译
    翻译 --> 翻译结果
    翻译结果 --> 入库
    end
```

### 使用
```bash
npx playwright test
npx playwright test --headed --debug
npx playwright show-trace trace.zip
npx playwright codegen https://www.zhihu.com/signin --save-storage=tests/知乎/auth.json --timeout=99999999
npx playwright codegen https://www.quora.com --save-storage=数据抓取/社会/quora/auth.json --timeout=99999999
npx playwright show-report
npx playwright codegen --save-storage=auth.json
npx playwright open --load-storage=auth.json my.web.app
npx playwright codegen --load-storage=auth.json my.web.app
npx playwright test --workers=5
```
