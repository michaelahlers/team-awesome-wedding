#!/bin/bash

curl -H "Content-Type: application/json" --data @"$1" http://localhost:9000/controllers/snapshots
