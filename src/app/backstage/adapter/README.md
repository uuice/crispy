# CKEditor 适配器

这个文件夹包含了 CKEditor 相关的适配器类。

## UploadAdapter

`UploadAdapter` 类用于处理 CKEditor 中的图片上传功能。

### 使用方法

1. 在组件中导入适配器：
```typescript
import { UploadAdapter } from '../../../adapter'
```

2. 在组件的构造函数中注入必要的服务：
```typescript
constructor(
  private httpService: HttpService,
  private messageService: MessageService
) {}
```

3. 添加 `onReady` 方法来配置图片上传适配器：
```typescript
onReady(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new UploadAdapter(loader, this.httpService, this.messageService)
  }
}
```

4. 在模板中的 CKEditor 组件上绑定 `ready` 事件：
```html
<ckeditor
  [editor]="Editor"
  [config]="editorConfig"
  (ready)="onReady($event)"
></ckeditor>
```

### 功能特性

- 支持图片文件上传
- 自动显示上传成功/失败的消息提示
- 与后端 `/api/admin/upload/image` 接口集成
- 支持上传取消功能（可扩展）

### 依赖

- `HttpService`: 用于发送 HTTP 请求
- `MessageService`: 用于显示消息提示
- PrimeNG API 服务

### 扩展

如果需要支持其他类型的文件上传或修改上传逻辑，可以：

1. 修改 `upload()` 方法中的 FormData 字段名
2. 更改上传接口地址
3. 自定义错误处理逻辑
4. 实现 `abort()` 方法来支持取消上传
