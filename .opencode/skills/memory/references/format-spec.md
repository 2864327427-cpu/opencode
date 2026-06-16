# 记忆 JSON 格式规范

## 文件格式 (v2)

```json
{
  "version": 2,
  "last_consolidation": "2026-06-15",
  "session_count": 0,
  "facts": [
    {
      "key": "reply-language",
      "value": "所有回复使用中文",
      "ts": "2026-06-12",
      "last_accessed": "2026-06-15",
      "session": "",
      "evidence": "validated",
      "tier": "P1"
    }
  ]
}
```

## 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `key` | ✅ | 短标识符，小写+连字符 |
| `value` | ✅ | 要记住的偏好或事实（一句话） |
| `ts` | ✅ | ISO 8601 日期，首次记录时间（如 `2026-06-15`） |
| `last_accessed` | ✅ | ISO 8601 日期，最近访问时间（每次加载/使用时更新） |
| `session` | ✅ | 会话 ID（当前始终为空字符串 `""`） |
| `evidence` | ✅ | `validated` \| `observed` \| `hypothesis` |
| `tier` | ✅ | `P1` \| `P2` \| `P3` |

## 获取当前日期和会话 ID

**当前日期**：使用 opencode 系统提示中的日期（在 `<env>` 部分，如 "Today's date: Mon Jun 15 2026"）。

**格式**：仅 ISO 8601 日期：`2026-06-15`（不含时间）

**会话 ID**：始终使用空字符串 `""`（opencode 不向 LLM 提供会话 ID）

**示例**：
```json
{
  "ts": "2026-06-15",
  "last_accessed": "2026-06-15",
  "session": ""
}
```
