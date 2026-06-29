'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState } from 'react'

import type { Theme } from './types'

import { useTheme } from '..'
import { themeLocalStorageKey } from './types'
import { frontendLabels } from '@/i18n/frontend-labels'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [value, setValue] = useState('')

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
      setValue('auto')
    } else {
      setTheme(themeToSet)
      setValue(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue(preference ?? 'auto')
  }, [])

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger
        aria-label={frontendLabels.theme.label}
        className="w-auto bg-transparent gap-2 pl-0 md:pl-3 border-none text-white/80"
      >
        <SelectValue placeholder={frontendLabels.theme.label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">{frontendLabels.theme.auto}</SelectItem>
        <SelectItem value="light">{frontendLabels.theme.light}</SelectItem>
        <SelectItem value="dark">{frontendLabels.theme.dark}</SelectItem>
      </SelectContent>
    </Select>
  )
}
