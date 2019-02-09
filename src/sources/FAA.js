const fs = require('fs');
const fetch = require('node-fetch');
const chalk = require('chalk');
const path = require('path');
const log = console.log;

module.exports = {
  filesWritten: 0,
  filesSkipped: 0,
  airport: null,
  overwrite: false,
  errorSelector: "strong:contains('Airport Not Found.')",
  init(code, overwrite) {
    this.airport = code;
    this.overwrite = overwrite;
    return 'https://nfdc.faa.gov/nfdcApps/services/ajv5/airportDisplay.jsp?airportId=' + code;
  },
  async getFile(type, url, name) {
    await fs.access(path.join("output", this.airport, type, name, ".pdf"), async err => {
      if (err || this.overwrite) {
        const res = await fetch(url);
        await new Promise((resolve, reject) => {
          const dest = fs.createWriteStream(path.join("output", this.airport, type, name + ".pdf"));
          res.body.pipe(dest);
          res.body.on("error", (err) => {
            reject(err);
          });
          dest.on("finish", function () {
            log(chalk.green(type) + ": " + chalk.yellow(name));
            dest.close();
            this.filesWritten++;
            resolve();
          });
        });
      } else {
        this.filesSkipped++;
      }
    });
  },
  async callback($) {

    let diagram = $("#charts .chartLink a").attr('href');

    await fetch(diagram).then(res => {
      const dest = fs.createWriteStream(path.join("output/", this.airport, this.airport + "_airport-diagram.pdf"));
      res.body.pipe(dest);
      log(chalk.cyan("Airport info diagram downloaded"));
    }).catch(err => {
      log(chalk.red("Airport info diagram failed to download."));
    });

    $("#charts h3:contains('Standard Terminal Arrival (STAR) Charts')").parent().children("span").each((e, el) => {
      let item = $(el).children("a");
        this.getFile('STAR', item.attr('href'), item.text().replace('/', '&'));
    });

    $("#charts h3:contains('Departure Procedure (DP) Charts')").parent().children("span").each((e, el) => {
      let item = $(el).children("a");
        this.getFile('DEPARTURES', item.attr('href'), item.text().replace('/', '&'));
    });

    $("#charts h3:contains('Instrument Approach Procedure (IAP) Charts')").parent().children("span").each((e, el) => {
      let item = $(el).children("a");
        this.getFile('IAP', item.attr('href'), item.text().replace('/', '&'));
    });

    // await log(chalk.green("DONE!"))
    // log(chalk.cyan("Files written: ") + chalk.green(this.filesWritten));
    // log(chalk.cyan("Files skipped: ") + chalk.yellow(this.filesSkipped));

  }
};