const Role = require('./Role')
const Person = require('./Person')
const Membership = require('./Membership')


const schemas = {
    Role,
    'injects': {
        'Core': {
            Membership,
        },
        'People': {
            Person,
        }
    }
}

module.exports = schemas;