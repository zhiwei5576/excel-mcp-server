# Excel MCP Server
[![npm](https://img.shields.io/npm/v/@zhiweixu/excel-mcp-server)](https://www.npmjs.com/package/@zhiweixu/excel-mcp-server)
[![smithery badge](https://smithery.ai/badge/@zhiwei5576/excel-mcp-server)](https://smithery.ai/server/@zhiwei5576/excel-mcp-server)
[简体中文](./README_CN.md) | English

Excel file processing server based on Model Context Protocol (MCP), providing functionalities for reading, writing, and analyzing Excel files.

## Features

- 📖 Read Excel Files

  - Get worksheet list
  - Read specific worksheet data
  - Read all worksheets data

- ✍️ Write Excel Files

  - Create new Excel files
  - Write to specific worksheet
  - Support multiple worksheets

- 🔍 Analyze Excel Structure

  - Analyze worksheet structure
  - Export structure to new file

- 💾 Cache Management

  - Automatic file content caching
  - Scheduled cache cleanup
  - Manual cache clearing

- 📝 Log Management
  - Automatic operation logging
  - Periodic log cleanup

## Installation

### Installing via Smithery

To install excel-mcp-server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@zhiwei5576/excel-mcp-server):

```bash
npx -y @smithery/cli install @zhiwei5576/excel-mcp-server --client claude
```

### Installing Manually
Installing via NPM
excel-mcp-server can be automatically installed by adding the following configuration to the MCP servers configuration.

Windows Platform:

```bash
{
  "mcpServers": {
    "excel": {
        "command": "cmd",
        "args": ["/c", "npx", "--yes", "@zhiweixu/excel-mcp-server"],
        "env": {
            "LOG_PATH": "[set an accessible absolute path]"
        }
    }
}
```

Other Platforms:

```bash
{
  "mcpServers": {
    "excel": {
        "command": "npx",
        "args": ["--yes", "@zhiweixu/excel-mcp-server"],
        "env": {
            "LOG_PATH": "[set an accessible absolute path]",
            "CACHE_MAX_AGE": "1",
            "CACHE_CLEANUP_INTERVAL": "4",
            "LOG_RETENTION_DAYS": "7",
            "LOG_CLEANUP_INTERVAL": "24"
        }
    }
}
```
Note: LOG_PATH is optional. If not set, logs will be stored in the 'logs' folder under the application root directory.other arguments are optional.

## API Tools

### Structure Tools

1. analyzeExcelStructure
   - Function: Get Excel file structure including sheet list and column headers in JSON format
   - Parameters:
     - fileAbsolutePath: Absolute path of the Excel file
     - headerRows: Number of header rows (default: 1)

2. exportExcelStructure
   - Function: Export Excel file structure (sheets and headers) to a new Excel template file
   - Parameters:
     - sourceFilePath: Source Excel file path
     - targetFilePath: Target Excel file path
     - headerRows: Number of header rows (default: 1)

### Read Tools

1. readSheetNames
   - Function: Get all sheet names from the Excel file
   - Parameters:
     - fileAbsolutePath: Absolute path of the Excel file

2. readDataBySheetName
   - Function: Get data from a specific sheet in the Excel file
   - Parameters:
     - fileAbsolutePath: Absolute path of the Excel file
     - sheetName: Name of the sheet to read
     - headerRow: Header row number (default: 1)
     - dataStartRow: Data start row number (default: 2)

3. readSheetData
   - Function: Get data from all sheets in the Excel file
   - Parameters:
     - fileAbsolutePath: Absolute path of the Excel file
     - headerRow: Header row number (default: 1)
     - dataStartRow: Data start row number (default: 2)

### Write Tools

1. writeDataBySheetName
   - Function: Write data to a specific sheet in the Excel file (overwrites if sheet exists)
   - Parameters:
     - fileAbsolutePath: Absolute path of the Excel file
     - sheetName: Name of the sheet to write
     - data: Array of data to write

2. writeSheetData
   - Function: Create a new Excel file with provided data
   - Parameters:
     - fileAbsolutePath: Absolute path for the new Excel file
     - data: Object containing multiple sheet data

### Cache Tools

1. clearFileCache
   - Function: Clear cached data for the specified Excel file
   - Parameters:
     - fileAbsolutePath: Absolute path of the Excel file to clear from cache

## Configuration

### Environment Variables

- `LOG_PATH`: Log files storage path
  - Optional
  - Default: 'logs' folder under application root directory

- `CACHE_MAX_AGE`: Cache expiration time (hours)
  - Optional
  - Default: 1

- `CACHE_CLEANUP_INTERVAL`: Cache cleanup interval (hours)
  - Optional
  - Default: 4

- `LOG_RETENTION_DAYS`: Log retention days
  - Optional
  - Default: 7

- `LOG_CLEANUP_INTERVAL`: Log cleanup interval (hours)
  - Optional
  - Default: 24

### Default Configuration

- Cache Configuration
  - Cache expiration time: 1 hour
  - Cache cleanup interval: 4 hours

- Log Configuration
  - Log retention days: 7 days
  - Cleanup interval: 24 hours

## Dependencies

- @modelcontextprotocol/sdk: ^1.7.0
- xlsx: ^0.18.5
- typescript: ^5.8.2

## Development Dependencies

- @types/node: ^22.13.10
- nodemon: ^3.1.9
- ts-node: ^10.9.2

## License

This project is licensed under the MIT License. This means you are free to:

- Use the software for commercial or non-commercial purposes
- Modify the source code
- Distribute original or modified code
  Requirements:

- Retain the original copyright notice
- No liability can be claimed against the authors for software use
  For detailed license information,please see the [LICENSE](./LICENSE) file.
