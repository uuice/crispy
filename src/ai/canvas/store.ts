import type { PayloadRequest } from 'payload'

import { AI_CANVAS_SLUG } from '@/collections/AiCanvases'
import { emptyCanvasGraph, isCanvasGraph, type CanvasGraph } from '@/ai/canvas/types'

export type AiCanvasSummary = {
  id: string | number
  title: string
  updatedAt: string
}

export type AiCanvasDoc = AiCanvasSummary & {
  graph: CanvasGraph
}

function asGraph(value: unknown): CanvasGraph {
  return isCanvasGraph(value) ? value : emptyCanvasGraph()
}

export async function listAiCanvases(req: PayloadRequest): Promise<AiCanvasSummary[]> {
  const result = await req.payload.find({
    collection: AI_CANVAS_SLUG,
    depth: 0,
    limit: 100,
    sort: '-updatedAt',
    overrideAccess: false,
    user: req.user,
  })

  return result.docs.map((doc) => ({
    id: doc.id,
    title: String(doc.title ?? '未命名画布'),
    updatedAt: String(doc.updatedAt),
  }))
}

export async function getAiCanvas(
  req: PayloadRequest,
  id: string | number,
): Promise<AiCanvasDoc | null> {
  try {
    const doc = await req.payload.findByID({
      collection: AI_CANVAS_SLUG,
      id,
      depth: 0,
      overrideAccess: false,
      user: req.user,
    })
    return {
      id: doc.id,
      title: String(doc.title ?? '未命名画布'),
      updatedAt: String(doc.updatedAt),
      graph: asGraph(doc.graph),
    }
  } catch {
    return null
  }
}

export async function createAiCanvas(
  req: PayloadRequest,
  title?: string,
): Promise<AiCanvasDoc> {
  const doc = await req.payload.create({
    collection: AI_CANVAS_SLUG,
    data: {
      title: title?.trim() || `画布 ${new Date().toLocaleString('zh-CN')}`,
      user: req.user!.id,
      graph: emptyCanvasGraph(),
    },
    overrideAccess: false,
    user: req.user,
  })

  return {
    id: doc.id,
    title: String(doc.title),
    updatedAt: String(doc.updatedAt),
    graph: asGraph(doc.graph),
  }
}

export async function updateAiCanvas(
  req: PayloadRequest,
  id: string | number,
  data: { title?: string; graph?: CanvasGraph },
): Promise<AiCanvasDoc | null> {
  const existing = await getAiCanvas(req, id)
  if (!existing) return null

  const doc = await req.payload.update({
    collection: AI_CANVAS_SLUG,
    id,
    data: {
      ...(data.title != null ? { title: data.title.trim() || existing.title } : {}),
      ...(data.graph != null ? { graph: data.graph } : {}),
    },
    overrideAccess: false,
    user: req.user,
  })

  return {
    id: doc.id,
    title: String(doc.title),
    updatedAt: String(doc.updatedAt),
    graph: asGraph(doc.graph),
  }
}

export async function deleteAiCanvas(
  req: PayloadRequest,
  id: string | number,
): Promise<boolean> {
  try {
    await req.payload.delete({
      collection: AI_CANVAS_SLUG,
      id,
      overrideAccess: false,
      user: req.user,
    })
    return true
  } catch {
    return false
  }
}
