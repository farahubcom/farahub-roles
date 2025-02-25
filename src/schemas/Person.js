const mongoose = require("mongoose");
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const PersonSchema = new Schema({
    roles: [{ type: ObjectId, ref: 'Role' }],
}, { timestamps: true });

PersonSchema.plugin(mongooseLeanVirtuals);

module.exports = PersonSchema;