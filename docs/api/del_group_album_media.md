# del_group_album_media

删除群相册中的图片或视频。

```js
await api.del_group_album_media({ self_id: 1060221, group_id: 123456789, album_id: 'album-id', lloc: 'media-lloc' })
```

`self_id`、`group_id`、`album_id`、`lloc` 均必填。删除视频时可以填写视频 ID 或封面 `lloc`；框架会先读取媒体列表，补齐 QQ 删除协议需要的封面标识和批次 ID。
