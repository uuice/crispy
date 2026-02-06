#!/bin/bash

# 清理项目中的空文件夹
echo "开始清理空文件夹..."

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../" && pwd)"

echo "项目根目录: $PROJECT_ROOT"

# 查找并删除空文件夹
find "$PROJECT_ROOT" -type d -empty -delete

echo "空文件夹清理完成！"
