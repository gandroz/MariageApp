/**
 * Backlog entry Schema
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

//Profile schema
var mariageListSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
    startDate: { type: Date },
    stopDate: { type: Date },
    budget: { type: Number },
	done: {type: Boolean, default: false}
});

// Export profile model
exports.mariageListModel = mongoose.model('ChosesAFaire', mariageListSchema);