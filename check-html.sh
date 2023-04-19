#!/bin/sh
# this is here as npm run lint:html does not work under windows, todo: make it independent from sh.
java -jar node_modules/vnu-jar/build/dist/vnu.jar --filterfile .vnurc dist/**/*.html
