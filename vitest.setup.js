import "@testing-library/jest-dom/vitest";

// JSDOM has no layout or viewport; scrolling is verified in the browser suite.
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};
