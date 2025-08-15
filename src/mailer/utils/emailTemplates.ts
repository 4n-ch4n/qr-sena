export const htmlSendResetPasswordUrl = (url: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px;">

  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;">
    
    <div style="background-color: #4A90E2; color: #ffffff; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">INU QR Restablecer Contraseña</h1>
    </div>

    <div style="padding: 30px;">
      <p style="margin-bottom: 20px; font-size: 16px;">Hola</p>
      <p style="margin-bottom: 20px;">Recibimos una peticion para restablecer la contraseña de tu cuenta. Para proceder, por favor da click en el boton de abajo. Este link sera valido por 15 minutos.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" target="_blank" style="background-color: #4A90E2; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
          Reset Your Password
        </a>
      </div>

      <p style="margin-bottom: 20px; font-size: 14px; color: #555;">Si el buton de arriba no funciona, por favor copia y pega el siguiente link en tu navegador:</p>
      <p style="word-break: break-all; font-size: 12px; color: #4A90E2; margin-bottom: 30px;"><a href="${url}" target="_blank">${url}</a></p>
      
      <p style="border-top: 1px solid #eeeeee; padding-top: 20px; color: #777; font-size: 14px;">Si tu no solicitaste un restablecimiento de contraseña, ignora este email o contacta a nuestro soporte.</p>
      
      <p style="margin-top: 20px;">Gracias,<br>El Team INU QR</p>
    </div>

  </div>

</body>
</html>
`;

export const htmlPetFoundNotification = (
  petName: string,
  ownerName: string,
  ownerPhone: string,
): string => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¡Tu Mascota Ha Sido Encontrada!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px;">

  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;">
    
    <div style="background-color: #28a745; color: #ffffff; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">¡Buenas Noticias! Tu Mascota Ha Sido Encontrada</h1>
    </div>

    <div style="padding: 30px;">
      <p style="margin-bottom: 20px; font-size: 16px;">Hola ${ownerName},</p>
      <p style="margin-bottom: 20px;">Tenemos excelentes noticias. Alguien ha escaneado el código QR de tu mascota, <strong>${petName}</strong>.</p>
      <p style="margin-bottom: 25px;">Para ayudar a que se reúnan lo antes posible, hemos compartido de forma segura tu información de contacto con la persona que encontró a tu mascota. Por favor, mantente atento a una llamada o un correo electrónico o contacta con nuestro soprte para darte mas informacion.</p>
      
      <div style="background-color: #f9f9f9; border: 1px solid #eeeeee; padding: 20px; border-radius: 5px; margin-bottom: 25px;">
        <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">Información Compartida</h3>
        <p style="margin: 10px 0;"><strong>Teléfono:</strong> ${ownerPhone}</p>
      </div>
      
      <p style="border-top: 1px solid #eeeeee; padding-top: 20px; color: #777; font-size: 14px;">Esperamos que tú y ${petName} se reúnan muy pronto.</p>
      
      <p style="margin-top: 20px;">Gracias por confiar en nosotros,<br>El Equipo de INU QR</p>
    </div>

  </div>

</body>
</html>
`;

export const htmlLostPetReportConfirmation = (
  ownerName: string,
  petName: string,
  location: string,
  message: string,
): string => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte de Mascota Perdida</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px;">

  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;">
    
    <div style="background-color: #f0ad4e; color: #ffffff; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">Reporte de Mascota Perdida Creado</h1>
    </div>

    <div style="padding: 30px;">
      <p style="margin-bottom: 20px; font-size: 16px;">Hola ${ownerName},</p>
      <p style="margin-bottom: 20px;">Este es un email para confirmar que se ha reportado a tu mascota, <strong>${petName}</strong>, como perdida.</p>
      <p style="margin-bottom: 25px;">Por favor mantente atento, ya que la persona que la encontro puede contactarte o mismamente nosotros. Aquí están los detalles de tu reporte:</p>
      
      <div style="background-color: #f9f9f9; border: 1px solid #eeeeee; padding: 20px; border-radius: 5px; margin-bottom: 25px;">
        <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #f0ad4e; padding-bottom: 10px;">Detalles del Reporte</h3>
        <p style="margin: 10px 0;"><strong>Ubicación (última vez visto):</strong> ${location}</p>
        <p style="margin: 10px 0;"><strong>Mensaje Adicional:</strong> ${message || 'No se proporcionó información adicional.'}</p>
      </div>
      
      <p style="border-top: 1px solid #eeeeee; padding-top: 20px; color: #777; font-size: 14px;">Esperamos sinceramente que te reúnas pronto con ${petName}.</p>
      
      <p style="margin-top: 20px;">Con nuestros mejores deseos,<br>El Equipo de INU QR</p>
    </div>

  </div>

</body>
</html>
`;

export const htmlPurchaseConfirmation = (purchaseId: string): string => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Compra</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px;">

  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;">
    
    <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">¡Gracias por tu Compra!</h1>
    </div>

    <div style="padding: 30px;">
      <p style="margin-bottom: 20px; font-size: 16px;">Hola,</p>
      <p style="margin-bottom: 20px;">Hemos recibido y confirmado tu pedido. ¡Gracias por confiar en INU QR para la seguridad de tu mascota!</p>
      <p style="margin-bottom: 25px;">Estamos preparando tu pedido para el envío.</p>
      
      <div style="background-color: #f9f9f9; border: 1px solid #eeeeee; padding: 20px; border-radius: 5px; margin-bottom: 25px;">
        <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Referencia de tu Pedido</h3>
        <p style="margin: 10px 0;"><strong>ID de Compra:</strong> ${purchaseId}</p>
      </div>
      
      <p style="border-top: 1px solid #eeeeee; padding-top: 20px; color: #777; font-size: 14px;">Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
      
      <p style="margin-top: 20px;">Atentamente,<br>El Equipo de INU QR</p>
    </div>
  </div>

</body>
</html>
`;
