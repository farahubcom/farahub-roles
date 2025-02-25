class RoleDeleted {

    /**
     * Deleted role
     * 
     * @var Role
     */
    role;

    /**
     * Workspace connection
     * 
     * @var Connection
     */
    connection;

    /**
     * Authentiacated user
     * 
     * @var User
     */
    user;

    /**
     * Create event instance
     * 
     * @constructor
     * @param {Role} role Deleted role
     * @param {Connection} connection Workspace connection
     * @param {User} user Authenticated user
     */
    constructor(role, connection, user) {
        this.role = role;
        this.connection = connection;
        this.user = user;
    }
}

module.exports = RoleDeleted;