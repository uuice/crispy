'use client'

import React, { useCallback, useEffect, useState } from 'react'

import type { DocBlock, DocSection } from './content'
import { DEV_DOC_SECTIONS } from './content'
import './dev-docs.scss'

function renderBlock(block: DocBlock, index: number) {
  switch (block.type) {
    case 'p':
      return (
        <p className="dev-docs__p" key={index}>
          {block.text}
        </p>
      )
    case 'h3':
      return (
        <h3 className="dev-docs__h3" key={index}>
          {block.text}
        </h3>
      )
    case 'pre':
      return (
        <pre className="dev-docs__pre" key={index}>
          <code>{block.text}</code>
        </pre>
      )
    case 'ul':
      return (
        <ul className="dev-docs__ul" key={index}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol className="dev-docs__ol" key={index}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      )
    case 'table':
      return (
        <div className="dev-docs__table-wrap" key={index}>
          <table className="dev-docs__table">
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    default:
      return null
  }
}

function renderSection(section: DocSection) {
  return (
    <section className="dev-docs__section" id={section.id} key={section.id}>
      <h2 className="dev-docs__h2">{section.title}</h2>
      {section.blocks.map((block, index) => renderBlock(block, index))}
    </section>
  )
}

export function DevDocsContent() {
  const [activeId, setActiveId] = useState(DEV_DOC_SECTIONS[0]?.id ?? '')

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) {
          setActiveId(visible.target.id)
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5] },
    )

    DEV_DOC_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="dev-docs">
      <header className="dev-docs__header">
        <h1 className="dev-docs__title">Crispy 二次开发文档</h1>
        <p className="dev-docs__subtitle">
          技术栈、目录、配置、命令、Collection 字段、权限、AI、MCP、部署与 CI 完整参考。
        </p>
      </header>

      <div className="dev-docs__layout">
        <nav aria-label="文档目录" className="dev-docs__toc">
          <p className="dev-docs__toc-label">目录</p>
          <ul>
            {DEV_DOC_SECTIONS.map(({ id, title }) => (
              <li key={id}>
                <button
                  className={`dev-docs__toc-link${activeId === id ? ' dev-docs__toc-link--active' : ''}`}
                  type="button"
                  onClick={() => scrollTo(id)}
                >
                  {title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="dev-docs__body">{DEV_DOC_SECTIONS.map(renderSection)}</div>
      </div>
    </div>
  )
}

export default DevDocsContent
