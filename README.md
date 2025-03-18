# Excel MCP Server

[English](./README_EN.md) | 简体中文

基于 Model Context Protocol (MCP) 的 Excel 文件处理服务器，提供 Excel 文件的读取、写入、分析等功能。

## 功能特性

- 📖 读取 Excel 文件
  - 获取工作表列表
  - 读取指定工作表数据
  - 读取所有工作表数据
- ✍️ 写入 Excel 文件

  - 创建新的 Excel 文件
  - 写入指定工作表
  - 支持多工作表写入

- 🔍 分析 Excel 结构
  - 分析工作表结构
  - 导出结构到新文件
- 💾 缓存管理

  - 自动缓存文件内容
  - 定时清理过期缓存
  - 手动清理指定文件缓存

- 📝 日志管理
  - 自动记录操作日志
  - 定期清理过期日志

## 安装

````bash
# 安装依赖
npm install

# 构建项目
npm run build
## 使用方法
### 启动服务
```bash
npm start
````

### 开发模式

```bash
npm run dev
```

### 监视模式构建

```bash
npm run watch
```

## API 工具

### 读取工具

1. readSheetNames

   - 功能：获取 Excel 文件中所有工作表的名称
   - 参数：
     - fileAbsolutePath: Excel 文件的绝对路径

2. readDataBySheetName

   - 功能：读取指定工作表的数据
   - 参数：
     - fileAbsolutePath: Excel 文件的绝对路径
     - sheetName: 工作表名称
     - headerRow: 表头行号（默认：1）
     - dataStartRow: 数据起始行号（默认：2）

3. readSheetData

   - 功能：读取所有工作表的数据
   - 参数：
     - fileAbsolutePath: Excel 文件的绝对路径
     - headerRow: 表头行号（默认：1）
     - dataStartRow: 数据起始行号（默认：2）

### 写入工具

1. writeDataBySheetName

   - 功能：写入数据到指定工作表
   - 参数：
     - fileAbsolutePath: Excel 文件的绝对路径
     - sheetName: 工作表名称
     - data: 要写入的数据数组

2. writeSheetData

   - 功能：写入数据到新的 Excel 文件
   - 参数：
     - fileAbsolutePath: 新 Excel 文件的绝对路径
     - data: 包含多个工作表数据的对象

### 分析工具

1. analyzeExcelStructure

   - 功能：分析 Excel 文件结构
   - 参数：
     - fileAbsolutePath: Excel 文件的绝对路径
     - headerRows: 表头行数（默认：1）

2. exportExcelStructure

   - 功能：导出 Excel 文件结构到新文件
   - 参数：
     - sourceFilePath: 源 Excel 文件路径
     - targetFilePath: 目标 Excel 文件路径
     - headerRows: 表头行数（默认：1）

### 通用工具

1. clearFileCache
   - 功能：清理指定 Excel 文件的缓存
   - 参数：
     - fileAbsolutePath: Excel 文件的绝对路径

## 配置说明

- 缓存配置

  - 缓存过期时间：1 小时
  - 缓存清理间隔：4 小时

- 日志配置

  - 日志保留天数：7 天
  - 清理间隔：24 小时

## 依赖项

- @modelcontextprotocol/sdk: ^1.7.0
- xlsx: ^0.18.5
- typescript: ^5.8.2

## 开发依赖

- @types/node: ^22.13.10
- nodemon: ^3.1.9
- ts-node: ^10.9.2

## 许可证

本项目采用 MIT 许可证。这意味着您可以自由地：

- 使用本软件用于商业或非商业用途
- 修改源代码
- 分发原始或修改后的代码

但需要：

- 保留原始版权声明
- 不能因使用本软件而要求作者承担责任

详细许可证文本请参见 [LICENSE](LICENSE) 文件。

---
