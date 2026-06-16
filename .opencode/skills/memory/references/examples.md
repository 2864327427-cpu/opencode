# 输出格式示例

## 列表展示

```
全局 (2 条, 2 P1):
  [P1] dev-workflow: 每次开发前确保能回滚 (权重: 1.0, validated, 0 天)
  [P1] programming-language: 喜欢用 Python 编程 (权重: 1.0, validated, 0 天)
```

## 健康检查

```
🔍 记忆健康检查:

✅ 健康 (权重 ≥ 0.5): 2
⚠️ 低权重 (< 0.5): 0
🕒 过时 (90+ 天): 0

建议:
  - 无需清理。
```

## 冲突解决

项目记忆与全局记忆矛盾时：
- 项目优先
- 明确告知："项目覆盖全局：runtime（Bun 而非 Node）。"
- 提供更新或删除冲突全局记忆的选项

同作用域内矛盾时：
- 更高的 `evidence` 优先（`validated` > `observed` > `hypothesis`）
- 相同证据？较新的 `ts` 优先
- 播报："已更新 'runtime' 偏好（更新，validated）。"

## 记忆管理命令

| 用户说 | 动作 |
|--------|------|
| "列出记忆" / "显示记忆" / "show memories" | 读取 memory.json，按权重降序展示所有事实 |
| "添加记忆 X" / "记住 X" / "remember X" | 添加新事实（evidence: validated, tier: P1） |
| "忘记 X" / "删除记忆 X" / "forget X" | 搜索匹配的事实，删除并确认 |
| "清空记忆" / "clear all memories" | 请求确认后删除所有事实 |
| "项目记忆 X" / "remember X for this project" | 添加到项目作用域（.opencode/memory.json） |
| "检查记忆" / "记忆健康度" / "check memories" | 运行漂移检测，列出低权重和过时记忆 |
| "清理记忆" / "整理记忆" / "clean up memories" | 展示整合建议，请求确认 |

**重要**：删除或修改记忆前必须请求用户确认。
