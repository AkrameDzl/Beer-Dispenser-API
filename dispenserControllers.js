import asyncHandler from "express-async-handler"
import Dispenser from "./dispenserModel.js"

//@desc     Create a new dispenser
//@route    POST /dispenser

const createNewDispenser = asyncHandler(async (req, res) => {
  const { flow_volume } = req.body
  try {
    const dispenser = await Dispenser.create({
      flow_volume,
    })
    if (dispenser) {
      res.status(200).json({
        id: dispenser._id,
        flow_volume: dispenser.flow_volume,
      })
    }
  } catch (error) {
    res.status(500)
    throw new Error("Unexpected API error")
  }
})

//@desc     Change dispenser status by Id(open,close)
//@route    PUT /dispenser/:id/status

const changeDispenserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  try {
    const dispenser = await Dispenser.findById(req.params.id)
    if (dispenser && dispenser.status != status) {
      dispenser.status = status
      if (dispenser.status == "open") {
        dispenser.spending = [
          {
            opened_at: new Date().toISOString(),
            closed_at: null,
          },
          ...dispenser.spending,
        ]
      } else {
        const index = dispenser.spending.findIndex((sp) => sp.closed_at == null)
        dispenser.spending[index].closed_at = new Date().toISOString()
        dispenser.spending[index].flow_volume = dispenser.flow_volume
      }
      await dispenser.save()
      res.status(202).json("Status of the tap changed correctly")
    } else {
      res.status(409).json(`Dispenser is already ${dispenser.status}`)
    }
  } catch (error) {
    res.status(500)
    throw new Error("Unexpected API error")
  }
})

//@desc     Money spent by dispenser Id
//@route    GET /dispenser/:id/spending

const moneySpent = asyncHandler(async (req, res) => {
  try {
    const dispenser = await Dispenser.findById(req.params.id)
    if (dispenser && dispenser.spending.length != 0) {
      dispenser.total_amount = 0
      dispenser.spending.forEach((sp) => {
        let { opened_at, closed_at } = sp
        if (closed_at == null) {
          closed_at = new Date().getTime()
          opened_at = new Date(opened_at).getTime()
        } else {
          opened_at = new Date(opened_at).getTime()
          closed_at = new Date(closed_at).getTime()
        }
        let time = Math.abs((closed_at - opened_at) / 1000)
        let lt = time * dispenser.flow_volume
        sp.spent = (lt * 12.25).toFixed(2)
        dispenser.total_amount += sp.spent
      })
      await dispenser.save()
      res.status(200).json({
        amount: dispenser.total_amount,
        usages: dispenser.spending,
      })
    } else {
      res.status(404).json("Requested dispenser does not exist")
    }
  } catch (error) {
    res.status(500)
    throw new Error("Unexpected API error")
  }
})

export { createNewDispenser, changeDispenserStatus, moneySpent }
