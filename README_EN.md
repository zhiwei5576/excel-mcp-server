# Excel MCP Server

[简体中文](./README.md) | English

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

````bash
# Install dependencies
npm install

# Build project
npm run build
## Usage
### Start Server
```bash
npm start
````

### Development Mode

```bash
npm run dev
```

### Watch Mode Build

```bash
npm run watch
```

## API Tools

### Read Tools

1. readSheetNames

   - Function: Get all sheet names from Excel file
   - Parameters:
     - fileAbsolutePath: Absolute path of the Excel file

2. readDataBySheetName

   - Function: Read data from specific sheet
   - Parameters:
     - fileAbsolutePath: Absolute path of the Excel file
     - sheetName: Name of the sheet to read
     - headerRow: Header row number (default: 1)
     - dataStartRow: Data start row number (default: 2)

3. readSheetData

   - Function: Read data from all sheets
   - Parameters:
     - fileAbsolutePath: Absolute path of the Excel file
     - headerRow: Header row number (default: 1)
     - dataStartRow: Data start row number (default: 2)

### Write Tools

1. writeDataBySheetName

   - Function: Write data to specific sheet
   - Parameters:
     - fileAbsolutePath: Absolute path of the Excel file
     - sheetName: Name of the sheet to write
     - data: Array of data to write

2. writeSheetData

   - Function: Write data to new Excel file
   - Parameters:
     - fileAbsolutePath: Absolute path for the new Excel file
     - data: Object containing multiple sheet data

### Analysis Tools

1. analyzeExcelStructure

   - Function: Analyze Excel file structure
   - Parameters:
     - fileAbsolutePath: Absolute path of the Excel file
     - headerRows: Number of header rows (default: 1)

2. exportExcelStructure

   - Function: Export Excel structure to new file
   - Parameters:
     - sourceFilePath: Source Excel file path
     - targetFilePath: Target Excel file path
     - headerRows: Number of header rows (default: 1)

### Common Tools

1. clearFileCache
   - Function: Clear cache for specific Excel file
   - Parameters:
     - fileAbsolutePath: Absolute path of the Excel file to clear from cache

## Configuration

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
  For detailed license information, please see the LICENSE file.
