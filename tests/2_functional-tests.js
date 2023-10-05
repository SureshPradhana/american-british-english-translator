const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');
const spanRegex = /<\/?span[^>]*>/g;

suite('Functional Tests', () => {
  // Test 1: Translation with text and locale fields
  test('Translation with text and locale fields: POST request to /api/translate', (done) => {
    chai
      .request(server)
      .keepOpen()
      .post('/api/translate')
      .send({
        text: "Mangoes are my favorite fruit.",
        locale: "american-to-british"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'translation');
        assert.equal(res.body.translation.replace(spanRegex, ""), 'Mangoes are my favourite fruit.');
        done();
      });
  });

  // Test 2: Translation with text and invalid locale field
  test('Translation with text and invalid locale field: POST request to /api/translate', (done) => {
    chai
      .request(server)
      .keepOpen()
      .post('/api/translate')
      .send({
        text: "Mangoes are my favorite fruit.",
        locale: "invalid-locale"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid value for locale field');
        done();
      });
  });

  // Test 3: Translation with missing text field
  test('Translation with missing text field: POST request to /api/translate', (done) => {
    chai
      .request(server)
      .keepOpen()
      .post('/api/translate')
      .send({
        locale: "american-to-british"
      })
      .end((err, res) => {
        assert.equal(res.status, 400);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  // Test 4: Translation with missing locale field
  test('Translation with missing locale field: POST request to /api/translate', (done) => {
    chai
      .request(server)
      .keepOpen()
      .post('/api/translate')
      .send({
        text: "Mangoes are my favorite fruit."
      })
      .end((err, res) => {
        assert.equal(res.status, 400);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  // Test 5: Translation with empty text
  test('Translation with empty text: POST request to /api/translate', (done) => {
    chai
      .request(server)
      .keepOpen()
      .post('/api/translate')
      .send({
        text: "",
        locale: "american-to-british"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'No text to translate');
        done();
      });
  });

  // Test 6: Translation with text that needs no translation
  test('Translation with text that needs no translation: POST request to /api/translate', (done) => {
    chai
      .request(server)
      .keepOpen()
      .post('/api/translate')
      .send({
        text: "Hello world!",
        locale: "american-to-british"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'translation');
        assert.equal(res.body.translation, 'Everything looks good to me!');
        done();
      });
  });
});
