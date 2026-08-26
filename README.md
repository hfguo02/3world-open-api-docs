# 3World 开发者文档

3World 白标卡服务开发者文档，基于 Docusaurus 和 OpenAPI 构建。

## 架构

- `/` 默认进入 V2 文档；V2 包含当前推荐接口和仍然有效的 V1 路径。
- `/v1` 是完整的 V1 历史快照，从 V2 版本栏以新窗口打开。
- 接入指南、API 文档、Webhook 事件、参考资料共用一个文档实例、一个持久侧栏和版本隔离搜索。
- API 详情页不发送真实请求；右栏只展示 OpenAPI 中明确维护的请求与响应 JSON 示例。
- Copy Page 和不可见的 `llms.txt` 机器入口使用社区维护的 Docusaurus 插件生成。

## 目录

```text
docs/                                   # V2 人工文档与生成的 API
versioned_docs/version-1.0.0/           # V1 完整快照
openapi/whitelabel/                     # OpenAPI 源与发布快照
scripts/build-openapi-releases.mjs      # 版本过滤、Schema 装饰、侧栏生成
sidebars.ts                             # V2 生成侧栏
versioned_sidebars/                     # V1 生成侧栏
src/components/                         # 版本栏与 API 模块入口
src/lib/                                # 路由纯逻辑
src/theme/                              # Docusaurus/OpenAPI 主题扩展
scripts/write-api-markdown.mjs          # 构建后生成 API Markdown 路由
```

生成目录和事实来源的详细边界见 `AGENTS.md`。

## 开发

环境要求：Node.js 20.17 或更高版本。

```bash
npm install
npm run generate:api-docs
npm run start
```

访问 `http://localhost:3000/`。

## 更新 API

更新 `openapi/whitelabel/whitelabel-api-openapi.json` 后运行：

```bash
npm run generate:api-docs
npm run typecheck
npm run build
```

生成过程会产出 V2 和 V1 的 OpenAPI 快照、API MDX 与侧栏。字段说明、公共请求头或 200 响应结构不完整时会直接失败；JSON 示例只读取 OpenAPI 中明确维护的 `example/examples`，不会根据 Schema 推断。
