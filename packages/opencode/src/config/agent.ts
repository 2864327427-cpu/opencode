export * as ConfigAgent from "./agent"

import path from "path"
import { Exit, Schema } from "effect"
import { Glob } from "@opencode-ai/core/util/glob"
import { ConfigAgentV1 } from "@opencode-ai/core/v1/config/agent"
import { configEntryNameFromPath } from "./entry-name"
import * as ConfigMarkdown from "./markdown"
import { ConfigParse } from "./parse"
import { ConfigVariable } from "./variable"

export async function load(dir: string) {
  const result: Record<string, ConfigAgentV1.Info> = {}
  for (const item of await Glob.scan("{agent,agents}/**/*.md", {
    cwd: dir,
    absolute: true,
    dot: true,
    symlink: true,
  })) {
    const md = await ConfigMarkdown.parse(item).catch(() => undefined)
    if (!md) continue

    const name = configEntryNameFromPath(path.relative(dir, item), ["agent/", "agents/"])

    const substitutedContent = await ConfigVariable.substitute({
      type: "path",
      text: md.content.trim(),
      path: item,
      context: "text",
      missing: "empty",
    })

    const substitutedData: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(md.data)) {
      if (typeof value === "string" && (value.includes("{file:") || value.includes("{env:"))) {
        substitutedData[key] = await ConfigVariable.substitute({
          type: "path",
          text: value,
          path: item,
          context: "json",
          missing: "empty",
        })
      } else {
        substitutedData[key] = value
      }
    }

    const config = {
      name,
      ...substitutedData,
      prompt: substitutedContent,
    }
    result[config.name] = ConfigParse.schema(ConfigAgentV1.Info, config, item)
  }
  return result
}

export async function loadMode(dir: string) {
  const result: Record<string, ConfigAgentV1.Info> = {}
  for (const item of await Glob.scan("{mode,modes}/*.md", {
    cwd: dir,
    absolute: true,
    dot: true,
    symlink: true,
  })) {
    const md = await ConfigMarkdown.parse(item).catch(() => undefined)
    if (!md) continue

    const substitutedContent = await ConfigVariable.substitute({
      type: "path",
      text: md.content.trim(),
      path: item,
      context: "text",
      missing: "empty",
    })

    const substitutedData: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(md.data)) {
      if (typeof value === "string" && (value.includes("{file:") || value.includes("{env:"))) {
        substitutedData[key] = await ConfigVariable.substitute({
          type: "path",
          text: value,
          path: item,
          context: "json",
          missing: "empty",
        })
      } else {
        substitutedData[key] = value
      }
    }

    const config = {
      name: configEntryNameFromPath(path.relative(dir, item), ["mode/", "modes/"]),
      ...substitutedData,
      prompt: substitutedContent,
    }
    const parsed = Schema.decodeUnknownExit(ConfigAgentV1.Info)(config, { errors: "all", propertyOrder: "original" })
    if (Exit.isSuccess(parsed)) {
      result[config.name] = {
        ...parsed.value,
        mode: "primary" as const,
      }
    }
  }
  return result
}
