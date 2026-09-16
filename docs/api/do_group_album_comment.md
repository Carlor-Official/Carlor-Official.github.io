# do_group_album_comment

评论群相册中的指定媒体。

```js
await api.do_group_album_comment({ self_id: 1060221, group_id: 123456789, album_id: 'album-id', lloc: 'media-lloc', content: '评论内容' })
```

`self_id`、`group_id`、`album_id`、`lloc`、`content` 均必填。`lloc` 从 `get_group_album_media_list` 的图片或视频封面信息中取得。
