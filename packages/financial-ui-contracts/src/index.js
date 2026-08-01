export const baselineNavigation = Object.freeze([
  Object.freeze({ id: 'dashboard', label: 'Dashboard', purpose: 'Show the operating picture and next required actions.' }),
  Object.freeze({ id: 'relationships', label: 'Clients', purpose: 'Manage every business relationship, project, payment, and timeline.' }),
  Object.freeze({ id: 'pipeline', label: 'Pipeline', purpose: 'Move qualified opportunities through explicit stages.' }),
  Object.freeze({ id: 'follow-ups', label: 'Follow-ups', purpose: 'Complete overdue, due-today, and upcoming commitments.' }),
  Object.freeze({ id: 'insights', label: 'Insights', purpose: 'Explain revenue, value, activity, risk, and financial performance.' })
]);

export const baselineScreens = Object.freeze({
  dashboard: Object.freeze({
    primaryAction: 'relationship.create',
    widgets: ['revenue.total', 'relationships.total', 'leads.new', 'relationships.active', 'followups.due', 'activity.recent', 'attention.required']
  }),
  relationships: Object.freeze({
    primaryAction: 'relationship.create',
    rowActions: ['relationship.open', 'followup.create', 'project.create', 'payment.record'],
    detailSections: ['summary', 'contacts', 'projects', 'payments', 'timeline', 'notes', 'documents']
  }),
  pipeline: Object.freeze({
    primaryAction: 'opportunity.create',
    cardActions: ['opportunity.open', 'opportunity.advance', 'followup.create'],
    requirements: ['stage-value', 'stage-owner', 'stalled-state', 'explicit-empty-state']
  }),
  'follow-ups': Object.freeze({
    primaryAction: 'followup.create',
    buckets: ['overdue', 'today', 'upcoming', 'completed'],
    rowActions: ['followup.complete', 'followup.reschedule', 'relationship.open']
  }),
  insights: Object.freeze({
    primaryAction: 'report.export',
    widgets: ['relationships.by-revenue', 'relationships.by-stage', 'average-value', 'active-projects', 'forecast.summary', 'budget-variance']
  })
});

export function validateActionRegistry(actions) {
  const ids = new Set();
  for (const action of actions) {
    if (!action?.id || !action?.label || typeof action.execute !== 'function') throw new TypeError('every UI action requires id, label, and execute');
    if (ids.has(action.id)) throw new TypeError(`duplicate UI action: ${action.id}`);
    ids.add(action.id);
  }
  return true;
}

export function createCapabilityMap(capabilities = {}) {
  return Object.freeze({
    persistence: capabilities.persistence || 'fixture',
    auth: capabilities.auth || 'isolated',
    payments: capabilities.payments || 'disabled',
    email: capabilities.email || 'disabled',
    documents: capabilities.documents || 'fixture',
    ai: capabilities.ai || 'shadow',
    authoritativeWrites: capabilities.authoritativeWrites === true
  });
}
