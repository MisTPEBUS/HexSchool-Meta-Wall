const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});

const doc = {
    info: {
        version: '1.0.0',            // by default: '1.0.0'
        title: 'HexSchool-Meta-Wall',              // by default: 'REST API'
        description: '六角學院2024Node.js春季班API'         // by default: ''
    },
    servers: [
        {
            url: 'http://localhost:2330',              // by default: 'http://localhost:3000'
            description: 'Local'       // by default: ''
        },
        {
            url: 'https://hexschool-meta-wall.onrender.com',              // by default: 'http://localhost:3000'
            description: 'Render'       // by default: ''
        },
    ],
    tags: [                   // by default: empty Array
        {
            name: "使用者登入驗證",  
            description: "Users&Auth"
        },
        {
            name: '貼文牆管理',  
            description: "Posts"
        },
    ],
   
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
   

};

const outputFile = './swagger_output.json'; // 輸出的文件名稱
const endpointsFiles = ['./app.js']; // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

swaggerAutogen(outputFile, endpointsFiles, doc); // swaggerAutogen 的方法