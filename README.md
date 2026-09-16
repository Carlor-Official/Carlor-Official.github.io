# 萌卡 NT 2.0 官网

萌卡 NT 的新一代官网与开发文档，基于 VitePress 构建并发布到 GitHub Pages。

## 本地开发

```bash
npm ci
npm run dev
```

生产构建：

```bash
npm run build
```

发布到仓库的 `gh-pages` 分支：

```bash
npm run deploy
```

GitHub Pages 当前从 `gh-pages` 分支根目录发布。正式切换域名前，在 `docs/public/CNAME` 写入 `mknt.net`，重新发布并完成 GitHub Pages 自定义域验证。

当前公开发布基线：`v2.3.9`。

自定义域 `mknt.net` 暂未写入仓库；正式切换前应先完成 GitHub 域名验证、DNS 预检与旧站迁移验收。
