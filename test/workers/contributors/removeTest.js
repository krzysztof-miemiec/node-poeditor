'use strict';

const assert = require('assertthat');
const path = require('path');
const processenv = require('processenv');

const workers = require(path.resolve('./lib'));

describe('contributors.remove...', () => {
  it('... is of type function', (done) => {
    assert.that(workers.contributors.remove).is.ofType('function');
    done();
  });

  it('... rejects an error when function is called without a access token', (done) => {
    (async () => {
      try {
        await workers.contributors.remove();
      } catch (err) {
        assert.that(err).is.equalTo('Error: You must define a valid API Token!');
        done();
      }
    })();
  });

  it('... rejects an error when function is called without a id for the project', (done) => {
    (async () => {
      try {
        await workers.contributors.remove('abcdef');
      } catch (err) {
        assert.that(err).is.equalTo('Error: You must define a valid project id!');
        done();
      }
    })();
  });

  it('... rejects an error when function is called without a valid object', (done) => {
    (async () => {
      try {
        await workers.contributors.remove('abcdef', '12345');
      } catch (err) {
        assert.that(err).is.equalTo('Error: You must define a valid object!');
        done();
      }
    })();
  });

  it('... must fetch the api error messages', (done) => {
    (async () => {
      try {
        await workers.contributors.remove('notfamoustoken', '1234', { name: 'Caesar', email: processenv('TEST_EMAIL') });
      } catch (err) {
        assert.that(err).is.ofType('object');
        done();
      }
    })();
  });

  it('... must resolve all true when contributor is removed', (done) => {
    (async () => {
      try {
        const add = await workers.projects.add(processenv('API_TOKEN'), 'removeContrib');

        await workers.contributors.add(processenv('API_TOKEN'), add.project.id, { name: 'Caesar', email: processenv('TEST_EMAIL'), admin: '1' });

        const res = await workers.contributors.remove(processenv('API_TOKEN'), add.project.id, { email: processenv('TEST_EMAIL') });

        assert.that(res).is.true();
        await workers.projects.delete(processenv('API_TOKEN'), add.project.id);
        done();
      } catch (err) {
        throw err;
      }
    })();
  });
});
