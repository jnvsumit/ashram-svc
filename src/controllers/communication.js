const { v4: uuidv4 } = require("uuid");
const { Communication } = require("../persistence/models");
const { sendEmail } = require("../libs/SES");

const sendCommunication = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const communication = new Communication({
      communicationId: uuidv4(),
      name,
      email,
      communicationType: "EMAIL",
      message,
    });

    const sesResponse = await sendEmail(email, `Hello from ${name}`, message);

    console.log(sesResponse);

    communication.messageId = sesResponse.MessageId;

    communication.communicationStatus = "SENT";
    await communication.save();

    return res.status(200).json({
      message: "Communication sent",
      messageCode: "COMMUNICATION_SENT",
      status: 200,
      success: false,
      data: {
        messageId: sesResponse.MessageId,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      messageCode: "INTERNAL_SERVER_ERROR",
      status: 500,
      success: false,
      data: null,
    });
  }
};

module.exports = {
  sendCommunication,
};
