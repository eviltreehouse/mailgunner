/**
 * Mailgunner
 * Its just basically a `curl` wrapper with a `Promise` twist
 */
'use strict';

const get = require('simple-get');

class Mailgunner {
	constructor(api_key) {
		this.api_key = api_key;
		this.cur_domain = null;
		this.timeout = 1000*60;
	}

	domain(new_domain) {
		this.cur_domain = new_domain;
		return this;
	}

	from(sender) {
		this.cur_sender = sender;

		return this;
	}

	send(to, subject, text) {
		var msg = {
			'method': 'POST',
			'timeout': this.timeout,
			'url': this.getMgUrl(),
			'form': {
				'from': this.cur_sender,
				'to': to,
				'subject': subject || "(no subject)",
				'text': text || "(nt)"
			}
		};

		if (! this.saneToSend(msg)) return Promise.reject("Message params not complete.");

		return new Promise((resolve, reject) => {
			get.concat(msg, (err, res, res_body) => {
				if (err) reject(err.message);
				else if (res.statusCode != 200) reject(res_body.toString('utf8'));
				else {
					var body_str = res_body.toString('utf8');
					var msg_id = true;
					try {
						var json = JSON.parse(body_str);
						if (json.id) msg_id = json.id;
					} catch(e) {
						// Oh well...
					}

					resolve(msg_id);
				}
			});
		});
	}

	saneToSend(msg) {
		if (! this.cur_domain) return false;
		if (! this.api_key) return false;

		if (! msg.form.to) return false;
		if (! msg.form.from) return false;

		return true;
	}

	getMgUrl() {
		return `https://api:${this.api_key}@api.mailgun.net/v3/${this.cur_domain}/messages`;
	}
}

module.exports = Mailgunner;