# Config Example
###  Language: Typescript
###  Path: /src/data/config.ts


```ts
const config = {
    Token : "Yout bot token",
    ClientID: "You bot id",
    ClientSecret: "Your bot secret",
    Prefix: "Your bot prefix",

    Dev: {
        Guild: "Your guild id",
    },

    Mongo: {
        Mongo_URI: "Your mongo uri",
    },

    Erela: {
        Host: "Host",
        Port: Port number,
        Password: "Password",
        Identifier: "Node Identifier",
        RetryAmount: Retry amount,
        RetryDelay: 1000 * 5 // 5 seconds
    },

    Webhooks: {
        ErrorLogger: "Webhook url"
    }
}
```