import express from 'express'
import "dotenv/config"
import "./db"

import router from './routers/auth'

const app = express()

//middleware registration
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/auth", router)


const PORT = process.env.PORT || 8989;

app.listen(PORT, () => {
    console.log('Port is listening on port ' + PORT);
});