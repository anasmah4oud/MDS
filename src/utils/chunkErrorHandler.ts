let reloading = false;

export function setupChunkErrorHandler() {
  window.addEventListener("error", (event) => {
    const target = event.target as HTMLScriptElement;

    if (
      target?.tagName === "SCRIPT" &&
      target?.src &&
      !reloading
    ) {
      reloading = true;

      console.log("Chunk load failed, reloading...");

      sessionStorage.setItem("chunk-reload", "true");

      window.location.reload();
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    const message = String(event.reason || "");

    if (
      message.includes("Failed to fetch dynamically imported module") &&
      !reloading
    ) {
      reloading = true;

      console.log("Dynamic import failed, reloading...");

      sessionStorage.setItem("chunk-reload", "true");

      window.location.reload();
    }
  });
}