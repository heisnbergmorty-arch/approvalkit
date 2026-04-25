// ApprovalKit Figma plugin — Figma sandbox side.
// Exports selected frames as PNGs and forwards them to the UI iframe,
// which posts them to the configured ApprovalKit install.

figma.showUI(__html__, { width: 360, height: 480 });

interface PushMessage {
  type: "push";
  apiUrl: string;
  token: string;
  projectId: string;
  groupKey: string;
}

figma.ui.onmessage = async (msg: PushMessage | { type: "ping" }) => {
  if (msg.type === "ping") {
    figma.ui.postMessage({
      type: "selection",
      count: figma.currentPage.selection.length,
      names: figma.currentPage.selection.map((n) => n.name),
    });
    return;
  }

  if (msg.type !== "push") return;

  const sel = figma.currentPage.selection.filter(
    (n): n is FrameNode | ComponentNode | InstanceNode =>
      n.type === "FRAME" || n.type === "COMPONENT" || n.type === "INSTANCE",
  );

  if (sel.length === 0) {
    figma.notify("Select at least one frame to push.");
    figma.ui.postMessage({ type: "error", message: "No frames selected." });
    return;
  }

  const frames: { label: string; pngBase64: string }[] = [];
  for (const node of sel) {
    const bytes = await node.exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 2 } });
    frames.push({
      label: node.name,
      pngBase64: figma.base64Encode(bytes),
    });
  }

  // Hand off to UI to perform the network call (sandbox can't fetch directly).
  figma.ui.postMessage({
    type: "do-fetch",
    payload: {
      apiUrl: msg.apiUrl,
      token: msg.token,
      projectId: msg.projectId,
      groupKey: msg.groupKey,
      frames,
    },
  });
};
