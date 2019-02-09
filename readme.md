# FAA Chart Download Assistant
Download all SID, STAR, DEPARTURE & INFORMATION charts for airports and routes as high resolution PDF files. Currently FAA only (north america).

## Requirements

- Node version >= 8 (https://nodejs.org/en/download/)

## Usage

Clone the project

`git clone https://github.com/Cookizza/FAA-Chart-Downloader`

Install dependencies

`cd FAA-Chart-Downloader`

`npm install`

Run the tool

`npm run go`

You will then be asked to selec a chart source and to enter the airport code that you wish to download. 
Right away, the tool will download all the charts and place them in relevant folders inside the `output/` directory.

![img](https://i.imgur.com/upRZnxy.gif)

EXAMPLE PDF:

![img](https://i.imgur.com/KVPIBKz.png)