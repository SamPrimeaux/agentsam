# Work Graph

Core primitive for AgentSam workflows.

The same graph powers multiple adapters:

## Engineering adapter

- Git
- MCP tools
- Tests
- Deployments

## Business adapter

- Projects
- Clients
- Approvals
- Milestones

The Gantt/timeline UI is only a renderer over this graph.

```
WorkGraph
 ├── WorkItem
 ├── Dependency
 ├── TimelineEvent
 ├── Artifact
 ├── Evidence
 └── Actor
```
