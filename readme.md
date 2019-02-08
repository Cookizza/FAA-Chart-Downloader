# FAA Chart Download Assistant
Download all FAA charts for North American airports including SID, STAR, IAP & Runway information as high resolution PDF files.

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

You will then be asked to enter the airport code that you wish to download. 
Right away, the tool will download all the charts from the FAA and place them in relevant folders inside the `output/` directory.
