'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "Admin" on table "users"
 *
 **/

var info = {
    "revision": 3,
    "name": "fixed_admin_notNull",
    "created": "2022-03-17T23:56:15.725Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "changeColumn",
    params: [
        "users",
        "Admin",
        {
            "type": Sequelize.BOOLEAN,
            "field": "Admin",
            "default": false
        }
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
