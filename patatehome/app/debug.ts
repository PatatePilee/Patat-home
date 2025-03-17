// Utilitaire pour gérer les logs en production et développement
const DEBUG = true; // Mettre à true pour activer les logs en production

export const debug = {
  log: (...args: any[]) => {
    if (DEBUG) {
      console.log("[DEBUG]", ...args);
    }
  },
  error: (...args: any[]) => {
    if (DEBUG) {
      console.error("[ERROR]", ...args);
    }
  },
  info: (...args: any[]) => {
    if (DEBUG) {
      console.info("[INFO]", ...args);
    }
  },
  warn: (...args: any[]) => {
    if (DEBUG) {
      console.warn("[WARN]", ...args);
    }
  },
};

// Fonction pour ajouter un élément visuel de debug en production
export function addDebugElement(message: string, data: any) {
  if (typeof window !== "undefined" && DEBUG) {
    const debugDiv = document.createElement("div");
    debugDiv.style.position = "fixed";
    debugDiv.style.bottom = "0";
    debugDiv.style.left = "0";
    debugDiv.style.right = "0";
    debugDiv.style.backgroundColor = "rgba(0,0,0,0.8)";
    debugDiv.style.color = "white";
    debugDiv.style.padding = "10px";
    debugDiv.style.zIndex = "9999";
    debugDiv.style.fontFamily = "monospace";
    debugDiv.style.fontSize = "12px";
    debugDiv.style.maxHeight = "200px";
    debugDiv.style.overflow = "auto";

    debugDiv.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">${message}</div>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;

    document.body.appendChild(debugDiv);
  }
}
