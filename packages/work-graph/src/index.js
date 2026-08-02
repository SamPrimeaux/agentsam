export class WorkGraph {
  constructor({ id, name, items = [], events = [] } = {}) {
    this.id = id ?? crypto.randomUUID();
    this.name = name ?? 'Untitled Work Graph';
    this.items = items;
    this.events = events;
  }

  add(item) {
    this.items.push(item);
    return item;
  }

  timeline() {
    return [...this.events].sort((a, b) => a.at - b.at);
  }
}

export class WorkItem {
  constructor({ id, title, type = 'task', status = 'planned', owner = null } = {}) {
    this.id = id ?? crypto.randomUUID();
    this.title = title;
    this.type = type;
    this.status = status;
    this.owner = owner;
    this.dependencies = [];
  }
}

export class Dependency {
  constructor({ from, to, relation = 'blocks' } = {}) {
    this.from = from;
    this.to = to;
    this.relation = relation;
  }
}

export class TimelineEvent {
  constructor({ type, at = new Date(), workItemId, metadata = {} } = {}) {
    this.type = type;
    this.at = new Date(at);
    this.workItemId = workItemId;
    this.metadata = metadata;
  }
}

export class Artifact {
  constructor({ name, kind, uri = null } = {}) {
    this.name = name;
    this.kind = kind;
    this.uri = uri;
  }
}

export class Evidence {
  constructor({ type, value, artifact = null } = {}) {
    this.type = type;
    this.value = value;
    this.artifact = artifact;
  }
}

export class Actor {
  constructor({ id, name, role = 'worker' } = {}) {
    this.id = id ?? crypto.randomUUID();
    this.name = name;
    this.role = role;
  }
}
