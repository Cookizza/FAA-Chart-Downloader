const Crawler = require("crawler");
const chalk = require('chalk');
const fs = require('fs');

const details = require('./details');
const FAA = require('./sources/FAA');

const log = console.log;

const sources = [
  {title: 'North America / Caribbean (faa.gov)', value: FAA}
];

async function go() {

  let info = await details.get(sources);

  let c = new Crawler({
    maxConnections: 1,
    rateLimit: 1,
    callback: async (error, res, done) => {
      if (error) {
        log(chalk.red("Crawler error!"), error)
      }
      else {

        let $ = res.$;

        if($(info.source.errorSelector).length){
          log(chalk.red("Airport not found"));
          process.exit();
        }else{
          await fs.access("output/" + info.source.airport, function (err) {
            if (err) {
              fs.mkdir("output/" + info.source.airport, function (err) {
                if (err) {
                  log(chalk.red('failed to create directory'), err);
                } else {
                  fs.mkdir("output/" + info.source.airport + "/DEPARTURES", function (err) {
                  });
                  fs.mkdir("output/" + info.source.airport + "/STAR", function (err) {
                  });
                  fs.mkdir("output/" + info.source.airport + "/IAP", function (err) {
                  });
                }
              });
            }
          });

          await info.source.callback($);
        }

        done();
      }
    }
  });

  let url = info.source.init(info.code, info.overwrite);

  log(chalk.yellow("Using URL: ") + chalk.cyan(url));

  await c.queue(url);

  // log(chalk.green("DONE!"))
  // log(chalk.cyan("Files written: ") + chalk.green(info.source.filesWritten));
  // log(chalk.cyan("Files skipped: ") + chalk.yellow(info.source.filesSkipped));

}

log(chalk.greenBright("======================================"));
log(chalk.green("AIRPORT AND AIRWAY CHART DOWNLOADER"));
log(chalk.cyan("Keep up to date and get new sources on Github"));
log(chalk.yellow("http://github.com/cookizza/faa-chart-downloader"));
log(chalk.greenBright("======================================"));
go();