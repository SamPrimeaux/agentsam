import { useEffect, useMemo, useState } from 'react';
import { createAgentClient, createArtifactsClient, createAuthClient, createProjectsClient, createWorkClient, createWorkspaceClient, detectClientEnvironment, type WorkspaceSummary, type AgentSessionSummary, type ProjectSummary, type ArtifactSummary, type TicketSummary } from '@inneranimalmedia/client-core';

type Tab = 'sam' | 'projects' | 'work' | 'me';
type ChatMessage = { role: 'user' | 'assistant'; content: string };

const auth = createAuthClient();
const workspacesApi = createWorkspaceClient();
const agent = createAgentClient();
const projectsApi = createProjectsClient();
const artifactsApi = createArtifactsClient();
const workApi = createWorkClient();

export function MobileApp() {
  const environment = useMemo(() => detectClientEnvironment(), []);
  const [tab, setTab] = useState<Tab>('sam');
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [workspaceId, setWorkspaceId] = useState('');
  const [userLabel, setUserLabel] = useState('');
  const [sessions, setSessions] = useState<AgentSessionSummary[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [artifacts, setArtifacts] = useState<ArtifactSummary[]>([]);

  const refreshSessions = async () => {
    try { setSessions(await agent.listSessions()); } catch { /* auth/bootstrap owns visible error */ }
  };

  const refreshMobileData = async (activeWorkspaceId: string) => {
    const [projectRows, ticketRows, artifactRows] = await Promise.all([
      projectsApi.list(activeWorkspaceId),
      workApi.listTickets({ limit: 24 }),
      artifactsApi.list({ workspaceId: activeWorkspaceId, limit: 16 }),
    ]);
    setProjects(projectRows);
    setTickets(ticketRows);
    setArtifacts(artifactRows);
  };

  useEffect(() => {
    void (async () => {
      try {
        const [me, ws] = await Promise.all([auth.getSessionUser(), workspacesApi.list()]);
        setUserLabel(String(me.display_name || me.name || me.email || 'Account'));
        setWorkspaces(ws.data);
        const activeId = ws.current || ws.data[0]?.id || '';
        setWorkspaceId(activeId);
        await Promise.all([refreshSessions(), activeId ? refreshMobileData(activeId) : Promise.resolve()]);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unable to load your IAM session.');
      }
    })();
  }, []);

  const switchWorkspace = async (next: string) => {
    if (!next || next === workspaceId) return;
    setError('');
    try {
      await workspacesApi.setActive(next);
      setWorkspaceId(next);
      setConversationId(null);
      setMessages([]);
      await Promise.all([refreshSessions(), refreshMobileData(next)]);
    } catch (e) { setError(e instanceof Error ? e.message : 'Workspace switch failed.'); }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || !workspaceId || busy) return;
    setInput('');
    setError('');
    setBusy(true);
    setMessages((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: '' }]);
    try {
      await agent.sendMessage({
        message: text,
        workspaceId,
        conversationId,
        environment,
        onEvent: (event) => {
          const nextId = String(event.conversationId || event.conversation_id || '').trim();
          if (nextId) setConversationId(nextId);
        },
        onText: (chunk) => setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === 'assistant') next[next.length - 1] = { ...last, content: last.content + chunk };
          return next;
        }),
      });
      await refreshSessions();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Agent Sam request failed.';
      setError(message);
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === 'assistant' && !last.content) next[next.length - 1] = { role: 'assistant', content: 'Unable to complete that request.' };
        return next;
      });
    } finally { setBusy(false); }
  };

  return <div className="mobile-app">
    <header className="mobile-header">
      <div><strong>IAM</strong><span>{workspaces.find((w) => w.id === workspaceId)?.name || 'Workspace'}</span></div>
      <select aria-label="Workspace" value={workspaceId} onChange={(e) => void switchWorkspace(e.target.value)}>
        {workspaces.map((w) => <option value={w.id} key={w.id}>{w.name}</option>)}
      </select>
    </header>
    <main className="mobile-main">
      {error ? <div className="error-banner">{error}</div> : null}
      {tab === 'sam' ? <section className="sam-screen">
        <div className="messages">
          {messages.length === 0 ? <div className="empty-state"><h1>Agent Sam</h1><p>Same workspace, conversations, tools, and execution backend as IAM desktop.</p>
            <div className="recent-chats">{sessions.slice(0, 6).map((s) => <button key={s.conversation_id || s.id} onClick={() => { setConversationId(s.conversation_id || s.id); setMessages([]); }}>{s.title || s.name || `Chat ${(s.conversation_id || s.id).slice(0, 8)}`}</button>)}</div>
          </div> : messages.map((m, i) => <div key={i} className={`message ${m.role}`}>{m.content || (busy ? 'Working…' : '')}</div>)}
        </div>
        <form className="composer" onSubmit={(e) => { e.preventDefault(); void send(); }}><textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Message Agent Sam" rows={2}/><button disabled={busy || !input.trim() || !workspaceId}>{busy ? 'Working' : 'Send'}</button></form>
      </section> : null}
      {tab === 'projects' ? <section className="simple-screen"><h1>Projects</h1><p>Focused project status and handoff surface; workstation editing stays on desktop.</p><div className="mobile-list">{projects.length ? projects.map((project) => <a className="mobile-list-row" key={project.id} href={`/dashboard/projects/${encodeURIComponent(project.id)}`}><strong>{project.name}</strong><span>{project.status || 'planning'}{project.github_repo ? ` · ${project.github_repo}` : ''}</span></a>) : <span className="muted">No projects in this workspace.</span>}</div></section> : null}
      {tab === 'work' ? <section className="simple-screen"><h1>Work</h1><p>Live tickets and recent artifacts from the same IAM platform.</p><h2>Tickets</h2><div className="mobile-list">{tickets.slice(0, 12).map((ticket) => <a className="mobile-list-row" key={ticket.id} href={`/dashboard/artifacts/tickets/${encodeURIComponent(ticket.id)}`}><strong>{ticket.title}</strong><span>{ticket.status}{ticket.priority ? ` · ${ticket.priority}` : ''}</span></a>)}</div><h2>Artifacts</h2><div className="mobile-list">{artifacts.slice(0, 10).map((artifact, i) => <a className="mobile-list-row" key={artifact.id || `artifact-${i}`} href="/dashboard/artifacts"><strong>{artifact.name}</strong><span>{artifact.artifact_type || 'artifact'}{artifact.artifact_status ? ` · ${artifact.artifact_status}` : ''}</span></a>)}</div></section> : null}
      {tab === 'me' ? <section className="simple-screen"><h1>{userLabel || 'Account'}</h1><p>Surface: {environment.surface}</p><p>Remote terminal: {environment.capabilities.remote_terminal ? 'available' : 'unavailable'} · Local terminal: {environment.capabilities.local_terminal ? 'available' : 'unavailable'}</p><a href="/dashboard/settings">Open settings</a></section> : null}
    </main>
    <nav className="tabbar" aria-label="Primary"><button className={tab === 'sam' ? 'active' : ''} onClick={() => setTab('sam')}>Sam</button><button className={tab === 'projects' ? 'active' : ''} onClick={() => setTab('projects')}>Projects</button><button className="plus" onClick={() => { setTab('sam'); setConversationId(null); setMessages([]); }}>+</button><button className={tab === 'work' ? 'active' : ''} onClick={() => setTab('work')}>Work</button><button className={tab === 'me' ? 'active' : ''} onClick={() => setTab('me')}>Me</button></nav>
  </div>;
}
