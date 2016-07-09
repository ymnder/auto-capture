/*
* Usage:
*  $ casperjs capture.js pc
*
*  デバイスの指定を省略すると横幅1280pxで取得します
*
* Options:
*  --id    Basic認証用ID
*  --pass  Basic認証用Password
*/

// casperJSのインスタンス生成とjQueryの差し込み
var casper = require('casper').create({clientScripts: ['./jquery.min.js']});

// ファイル操作を行うモジュールの読み込み
var fs = require('fs');

// キャプチャーするURLリストの取得
var buf = fs.read('./list.csv');
    buf = buf.replace( /\r\n/g , '\n' );
var captureList = makeCSVArray(buf);

// capture device
var devlist = fs.read('./device.csv');
    devlist = devlist.replace( /\r\n/g , '\n' );
var deviceList = makeCSVArray(devlist);

// // コマンドラインからのデバイス指定を確認
// if (casper.cli.args.length < 1) {
//     // 指定なしのデフォルト
//     var inputDevice = 'pc';
//     var viewport = {width: 1280, hight: 800};
//     var ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36';
// } else {
//     // 指定ありの場合CSVから情報を取得
//     var inputDevice = casper.cli.args[0];
//
//     var buf = fs.read('./device.csv');
//         buf = buf.replace( /\r\n/g , '\n' );
//     var deviceSpec = findFromCSV(buf, inputDevice);
//
//     var viewport = {width: parseInt(deviceSpec[1]), hight: parseInt(deviceSpec[2])};
//     var ua = deviceSpec[3].replace(/(^\s+)|(\s+$)/g, '"');
// }

// キャプチャーを撮る間隔
var waitTime = 3000;

// コマンドラインから指定されたBasic認証のIDとPassword
var basicId = casper.cli.options.id;
var basicPass = casper.cli.options.pass;

// キャプチャーを保存するフォルダ名に使う文字列を日時から生成
var screenshotNow = new Date();
var screenshotDateTime = screenshotNow.getFullYear() + pad(screenshotNow.getMonth() + 1) +
    pad(screenshotNow.getDate()) + '-' + pad(screenshotNow.getHours()) +
    pad(screenshotNow.getMinutes()) + pad(screenshotNow.getSeconds());

// casperJSの処理を開始
casper.start();

casper.each(deviceList, function(casper, deviceData){
    var deviceSpec = deviceData[0];
    var viewport = {width: parseInt(deviceData[1]), hight: parseInt(deviceData[2])};
    var ua = deviceData[3].replace(/(^\s+)|(\s+$)/g, '"');
    // viewport, UA, Basic認証の情報を設定
    casper.userAgent(ua);
    casper.viewport(viewport.width, viewport.hight);
    casper.setHttpAuth(basicId, basicPass);

    // 取得したURLリストからキャプチャーを撮る処理
    casper.each(captureList, function(casper, data) {
        var url = data[0];  // ページのURL
        var file = data[1];  // 保存する画像名

        // ページを開く
        this.thenOpen(url, function () {
            this.wait(waitTime);
        });
        this.then(function () {
            // コマンドラインにメッセージを出す
            this.echo('URL: ' + url + ' | File: ' + file + deviceSpec + '.png');
            // background-colorに指定がない場合透過されるので色をつける
            this.evaluate(function(){
                $('body').css('background-color','#fff');
            });
            // キャプチャーした画像を保存する。/ をつけることでフォルダを作成
            this.capture(screenshotDateTime + '-' + deviceSpec + '/' + file + '.png');
        });
    });
});
// casperJSの処理を実行
casper.run();

// csvファイルを配列化
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

// csvファイルから指定したレコードを取り出す
function findFromCSV(buf, key) {
    var csvData =[];
    var lines = buf.split('\n');
    for(var i = 0; i < lines.length; i++){
        var cells = lines[i].split(',');
        if(cells[0] == key){
            csvData = cells;
            break;
        }
    }
    return csvData;
}

// 数値→文字列変換
function pad(number) {
    var r = String(number);
    if ( r.length === 1 ) {
        r = '0' + r;
    }
    return r;
}
