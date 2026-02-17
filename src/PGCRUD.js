const express = require('express');
const Sequelize = require('sequelize');
const app = express();
app.use(express.json());

const dbUrl = 'postgres://webadmin:ZYLktn88294@node86021-env-nexonkitsune.proen.app.ruk-com.cloud:11620/Books'

const sequelize = new Sequelize(dbUrl);
