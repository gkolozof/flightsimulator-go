<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: products/');
    exit;
}
$product = trim((string) ($_POST['product'] ?? ''));
$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$ok = $product !== '' && $name !== '' && filter_var($email, FILTER_VALIDATE_EMAIL);
if ($ok) {
    $body = "Product: $product\nName: $name\nEmail: $email\nPhone: $phone\n\n$message\n";
    @mail('info@virtualsky.gr', 'Order: ' . $product, $body, 'From: info@virtualsky.gr' . "\r\n" . 'Reply-To: ' . $email);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Order sent</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <main>
    <section class="section" style="padding-top:8rem">
      <div class="container" style="max-width:640px">
        <?php if ($ok): ?>
          <h1>Order sent</h1>
          <p style="color:var(--muted);margin-top:1rem">Thank you, <?= htmlspecialchars($name) ?>. We received your request for <strong style="color:#fff"><?= htmlspecialchars($product) ?></strong> and will reply to <?= htmlspecialchars($email) ?>.</p>
        <?php else: ?>
          <h1>Could not send</h1>
          <p style="color:var(--muted);margin-top:1rem">Check your name and email, then try again.</p>
        <?php endif; ?>
        <p style="margin-top:1.5rem"><a class="btn btn-primary" href="products/">Back to products</a></p>
      </div>
    </section>
  </main>
</body>
</html>
