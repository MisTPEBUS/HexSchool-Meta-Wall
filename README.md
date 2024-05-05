# HexSchool-Meta-Wall

## 項目介紹
HexSchool-Meta-Wall 

## 版本控管
- Week 3: 
    1. 建立express版本
    2. 建立 ./models/posts.js MODEL
    3. 建立 ./routes/posts.js API  
        3-1. 查詢全部
        3-2. 查詢單筆
        3-3. 新增單筆資料
        3-4. 修改單筆資料
        3-5. 刪除單筆資料
- 助教補充:
    1. 可在 app.js 路由下方加上一個找不到頁面的 404 錯誤訊息捕捉。
    2. 刪除單筆資料時，若使用者傳入格式正確但不存在的 ObjectId，mongoose 預設會回傳 null 並回傳刪除成功，可以再針對此情況自訂錯誤訊息。
    3. 由於最終作業是一個臉書動態牆，不能有新增空白內容的情況，因此建議 PUT 這裡加上一個 data.content 是否為空的判斷，或者可以在 findByIdAndUpdate 加入第三個參數 { runValidators: true }，讓 findByIdAndUpdate 也可以跑 Schema 驗證規則，可以參考
    (https://israynotarray.com/nodejs/20220301/1465076357/)這篇文章哦

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
