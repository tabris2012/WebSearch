# WebSearch
Node.jsを使ったローカルディレクトリ検索

## Memo
- windowsローカルではパス長制限に引っ掛かりnpm installが失敗する
    - コンテナ内にフォルダを作り、node_modulesの代わりに使う
    - http://jjtake.hatenablog.jp/entry/2017/10/22/004650
    ```
    # mount --bind [コンテナ内フォルダ] ./node_modules/
    # npm install
    # umount ./node_moduels/ # Invalid argumentエラーは無視できる
    # cp -r [コンテナ内フォルダ]/* .node_modules/ #マウント解除後に中身をコピー
    ```
