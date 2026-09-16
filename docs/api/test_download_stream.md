# test_download_stream

发送 10 个 `data_chunk` 测试帧，随后返回 `data_complete`，用于检查插件的流式帧消费逻辑。

```js
await api.test_download_stream({ error: false })
```

传 `error: true` 时，10 个测试帧发送完毕后返回失败响应。
