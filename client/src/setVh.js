export function updateViewportHeight() {
   document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
   );
}
