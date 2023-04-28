require('dotenv').config();

module.exports = {
    app: "ashram-svc",
    port: 8000,
    jwt: {
        access: {
            secret: 'abcd',
            expiresIn: '15m',
            algorithm: 'HS256'
        },
        refresh: {
            secret: 'abcd',
            expiresIn: '2h',
            algorithm: 'HS256'
        }
    },
    mongo: {
        uri: process.env.MONGO_URI,
        dbName: process.env.DB_NAME
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        bucketName: process.env.AWS_BUCKET_NAME,
        region: process.env.AWS_REGION
    },
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET
    },
    defaultBookCoverURL: 'https://example.com/blank-book-cover.jpg'
  };
  