# upload_file_stream

按 `stream_id` 分片上传文件。新流必须填写 `total_chunks`，每个分片填写 Base64 `chunk_data` 与从 0 开始的 `chunk_index`。分片可乱序，重复提交相同分片不会重复计数。

```js
await api.upload_file_stream({
  stream_id: 'job-1', total_chunks: 2, chunk_index: 0,
  chunk_data: 'SGVsbG8g', file_size: 11, filename: 'hello.txt'
})
await api.upload_file_stream({ stream_id: 'job-1', chunk_index: 1, chunk_data: 'V29ybGQ=' })
const result = await api.upload_file_stream({ stream_id: 'job-1', is_complete: true })
```

可选 `expected_sha256` 用于完整性校验，`verify_only` 查询状态，`reset` 清理未完成流。`file_retention` 单位毫秒，默认 5 分钟，填 0 表示不自动删除完成文件。未完成流 10 分钟无活动会自动回收，所有文件均限定在框架目录的 `data/stream-temp`。
