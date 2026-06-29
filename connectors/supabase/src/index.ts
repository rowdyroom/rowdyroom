import type { Connector } from "../../../packages/connector-sdk/src/index.js";

export const supabaseConnector: Connector = {
  manifest: {
    id: "supabase",
    name: "Supabase",
    category: "development",
    description: "Database, memory, auth, storage, and project intelligence connector.",
    authType: "api-key",
    permissions: [
      {
        id: "supabase.query",
        label: "Query Supabase",
        level: "read",
        description: "Allows read access to approved Supabase tables and views.",
      },
      {
        id: "supabase.mutate",
        label: "Write Supabase data",
        level: "sensitive",
        description: "Allows approved database writes and migrations.",
      },
    ],
  },
  actions: [],
  async health() {
    return {
      state: "not-configured",
      message: "Supabase connector shell created. Project URL and service role key required locally.",
      checkedAt: new Date().toISOString(),
    };
  },
};
