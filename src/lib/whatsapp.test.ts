import { describe, it, expect } from "vitest";
import { buildOrderMessage, subtotal, waLink } from "./whatsapp";

describe("whatsapp order", () => {
  it("free delivery from ₹399", () => {
    expect(buildOrderMessage([{ id: "a", name: "Pizza", price: 399, qty: 1 }])).toContain("free home delivery");
    expect(buildOrderMessage([{ id: "a", name: "Pizza", price: 300, qty: 1 }])).toContain("Add ₹99 more");
  });
  it("subtotal multiplies qty", () => {
    expect(subtotal([{ id: "a", name: "x", price: 80, qty: 3 }])).toBe(240);
  });
  it("uses restaurant number", () => {
    expect(waLink("hi")).toBe("https://api.whatsapp.com/send?phone=918796130029&text=hi");
  });
});
