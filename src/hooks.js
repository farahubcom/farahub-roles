
const map = require('lodash/map');
const uniqBy = require('lodash/uniqBy');
const { Lang } = require('@farahub/framework/facades');


const hooks = module => ({
    'Core': {
        'authenticated.getAccess.params': async ({ roles, permissions, user, connection, workspace, membership, Permission }) => {

            const Person = connection.model('Person');

            const person = await Person.findOne({ user: user.id });

            if (person) {

                const personPermissions = map(uniqBy((await person.getPermissions(Permission)), 'id'), 'identifier');

                const personObject = await Person.findOne({ membership: membership.id })
                    .populate({ path: 'roles', select: 'name identifier' })
                    .lean({ virtuals: true });

                let personRules = personObject.roles;

                personRules = Lang.translate(personRules);


                return {
                    permissions: [
                        ...permissions,
                        ...personPermissions
                    ],
                    roles: [
                        ...roles,
                        ...personRules
                    ]
                }
            }
        }
    },
})

module.exports = hooks;