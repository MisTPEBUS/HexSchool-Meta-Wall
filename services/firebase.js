const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const admin = require("firebase-admin");

// Firebase Admin  金鑰內容
const config = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_X509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

// 初始化
admin.initializeApp({
  credential: admin.credential.cert(config),  // 設定身份驗證，可授予 Firebase 服務的管理員存取權
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`, 
  // 設定儲存桶位置（要存放在哪個專案，FIREBASE_PROJECT_ID 即為專案名稱）
});

module.exports = admin;