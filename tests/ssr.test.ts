import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

test("the installed React packages can render on the server", () => {
  assert.equal(
    renderToString(createElement("p", null, "Cadena Labs")),
    "<p>Cadena Labs</p>",
  );
});
