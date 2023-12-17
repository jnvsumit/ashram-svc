const mongoose = require("mongoose");

const CommunicationSchema = new mongoose.Schema(
  {
    communicationId: {
      type: String,
      required: true,
      unique: true,
    },
    messageId: {
      type: String,
      required: true,
      unique: true,
    },
    communicationType: {
      type: String,
      required: true,
      enum: ["EMAIL", "SMS", "WHATSAPP", "TELEGRAM"],
    },
    communicationStatus: {
      type: String,
      required: true,
      enum: ["SENT", "DELIVERED", "FAILED"],
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Communication", CommunicationSchema);
