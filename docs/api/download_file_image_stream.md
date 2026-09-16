# download_file_image_stream

安全来源和分片顺序与 [`download_file_stream`](/api/download_file_stream.html) 相同。首个 `file_info` 额外返回图片 `width`、`height`；内容不能被识别为图片时请求失败。

```js
await api.download_file_image_stream(
  { file: 'data:image/png;base64,iVBORw0KGgo...' },
  frame => console.log(frame),
)
```

该接口不接受仅有 `file_id` 的 QQ 媒体解析请求。
