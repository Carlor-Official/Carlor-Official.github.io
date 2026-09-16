import fs from 'node:fs'
import path from 'node:path'
const directory = new URL('../api/', import.meta.url)
const rules = {
  '系统信息': [['状态与资料', /status|login_info|version|model|online_clients|input_status/], ['文件与流传输', /file|stream|can_send/], ['系统工具', /.*/]],
  '消息与媒体': [['发送与转发', /send_(?:group|friend|private)?_?(?:msg|forward)|forward/], ['历史、撤回与已读', /history|recall|delete_msg|get_msg|mark_.*read/], ['红包与互动', /red_packet|up_for_grabs|emoji|poke/], ['语音与 AI', /voice|record|ptt|ai_/], ['图片、文件与卡片', /.*/]],
  '好友与空间': [['好友关系与申请', /friend_list|friend_request|friend_add|doubt|delete_friend|remark/], ['空间动态', /qzone/], ['名片与资料', /summary|profile|longnick|user_agent/], ['登录凭据', /skey|pskey|clientkey|rkey/], ['其他操作', /.*/]],
  '群聊管理': [['文件管理', /file|folder/], ['相册管理', /album/], ['公告与精华', /notice|essence/], ['群资料与成员', /list|info|create_group|special_title|set_group_name/], ['申请与权限', /apply|invite|option|permission|search|robot|request|leave_group/], ['管理与互动', /.*/]],
  '账号、登录与等级任务': [['等级任务', /level_task/], ['安全验证与扫码', /qr|sms|captcha|slider|security/], ['登录与缓存', /login|cache/], ['账号与设备', /.*/]],
  '框架服务管理': [['插件与服务', /plugin|service/], ['节点与设备', /node|device|protocol/], ['令牌与权限', /token|permission/], ['系统与运行', /.*/]],
  'QQ 宠物': [['资料与属性', /profile|medal|vitals|attributes/], ['喂食与洗护', /food|feed|bath/], ['活动与疲劳', /activity|fatigue/], ['好友与 PK', /.*/]],
  'QQ 农场': [['农场接口', /.*/]],
}
export function buildApiSidebar() {
  const files = fs.readdirSync(directory).filter(file => file.endsWith('.md') && file !== 'index.md')
  const groups = new Map(Object.keys(rules).map(key => [key, []]))
  const seen = new Set()
  let category = ''
  for (const line of fs.readFileSync(new URL('index.md', directory), 'utf8').split('\n')) {
    if (line.startsWith('## ')) category = line.slice(3).trim()
    const match = line.match(/^\|\s*\[([^\]]+)\]\(\/api\/([^)#]+?)(?:\.html)?\)/)
    if (!match || !groups.has(category)) continue
    const name = match[2].replace(/\.html$/, '')
    if (!files.includes(name + '.md') || seen.has(name)) continue
    seen.add(name); groups.get(category).push({ name, text: match[1], link: `/api/${name}.html` })
  }
  for (const file of files) {
    const name = path.basename(file, '.md')
    if (seen.has(name)) continue
    const content = fs.readFileSync(new URL(file, directory), 'utf8')
    const text = content.match(/^#\s+(.+)/m)?.[1].replace(/`/g, '') || name
    const category = /pet/.test(name) ? 'QQ 宠物' : /group|qun/.test(name) ? '群聊管理' : /friend|qzone/.test(name) ? '好友与空间' : /account|level_task|qr|sms/.test(name) ? '账号、登录与等级任务' : /plugin|service|node|token/.test(name) ? '框架服务管理' : '系统信息'
    groups.get(category).push({ name, text, link: `/api/${name}.html` })
  }
  return [
    { text: 'API 参考', items: [{ text: 'API 总览', link: '/api/' }, { text: '通信协议', link: '/reference/protocol.html' }, { text: '事件参考', link: '/events/' }] },
    ...[...groups].filter(([,items]) => items.length).map(([text, entries]) => {
      const buckets = new Map(rules[text].map(([label]) => [label, []]))
      for (const {name, ...item} of entries) {
        const [label] = rules[text].find(([,pattern]) => pattern.test(name))
        buckets.get(label).push(item)
      }
      return { text, collapsed: true, items: [...buckets].filter(([,items]) => items.length).map(([text,items]) => ({ text, collapsed: true, items })) }
    }),
  ]
}
