
const map = require('lodash/map');
const uniqBy = require('lodash/uniqBy');
const { Doc, Lang } = require('@farahub/framework/facades');


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
    'People': {
        'main.list.populate': async () => {
            return {
                path: 'roles',
                select: 'name'
            }
        },
        'main.createOrUpdate.validate': async () => {
            return {
                roles: {
                    in: ["body"],
                    optional: true,
                    isArray: true,
                },
                'roles.*': {
                    in: ["body"],
                    custom: {
                        options: (value, { req }) => {
                            const Role = req.wsConnection.model('Role');
                            return Doc.resolve(value, Role).then(role => {
                                if (!role)
                                    return Promise.reject(false);
                                return Promise.resolve(true);
                            })
                        },
                        bail: true
                    },
                    customSanitizer: {
                        options: (value, { req }) => {
                            const Role = req.wsConnection.model('Role');
                            return Doc.resolve(value, Role);
                        }
                    }
                }
            }
        },
        'main.details.populate': async () => {
            return {
                path: 'roles',
                select: 'name'
            }
        },
        'main.createOrUpdate.preSave': async ({ data, connection, inject, person }) => {
            person.roles = data.roles?.map(role => role.id);
        },
    }
    //    
})

module.exports = hooks;