// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Bárdi Autó Mozi',
      meta: [
        { name: 'description', content: 'Bárdi Autó Mozi jegyfoglalás'}
      ]
    }
  },
  runtimeConfig: {
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbName: process.env.DB_NAME,
    dbPassword: process.env.DB_PASSWORD
  }
})
