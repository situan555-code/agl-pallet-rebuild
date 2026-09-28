import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { pageField } from "./page-field";

describe("pageField", () => {
  it("marks resource guides, hub, glossary, and calculators as light", () => {
    for (const path of [
      "/resources",
      "/resources/",
      "/resources/types-of-pallets/",
      "/resources/pallet-standards/",
      "/resources/glossary/",
      "/resources/pallet-calculators/",
      "/resources/pallet-calculators/cost-per-trip/",
      "/resources/questions/what-is-a-gma-pallet/",
      "/faq/",
      "/request-a-quote/",
      "/contact/",
      "/the-pledge/",
    ]) {
      assert.equal(pageField(path), "light", path);
    }
  });

  it("marks sell pages as dark", () => {
    for (const path of ["/", "/products/", "/who-we-are/", "/how-we-work/", "/partners/"]) {
      assert.equal(pageField(path), "dark", path);
    }
  });
});
