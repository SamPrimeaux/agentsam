const RELATIONSHIP_TYPES = new Set(['customer', 'lead', 'vendor', 'investor', 'lender', 'advisor', 'partner']);

export function createRelationship(input) {
  const id = String(input?.id || '').trim();
  const displayName = String(input?.displayName || '').trim();
  const relationshipType = String(input?.relationshipType || '').trim();
  if (!id || !displayName) throw new TypeError('id and displayName are required');
  if (!RELATIONSHIP_TYPES.has(relationshipType)) throw new TypeError(`unsupported relationshipType: ${relationshipType}`);
  return Object.freeze({
    id,
    displayName,
    relationshipType,
    stage: input.stage || 'unqualified',
    ownerId: input.ownerId || null,
    contact: Object.freeze({ ...(input.contact || {}) }),
    tags: Object.freeze([...(input.tags || [])]),
    createdAt: input.createdAt || new Date().toISOString()
  });
}

export function createTimelineEvent({ id, relationshipId, type, occurredAt, summary, metadata = {} }) {
  if (!id || !relationshipId || !type || !occurredAt || !summary) throw new TypeError('timeline event fields are required');
  return Object.freeze({ id, relationshipId, type, occurredAt, summary, metadata: Object.freeze({ ...metadata }) });
}

export function createFollowUp({ id, relationshipId, dueAt, title, status = 'open', priority = 'normal' }) {
  if (!id || !relationshipId || !dueAt || !title) throw new TypeError('follow-up fields are required');
  return Object.freeze({ id, relationshipId, dueAt, title, status, priority });
}

export function groupFollowUpsByUrgency(followUps, now = new Date()) {
  const nowMs = now.getTime();
  return followUps.reduce((groups, item) => {
    const dueMs = new Date(item.dueAt).getTime();
    const bucket = dueMs < nowMs ? 'overdue' : dueMs - nowMs < 86_400_000 ? 'today' : 'upcoming';
    groups[bucket].push(item);
    return groups;
  }, { overdue: [], today: [], upcoming: [] });
}

export function summarizeRelationship({ relationship, timeline = [], projects = [], payments = [] }) {
  return Object.freeze({
    relationship,
    recentActivity: [...timeline].sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt)).slice(0, 20),
    activeProjects: projects.filter((project) => project.status === 'active'),
    lifetimeValueMinor: payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amountMinor, 0)
  });
}
