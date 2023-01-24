import express from "express"
const router = express.Router()
import {
  createNewDispenser,
  changeDispenserStatus,
  moneySpent,
} from "./dispenserControllers.js"

router.route("/").post(createNewDispenser)

router.route("/:id/status").put(changeDispenserStatus)

router.route("/:id/spending").get(moneySpent)

export default router
