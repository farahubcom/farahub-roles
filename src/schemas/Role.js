const mongoose = require("mongoose");
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;


const RoleSchema = new Schema({
    identifier: { type: String, unique: true, sparse: true, lowercase: true },
    name: { type: Map, of: String },
    immutable: Boolean, // immutable roles can not be edited by workspace members & can not apply or remove from members by workspace members
    access: [{
        permission: { type: ObjectId, ref: 'Permission' },
        includes: [{ type: ObjectId, refPath: 'access.onModel' }],
        excludes: [{ type: ObjectId, refPath: 'access.onModel' }],
        onModel: String
    }],
}, {

    /**
     * Name of the collection
     * 
     * @var string
     */
    collection: "roles:roles",
});

RoleSchema.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
});

RoleSchema.plugin(mongooseLeanVirtuals);

module.exports = RoleSchema;