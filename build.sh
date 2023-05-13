#!/bin/bash
rm -rf dist/
ng build --environment=prod --deploy-url=https://usini.github.io/LaserCutMazes
