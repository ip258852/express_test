# express_test

## 摘要
使用nodejs實作小型購物系統.

## 系統
* OS : win10
* DB : mongodb,redis
* FW : express.js
 
## 功能
* 起始畫面
    - https://localhost:3001
* mongodb
    - mongodb://localhost:27017/chart
* 登入畫面
    - 註冊   /POST  /api/v1/members
    - 登入   /POST  /api/v1/login
* 登入後畫面
    + 會員相關
        - 客戶資料顯示  /GET  /api/v1/members
        - 客戶資料修改  /PUT  /api/v1/members
    + 產品相關
        - 產品資料取得  /GET  /api/v1/products
    + 訂單相關
        - 新增訂單     /POST  /api/v1/orders
        - 取得訂單     /GET  /api/v1/orders
        - 更新訂單     /PUT /api/v1/orders
        - 刪除訂單     /DELETE /api/vi/orders
        - 付款(假的)   /GET  /api/vi/payments
  
## 參考資料
    https://ithelp.ithome.com.tw/users/20107420/ironman/1381