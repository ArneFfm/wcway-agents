# wcway integrations

This repository holds the public agent plugin, skill, ChatGPT app submission and MCP registry metadata for wcway.
The server code lives in the `ArneFfm/wcway` repository.

- Keep the manifests aligned with the live MCP `tools/list` of https://wcway.com/mcp.
- Tool names, schemas and annotations come from `apps/web/src/lib/mcp.ts` in `ArneFfm/wcway`. Change the server first.
- `test/mcp-schema.snapshot.json` is a snapshot of that tool list. Regenerate it after each tool change. Staging sits behind Access, so the snapshot comes from the source.
- Keep public toilet search at `/mcp` keyless. The account endpoint `/mcp/account` uses the existing passkey login through OAuth.
- Advertise account Events only for an authenticated account and a ready relay. Never advertise Events on the public endpoint.
- Never invent toilets in a skill or test prompt. Keep the OpenStreetMap credit in every skill.
- Do not submit to a directory, registry or portal without Arne's approval.
- Increment `version` in `server.json`, `plugin.json` and `.codex-plugin/plugin.json` together before each registry publication.
- Never commit credentials. Stage only files you changed.

## Checks

`npm test` runs the parity test against the snapshot.
`.github/workflows/check.yml` validates the manifests against their schemas, runs the parity test and compares the live tool list with the snapshot. The live comparison is skipped while wcway.com does not serve MCP.
`publish-mcp.yml` publishes `server.json` to the MCP Registry. It runs only by hand. It needs the secret `MCP_REGISTRY_PRIVATE_KEY`. See `docs/mcp-registry-publishing.md` in `ArneFfm/wcway`.

## Regenerate the snapshot

Run in a checkout of `ArneFfm/wcway`. Write a temporary test in `apps/web/src/lib` that imports `serverInfo`, `tools` and `mcpPrompts` from `./mcp`.
Keep `name`, `title`, `description`, `inputSchema` and `annotations` of each tool. Write the JSON to `test/mcp-schema.snapshot.json`. Delete the temporary test.
