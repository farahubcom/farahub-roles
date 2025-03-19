
const map = require('lodash/map');
const uniqBy = require('lodash/uniqBy');
const { Lang, Doc, Injection } = require('@farahub/framework/facades');
const toLower = require('lodash/toLower');


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
        'main.list.search': async ({ req, user }) => {
            const args = req.query;

            if (args && args.roles) {
                const Role = req.wsConnection.model('Role');
                const role = typeof args.roles == "string" ?
                    await Doc.resolveByIdentifier(args.roles, Role) :
                    await Doc.resolve(args.roles, Role);
                return role?.id ? { roles: role?.id } : { _id: null };
            }

            return {}
        },
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

                            if (typeof value === 'string') {
                                return Doc.resolveByIdentifier(value, Role).then(role => {
                                    if (!role) {
                                        if (!Object.keys(module.app.roles).includes(value)) {
                                            return Promise.reject('نقش نامعتبر است');
                                        }
                                    }

                                    return Promise.resolve(true);
                                })
                            }

                            return Doc.resolve(value, Role).then(role => {
                                if (!role) {
                                    return Promise.reject(false);
                                }

                                return Promise.resolve(true);
                            })
                        },
                        bail: true
                    },
                }
            }
        },
        'main.details.populate': async () => {
            return {
                path: 'roles',
                select: 'name'
            }
        },
        'main.createOrUpdate.preSave': async ({ req, data, connection, inject, person }) => {
            const Role = req.wsConnection.model('Role');

            person.roles = (await Promise.all(
                data.roles?.filter(Boolean)?.map(
                    async role => {
                        if (typeof role === "string") {
                            const roleDoc = await Doc.resolveByIdentifier(role, Role);

                            if (roleDoc) {
                                role = roleDoc;
                            } else if (Object.keys(module.app.roles).includes(role)) {
                                role = await Role.createOrUpdate(
                                    {
                                        identifier: toLower(role),
                                        ...module.app.roles[role],
                                    },
                                    null,
                                    {
                                        connection,
                                        inject: Injection.register(module.app.module('Roles'), 'main.createOrUpdate', { withRequest: false })
                                    }
                                )
                            }
                        } else {
                            role = await Doc.resolve(role, Role);
                        }

                        return role?.id;
                    }
                )
            )).filter(Boolean);
        },
    }
})

module.exports = hooks;