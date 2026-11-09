import "@testing-library/jest-dom/vitest";

// JSDOM has no layout or viewport; scrolling is verified in the browser suite.
if (typeof window !== "undefined") {
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
}
