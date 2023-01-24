import express from "express"
import { config } from "dotenv"
import connectDB from "./db.js"
import dispenserRoutes from "./dispenserRoutes.js"

config()
connectDB()
const app = express()
app.use(express.json())

app.get("/", (req, res) => {
  res.send("API is running...")
})

app.use("/api/dispenser", dispenserRoutes)

app.listen(
  process.env.PORT,
  console.log(`server is running in ${process.env.PORT}`)
)
