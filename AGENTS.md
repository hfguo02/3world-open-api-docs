# 3World Open API 文档 Agent 规则

本文件约束 `/usr/local/codes/vicotria-open-api-docs` 的长期维护。全局规则继续生效；冲突时采用更严格的规则。

## 事实来源

- 后端工程位于 `/usr/local/codes/victoria`。接口、字段、枚举、错误码和运行时行为存在疑问时，必须回到后端代码核对，不能依据页面文案猜测。
- 文档站的 OpenAPI 输入为 `openapi/whitelabel/whitelabel-api-openapi.json`，发布快照由 `scripts/build-openapi-releases.mjs` 生成。
- 后端 `ResultCodeEnum` 是错误码真源。没有明确任务时不要顺手调整 `docs/reference/error-codes.mdx`；修改错误码必须与后端和 OpenAPI 快照一起核对。
- 枚举只出现在对应请求/响应字段的 Schema 说明中，不维护独立枚举页面或第二份人工枚举表。

## 版本模型

- 对外只维护一套当前文档，内容位于 `docs/`；不提供历史文档版本切换或 `/v1` 文档路由。
- Card 与 Funds 是并列业务域；公共接入规范集中在开发者指南，业务 API、Webhook 和错误码归属具体业务域。
- API 运行路径中的 `/v1/`、`/v2/` 是后端契约，不属于文档版本模型，必须按 OpenAPI 源保留。

## 目录与生成边界

- 人工内容只维护在 `docs/introduction/`、`docs/webhooks/`、`docs/reference/`、`docs/funds/`；`docs/api/` 和 `sidebars.ts` 为生成产物，不手工修改。
- `openapi/whitelabel/releases/` 是当前 OpenAPI 发布快照目录；不再生成或维护历史版本快照。
- 修改接口后运行 `npm run generate:api-docs`。接口分类、数量和侧栏条目必须由同一生成脚本产出，禁止维护第二份接口清单。
- API 概览只展示业务模块卡片、模块说明、接口数量和入口，不恢复全量接口大表。
- 删除本次变更淘汰的文件、路由、组件和类型声明；不要保留“以后可能用到”的并行实现。

## UI 与依赖边界

- 优先复用主流维护中的组件，不为常见能力自建组件库或复制第三方源码。
- Copy Page 使用 `docusaurus-plugin-copy-page-button`；LLM 索引使用 `docusaurus-plugin-llms`。`LLMs.txt` 不出现在页面 UI，但 `/llms.txt` 必须持续生成和验证。
- `scripts/write-api-markdown.mjs` 通过 npm `postbuild` 在 Docusaurus 构建完成后把同一份 OpenAPI 转成 API `.md` 路由，用于 `View as Markdown` 和 LLM 索引；它只负责格式转换，不得维护接口事实或推断示例。不得绕过 `npm run build` 只调用 `docusaurus build`，否则 API `.md` 会被上游插件产物覆盖。
- API 页面保持左侧目录、中间请求/响应字段文档、右侧 sticky JSON 示例三栏；指南页使用宽正文，没有显式示例时不保留空右栏。
- API 详情页必须解除 Docusaurus 默认的 900px 正文上限；常规屏幕充分使用侧栏后的空间，宽屏使用响应式居中画布保留适量左右留白并设置合理上限。指南页继续保留适合阅读的正文宽度，禁止固定窄栏或超宽铺满。
- API 路径的方法标记与 URL 必须保持同一基线；中间栏参数使用分组卡片、统一行内边距和分隔线，不使用上游主题默认的树形连接线。媒体类型或 Schema 只有一个选项时隐藏其标签栏，存在多个选项时才显示切换。
- 右栏只读取 OpenAPI 明确维护的 `example` 或 `examples`。GET 只展示响应示例，其他方法按存在情况展示请求和响应示例；禁止根据 Schema、默认值或枚举自动生成示例。
- 不提供 Try It、浏览器真实请求或自动生成的 cURL/SDK 代码；页面不能持有或发送用户凭证。
- 搜索使用居中响应式弹框并沿用当前文档版本索引，结果列表只能在弹框内部滚动，不能溢出视口。
- 品牌素材必须下载到 `static/`，生产页面不得热链官网资源。

## 验证

修改完成后依次运行：

1. `npm run generate:api-docs`
2. `npm run typecheck`
3. `npm run build`
4. 用真实浏览器检查 `/introduction`、`/api`、一个 API 详情页、`/funds`、Copy Page、搜索和明暗主题；确认 `/v1/**` 不再生成。

构建警告、断链、Markdown 路由缺失都必须显式处理，不能用 silent fallback 掩盖。
