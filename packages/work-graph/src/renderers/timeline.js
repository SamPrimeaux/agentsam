export function createTimelineModel(graph) {
  return {
    items: graph?.items ?? [],
    events: graph?.events ?? [],
  };
}
