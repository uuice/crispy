import Link from 'next/link'
import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'
import type { Novel } from '@/payload-types'

import type { NovelDetailPageData } from '../pages/novelDetail'
import { Banner } from '../components/Banner'

type Props = {
  data: NovelDetailPageData
}

type InfoBlockProps = {
  label: string
  value: string
}

function InfoBlock({ label, value }: InfoBlockProps) {
  return (
    <section className="section-card p-5 sm:p-6">
      <h2 className="section-title m-0 mb-3">{label}</h2>
      <p className="m-0 text-sm leading-relaxed novel-intro-text">{value}</p>
    </section>
  )
}

function CharacterList({ characters }: { characters: NonNullable<Novel['characters']> }) {
  return (
    <section className="section-card p-5 sm:p-6">
      <h2 className="section-title m-0 mb-3">{frontendLabels.novels.characters}</h2>
      <ul className="novel-character-list m-0 p-0 list-none space-y-3">
        {characters.map((character) => (
          <li className="novel-character-item" key={character.id || character.name}>
            <p className="m-0 font-medium text-sm" style={{ color: 'var(--text)' }}>
              {character.name}
              {character.role ? (
                <span className="code-label font-normal"> · {character.role}</span>
              ) : null}
            </p>
            {character.personality ? (
              <p className="m-0 mt-1 text-sm novel-intro-text">{character.personality}</p>
            ) : null}
            {character.notes ? (
              <p className="m-0 mt-1 text-xs novel-intro-text">{character.notes}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

function hasIntroContent(novel: Novel): boolean {
  return Boolean(
    novel.synopsis ||
      novel.writingStyle ||
      novel.worldBuilding ||
      novel.constraints ||
      novel.plotOutline ||
      (novel.characters && novel.characters.length > 0),
  )
}

export function NovelDetailView({ data }: Props) {
  const { novel, chapters } = data
  const firstChapter = chapters[0]

  const infoBlocks: InfoBlockProps[] = []
  if (novel.synopsis) infoBlocks.push({ label: frontendLabels.novels.synopsis, value: novel.synopsis })
  if (novel.writingStyle) {
    infoBlocks.push({ label: frontendLabels.novels.writingStyle, value: novel.writingStyle })
  }
  if (novel.worldBuilding) {
    infoBlocks.push({ label: frontendLabels.novels.worldBuilding, value: novel.worldBuilding })
  }
  if (novel.constraints) {
    infoBlocks.push({ label: frontendLabels.novels.constraints, value: novel.constraints })
  }
  if (novel.plotOutline) {
    infoBlocks.push({ label: frontendLabels.novels.plotOutline, value: novel.plotOutline })
  }

  return (
    <>
      <p className="mb-4 animate-in animate-in-delay-1">
        <Link
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium transition-colors hover:bg-(--card-border)"
          href="/novels"
          prefetch={false}
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          ← 返回小说列表
        </Link>
      </p>
      <Banner
        subtitle={novel.genre ? `${frontendLabels.novels.genre}：${novel.genre}` : undefined}
        title={novel.title}
      />

      {firstChapter ? (
        <div className="mb-4 animate-in animate-in-delay-1">
          <Link
            className="inline-flex items-center gap-1 px-4 py-2 rounded font-medium text-sm transition-opacity hover:opacity-85"
            href={firstChapter.url}
            prefetch={false}
            style={{
              background: 'var(--accent)',
              color: 'var(--page-bg)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {frontendLabels.novels.startReading} →
          </Link>
        </div>
      ) : null}

      {hasIntroContent(novel) ? (
        <div className="space-y-4 animate-in animate-in-delay-2">
          {infoBlocks.map((block) => (
            <InfoBlock key={block.label} label={block.label} value={block.value} />
          ))}
          {novel.characters && novel.characters.length > 0 ? (
            <CharacterList characters={novel.characters} />
          ) : null}
        </div>
      ) : (
        <div className="section-card p-8 text-center animate-in animate-in-delay-2">
          <p className="m-0 code-label">{frontendLabels.novels.emptyIntro}</p>
        </div>
      )}

      {chapters.length === 0 ? (
        <div className="section-card p-8 text-center animate-in animate-in-delay-3 mt-4">
          <p className="m-0 code-label">{frontendLabels.novels.noChapters}</p>
        </div>
      ) : null}
    </>
  )
}
