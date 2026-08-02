export function createMcpAdapter(config = {}) {
  return {
    type: 'engineering.mcp',
    config,
    toWorkItems() {
      return [];
    },
  };
}
