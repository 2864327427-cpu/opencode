import { PermissionV1 } from "@opencode-ai/core/v1/permission"
import type { Permission } from "../permission"
import type { Agent } from "./agent"

/**
 * Parent agent's edit-deny rules that must always be forwarded to subagent
 * sessions. Plan Mode's file-edit restriction lives on the agent ruleset,
 * not the session, so forwarding prevents silent bypass. (#26514)
 */
export function parentAgentDenyRules(parentAgent: Agent.Info | undefined): PermissionV1.Ruleset {
  return parentAgent?.permission.filter((rule) => rule.action === "deny" && rule.permission === "edit") ?? []
}

/**
 * Parent session's deny rules and external_directory rules that must always
 * be forwarded to subagent sessions.
 */
export function parentSessionDenyRules(parentSessionPermission: PermissionV1.Ruleset): PermissionV1.Ruleset {
  return parentSessionPermission.filter(
    (rule) => rule.permission === "external_directory" || rule.action === "deny",
  )
}

/**
 * Build the `permission` ruleset for a subagent's session when it's spawned
 * via the task tool. Combines:
 *
 * 1. The parent **agent's** edit-class deny rules — Plan Mode's file-edit
 *    restriction lives on the agent ruleset, not on the session, so a
 *    subagent that only inherited the parent SESSION's permission would
 *    silently bypass it. (#26514)
 * 2. The parent **session's** deny rules and external_directory rules —
 *    same forwarding the original code already did.
 * 3. Default `todowrite` and `task` denies if the subagent's own ruleset
 *    doesn't already permit them.
 */
export function deriveSubagentSessionPermission(input: {
  parentSessionPermission: PermissionV1.Ruleset
  parentAgent: Agent.Info | undefined
  subagent: Agent.Info
}): PermissionV1.Ruleset {
  const canTask = input.subagent.permission.some((rule) => rule.permission === "task")
  const canTodo = input.subagent.permission.some((rule) => rule.permission === "todowrite")
  return [
    ...parentAgentDenyRules(input.parentAgent),
    ...parentSessionDenyRules(input.parentSessionPermission),
    ...(canTodo ? [] : [{ permission: "todowrite" as const, pattern: "*" as const, action: "deny" as const }]),
    ...(canTask ? [] : [{ permission: "task" as const, pattern: "*" as const, action: "deny" as const }]),
  ]
}
