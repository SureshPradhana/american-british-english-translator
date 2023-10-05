'use strict';

const Translator = require('../components/translator.js');

module.exports = function(app) {

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      // Get the text to translate and the locale from the request body
      const { text, locale } = req.body;
      // Check if text is empty
      if (text === '') {
        return res.json({ error: 'No text to translate' });
      }
      // Check if the required fields are provided in the request
      if (!text || !locale) {
        return res.status(400).json({ error: 'Required field(s) missing'});
      }

    
      // Check if locale is invalid
      if (locale !== 'british-to-american' && locale !== 'american-to-british') {
        return res.json({ error: 'Invalid value for locale field' });
      }

      // Perform translation based on the specified locale
      const translation = translator.translate(text, locale);
      if(translation===text){
        res.json({ text: text, translation: "Everything looks good to me!" });
      }
      // Check if translation was successful
      if (!translation) {
        return res.json({ error: 'Invalid locale or translation error' });
      }

      // Return the translation
      res.json({ text: text, translation: translation });
    });
};
