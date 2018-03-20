const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const request = require("request");
const exec = require("child_process").exec;
require("dotenv").config();
const nexturl = process.env.url;

app.use(bodyparser.json());

app.post("/*", (req, res) => {
	if (req.query && req.query.script) {
		var script = req.query.script;
		script = "scripts/" + script;
		if (req.query.args) script += " " + req.query.args;
		console.log(script);
		exec(script, (err, stdout, stderr) => {
			req.body.extra = stdout;
			send(req, res);
		});
	} else {
		send(req, res);
	}
});

function send(req, res) {
	var postdata = {
		headers: {
			"content-type": "application/json"
		}
	};
	postdata.url = nexturl + req.originalUrl;
	postdata.body = JSON.stringify(req.body);
	console.log(postdata.url);
	request.post(postdata, (err, resp, body) => {
		res.sendStatus(resp.statusCode);
	});
}

app.listen(process.env.PORT || 6006);
