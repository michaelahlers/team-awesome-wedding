#!/bin/bash

mkdir -p db logs
mongod --cpu --dbpath db --logpath logs/mongod.log
