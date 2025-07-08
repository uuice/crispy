# 样式文件说明

这个文件夹包含了项目的自定义样式文件。

## 文件列表

### `ckeditor.less`
CKEditor 5 的样式重置文件，使用 PrimeNG CSS 变量来保持主题一致性。

**主要功能：**
- 工具栏样式适配
- 编辑区域样式
- 下拉菜单和弹框的 z-index 修复
- 响应式设计

### `quill-primeng.less`
Quill 编辑器（PrimeNG p-editor）的样式重置文件，完全适配 PrimeNG 主题系统。

**主要功能：**
- 工具栏样式使用 PrimeNG CSS 变量
- 编辑区域样式适配
- 下拉菜单和工具提示样式
- PrimeNG Dialog 兼容性
- 暗色主题支持
- 高对比度模式支持
- 响应式设计
- 错误状态和禁用状态样式

## 使用的 PrimeNG CSS 变量

### 颜色变量
- `--p-content-background`: 内容背景色
- `--p-content-border-color`: 边框颜色
- `--p-content-hover-background`: 悬停背景色
- `--p-text-color`: 主要文本颜色
- `--p-text-muted-color`: 次要文本颜色
- `--p-primary-color`: 主色调
- `--p-primary-contrast-color`: 主色调对比色
- `--p-primary-600`: 主色调深色变体
- `--p-red-500`: 错误状态颜色

### 布局变量
- `--p-border-radius`: 圆角半径
- `--p-font-family`: 字体系列
- `--p-font-size`: 字体大小
- `--p-overlay-shadow`: 弹层阴影

## 特殊处理

### PrimeNG Dialog 兼容性
为了确保编辑器在 PrimeNG Dialog 中正常工作，特别处理了：
- z-index 层级问题
- 工具提示和下拉菜单的显示
- 编辑器的最小高度

### 主题适配
- 支持亮色和暗色主题自动切换
- 支持高对比度模式
- 响应式设计适配移动设备

### 状态样式
- 错误状态（ng-invalid.ng-dirty）
- 禁用状态（p-disabled）
- 焦点状态
- 悬停状态
- 激活状态

## 导入方式

在 `src/styles.less` 中导入：

```less
@import './styles/quill-primeng.less';
@import './styles/ckeditor.less';
```

## 自定义扩展

如果需要进一步自定义样式，建议：

1. 创建新的 `.less` 文件
2. 使用 PrimeNG CSS 变量保持一致性
3. 在 `src/styles.less` 中导入
4. 使用适当的选择器优先级

## 注意事项

- 所有样式都使用 `!important` 来覆盖默认样式
- 确保与 PrimeNG 主题系统兼容
- 支持主题切换和响应式设计
- 考虑了无障碍访问需求
