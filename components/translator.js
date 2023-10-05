const { trash } = require("./american-only.js");
const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");


const translationListAmToBr = []
Object.keys(americanOnly).forEach((key) =>{
	translationListAmToBr.push([
		key, 
    americanOnly[key]
	])
})
Object.keys(americanToBritishSpelling).forEach((key) =>{
	translationListAmToBr.push([
		key,
		americanToBritishSpelling[key]
	])
})
Object.keys(britishOnly).forEach((key) => {
  translationListAmToBr.push([britishOnly[key], key]);
});

const translationListBrToAm = [];

Object.keys(americanToBritishSpelling).forEach((key) =>{
	translationListBrToAm.push([
		americanToBritishSpelling[key],
		key
	])
})
Object.keys(britishOnly).forEach((key) =>{
	translationListBrToAm.push([
		key,
		britishOnly[key]
	])
})

const translationTitles = [];
Object.keys(americanToBritishTitles).forEach((key) =>{
	translationTitles.push([
		key,
		americanToBritishTitles[key]
	])
})
// const terms = [];
// Object.keys(americanOnly).forEach((key) => {
//   terms.push([key, americanOnly[key]]);
// });
// Object.keys(americanToBritishSpelling).forEach((key) => {
//   terms.push([key, americanToBritishSpelling[key]]);
// });
// Object.keys(britishOnly).forEach((key) => {
//   terms.push([britishOnly[key], key]);
// });

class Translator {
  americanToBritish(text) {
    let translation = text;

    translationListAmToBr.forEach((term) => {
      var regexAmerican = new RegExp(`\\b${term[0]}\\b`, "ig");
      var regexAmericanCap = new RegExp(
        `\\b${term[0].charAt(0).toUpperCase() + term[0].slice(1)}\\b`,
        "g"
      );

      translation = translation.replace(
        regexAmerican,
        `<span class="highlight">${term[1]}</span>`
      );
      translation = translation.replace(
        regexAmericanCap,
        `<span class="highlight">${
          term[1].charAt(0).toUpperCase() + term[1].slice(1)
        }</span>`
      );
    });

    var timeRegex = /(([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]))/g;
    var times = translation.match(timeRegex);
    if (times) {
      times.forEach((time) => {
        translation = translation.replace(
          time,
          `<span class="highlight">${time.replace(":", ".")}</span>`
        );
      });
    }

    var titleRegex = /(mr|mrs|ms|mx|dr|prof)\./gi;
    var titles = translation.match(titleRegex);
    if (titles) {
      titles.forEach((title) => {
        translation = translation.replace(
          title,
          `<span class="highlight">${(title.charAt(0).toUpperCase() + title.slice(1)).replace(".", "")}</span>`
        );
      });
    }

    return translation;
  }

  britishToAmerican(text) {
    let translation = text;

    translationListBrToAm.forEach((term) => {
      var regexBritish = new RegExp(`\\b${term[0]}\\b`, "g");
      var regexBritishCap = new RegExp(
        `\\b${term[0].charAt(0).toUpperCase() + term[0].slice(1)}\\b`,
        "g"
      );

      translation = translation.replace(
        regexBritish,
        `<span class="highlight">${term[1]}</span>`
      );
      translation = translation.replace(
        regexBritishCap,
        `<span class="highlight">${
          term[1].charAt(0).toUpperCase() + term[1].slice(1)
        }</span>`
      );
    });

    var timeRegex = /(([0-9]|0[0-9]|1[0-9]|2[0-3])(\.)([0-5][0-9]))/g;
    var times = translation.match(timeRegex);
    if (times) {
      times.forEach((time) => {
        translation = translation.replace(
          time,
          `<span class="highlight">${time.replace(".", ":")}</span>`
        );
      });
    }

    var titleRegex = /(mr|mrs|ms|mx|dr|prof)\s/gi;
    var titles = translation.match(titleRegex);
    if (titles) {
      titles.forEach((title) => {
        translation = translation.replace(
          title,
          `<span class="highlight">${(title.charAt(0).toUpperCase() + title.slice(1)).replace(" ", ".")}</span> `
        );
      });
    }

    return translation;
  }

  translate(text, locale) {
    let translation;

    if (locale === "american-to-british") {
      translation = this.americanToBritish(text);
    }

    if (locale === "british-to-american") {
      translation = this.britishToAmerican(text);
    }

    if (translation === text) {
      translation = "Everything looks good to me!";
    }

    return translation;
  }
}

module.exports = Translator;
