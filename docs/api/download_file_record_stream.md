# download_file_record_stream

流式读取安全来源中的语音文件。参数和分片顺序与 [`download_file_stream`](/api/download_file_stream.html) 相同。

可选 `out_format`：`mp3`、`amr`、`wma`、`m4a`、`spx`、`ogg`、`wav`、`flac`。指定格式时由框架管理的 FFmpeg 容器完成转换，转换最多等待 2 分钟；未运行 FFmpeg 时会返回明确错误。

```js
await api.download_file_record_stream(
  { file: 'https://example.com/voice.ogg', out_format: 'mp3' },
  frame => console.log(frame),
)
```

该接口不通过 `file_id` 查询 QQ 文件或媒体服务。
