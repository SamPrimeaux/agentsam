export function createProjectsAdapter(config = {}) {
  return {
    type: 'business.projects',
    config,
    toWorkItems() {
      return [];
    },
  };
}
