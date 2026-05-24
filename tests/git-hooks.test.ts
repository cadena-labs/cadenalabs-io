import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(import.meta.dirname, "..");
const hookPath = path.join(repoRoot, ".githooks", "commit-msg");

function runHook(message: string) {
  const directory = mkdtempSync(path.join(tmpdir(), "commit-msg-hook-"));
  const messagePath = path.join(directory, "COMMIT_EDITMSG");
  writeFileSync(messagePath, message);

  try {
    execFileSync(hookPath, [messagePath], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: "pipe",
    });

    return { status: 0, stderr: "" };
  } catch (error) {
    assert.equal(typeof error, "object");
    assert.notEqual(error, null);

    const { status, stderr } = error as {
      status: number;
      stderr: string;
    };

    return { status, stderr };
  }
}

test("commit-msg hook rejects AI co-author trailers", () => {
  const result = runHook(`Add hook coverage

Co-authored-by: Claude <noreply@anthropic.com>
`);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /AI co-author trailers are not allowed/);
});

test("commit-msg hook accepts human co-author trailers", () => {
  const result = runHook(`Add hook coverage

Co-authored-by: Jane Developer <jane@example.com>
`);

  assert.equal(result.status, 0);
});
