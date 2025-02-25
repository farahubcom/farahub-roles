const map = require('lodash/map');
const flatten = require('lodash/flatten');


class Person {

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
            _id: { $in: map(flatten(roles.map(r => r.access)), 'permission') },
            ...filter
        });
    }

    //
}

module.exports = Person;