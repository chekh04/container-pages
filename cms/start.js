'use strict';
const path = require('path');
const { createStrapi } = require('@strapi/core');

createStrapi({
  appDir: process.cwd(),
  distDir: path.join(process.cwd(), 'dist'),
}).start();
