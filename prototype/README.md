# AgentSam Timeline Prototype

The prototype is moving from static Gantt markup to a WorkGraph-driven renderer.

Flow:

```
demo-workgraph.js
        |
        v
workgraph-runtime.js
        |
        v
timeline renderer
        |
        v
UI
```

The timeline is a projection of the graph, not the source of truth.

Supported projections:

- task timeline bars
- agent lanes
- evidence/artifact drawer data
- timeline event markers
