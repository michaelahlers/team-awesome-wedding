#!/bin/bash

MONGOLAB_URI=$(heroku config --app $1 | grep "MONGOLAB_URI" | awk '{ print $2 }')

USER=$(echo $MONGOLAB_URI | sed 's,\(^.*://\)\(.*\)\(:.*\)\(:.*$\),\2,g')
PASS=$(echo $MONGOLAB_URI | sed 's,\(^.*://.*:\)\(.*\)\(@.*$\),\2,g')
LOCATION=$(echo $MONGOLAB_URI | sed 's,\(^.*://.*@\)\(.*$\),\2,g')

echo $USER
echo $PASS
echo $LOCATION

mongo -u "$USER" -p "$PASS" "$LOCATION"
