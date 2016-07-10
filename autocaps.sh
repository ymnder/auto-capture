#!/bin/bash

DATE=`date +"%Y-%m-%d-%H-%M-%S"`

# まずstatusbarを撮る
FILENAME="notification-${DATE}.png"
echo "capturing ${FILENAME}..."
# Expand status bar
adb shell service call statusbar 1
sleep 5s
adb shell screencap -p "/sdcard/${FILENAME}"
adb pull /sdcard/"${FILENAME}" ./autocap/stbar/"${FILENAME}"
adb shell rm "/sdcard/${FILENAME}"
# Collapse status bar
adb shell service call statusbar 2
echo "saved ${FILENAME}."

# 次に各アプリのtopを撮る
# パッケージ名の取得
# adb shell pm list packages
PACKAGES=("com.nikkei.news.dev" "jp.co.yahoo.android.news")
for PACKAGE in ${PACKAGE[@]}; do
	echo "capturing ${PACKAGE}..."
	APPFILENAME="app-${DATE}.png"
	adb shell monkey -p ${PACKAGE} -c android.intent.category.LAUNCHER 1\n
	sleep 10s
	# もしスライドさせる必要があれば適宜利用
	# adb shell input touchscreen swipe 0 200 500 200
	# adb shell input touchscreen swipe 500 200 0 200
	# sleep 5s
	adb shell screencap -p "/sdcard/${APPFILENAME}"
	adb pull /sdcard/"${APPFILENAME}" ./autocap/${PACKAGE}/"${APPFILENAME}"
	adb shell rm "/sdcard/${APPFILENAME}"
	# ホームに戻しておく
	adb shell input keyevent KEYCODE_HOME
	# もし、終了させる必要があれば
	# adb shell am force-stop ${PACKAGE}
done
