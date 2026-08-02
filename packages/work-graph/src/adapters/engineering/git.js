export function createGitAdapter(config = {}) {
  return {
    type: 'engineering.git',
    config,
    toWorkItems() {
      return [];
    },
  };
}
