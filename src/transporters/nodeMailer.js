import { createTransport } from 'nodemailer';

export async function sendMail(to, subject, html){
    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'cynthia.ferry@ethereal.email',
            pass: 'TcBzmB8ky3GQCvUcM5'
        }
    });

    const opts = {
        from: "cynthia.ferry@ethereal.email",
        to,
        subject,
        html
    }

    try{
        const info = await transporter.sendMail(opts)
        console.log(info)
    } catch(e) {
        console.log(e)
    }
}

// sendMail(
//     "taurean.volkman65@ethereal.email",
//     "test email",
//     "<h1>Hola Mundo</h1><div>hola senior mundo, le escribimos para recordarle que adeuda el pago de su tarjeta santander</div>"
//     )