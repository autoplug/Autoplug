#!/usr/bin/env node
'use strict';

//copy compile bundle remove preview 
const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

var exec = require('child_process').exec;
var config = "module.exports={\n	1:{ io:[0,0] , action:['watch',0] , next:0 },\n\n}";

const Reset = '\x1b[0m';
const error = '\x1b[31m';
const log   = '\x1b[32m';
const warn  = '\x1b[33m';

console.log(process.cwd());

//if have not any config file create default
if(process.argv[2]){
	exec('npm root', function(err, stdout, stderr) {
		var _path = stdout.slice(0,stdout.length-13) + process.argv[2];
		fs.access(_path,fs.constants.R_OK,function(err){	  
			if(err){
				console.log(error + 'Config file not found.' + Reset);	
				process.exit(0);
			}
		});
	});
}else{
	exec('npm root', function(err, stdout, stderr) {
		var _path = stdout.slice(0,stdout.length-13) + 'autoplug.config.js';
		fs.access(_path,fs.constants.R_OK,function(err){	  
			if(err){
				fs.writeFileSync(path,config);
				console.log(log + 'Default config file created successfully.' + Reset);
			}
		});
	});
}



exec('npm root',function(err, stdout, stderr){
	
	var _path = stdout.slice(0,stdout.length-13);
	var pathConfig = _path + (process.argv[2] ? process.argv[2] : 'autoplug.config.js');
	var config = require(pathConfig);
	
	manager(_path,config,1);
	
});

var manager = function(_path,config,next){
	
	if(!next)
		return;
	
	var input  = _path + config[next].io[0] ;
	var output = _path + config[next].io[1] ;
	
	switch( config[next].action[0].toLowerCase() ){
		
		case 'copy':
			var data = fs.readFileSync(input);
			fs.writeFileSync(output,data);
			break;
			
		case 'watch':
			var active = true;

			fs.watch(input, function (event, filename) {
				if(event === 'change' && active) {
					active = false;
					console.log(event + ':' + filename);
					active = true;
					}
			});
			break;
				
		case 'compile':
			
			var exec = require('child_process').exec;
			exec('webpack '+ path + config[next].input  + ' ' + path + config[next].output,function(err, stdout, stderr){
				console.log('babel');
			});
			
			break;


		case 'preview':
			app.use(express.static('dist'));
			app.listen(3000);
			break;	
	};
	


	
};


