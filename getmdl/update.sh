#!/bin/sh

# Update and Download MDL

ver="1.1.3" #Version
col="grey-orange" #Color

wget -O "../app/mdl.js" https://code.getmdl.io/$ver/material.min.js
wget -O "../app/mdl.css" https://code.getmdl.io/$ver/material.$col.min.css
