# Loonaut agent integrations

Official agent integration files for [Loonaut](https://loonaut.com/agents.md).

Loonaut finds public toilets worldwide.
It shows distance, walk time, access rule, fee, opening state and wheelchair access.
Public toilet search needs no account or API key.
The optional account connection uses your existing Loonaut passkey through OAuth.
Toilet data is © OpenStreetMap contributors, ODbL-1.0.

Read the [agent guide](https://loonaut.com/agents.md) and the [OpenAPI description](https://loonaut.com/openapi.json).

## Connect with MCP

Both connections use Streamable HTTP:

| Connection | Endpoint | Access |
| --- | --- | --- |
| Public toilet search | `https://loonaut.com/mcp` | Keyless |
| Your partner listings and Events | `https://loonaut.com/mcp/account` | Loonaut passkey through OAuth |

Both endpoints support MCP `2026-07-28`. Modern requests use per-request metadata and matching HTTP headers.
Public search retains its legacy protocol and result shapes. The public server card advertises no Events.

| Tool | Arguments | Effect |
|---|---|---|
| `find_toilets_near` | `place` or `lat` and `lon`; `country`, `limit`, `open_now`, `wheelchair`, `changing_table`, `free`, `no_purchase_needed` | Read-only. Up to 20 toilets sorted by distance. |
| `get_toilet` | `id` | Read-only. One toilet: hours, access rule, fee, last confirmation. |

### Claude Code

```sh
claude mcp add --transport http loonaut https://loonaut.com/mcp
```

### Codex CLI

```sh
codex mcp add loonaut --url https://loonaut.com/mcp
```

## Account access and Events

Use an MCP client that supports OAuth. Account discovery lives at `https://loonaut.com/.well-known/oauth-protected-resource/mcp/account`.
The issuer metadata lives at `https://loonaut.com/.well-known/oauth-authorization-server`.
Register a public client at `/oauth/register`. Use authorization code, PKCE S256, scope `account:events` and the exact account resource URI.
Sign in with your existing passkey and approve the displayed client and return URL.
Keep tokens in your client's credential store. Do not put tokens in connection URLs or repository files.

The account endpoint adds the read-only `get_my_partner_listings` tool.
It reads your claims, moderation state, billing state and current profiles.
Revoke account connections at `https://loonaut.com/oauth/connections`.
Clients can revoke credentials at `/oauth/revoke`.

Authenticated account discovery advertises Events only while the configured relay is ready.
Check `server/discover` with your account access token before subscribing.

| Event | Change | Optional filters |
| --- | --- | --- |
| `partner.claim.status_changed` | Your claim changes moderation status | `listing_id`, `toilet_id` |
| `partner.profile.updated` | Your profile changes conditions, hours or temporary closure | `listing_id`, `toilet_id` |

Both filters must match when supplied. Subscribe checks ownership; delivery checks it again.
Filtered profile monitoring requires an approved claim. Revocation and account deletion stop delivery.
Subscriptions last at most 24 hours. Refresh before `refreshBefore`. Unsubscribe stops the subscription.
Webhook delivery has no replay. See the [account guidance](https://loonaut.com/auth.md).

The public search tools retain their MCP App resource for hosts that support it.
These files do not prove native ChatGPT rescan, Events subscription, callback delivery or a host response.
The ChatGPT submission and schema snapshot cover the public search tools.

## Files

| Path | Use |
|---|---|
| `plugin.json`, `.mcp.json`, `mcp.json` | Claude plugin and MCP client manifests. |
| `.codex-plugin/plugin.json` | Codex plugin manifest. |
| `skills/loonaut-find-toilet/SKILL.md` | Skill: tool order, result fields, attribution rule. |
| `server.json` | MCP Registry entry `com.loonaut/loonaut`, with public and account endpoints. |
| `chatgpt-app-submission.json` | ChatGPT app submission data: annotations, test prompts. |
| `test/` | Parity test and the MCP schema snapshot. |

Registry and plugin versions are `0.2.0`. The server source also reports `0.2.0`; a registry listing needs a successful publisher run and readback.

## Check

```sh
npm test
```

## Licence

MIT. See [LICENSE](LICENSE).
