import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "../../src/app/page";

describe("demo disclosure", () => {
  it("renders the mock-transaction disclosure in server HTML before JavaScript runs", () => {
    const html = renderToStaticMarkup(createElement(Home));
    expect(html).toContain("dữ liệu mẫu và giao dịch mô phỏng");
    expect(html).toContain("Bản trải nghiệm");
  });
});
