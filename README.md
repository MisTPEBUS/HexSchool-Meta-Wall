# HexSchool-Meta-Wall

## 項目介紹
HexSchool-Meta-Wall 

# 版本控管

## Week 3
1. 建立 Express 版本
2. 建立 `./models/posts.js` 模型
3. 建立 `./routes/posts.js` API
    - 查詢全部
    - 查詢單筆
    - 新增單筆資料
    - 修改單筆資料
    - 刪除單筆資料

### 助教補充
1. 可在 `app.js` 路由下方加上一個找不到頁面的 404 錯誤訊息捕捉。
2. 刪除單筆資料時，若使用者傳入格式正確但不存在的 ObjectId，Mongoose 預設會回傳 `null` 並顯示刪除成功，應自訂錯誤訊息。
3. 由於最終作業是一個臉書動態牆，不能有新增空白內容的情況，建議在 `PUT` 方法中加上 `data.content` 是否為空的判斷，或者在 `findByIdAndUpdate` 中加入第三個參數 `{ runValidators: true }`，讓 `findByIdAndUpdate` 也可以執行 Schema 驗證規則。可以參考[這篇文章](https://israynotarray.com/nodejs/20220301/1465076357/)。

## Week 4 (整合 User Model)
1. 建立 `./models/users.js` 模型
2. 在 `./models/posts.js` 中關聯 Users 模型
3. 修改 `./routes/posts.js` API
    - 查詢全部: 加入標籤篩選和關鍵字搜尋

## Week 5 Express Middleware 異常狀態處理
1. 設計一個 Middleware，讓 Controller 程式碼中不需要使用 `try catch`
2. 透過環境變數設定在開發和生產環境下的不同回饋訊息
3. 客製化各種錯誤狀態，包括 NPM 的錯誤訊息
4. 使用 `node.js` 的 `uncaughtException` 和 `unhandledRejection` 來捕捉預期外的錯誤

## 技術棧
- express --no view
- mongoose


## 安裝指南
```bash
# 複製倉庫
git clone https://github.com/yourusername/HexSchool-Meta-Wall.git

# 進入項目目錄
cd HexSchool-Meta-Wall

# 安裝依賴
npm install

npm install dotenv cors mongoose

# 環境變數
PORT=
DATABASE=
DATABASE_PASSWORD=
