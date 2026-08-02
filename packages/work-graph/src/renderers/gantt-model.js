export function createGanttModel(graph) {
  const items = graph?.items ?? [];

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    status: item.status,
    start: item.start ?? null,
    end: item.end ?? null,
  }));
}
