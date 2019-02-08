const Crawler = require("crawler");
const fs = require('fs');
const fetch = require('node-fetch');
const details = require('./details')

let airport = '';

const c = new Crawler({
  maxConnections: 1,
  callback: async function (error, res, done) {
    if (error) {
      console.log(error);
    } else {

      let $ = res.$;

      fs.access("output/" + airport, function (err) {
        if (err) {
          fs.mkdir("output/" + airport, function (err) {
            if (err) {
              console.log('failed to create directory', err);
            } else {
              fs.mkdir("output/" + airport + "/DEPARTURES", function (err) {});
              fs.mkdir("output/" + airport + "/STAR", function (err) {});
              fs.mkdir("output/" + airport + "/IAP", function (err) {});
            }
          });
        }
      });

      let diagram = $("#charts .chartLink a").attr('href');

      await fetch(diagram).then(res => {
        const dest = fs.createWriteStream("output/" + airport + "/" + airport + "_airport-diagram.pdf");
        res.body.pipe(dest);
        console.log("Airport diagram downloaded");
      });

      await $("#charts h3:contains('Standard Terminal Arrival (STAR) Charts')").parent().children("span").each((e, el) => {
        let item = $(el).children("a");

        fetch(item.attr('href')).then(res => {
          const dest = fs.createWriteStream("output/" + airport + "/STAR/"+item.text().replace('/', '&')+".pdf");
          res.body.pipe(dest);
          console.log("STAR: "+item.text());
        });

      });

      await $("#charts h3:contains('Departure Procedure (DP) Charts')").parent().children("span").each((e, el) => {
        let item = $(el).children("a");

        fetch(item.attr('href')).then(res => {
          const dest = fs.createWriteStream("output/" + airport + "/DEPARTURES/"+item.text().replace('/', '&')+".pdf");
          res.body.pipe(dest);
          console.log("DEPARTURE: "+item.text());
        });

      });

      await $("#charts h3:contains('Instrument Approach Procedure (IAP) Charts')").parent().children("span").each((e, el) => {
        let item = $(el).children("a");

        fetch(item.attr('href')).then(res => {
          const dest = fs.createWriteStream("output/" + airport + "/IAP/"+item.text().replace('/', '&')+".pdf");
          res.body.pipe(dest);
          console.log("IAP: "+item.text());
        });

      });

    }
    done();
  }
});

async function go() {
  airport = await details.get();
  await c.queue('https://nfdc.faa.gov/nfdcApps/services/ajv5/airportDisplay.jsp?airportId=' + airport);
}

go();