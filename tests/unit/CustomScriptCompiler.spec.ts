import { describe, expect, it } from "vitest";
import { compileScript } from "@/services/CustomScriptCompiler";

const validDecide = `
function decide(self, opponent) {
  return { left: false, right: true, up: false, down: false, action1: false, action2: false, action3: false };
}
`;

describe("compileScript", () => {
  it("compiles a valid decide function", () => {
    const result = compileScript(validDecide);

    expect(result.error).toBeNull();
    expect(result.compiledDecideFunction).toBeTypeOf("function");

    const actions = result.compiledDecideFunction!(
      {} as never,
      {} as never,
    );
    expect(actions.right).toBe(true);
    expect(actions.left).toBe(false);
  });

  it("rejects scripts without decide", () => {
    const result = compileScript("const x = 1;");

    expect(result.compiledDecideFunction).toBeNull();
    expect(result.error).toMatch(/decide/i);
  });

  it("rejects infinite loops before compilation", () => {
    const result = compileScript(`
      function decide(self, opponent) {
        while (true) {}
        return { left: false, right: false, up: false, down: false, action1: false, action2: false, action3: false };
      }
    `);

    expect(result.compiledDecideFunction).toBeNull();
    expect(result.error).toMatch(/INFINITE LOOP/i);
  });

  it("returns syntax errors for invalid JavaScript", () => {
    const result = compileScript("function decide( {");

    expect(result.compiledDecideFunction).toBeNull();
    expect(result.error).toMatch(/Syntax Error/i);
  });
});
