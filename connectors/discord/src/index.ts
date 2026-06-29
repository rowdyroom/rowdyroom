import type { Connector } from "../../../packages/connector-sdk/src/index.js";

export const discordConnector: Connector = {
  manifest: {
    id: "discord",
    name: "Discord",
    category: "streaming",
    description: "Discord community, staff room, voice, and announcement connector.",
    authType: "api-key",
    permissions: [
      {
        id: "discord.send-message",
        label: "Send Discord messages",
        level: "write",
        description: "Allows the Engine to send messages through approved Discord channels.",
      },
    ],
  },
  actions: [],
  async health() {
    return {
      state: "not-configured",
      message: "Discord connector shell created. Bot token setup required.",
      checkedAt: new Date().toISOString(),
    };
  },
};
