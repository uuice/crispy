import type { PayloadRequest } from 'payload'

import { AI_CHAT_SESSION_SLUG } from '@/collections/AiChatSessions'
import type {
  AiChatSessionDetail,
  AiChatSessionSummary,
  StoredAgentMessage,
  StoredAgentToolActivity,
} from '@/ai/agent/sessionTypes'

const SESSION_LIST_LIMIT = 50

export function createMessageId(): string {
  return `msg-${crypto.randomUUID()}`
}

export function buildSessionTitle(firstUserMessage: string): string {
  const trimmed = firstUserMessage.trim().replace(/\s+/g, ' ')
  if (trimmed.length <= 48) return trimmed
  return `${trimmed.slice(0, 48)}…`
}

function normalizeStoredMessages(raw: unknown): StoredAgentMessage[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (item): item is StoredAgentMessage =>
      Boolean(item) &&
      typeof item === 'object' &&
      typeof (item as StoredAgentMessage).id === 'string' &&
      ((item as StoredAgentMessage).role === 'user' ||
        (item as StoredAgentMessage).role === 'assistant') &&
      typeof (item as StoredAgentMessage).content === 'string',
  )
}

function toSummary(doc: Record<string, unknown>): AiChatSessionSummary {
  const messages = normalizeStoredMessages(doc.messages)
  return {
    id: doc.id as string | number,
    title: String(doc.title ?? '未命名对话'),
    lastMessageAt: String(doc.lastMessageAt ?? doc.updatedAt ?? doc.createdAt ?? ''),
    updatedAt: String(doc.updatedAt ?? doc.createdAt ?? ''),
    messageCount: messages.length,
  }
}

function toDetail(doc: Record<string, unknown>): AiChatSessionDetail {
  const messages = normalizeStoredMessages(doc.messages)
  return {
    ...toSummary({ ...doc, messages }),
    messages,
  }
}

export async function createAiChatSession(
  req: PayloadRequest,
  userMessage: string,
): Promise<AiChatSessionDetail> {
  const now = new Date().toISOString()
  const userMsg: StoredAgentMessage = {
    id: createMessageId(),
    role: 'user',
    content: userMessage.trim(),
    createdAt: now,
  }

  const doc = await req.payload.create({
    collection: AI_CHAT_SESSION_SLUG,
    data: {
      title: buildSessionTitle(userMessage),
      user: req.user!.id,
      lastMessageAt: now,
      messages: [userMsg],
    },
    overrideAccess: false,
    user: req.user,
  })

  return toDetail(doc as unknown as Record<string, unknown>)
}

export async function getAiChatSession(
  req: PayloadRequest,
  sessionId: string | number,
): Promise<AiChatSessionDetail | null> {
  try {
    const doc = await req.payload.findByID({
      collection: AI_CHAT_SESSION_SLUG,
      id: sessionId,
      depth: 0,
      overrideAccess: false,
      user: req.user,
    })
    return toDetail(doc as unknown as Record<string, unknown>)
  } catch {
    return null
  }
}

export async function appendUserMessageToSession(
  req: PayloadRequest,
  sessionId: string | number,
  userMessage: string,
): Promise<AiChatSessionDetail> {
  const existing = await getAiChatSession(req, sessionId)
  if (!existing) {
    throw new Error('会话不存在或无权访问')
  }

  const now = new Date().toISOString()
  const userMsg: StoredAgentMessage = {
    id: createMessageId(),
    role: 'user',
    content: userMessage.trim(),
    createdAt: now,
  }

  const doc = await req.payload.update({
    collection: AI_CHAT_SESSION_SLUG,
    id: sessionId,
    data: {
      messages: [...existing.messages, userMsg],
      lastMessageAt: now,
    },
    overrideAccess: false,
    user: req.user,
  })

  return toDetail(doc as unknown as Record<string, unknown>)
}

export async function appendAssistantMessageToSession(
  req: PayloadRequest,
  sessionId: string | number,
  content: string,
  tools: StoredAgentToolActivity[],
): Promise<void> {
  const existing = await getAiChatSession(req, sessionId)
  if (!existing) return

  const now = new Date().toISOString()
  const assistantMsg: StoredAgentMessage = {
    id: createMessageId(),
    role: 'assistant',
    content: content.trim(),
    tools: tools.length > 0 ? tools : undefined,
    createdAt: now,
  }

  await req.payload.update({
    collection: AI_CHAT_SESSION_SLUG,
    id: sessionId,
    data: {
      messages: [...existing.messages, assistantMsg],
      lastMessageAt: now,
    },
    overrideAccess: false,
    user: req.user,
  })
}

export async function listAiChatSessions(
  req: PayloadRequest,
  limit = SESSION_LIST_LIMIT,
): Promise<AiChatSessionSummary[]> {
  const result = await req.payload.find({
    collection: AI_CHAT_SESSION_SLUG,
    limit,
    sort: '-lastMessageAt',
    depth: 0,
    overrideAccess: false,
    user: req.user,
  })

  return result.docs.map((doc) => toSummary(doc as unknown as Record<string, unknown>))
}

export async function deleteAiChatSession(
  req: PayloadRequest,
  sessionId: string | number,
): Promise<boolean> {
  const existing = await getAiChatSession(req, sessionId)
  if (!existing) return false

  await req.payload.delete({
    collection: AI_CHAT_SESSION_SLUG,
    id: sessionId,
    overrideAccess: false,
    user: req.user,
  })

  return true
}
