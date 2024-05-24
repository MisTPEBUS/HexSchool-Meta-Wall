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

- Week 4 (整合 user model, 貼文API): 
    1. 建立 ./models/users.js MODEL
    2. ./models/posts.js 關聯 users Model  
    3. ./routes/posts.js API 
        3-1. 查詢全部: 加入時間排序+篩選關鍵字    
        3-2. 新增貼文:檢查欄位     
- 助教補充:   
    ．console.log 測試完畢後可以移除。
    ．宣告部分建議使用 let、const 來取代 var 的方式

    ．正確 200 與錯誤 400 等等狀態的管理，可以另外建立一個檔案後匯入，可以避免不斷重複的程式碼。
    ．在新增貼文的部分，postToDelete 並沒有這個資料喔~，所以新增貼文時會出現錯誤喔~
    ．.env 的檔案記得要有空白的 example ，因為這樣才能知道這份檔案需要載入的環境變數有哪些喔~
    ．可以在 content 這類必備的資料內加入 .trim 去除空格，避免使用者會輸入純空白讓系統判斷有值。

    ．目前查詢的部分是有一些錯誤導致無法查詢，像是沒有導入 User 、 Schema 也有錯誤的部分，但是 Render 是可以查詢的。 
       
        
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
