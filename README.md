# 萌卡 NT 2.0 官网

萌卡 NT 的新一代官网与开发文档，基于 VitePress 构建并由 Cloudflare Pages 发布。

## 本地开发

```bash
npm ci
npm run dev
```

生产构建：

```bash
npm run build
```

生产环境由 Cloudflare Pages 连接本仓库的 `main` 分支自动发布：

- 构建命令：`npm run build`
- 输出目录：`docs/.vitepress/dist`
- 正式域名：`mknt.net`

推送前执行 `npm run check`。旧 `gh-pages` 分支仅作为迁移回退，不再作为正式发布入口。

## 文档与版本维护

- 首页与下载中心在访问时读取官方 GitHub 最新正式 Release；读取失败时保留官方发布页入口，不伪造版本号。
- API 目录由 `docs/.vitepress/api-sidebar.mjs` 从文档生成，按功能和子类折叠，当前路径自动展开。
- API、事件与开发指南迁自现有官网文档；本次迁移时以 `v2.3.9` 正式标签中的 42 篇公开接口文档覆盖旧版同名内容。历史版本说明不代表最新版本。
- 框架插件采用本地上传导入，不读取官网插件清单；本仓库不提供用户注册、管理员登录或插件审核后端。
- `npm test` 检查版本读取、错误降级、菜单覆盖率和临时文案；`npm run check` 同时执行完整构建与断链检查。

原始品牌图保留为 `docs/public/logo.png`。首页使用 `mascot-clean.png`：经用户允许，以本地像素蒙版清除头发缝隙背景，不使用生成图重绘角色。复现：`python scripts/clean-mascot.py`（需要 Pillow）。
