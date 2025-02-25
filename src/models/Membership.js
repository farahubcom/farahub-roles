const flatten = require('lodash/flatten');


class Membership {

    /**
     * Get membership permissions
     * 
     * @param {Permission} Permission Permission model
     * @param {object} filter Filter
     * @return {Promise<Permission[]>} Permissions
     */
    async getPermissions(Permission, filter = {}) {
        const roles = await this.model('Role').find({ _id: this.roles });
        return Permission.find({
            _id: { $in: flatten(roles.map(r => r.access.permission)) },
            ...filter
        });
    }

    //
}

module.exports = Membership;