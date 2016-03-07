# auto-capture

[PhntomJS](http://phantomjs.org/) と [CasperJS](http://casperjs.org/) で複数ページを自動的にキャプチャします。

## モジュールをインストール

### Mac

PhantomJS と CasperJS をインストール

```
$ npm install -g phantomjs casperjs
```

確認

```
$ phantomjs --version
2.0.0
$ casperjs --version
1.1.0-beta5
```

### Windows

zipをダウンロード

- [PhantomJS | Download](http://phantomjs.org/download.html)
- [CasperJS | Installation ](http://docs.casperjs.org/en/latest/installation.html#installing-from-an-archive)

zipを解凍し適当なディレクトリに配置

- c:\phantomjs  
- c:\casperjs  

環境変数にPATHを追記

- 変数名：PATH  
- 変数値：;C:\phantomjs¥bin;C:\casperjs¥bin

確認

```
$ phantomjs --version
2.0.0
$ casperjs --version
1.1.0-beta5
```

## 使い方

1. ここのファイルを `git clone` か [ダウンロード](https://github.com/tipsnote/auto-capture/archive/master.zip)

2. [list.csv](https://github.com/tipsnote/auto-capture/blob/master/list.csv) にキャプチャーするURLと保存するファイル名を記載する

3. [device.csv](https://github.com/tipsnote/auto-capture/blob/master/device.csv) にキャプチャーしたい任意のデバイス情報を記載する

4. コマンドで実行

## コマンド例

width: 1280 でキャプチャする場合
```
$ casperjs capture.js
```

任意のデバイスサイズでキャプチャする場合（device.csvに記載があるもの）
```
$ casperjs capture.js pc
```

Basic認証があるページをキャプチャする場合
```
$ casperjs capture.js pc --id=UserName --pass=Password
```
