<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function out(bool $ok, string $code): void {
    echo json_encode(['ok' => $ok, 'code' => $code], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    out(false, 'fail');
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && stripos($origin, 'flightsimulator.gr') === false) {
    http_response_code(403);
    out(false, 'fail');
}

if (trim((string)($_POST['company'] ?? '')) !== '') {
    out(true, 'subscribed');
}

if (empty($_POST['consent'])) {
    out(false, 'consent');
}

$email = strtolower(trim((string)($_POST['email'] ?? '')));
if (strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    out(false, 'invalid');
}

$at = strrpos($email, '@');
$domain = $at === false ? '' : substr($email, $at + 1);
$hasMx = $domain !== '' && getmxrr($domain, $mx);
$hasA = $domain !== '' && checkdnsrr($domain, 'A');
if (!$hasMx && !$hasA) {
    out(false, 'nomx');
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
$bucket = sys_get_temp_dir() . '/fsnews-' . hash('sha256', $ip);
$now = time();
$hits = [];
if (is_file($bucket)) {
    $raw = @file_get_contents($bucket);
    $hits = $raw ? json_decode($raw, true) : [];
    if (!is_array($hits)) {
        $hits = [];
    }
}
$hits = array_values(array_filter($hits, function ($t) use ($now) {
    return is_int($t) && ($now - $t) < 3600;
}));
if (count($hits) >= 5) {
    http_response_code(429);
    out(false, 'fail');
}
$hits[] = $now;
@file_put_contents($bucket, json_encode($hits), LOCK_EX);

$configFile = __DIR__ . '/1q2w3e4r5t6y7u8i9o0p/newsletter-config.php';
if (!is_file($configFile)) {
    error_log('newsletter: missing config');
    http_response_code(500);
    out(false, 'fail');
}
$config = require $configFile;
if (!is_array($config)) {
    http_response_code(500);
    out(false, 'fail');
}

try {
    $pdo = new PDO(
        'mysql:host=' . $config['host'] . ';dbname=' . $config['name'] . ';charset=utf8mb4',
        $config['user'],
        $config['pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]
    );
    $insert = function (PDO $pdo, string $email): int {
        $stmt = $pdo->prepare('INSERT IGNORE INTO subscribers (email) VALUES (:email)');
        $stmt->execute(['email' => $email]);
        return $stmt->rowCount();
    };
    try {
        $added = $insert($pdo, $email);
    } catch (PDOException $e) {
        $missing = strpos($e->getMessage(), '1146') !== false || stripos($e->getMessage(), 'exist') !== false;
        if (!$missing) {
            throw $e;
        }
        $pdo->exec('CREATE TABLE IF NOT EXISTS subscribers (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uniq_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
        $added = $insert($pdo, $email);
    }
} catch (Throwable $e) {
    error_log('newsletter: ' . $e->getMessage());
    http_response_code(500);
    out(false, 'fail');
}

if ($added === 0) {
    out(true, 'exists');
}

$safe = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$lang = preg_replace('/[^a-z]/', '', strtolower((string)($_POST['lang'] ?? 'en')));
$copy = [
    'en' => ['You are on the list', 'Thanks for subscribing. We will write only about the simulators and the catalogue.'],
    'it' => ['Iscrizione completata', 'Grazie. Ti scriviamo solo per i simulatori e il catalogo.'],
    'el' => ['Η εγγραφή ολοκληρώθηκε', 'Ευχαριστούμε. Γράφουμε μόνο για τους προσομοιωτές και τον κατάλογο.'],
    'es' => ['Inscripción hecha', 'Gracias. Escribimos solo sobre los simuladores y el catálogo.'],
    'fr' => ['Inscription confirmée', 'Merci. Nous écrivons seulement au sujet des simulateurs et du catalogue.'],
    'de' => ['Anmeldung gespeichert', 'Danke. Wir schreiben nur über die Simulatoren und den Katalog.'],
    'ru' => ['Подписка оформлена', 'Спасибо. Пишем только о тренажёрах и каталоге.'],
];
$pair = $copy[$lang] ?? $copy['en'];
$html = '<div style="font-family:Arial,sans-serif;color:#122">'
    . '<a href="https://virtualsky.gr"><img src="https://virtualsky.gr/NEWSLETTER/logo.png" width="214" alt="Virtual Sky"></a><br>'
    . '<h2 style="font-size:18px">' . $pair[0] . '</h2>'
    . '<p>' . $pair[1] . '</p>'
    . '<a href="https://flightsimulator.gr"><img src="https://virtualsky.gr/NEWSLETTER/HOME.webp" width="400" alt="Flight Simulator"></a><br>'
    . '<p><a href="https://flightsimulator.gr">flightsimulator.gr</a><br>'
    . '<a href="mailto:info@virtualsky.gr">info@virtualsky.gr</a></p></div>';
$headers = "MIME-Version: 1.0\r\n"
    . "Content-type: text/html; charset=UTF-8\r\n"
    . "From: Flight Simulator <no-reply@virtualsky.gr>\r\n"
    . "X-Mailer: PHP/" . phpversion();
@mail($email, $pair[0], $html, $headers);
@mail(
    'info@virtualsky.gr',
    'New newsletter subscription',
    "A new address subscribed:\n\n" . $email . "\n",
    "From: Flight Simulator <no-reply@virtualsky.gr>\r\nContent-Type: text/plain; charset=UTF-8\r\n"
);

out(true, 'subscribed');
