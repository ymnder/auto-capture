#!/bin/bash
# 画面サイズからswipeを行う
# adb shell wm size | grep -o -e "[0-9]\{2,\}" >> tmp
# ホームに戻しておく
adb shell input keyevent KEYCODE_HOME

DATE=`date +"%Y-%m-%d-%H-%M-%S"`

# まずstatusbarを撮る
FILENAME="notification-${DATE}.png"
echo "capturing ${FILENAME}..."
# Expand status bar
adb shell service call statusbar 1
sleep 5s
adb shell screencap -p "/sdcard/${FILENAME}"
adb pull /sdcard/"${FILENAME}" ./autocap/not/"${FILENAME}"
adb shell rm "/sdcard/${FILENAME}"
# Collapse status bar
adb shell service call statusbar 2
echo "saved ${FILENAME}."


# 次に各アプリのtopを撮る
# パッケージ名の取得
# adb shell pm list packages
PACKAGES=("jp.co.yahoo.android.news" "jp.gocro.smartnews.android" "jp.naver.linenews.android" "com.newspicks" "jp.www47news.Viewer" "jp.co.yahoo.android.yjtop" "com.gunosy.android")
for PACKAGE in ${PACKAGES[@]}; do
	echo "capturing ${PACKAGE}..."
	APPFILENAME="app-${PACKAGE}-${DATE}.png"
	adb shell monkey -p ${PACKAGE} -c android.intent.category.LAUNCHER 1
	sleep 10s
	# もしスライドさせる必要があれば適宜利用
	# adb shell input touchscreen tap x y
	# adb shell input touchscreen swipe x1 y1 x2 y2
	# 例：
	# adb shell input touchscreen swipe 0 200 500 200 # swipe left
	# adb shell input touchscreen swipe 500 200 0 200 # swipe right
	# PTRを使うなら
	adb shell input touchscreen swipe 200 400 200 2000 1000
	sleep 10s
	adb shell screencap -p "/sdcard/${APPFILENAME}"
	adb pull /sdcard/"${APPFILENAME}" ./autocap/apps/"${APPFILENAME}"
	adb shell rm "/sdcard/${APPFILENAME}"
	# ホームに戻しておく
	adb shell input keyevent KEYCODE_HOME
	# もし、終了させる必要があれば
	# adb shell am force-stop ${PACKAGE}
done
