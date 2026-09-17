<?php
/**
 * ==========================================================================
 * AUSTIN KIDS EVENTS - BACKEND DE ENVÍO DE CORREO NATIVO (PHP / NAMECHEAP)
 * ==========================================================================
 */

// Encabezados para permitir peticiones AJAX y devolver JSON
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Solo permitir peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed'
    ]);
    exit;
}

// 1. RECEPTOR DEL CORREO
$recipient_email = 'gestionsaberesyemociones@gmail.com';
$server_domain = preg_replace('/^www\./', '', $_SERVER['SERVER_NAME'] ?? 'austinkidsevents.com');
$from_email = 'no-reply@' . $server_domain;

// 2. OBTENER DATOS (compatible con FormData y JSON)
$input = $_POST;
if (empty($input)) {
    $raw_json = file_get_contents('php://input');
    $input = json_decode($raw_json, true) ?? [];
}

// 3. PROTECCIÓN ANTI-SPAM (Honeypot)
if (!empty($input['_honey'])) {
    // Es un bot, responder con éxito falso silencioso
    echo json_encode([
        'success' => true,
        'message' => 'Message processed.'
    ]);
    exit;
}

// 4. SANITIZAR Y EXTRAER CAMPOS
function clean_field($data) {
    return htmlspecialchars(trim($data ?? ''), ENT_QUOTES, 'UTF-8');
}

$first_name = clean_field($input['First_Name'] ?? $input['First Name'] ?? $input['firstName'] ?? '');
$last_name  = clean_field($input['Last_Name'] ?? $input['Last Name'] ?? $input['lastName'] ?? '');
$phone      = clean_field($input['Phone_Number'] ?? $input['Phone Number'] ?? $input['phone'] ?? '');
$email      = filter_var(trim($input['Email_Address'] ?? $input['Email Address'] ?? $input['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$zip_code   = clean_field($input['Event_ZIP_Code'] ?? $input['Event ZIP Code'] ?? $input['zipCode'] ?? '');
$event_date = clean_field($input['Event_Date'] ?? $input['Event Date'] ?? $input['eventDate'] ?? '');
$location   = clean_field($input['Event_Location'] ?? $input['Event Location'] ?? $input['location'] ?? 'Private home');
$setup      = clean_field($input['Setup_Requested'] ?? $input['Setup Requested'] ?? $input['setup'] ?? 'General Setup');

// Validación básica de campos obligatorios
if (empty($first_name) || empty($phone) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please provide a valid name, email address, and phone number.'
    ]);
    exit;
}

$full_name = trim("$first_name $last_name");

// 5. ASUNTO DEL CORREO
$subject = "🎉 Nueva Cotización: {$setup} - {$full_name}";

// 6. PLANTILLA HTML DEL CORREO (Diseño profesional de Austin Kids Events)
$email_html = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Nueva Cotización - Austin Kids Events</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(10,37,64,0.1); border: 2px solid #cbd5e1; }
        .header { background: #ffffff; padding: 28px 24px 20px; text-align: center; color: #0A2540; }
        .header img { height: 80px; width: auto; margin-bottom: 8px; display: inline-block; }
        .header h1 { margin: 0; font-size: 21px; font-weight: 800; color: #0A2540; letter-spacing: 0.05em; text-transform: uppercase; }
        .header p { margin: 4px 0 0; color: #5F7D95; font-size: 14px; font-weight: 600; }
        .color-bar { display: flex; height: 6px; width: 100%; }
        .c-1 { background-color: #0A2540; width: 20%; }
        .c-2 { background-color: #52B79A; width: 20%; }
        .c-3 { background-color: #FF5A60; width: 20%; }
        .c-4 { background-color: #FFB400; width: 20%; }
        .c-5 { background-color: #9EC5E6; width: 20%; }
        .content { padding: 32px 28px; color: #0A2540; }
        .intro-box { background-color: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 5px solid #52B79A; padding: 14px 18px; border-radius: 0 10px 10px 0; margin-bottom: 24px; font-size: 15px; line-height: 1.5; color: #0A2540; }
        .table-wrap { width: 100%; border-collapse: separate; border-spacing: 0; border-radius: 12px; overflow: hidden; border: 1.5px solid #e2e8f0; margin-bottom: 28px; }
        .table-wrap tr:nth-child(even) { background-color: #f8fafc; }
        .table-wrap td { padding: 14px 18px; font-size: 14px; border-bottom: 1px solid #e2e8f0; }
        .table-wrap tr:last-child td { border-bottom: none; }
        .label-col { font-weight: 800; color: #5F7D95; width: 38%; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em; }
        .val-col { font-weight: 700; color: #0A2540; }
        .badge-setup { display: inline-block; background-color: #FF5A60; color: #ffffff; padding: 4px 12px; border-radius: 999px; font-weight: 800; font-size: 13px; }
        .actions-box { text-align: center; padding: 20px; background-color: #f8fcff; border: 2px dashed #9EC5E6; border-radius: 14px; margin-top: 10px; }
        .btn-reply { display: inline-block; background-color: #0A2540; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-weight: 800; font-size: 14px; margin: 4px; }
        .btn-wa { display: inline-block; background-color: #25D366; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-weight: 800; font-size: 14px; margin: 4px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #94A3B8; background-color: #f8fafc; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <img src="https://{$server_domain}/assets/brand/AUSTIN%20KE%20LOGO-1.png" alt="Austin Kids Events">
            <h1>AUSTIN KIDS EVENTS</h1>
            <p>Nueva Solicitud de Cotización Recibida</p>
        </div>
        <div class="color-bar">
            <div class="c-1"></div>
            <div class="c-2"></div>
            <div class="c-3"></div>
            <div class="c-4"></div>
            <div class="c-5"></div>
        </div>
        <div class="content">
            <div class="intro-box">
                ¡Tienes una nueva solicitud de cotización desde la página web de <strong>Austin Kids Events</strong>!
            </div>

            <table class="table-wrap">
                <tr>
                    <td class="label-col">Cliente</td>
                    <td class="val-col">{$full_name}</td>
                </tr>
                <tr>
                    <td class="label-col">Setup Solicitado</td>
                    <td class="val-col"><span class="badge-setup">{$setup}</span></td>
                </tr>
                <tr>
                    <td class="label-col">Fecha del Evento</td>
                    <td class="val-col">📅 {$event_date}</td>
                </tr>
                <tr>
                    <td class="label-col">Código Postal (ZIP)</td>
                    <td class="val-col">📍 {$zip_code}</td>
                </tr>
                <tr>
                    <td class="label-col">Lugar de la Fiesta</td>
                    <td class="val-col">🏠 {$location}</td>
                </tr>
                <tr>
                    <td class="label-col">Teléfono</td>
                    <td class="val-col"><a href="tel:{$phone}" style="color: #0A2540; text-decoration: none; font-weight: 800;">📞 {$phone}</a></td>
                </tr>
                <tr>
                    <td class="label-col">Correo Electrónico</td>
                    <td class="val-col"><a href="mailto:{$email}" style="color: #52B79A; text-decoration: none; font-weight: 800;">✉️ {$email}</a></td>
                </tr>
            </table>

            <div class="actions-box">
                <p style="margin: 0 0 12px; font-size: 13px; color: #5F7D95; font-weight: 700;">ACCIONES RÁPIDAS CON EL CLIENTE:</p>
                <a href="mailto:{$email}?subject=Respuesta%20a%20tu%20cotización%20-%20Austin%20Kids%20Events" class="btn-reply">✉️ Responder por Correo</a>
            </div>
        </div>
        <div class="footer">
            Enviado automáticamente desde el formulario web de Austin Kids Events.<br>
            Hosting: Namecheap Server • IP: {$_SERVER['REMOTE_ADDR']}
        </div>
    </div>
</body>
</html>
HTML;

// 7. ENCABEZADOS DEL CORREO (Headers)
$server_domain = $_SERVER['SERVER_NAME'] ?? 'austinkidsevents.com';
$from_email = 'no-reply@' . preg_replace('/^www\./', '', $server_domain);

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Austin Kids Events <{$from_email}>\r\n";
$headers .= "Reply-To: {$full_name} <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 8. ENVIAR CORREO MEDIANTE LA FUNCIÓN NATIVA MAIL() DE NAMECHEAP
$sent = @mail($recipient_email, $subject, $email_html, $headers, '-f' . $from_email);

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => '¡Cotización enviada con éxito!'
    ]);
} else {
    // Si la función mail falló por alguna restricción de configuración en cPanel
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al procesar el envío de correo en el servidor.'
    ]);
}
?>

