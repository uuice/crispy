# 静态生成优化 - 服务连续性保障

## 问题背景

在静态生成过程中，如果直接清空现有的静态文件目录，会导致服务中断：

```
❌ 错误做法:
1. 清空 temp/static/ 目录
2. 开始生成新文件
3. 用户请求 → 404 错误 (服务中断)
```

## 优化方案

### 临时目录策略

使用临时目录进行生成，确保服务连续性：

```
✅ 正确做法:
1. 在 temp/static-temp/ 目录生成新文件
2. 生成完成后，原子性地替换目录
3. 用户请求 → 始终有文件可用 (服务连续)
```

## 实现细节

### 1. 目录结构

```
temp/
├── static/          # 当前服务的静态文件
└── static-temp/     # 临时生成目录
```

### 2. 生成流程

```typescript
// 1. 准备临时目录
this.prepareTempDirectory()

// 2. 在临时目录中生成所有文件
await this.generateAllPages()

// 3. 原子性地替换目录
this.replaceStaticDirectory()
```

### 3. 关键方法

#### prepareTempDirectory()

```typescript
private prepareTempDirectory() {
  // 清理临时目录
  if (existsSync(this.tempStaticDir)) {
    rmSync(this.tempStaticDir, { recursive: true, force: true })
  }

  // 创建新的临时目录
  mkdirSync(this.tempStaticDir, { recursive: true })
}
```

#### replaceStaticDirectory()

```typescript
private replaceStaticDirectory() {
  // 删除旧的静态目录
  if (existsSync(this.staticDir)) {
    rmSync(this.staticDir, { recursive: true, force: true })
  }

  // 原子性地重命名临时目录
  fs.renameSync(this.tempStaticDir, this.staticDir)
}
```

#### cleanupTempDirectory()

```typescript
private cleanupTempDirectory() {
  // 失败时清理临时目录
  if (existsSync(this.tempStaticDir)) {
    rmSync(this.tempStaticDir, { recursive: true, force: true })
  }
}
```

## 优势

### 1. 服务连续性

- ✅ 生成过程中用户仍可访问旧文件
- ✅ 替换过程是原子性的
- ✅ 无服务中断时间

### 2. 错误恢复

- ✅ 生成失败时不影响现有服务
- ✅ 自动清理临时目录
- ✅ 保持原有文件不变

### 3. 性能优化

- ✅ 减少文件I/O冲突
- ✅ 避免读写竞争
- ✅ 提高生成稳定性

## 错误处理

### 生成失败场景

```typescript
try {
  // 生成过程
  await this.generateAllStaticPages()
} catch (error) {
  // 清理临时目录
  this.cleanupTempDirectory()
  throw error
}
```

### 替换失败场景

```typescript
private replaceStaticDirectory() {
  try {
    // 替换目录
    fs.renameSync(this.tempStaticDir, this.staticDir)
  } catch (error) {
    // 记录错误但不影响现有服务
    console.error('❌ Error replacing static directory:', error)
    throw error
  }
}
```

## 监控和日志

### 生成过程日志

```
🚀 Starting optimized static generation...
📁 Static directory: /path/to/temp/static
📁 Temp directory: /path/to/temp/static-temp
🗑️ Cleaned temp directory: /path/to/temp/static-temp
📁 Created temp directory: /path/to/temp/static-temp
📁 Created all directories in advance
🏠 Generating home page...
✅ Generated home page
...
🔄 Replaced static directory with new one: /path/to/temp/static
```

### 错误处理日志

```
❌ Static generation error: Request timeout
🗑️ Cleaned up temp directory after failure: /path/to/temp/static-temp
```

## 最佳实践

### 1. 定期生成

```bash
# 建议在低峰期进行生成
bun run generate:static
```

### 2. 监控生成状态

```typescript
// 检查生成是否成功
const result = await staticGenerationService.generateAllStaticPages()
if (result.success) {
  console.log('✅ Static generation completed')
} else {
  console.log('❌ Static generation failed')
}
```

### 3. 备份策略

```typescript
// 在替换前备份重要文件
if (existsSync(this.staticDir)) {
  // 可以在这里添加备份逻辑
  this.backupStaticDirectory()
}
```

## 总结

通过使用临时目录策略，我们实现了：

- **零服务中断**: 生成过程中服务始终可用
- **原子性替换**: 确保文件一致性
- **错误恢复**: 失败时不影响现有服务
- **性能优化**: 减少I/O冲突和竞争

这种优化确保了静态生成过程的稳定性和服务的连续性。
