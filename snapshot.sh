#!/bin/bash

curl -H "Content-Type: application/json" --data @"$1" http://$2/controllers/snapshots
