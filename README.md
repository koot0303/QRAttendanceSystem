# QRAttendanceSystem

## 概要
QRコードの読み込むだけで出席確認が完了するWebアプリケーション

## 導入
- リポジトリのクローン
  ```bash
  git clone https://github.com/g022c1011/QRAttendanceSystem
  cd QRAttendanceSystem
  ```
- ライブラリインストール
  ```bash
  pip install -r requirements.txt
  ```
- マイグレーション
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  ```
- サーバ起動
  ```bash
  python manage.py runserver
  ```
- ブラウザでアクセス<br>
  http://127.0.0.1:8000/accounts/home/

## 機能
| 項目 | 内容 |
| - | - |
| ログイン関連 | ログイン、ログアウト、サインアップ |
| 授業管理(教師ユーザー) | 新規授業登録、授業選択 |
| QRコード読み取り(教師ユーザー) | QRコードから生徒情報の読み取り、「生徒情報、出席時間」を記録 |
| 出席リスト確認(教師ユーザー) | 出席データをリストで確認 |
| QRコード生成(生徒ユーザー) | 生徒情報(学籍番号、メールアドレス)を含むQRコードを生成 |

## 使用技術
| 項目 | 内容 |
| - | - |
| バックエンド | Python 3.10.11 |
| フレームワーク | Django 5.0.6 |
| フロントエンド | HTML,JavaScript |
| データベース | SQlite |


## 開発環境
| 項目 | 内容 |
| - | - |
| エディタ | Visual Studio Code |
| バージョン管理 | Github |

## 今後の課題
- GoogleOauthの導入
- 早退者用の機能の導入
- 生徒が出席状況を確認できるページの追加
- 環境やカメラの性能によってQRコードを読み取りにくい問題の対策
