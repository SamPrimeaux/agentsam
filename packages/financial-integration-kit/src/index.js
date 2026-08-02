export function defineAdapter({ id, version = '0.1.0', capabilities = [], read, write = null, healthcheck = null }) {
  if (!id || typeof read !== 'function') throw new TypeError('adapter id and read function are required');
  return Object.freeze({ id, version, capabilities: Object.freeze([...capabilities]), read, write, healthcheck });
}

export function createIsolatedRuntime({ adapters = [], fixtures = {}, allowAuthoritativeWrites = false } = {}) {
  const registry = new Map(adapters.map((adapter) => [adapter.id, adapter]));
  return Object.freeze({
    mode: allowAuthoritativeWrites ? 'controlled-write' : 'read-only-sandbox',
    listAdapters: () => [...registry.keys()],
    read: async (adapterId, request) => {
      const adapter = registry.get(adapterId);
      if (!adapter) throw new Error(`adapter not registered: ${adapterId}`);
      return adapter.read({ ...request, fixtures });
    },
    write: async (adapterId, request) => {
      if (!allowAuthoritativeWrites) throw new Error('authoritative writes are disabled in this runtime');
      const adapter = registry.get(adapterId);
      if (!adapter?.write) throw new Error(`adapter does not support writes: ${adapterId}`);
      return adapter.write(request);
    }
  });
}

export function createImportReceipt({ adapterId, sourceId, importedAt, recordCount, checksum, warnings = [] }) {
  if (!adapterId || !sourceId || !importedAt || !Number.isInteger(recordCount) || !checksum) {
    throw new TypeError('complete import receipt fields are required');
  }
  return Object.freeze({ adapterId, sourceId, importedAt, recordCount, checksum, warnings: Object.freeze([...warnings]) });
}

export function evaluatePromotionGate({ deterministicTests, fixtureParity, permissionsVerified, evidenceComplete, shadowReviewed }) {
  const checks = { deterministicTests, fixtureParity, permissionsVerified, evidenceComplete, shadowReviewed };
  const failures = Object.entries(checks).filter(([, passed]) => passed !== true).map(([name]) => name);
  return Object.freeze({ promotable: failures.length === 0, failures });
}
