import twilio from "twilio";
import logger from "../loggers/configLog4JS.js";

export async function enviarMensajeTxt(body, to = "+541164665369") {
  const accountSID = "AC9c8fd8fadd42839fff278b4a49fb7f63";
  const authToken = "3f92a406febf0a30aa223a1358031b8c";

  const client = twilio(accountSID, authToken);

  try {
    const msg = await client.messages.create({
      body,
      from: "+17747377860",
      to,
    });
    console.log(msg);
  } catch (e) {
    logger.error(e);
  }
}

export async function enviarMensajeWsp(body, to = "+541164665369") {
  const accountSID = "AC9c8fd8fadd42839fff278b4a49fb7f63";
  const authToken = "3f92a406febf0a30aa223a1358031b8c";

  const client = twilio(accountSID, authToken);

  try {
    const msg = await client.messages.create({
      body: `whatsapp:${body}`,
      from: "+17747377860",
      to: `whatsapp:${to}`,
    });
    console.log(msg);
  } catch (e) {
    logger.error(e);
  }
}
