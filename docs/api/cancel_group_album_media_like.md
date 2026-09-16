# cancel_group_album_media_like

取消群相册媒体点赞。参数与 `set_group_album_media_like` 相同。

```js
await api.cancel_group_album_media_like({ self_id: 1060221, group_id: 123456789, album_id: 'album-id', batch_id: '1234567890', lloc: 'media-lloc' })
```

`lloc` 为空时取消整批点赞；填写时取消指定媒体的点赞。
