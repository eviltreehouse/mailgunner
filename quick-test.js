const Mailgunner = require('./mailgunner');

const API_KEY = process.argv[2];
const DOMAIN = process.argv[3];
const TO = process.argv[4];

if (! API_KEY || ! DOMAIN || ! TO) {
    console.error("Usage: quick-test.js <api_key> <domain> <to_addr>");
    process.exit(1);
}

var mg = new Mailgunner(API_KEY);

mg.domain(DOMAIN)
    .from(`no-reply@${DOMAIN}`)
    .send(
        TO,
        '[test] Mailgunner Test',
        "This is just a test -- you can ignore it."
    ).then((result) => {
        console.info('SUCCESS', result);
    }, (err) => {
        console.error('ERROR', err);
    }
);