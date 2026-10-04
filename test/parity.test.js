import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const json = (path) => JSON.parse(read(path));
const live = json("test/mcp-schema.snapshot.json");
const names = live.tools.map((tool) => tool.name).sort();

test("ChatGPT submission lists exactly the live tools with the live annotations", () => {
  const submission = json("chatgpt-app-submission.json");
  assert.deepEqual(Object.keys(submission.tools).sort(), names);
  for (const tool of live.tools) {
    const { readOnlyHint, openWorldHint, destructiveHint } = tool.annotations;
    assert.deepEqual(submission.tools[tool.name].annotations, { readOnlyHint, openWorldHint, destructiveHint });
  }
});

test("submission test cases trigger only live tools", () => {
  const submission = json("chatgpt-app-submission.json");
  for (const testCase of submission.test_cases) {
    for (const name of testCase.tools_triggered.split(", ")) assert.ok(names.includes(name), name);
  }
  for (const testCase of submission.negative_test_cases) assert.equal(testCase.tools_triggered, null);
});

test("every skill names live tools only and covers each tool", () => {
  const skill = read("skills/wcway-find-toilet/SKILL.md");
  const used = new Set([...skill.matchAll(/`((?:find|get)_[a-z_]+)`/g)].map((match) => match[1]));
  for (const name of used) assert.ok(names.includes(name), `unknown tool ${name}`);
  for (const name of names) assert.ok(used.has(name), `skill misses ${name}`);
});

test("every manifest points at the live MCP URL", () => {
  const url = "https://wcway.com/mcp";
  assert.equal(json("mcp.json").mcpServers.wcway.url, url);
  assert.equal(json(".mcp.json").mcpServers.wcway.url, url);
  assert.equal(json("server.json").remotes[0].url, url);
});

test("plugin and registry versions match", () => {
  const version = json("server.json").version;
  assert.equal(json("plugin.json").version, version);
  assert.equal(json(".codex-plugin/plugin.json").version, version);
});
