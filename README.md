# ModelV.

webカメラとブラウザでバーチャルモデルになれるwebアプリです。

![demo](https://user-images.githubusercontent.com/26014062/81504695-bb14d880-9325-11ea-920c-372a19fb7385.gif)

このwebアプリでは2つのタブ(もしくはブラウザ)を使います。

1つ目のタブは、webカメラで撮影した映像からフェイストラッキングを行うために使われます。現在は顔の向きと口の開閉動作に対応しています。ここで取得・処理されたデータは2つ目のタブに送信されます。

2つ目のタブでは、1つ目のタブから送信されたトラッキングデータをもとにヴァーチャルモデルを描画するために使われます。


## Usage

1. モデルの読み込み

「モデル」ページに移動して、モデルデータを読み込みます。現在対応しているモデルはMMDのみです。

2. 接続設定

新規タブ(もしくは別ブラウザ)を開いて「操作パネル」ページに移動します。「コネクトキーを生成する」ボタンからコネクトキーを取得します。

取得したコネクトキーを「モデル」ページのフォームに入力すると、リターンキーが生成されます。このリターンキーは「操作パネル」ページのフォームに入力します。

「操作パネル」ページを開いているタブと「モデル」ページを開いているタブの接続が確立されると、接続ステータスが「接続中」になります。

3. webカメラ起動

「操作パネル」ページの「カメラ起動」ボタンからカメラを起動します。トラッキングデータに連動してモデルが動きます。


## Development

```bash
# clone this repository
git clone https://github.com/shooontan/modelv.git
cd modelv
```

### Download static files

```bash
bash scripts/dlfl.sh
```

### Build OpenCV.js

```bash
git clone https://github.com/opencv/opencv.git
# git rev-parse HEAD
# f19d0ae41d112de1e8aba11717462dd1b118342f

bash scripts/build-opencv.sh
```

### Develop app

```bash
# install
npm install

# develop localhost:3000
npm run dev

# production build
npm run build

# start localhost:3000
npm start
```
