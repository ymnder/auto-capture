/*
* Usage:
*  $ casperjs capture.js
* Devices X URLs
*/

// casperJSのインスタンス生成とjQueryの差し込み
var casper = require('casper').create({clientScripts: ['./jquery.min.js']});

// ファイル操作を行うモジュールの読み込み
var fs = require('fs');

// capture urls
var buf = fs.read('./list.csv');
    buf = buf.replace( /\r\n/g , '\n' );
var captureList = makeCSVArray(buf);

// capture devices
var devlist = fs.read('./device.tsv');
    devlist = devlist.replace( /\r\n/g , '\n' );
var deviceList = makeTSVArray(devlist);

// キャプチャーを撮る間隔
var waitTime = 1500;

// キャプチャーを保存するフォルダ名に使う文字列を日時から生成
var screenshotNow = new Date();
var screenshotDateTime = screenshotNow.getFullYear() + pad(screenshotNow.getMonth() + 1) +
    pad(screenshotNow.getDate()) + '-' + pad(screenshotNow.getHours()) +
    pad(screenshotNow.getMinutes()) + pad(screenshotNow.getSeconds());


// casperJS
casper.start();

casper.each(deviceList, function(casper, deviceData){
    var deviceSpec = deviceData[0];
    var viewport = {width: parseInt(deviceData[1]), hight: parseInt(deviceData[2])};
    var ua = deviceData[3].replace(/(^\s+)|(\s+$)/g, '"');
    captureList.forEach(function(data) {

        var url = data[0];  //URL
        var file = data[1];  //画像名
        casper.then(function(){
            this.userAgent(ua);
            this.viewport(viewport.width, viewport.hight);
        });
        // ページを開く
        casper.thenOpen(url, function () {
            this.wait(waitTime);
        });
        casper.then(function () {
            this.echo('URL: ' + url + ' | File: ' + file + deviceSpec + '.png');
            // background-colorに指定がない場合透過されるので色をつける
            this.evaluate(function(){
                $('body').css('background-color','#fff');
            });
            this.capture(file + '/' + file + '-' + deviceSpec + screenshotDateTime  + '.png');
        });
    });
});

casper.run();

function makeCSVArray(buf){
    var csvData = [];
    var lines = buf.split('\n');
    for(var i = 0; i < lines.length; i++){
        var cells = lines[i].split(',');
        if(cells.length !=1){
            csvData.push(cells);
        }
    }
    return csvData;
}

function makeTSVArray(buf){
    var tsvData = [];
    var lines = buf.split('\n');
    for(var i = 0; i < lines.length; i++){
        var cells = lines[i].split('\t');
        if(cells.length !=1){
            tsvData.push(cells);
        }
    }
    return tsvData;
}

// 数値→文字列変換
function pad(number) {
    var r = String(number);
    if ( r.length === 1 ) {
        r = '0' + r;
    }
    return r;
}