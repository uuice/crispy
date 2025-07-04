import { MessageService } from 'primeng/api'
import { HttpService } from '../services/http.service'

/**
 * CKEditor 图片上传适配器
 * 用于处理 CKEditor 中的图片上传功能
 */
export class UploadAdapter {
  constructor(
    private loader: any,
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  /**
   * 上传文件
   * @returns Promise 返回上传结果
   */
  upload() {
    return this.loader.file.then((file: File) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('image', file)

        this.httpService.post('/api/admin/upload/image', formData).subscribe({
          next: (response: any) => {
            if (response.success) {
              resolve({
                default: response.data.url
              })
              this.messageService.add({
                severity: 'success',
                summary: '上传成功',
                detail: '图片上传成功'
              })
            } else {
              reject(response.message || '图片上传失败')
              this.messageService.add({
                severity: 'error',
                summary: '上传失败',
                detail: response.message || '图片上传失败'
              })
            }
          },
          error: () => {
            reject('图片上传失败，请重试')
            this.messageService.add({
              severity: 'error',
              summary: '上传失败',
              detail: '图片上传失败，请重试'
            })
          }
        })
      })
    })
  }

  /**
   * 取消上传
   * 可以在这里实现取消上传的逻辑
   */
  abort() {
    // 可以在这里实现取消上传的逻辑
  }
}
