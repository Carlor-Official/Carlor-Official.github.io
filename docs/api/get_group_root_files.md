# get_group_root_files

使用指定 Android 或 Linux QQ 在线会话获取群文件根目录。接口会自动处理 QQ 服务端分页，并分别返回文件与文件夹。

```js
const result = await api.get_group_root_files({
  self_id: 1060221,
  group_id: 106500,
  file_count: 50,
})
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `self_id` | number | 是 | 执行请求的在线 Bot QQ 号 |
| `group_id` | number | 是 | 群号 |
| `file_count` | number | 否 | 单页请求数量，默认 50，范围 1-100 |

返回值包含 `files` 和 `folders`。文件字段包括 `file_id`、`file_name`、`busid`、`file_size`、`upload_time`、`dead_time`、`modify_time`、`download_times`、`uploader`、`uploader_name` 与 `parent_folder_id`；文件夹字段包括 `folder_id`、`parent_folder_id`、`folder_name`、`creator`、`creator_name` 和 `total_file_count`。

该接口是只读操作，账号必须已加入目标群并具有查看群文件的权限。

v2.0.6 对满页结束响应增加同位置窗口复核，`file_count` 仍用于初始请求，复核单次不超过 100 条。视图变化、重复记录、无效游标或末页完整性无法确认时返回错误；行为和验收限制见[文件夹内容读取](/api/get_group_files_by_folder.html#分页与完整性)。
