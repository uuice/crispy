// 工具函数：过滤 undefined 字段
export const filterUndefined = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const filtered: Partial<T> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value) {
      filtered[key as keyof T] = value
    }
  }
  return filtered
}

// Utility function: Transform BigInt values
export const transformBigInt = (data: any): any => {
  if (data === null || data === undefined) {
    return data
  }

  if (typeof data === 'bigint') {
    return data.toString()
  }

  if (Array.isArray(data)) {
    return data.map(transformBigInt)
  }

  if (typeof data === 'object') {
    const transformed: any = {}
    for (const key in data) {
      transformed[key] = transformBigInt(data[key])
    }
    return transformed
  }

  return data
}
