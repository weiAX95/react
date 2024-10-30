// app/aws-config.js
import { Amplify } from 'aws-amplify';

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: "https://od7i6hd4mfekldabr3hazokqde.appsync-api.ap-southeast-2.amazonaws.com/graphql",
      region: "ap-southeast-2",
      defaultAuthMode: "apiKey",  // 确保是小写的 "apiKey"
      apiKey: "da2-bmdc6vumjvbnthj6kz4uh5hwnu"  // 使用实际的 API 密钥
    }
  }
});