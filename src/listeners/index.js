const RoleCreatedOrUpdated = require("../events/RoleCreatedOrUpdated");
const RoleDeleted = require("../events/RoleDeleted");
const LogRoleDeletionActivity = require("./LogRoleDeletionActivity");
const LogRoleModificationActivity = require("./LogRoleModificationActivity");


module.exports = new Map([
    [
        RoleCreatedOrUpdated, [
            LogRoleModificationActivity,
        ],

        RoleDeleted, [
            LogRoleDeletionActivity,
        ]
    ]
]);