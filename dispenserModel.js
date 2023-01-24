import mongoose from "mongoose"
const dispenserSpendingLineSchema = new mongoose.Schema({
  opened_at: {
    type: String,
  },
  closed_at: {
    type: String,
  },
  flow_volume: {
    type: Number,
  },
  spent: {
    type: Number,
    default: null,
  },
})

const dispenserSchema = new mongoose.Schema(
  {
    flow_volume: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "close"],
      default: "close",
    },
    total_amount: {
      type: Number,
      default: null,
    },
    spending: [dispenserSpendingLineSchema],
  },
  {
    timestamps: true,
  }
)

const Dispenser = mongoose.model("Dispenser", dispenserSchema)
export default Dispenser
