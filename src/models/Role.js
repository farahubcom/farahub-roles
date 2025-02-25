const mongoose = require("mongoose");
const { Doc } = require('@farahub/framework/facades')

const { ObjectId } = mongoose.Types;

class Role {

    /**
     * Create new or update an existing role
     * 
     * @param {Object} data role data created
     * @param {ObjectId} roleId modifying role id
     * @return {Role} modified role
     */
    static async createOrUpdate(data, roleId, { connection, inject, Permission }) {
        try {
            const Role = this.model('Role');

            // create instance
            const role = roleId ? await Role.findById(roleId) : new Role();

            // assign name
            role.name = {
                'fa-IR': data.name
            }

            // assign access
            role.access = [];
            await Promise.all(
                data.access.map(
                    async access => {
                        const permission = await Doc.resolve(access.permission, Permission);
                        role.access = role.access.length > 0 ? [...role.access, { permission: permission.id }] : [{ permission: permission.id }];
                    }
                )
            )

            // inject pre save hooks
            await inject('preSave', { role, data, roleId });

            // save document
            await role.save();

            // inject post save hooks
            await inject('postSave', { role, data, roleId });

            // return modified role
            return role;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Role;