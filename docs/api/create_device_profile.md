# create_device_profile

使用框架与前端“一键生成”相同的规则创建随机设备指纹。当前唯一 action 为 `create_device_profile`，旧名称 `generate_device_profile` 已删除。

## 调用

```js
const profile = await api.create_device_profile({ name: '账号 106606 指纹' })
```

`name` 可省略；省略时框架自动生成名称。返回完整指纹记录，其 `id` 可直接用于 `add_account`。每个账号应使用独立指纹，避免多人复用。
