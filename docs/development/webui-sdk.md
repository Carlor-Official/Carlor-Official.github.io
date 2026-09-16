# WebUI SDK

插件需要网页管理后台时，可以通过 WebUI SDK 将自己的页面安全嵌入萌卡 NT 管理界面。

## 设计边界

- 后端使用框架分配的本地端口、挂载路径与令牌文件；
- 浏览器只持有完成当前页面操作所需的短期凭据；
- 不把框架 WebSocket 服务令牌写入前端脚本或 URL；
- 页面路由、静态资源和 WebSocket 地址必须兼容反向代理挂载路径；
- 管理操作需要明确的成功、失败和重试反馈。

[查看 WebUI SDK 文档](https://github.com/Carlor-Official/Mengka-NT/tree/main/sdk/plugin-web)
