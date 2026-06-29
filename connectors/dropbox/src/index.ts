import type { Connector } from "../../../packages/connector-sdk/src/index.js";

export const dropboxConnector: Connector = {
  manifest: {
    id: "dropbox",
    name: "Dropbox",
    category: "content",
    description: "Content storage, project backup, asset sync, and share-link connector.",
    authType: "oauth",
    permissions: [
      {
        id: "dropbox.read-files",
        label: "Read Dropbox files",
        level: "read",
        description: "Allows browsing and reading approved Dropbox folders.",
      },
      {
        id: "dropbox.write-files",
        label: "Write Dropbox files",
        level: "write",
        description: "Allows uploading and updating approved Dropbox files.",
      },
    ],
  },
  actions: [],
  async health() {
    return {
      state: "not-configured",
      message: "Dropbox connector shell created. OAuth setup required.",
      checkedAt: new Date().toISOString(),
    };
  },
};
