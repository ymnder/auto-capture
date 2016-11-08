#!/bin/bash
while :
do
  echo start
  casperjs capture.js
  echo end
  sleep 1200
done
