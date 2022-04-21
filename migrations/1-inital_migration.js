'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "posts", deps: []
 * createTable "users", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "inital_migration",
    "created": "2022-03-17T16:44:21.307Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "posts",
            {
                "PostId": {
                    "type": Sequelize.INTEGER,
                    "field": "PostId",
                    "primaryKey": true,
                    "autoIncrement": true,
                    "allowNull": false
                },
                "PostTitle": {
                    "type": Sequelize.STRING,
                    "field": "PostTitle"
                },
                "PostBody": {
                    "type": Sequelize.STRING,
                    "field": "PostBody"
                },
                "UserId": {
                    "type": Sequelize.INTEGER,
                    "field": "UserId"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt"
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt"
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "users",
            {
                "UserId": {
                    "type": Sequelize.INTEGER,
                    "field": "UserId",
                    "primaryKey": true,
                    "autoIncrement": true,
                    "allowNull": false
                },
                "FirstName": {
                    "type": Sequelize.STRING,
                    "field": "FirstName"
                },
                "LastName": {
                    "type": Sequelize.STRING,
                    "field": "LastName"
                },
                "Username": {
                    "type": Sequelize.STRING,
                    "field": "Username",
                    "unique": true
                },
                "Password": {
                    "type": Sequelize.STRING,
                    "field": "Password"
                },
                "Email": {
                    "type": Sequelize.STRING,
                    "field": "Email",
                    "unique": true
                },
                "Admin": {
                    "type": Sequelize.BOOLEAN,
                    "field": "Admin",
                    "allowNull": false,
                    "default": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    }
];

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
