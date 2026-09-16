# set_group_album_media_like

点赞群相册的一批上传内容或其中一项媒体。

```js
await api.set_group_album_media_like({ self_id: 1060221, group_id: 123456789, album_id: 'album-id', batch_id: '1234567890', lloc: 'media-lloc' })
```

`self_id`、`group_id`、`album_id`、`batch_id` 必填；`lloc` 可选。两者都可从媒体列表响应取得。
