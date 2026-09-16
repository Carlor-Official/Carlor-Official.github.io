# update_node

更新现有节点配置。

## 调用

```js
const node = await api.update_node({
  id: 2,
  name: '华东节点',
  enabled: false,
  proxy_enabled: true,
  proxy_type: 'http',
  host: 'proxy.example.com',
  port: 8080,
  remark: '维护中'
})
```

## 规则

- `id` 与 `name` 必填；节点必须先停用再编辑。
- 停用启用中的节点时，除 `enabled: false` 外应提交原配置；不能同时修改名称、代理设置或备注。上例用于编辑已经停用的节点。
- `proxy_enabled: false` 时，`proxy_type` 省略或为空默认保存为 `http`，`port` 省略或为 `0` 默认保存为 `8080`；明确提供的有效代理设置会保留，不会因关闭代理而被清空。`proxy_type` 仅支持 `http`、`socks5`，有效端口为 1–65535。
- 更新是完整配置提交；省略普通代理字段按空值或上述默认值处理，不表示保留原值。旧直连节点的空类型、零端口与 `http / 8080` 视为等价，停用时自动规范化，无需手动修改数据库。
- 省略 `proxy_password` 表示保留已保存的密码。
- 明确传入 `proxy_password: ''` 表示清除密码。
- 成功返回节点详情，但不会回显代理密码。
