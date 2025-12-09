# プロンプト
下記参照

# 使い方
1. .env.exampleを設定
```
mv .env.example .env

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_access_key
```

2. レビュー
1ファイルに対して実行する場合

```
pnpm run review ./hoge.md
```

フォルダ配下全てに対して実行数r場合

```
pnpm run review ./foo
```

3. webからmdに

```
pnpm run web2md https://sori883.dev
```