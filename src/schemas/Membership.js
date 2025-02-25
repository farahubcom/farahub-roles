const mongoose = require("mongoose");
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const MembershipSchema = new Schema({
    roles: [{ type: ObjectId, ref: 'Role' }],
}, { timestamps: true });

MembershipSchema.plugin(mongooseLeanVirtuals);

module.exports = MembershipSchema;