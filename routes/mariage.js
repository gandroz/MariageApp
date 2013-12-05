/**
 * Mariage list controller
 */
var mongoose = require('mongoose')
  , dbMariage = require('../models/listMariage')
  , MariageEntry = dbMariage.mariageListModel;
  
/*
 * REST API
 */
exports.all = function(req, res) {
	MariageEntry.find().sort({importance: 1}).exec(function(err, entry) { 
		if(err) {
			console.log('Unable to retrieve mariage list entry.');
		}
		res.send(JSON.stringify(entry));
	});
};

exports.create = function(req, res) {
	var entry = new MariageEntry(req.body);
	entry.save(function(err, entry) {
		if(err) {
			console.log(err);
	    } 
		else {
			console.log('New mariage list entry has been posted.');	
			res.send(JSON.stringify(entry));
		}
	});
};

exports.update = function(req, res) {
	var Id = req.params.Id;
	var entry = req.body;
	delete entry._id;
	MariageEntry.update({_id: Id}, entry, {safe:true, upsert: true}, function(err, result){
		if(err) {
			console.log('Error updating profile. ' + err);
		}
		else{
			console.log(result + ' mariage list entry updated');
			entry._id = Id;
			res.send(JSON.stringify(entry));
		}			
	});
};

exports.remove = function(req,res) {
	var Id = req.params.Id;
	MariageEntry.findByIdAndRemove(Id, function(err, entry) {
	    if (err) {
	    	console.log('An error hase occured while trying to delete mariage list entry with Id: ' + Id);
	    }
	    else {
	        console.log('Mariage list entry with Id ' + Id + ' has well been removed from DB');
	        res.send(JSON.stringify(entry));
	    }
	});
};