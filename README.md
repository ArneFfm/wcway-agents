# wcway agent integrations

[![AgentHub 已收录：wcway](https://myagenthub.cn/badge/com.wcway/wcway)](https://myagenthub.cn/p/com.wcway/wcway)
Official agent integration files for [wcway](https://wcway.com/agents.md).

wcway finds public toilets worldwide.
It shows distance, walk time, access rule, fee, opening state and wheelchair access.
There are no accounts and no API keys.
Toilet data is © OpenStreetMap contributors, ODbL-1.0.

Read the [agent guide](https://wcway.com/agents.md) and the [OpenAPI description](https://wcway.com/openapi.json).

## Connect with MCP

The remote MCP server is `https://wcway.com/mcp`. It uses Streamable HTTP and needs no authentication.

| Tool | Arguments | Effect |
|---|---|---|
| `find_toilets_near` | `place` or `lat` and `lon`; `country`, `limit`, `open_now`, `wheelchair`, `changing_table`, `free`, `no_purchase_needed` | Read-only. Up to 20 toilets sorted by distance. |
| `get_toilet` | `id` | Read-only. One toilet: hours, access rule, fee, last confirmation. |

### Claude Code

```sh
claude mcp add --transport http wcway https://wcway.com/mcp
```

### Codex CLI

```sh
codex mcp add wcway --url https://wcway.com/mcp
```

## Files

| Path | Use |
|---|---|
| `plugin.json`, `.mcp.json`, `mcp.json` | Claude plugin and MCP client manifests. |
| `.codex-plugin/plugin.json` | Codex plugin manifest. |
| `skills/wcway-find-toilet/SKILL.md` | Skill: tool order, result fields, attribution rule. |
| `server.json` | MCP Registry entry `com.wcway/wcway`. |
| `chatgpt-app-submission.json` | ChatGPT app submission data: annotations, test prompts. |
| `test/` | Parity test and the MCP schema snapshot. |

## Check

```sh
npm test
```

## Licence

MIT. See [LICENSE](LICENSE).
