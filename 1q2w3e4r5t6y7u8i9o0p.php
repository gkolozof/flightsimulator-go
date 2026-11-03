<?php
if (isset($_GET['logout'])) {
    ini_set('session.use_cookies', '0');
    session_start();
    $_SESSION = [];
    session_destroy();
    setcookie('PHPSESSID', '', time() - 42000, '/');
    header('Location: 1q2w3e4r5t6y7u8i9o0p.php');
    exit;
}
session_start();
$root = __DIR__;
$dataDir = $root . '/1q2w3e4r5t6y7u8i9o0p';
$jsonFile = $dataDir . '/products.json';
$imgDir = $root . '/img/products/extra';
$ACCESS_HASH = '$2y$12$r7QuK0kU.t4HX83uVX6UD.y8oFJK6ULLW70CP73lFhpYKqvPNLcYm';

function load_products($file) {
    $list = json_decode((string) @file_get_contents($file), true);
    return is_array($list) ? $list : [];
}
function save_products($file, $list) {
    return file_put_contents($file, json_encode(array_values($list), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
}
function h($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }

function http_post($url, $body) {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 25,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded', 'User-Agent: Mozilla/5.0'],
        ]);
        $out = curl_exec($ch);
        curl_close($ch);
        return is_string($out) ? $out : '';
    }
    $ctx = stream_context_create(['http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\nUser-Agent: Mozilla/5.0\r\n",
        'content' => $body,
        'timeout' => 25,
    ]]);
    $out = @file_get_contents($url, false, $ctx);
    return is_string($out) ? $out : '';
}

function translate_batch($texts, $tl) {
    $texts = array_values($texts);
    if (!$texts) return [];
    $sep = "\n§§§\n";
    $url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' . rawurlencode($tl) . '&dt=t';
    $raw = http_post($url, http_build_query(['q' => implode($sep, $texts)]));
    $data = json_decode($raw, true);
    if (!is_array($data) || !isset($data[0]) || !is_array($data[0])) return null;
    $text = '';
    foreach ($data[0] as $part) {
        if (isset($part[0])) $text .= $part[0];
    }
    $bits = explode('§§§', $text);
    if (count($bits) !== count($texts)) return null;
    $out = [];
    foreach ($texts as $i => $src) $out[$src] = trim($bits[$i]);
    return $out;
}

function text_pieces($html) {
    $parts = preg_split('/<[^>]+>/', (string) $html);
    $out = [];
    foreach ($parts as $p) {
        $p = trim(html_entity_decode($p, ENT_QUOTES, 'UTF-8'));
        if ($p !== '') $out[] = $p;
    }
    return $out;
}

function remember_translations($dataDir, $strings) {
    $clean = [];
    foreach ($strings as $s) {
        $s = trim((string) $s);
        if ($s !== '' && !in_array($s, $clean, true)) $clean[] = $s;
    }
    if (!$clean) return true;
    @set_time_limit(120);
    $file = $dataDir . '/i18n-extra.json';
    $map = json_decode((string) @file_get_contents($file), true);
    if (!is_array($map)) $map = [];
    $ok = true;
    foreach (['es', 'fr', 'ru', 'de', 'it', 'el', 'en'] as $tl) {
        $batch = translate_batch($clean, $tl);
        if (!is_array($batch)) { $ok = false; continue; }
        foreach ($clean as $src) {
            $tr = $batch[$src] ?? '';
            if ($tr === '') continue;
            if ($tl === 'en' && strcasecmp($tr, $src) === 0) continue;
            if (!isset($map[$src]) || !is_array($map[$src])) $map[$src] = [];
            $map[$src][$tl] = $tr;
        }
    }
    if (!is_dir($dataDir)) mkdir($dataDir, 0755, true);
    $written = file_put_contents($file, json_encode($map, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
    return $ok && $written;
}

function rename_visible($root, $old, $new) {
    if ($old === '' || $old === $new) return;
    foreach (['products/index.html', 'js/main.js', 'index.html'] as $rel) {
        $path = $root . '/' . $rel;
        if (!is_file($path)) continue;
        $html = (string) file_get_contents($path);
        $html2 = str_replace(
            ['>' . $old . '<', 'alt="' . $old . '"', "'" . $old . "'", '"' . $old . '"'],
            ['>' . $new . '<', 'alt="' . $new . '"', "'" . $new . "'", '"' . $new . '"'],
            $html
        );
        if ($html2 !== $html) file_put_contents($path, $html2);
    }
}

function write_product_html($root, $id, $name, $price, $desc, $images) {
    $thumbs = '';
    foreach ($images as $src) {
        $thumbs .= '<img src="../' . h($src) . '" alt="">';
    }
    $page = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' . h($name) . '</title><link rel="stylesheet" href="../css/style.css?v=8"></head><body>'
        . '<header class="header"><div class="container header-inner"><a href="../" class="logo"><img src="../img/logo.png" alt=""></a><a href="./">Products</a></div></header>'
        . '<main><section class="product-hero"><div class="container product-layout"><div class="product-gallery"><div class="gallery-stage"><button type="button" class="g-prev" aria-label="Previous photo">&#8249;</button><img id="mainPhoto" src="../' . h($images[0]) . '" alt="' . h($name) . '"><button type="button" class="g-next" aria-label="Next photo">&#8250;</button></div><div class="thumbs">' . $thumbs . '</div></div>'
        . '<div class="product-info"><h1>' . h($name) . '</h1><p class="price"><strong>' . h($price) . '</strong></p><p class="lead">Delivery time: 2–3 months</p><p>' . nl2br(h($desc)) . '</p>'
        . '<button class="btn btn-primary" type="button" id="buyBtn">Buy</button>'
        . '<form class="form" id="orderForm" action="../order.php" method="post" hidden style="margin-top:1.2rem"><input type="hidden" name="product" value="' . h($name) . '">'
        . '<div class="form-row"><label>Name *</label><input name="name" required></div><div class="form-row"><label>Email *</label><input type="email" name="email" required></div>'
        . '<div class="form-row"><label>Phone</label><input name="phone"></div><div class="form-row"><label>Message</label><textarea name="message" rows="4"></textarea></div>'
        . '<button class="btn btn-primary" type="submit">Send order by email</button></form></div></div></section></main>'
        . '<script>(function(){var imgs=[].slice.call(document.querySelectorAll(".thumbs img"));var seen={};imgs=imgs.filter(function(img){var k=img.getAttribute("src");if(seen[k]){img.remove();return false;}seen[k]=1;return true;});var main=document.getElementById("mainPhoto"),i=0;function show(n){if(!imgs.length)return;i=(n+imgs.length)%imgs.length;main.src=imgs[i].src;imgs.forEach(function(t,k){t.classList.toggle("on",k===i);});}imgs.forEach(function(t,k){t.addEventListener("click",function(){show(k);});});var prev=document.querySelector(".g-prev"),next=document.querySelector(".g-next");if(imgs.length<2){if(prev)prev.hidden=true;if(next)next.hidden=true;}else{prev.addEventListener("click",function(){show(i-1);});next.addEventListener("click",function(){show(i+1);});}show(0);document.getElementById("buyBtn").addEventListener("click",function(){var f=document.getElementById("orderForm");f.hidden=false;f.scrollIntoView({behavior:"smooth"});});})();</script>'
        . '<script src="../js/i18n.js?v=12" defer></script><script src="../js/main.js?v=9" defer></script></body></html>';
    file_put_contents($root . '/products/' . $id . '.html', $page);
}

function store_uploads($imgDir, $id, $files) {
    $images = [];
    $count = isset($files['name']) && is_array($files['name']) ? count($files['name']) : 0;
    if (!is_dir($imgDir)) mkdir($imgDir, 0755, true);
    $n = 0;
    for ($i = 0; $i < $count; $i++) {
        if (($files['error'][$i] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) continue;
        $ext = strtolower(pathinfo((string) $files['name'][$i], PATHINFO_EXTENSION));
        if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) continue;
        if (($files['size'][$i] ?? 0) > 8 * 1024 * 1024) continue;
        $file = $id . '-' . bin2hex(random_bytes(3)) . '.' . ($ext === 'jpeg' ? 'jpg' : $ext);
        if (move_uploaded_file($files['tmp_name'][$i], $imgDir . '/' . $file)) {
            $images[] = 'img/products/extra/' . $file;
            $n++;
        }
    }
    return $images;
}

function home_fields($html) {
    $title = 'Professional Cessna 172/152';
    $accent = 'Flight Simulators';
    $lead = '';
    $image = 'img/products/c172-magic-full-embedded-big.jpg';
    if (preg_match('/id="homeTitle">(.*?)<br>\s*<span>(.*?)<\/span>\s*<\/h1>/s', $html, $m)) {
        $title = trim(html_entity_decode(strip_tags($m[1]), ENT_QUOTES, 'UTF-8'));
        $accent = trim(html_entity_decode(strip_tags($m[2]), ENT_QUOTES, 'UTF-8'));
    }
    if (preg_match('/id="homeLead">(.*?)<\/p>/s', $html, $m)) {
        $lead = trim(html_entity_decode($m[1], ENT_QUOTES, 'UTF-8'));
    }
    if (preg_match('/id="homePhoto"[^>]*src="([^"]+)"/', $html, $m)) {
        $image = $m[1];
    }
    return ['title' => $title, 'accent' => $accent, 'lead' => $lead, 'image' => $image];
}

function clean_lead($s) {
    $s = strip_tags($s, '<b><strong>');
    return preg_replace('/<(b|strong)\b[^>]*>/i', '<$1>', $s);
}

function save_home($root, $title, $accent, $lead, $image) {
    $file = $root . '/index.html';
    $html = (string) file_get_contents($file);
    $titleHtml = '<h1 class="stage-title" id="homeTitle">' . h($title) . '<br> <span>' . h($accent) . '</span></h1>';
    $html2 = preg_replace('/<h1 class="stage-title" id="homeTitle">.*?<\/h1>/s', $titleHtml, $html, 1);
    if ($html2 === null) return false;
    $html = $html2;
    $leadHtml = '<p id="homeLead">' . clean_lead($lead) . '</p>';
    $html2 = preg_replace('/<p id="homeLead">.*?<\/p>/s', $leadHtml, $html, 1);
    if ($html2 === null) return false;
    $html = $html2;
    $html = preg_replace('/(<img id="homePhoto"[^>]*src=")[^"]+(")/', '$1' . h($image) . '$2', $html, 1);
    $abs = 'https://flightsimulator.gr/' . ltrim($image, '/');
    $html = preg_replace('/(<meta property="og:image" content=")[^"]+(")/', '$1' . h($abs) . '$2', $html, 1);
    return file_put_contents($file, $html) !== false;
}

function load_access($dataDir) {
    $file = $dataDir . '/1q2w3e4r5t6y7u8i9o0p';
    if (!is_file($file)) $file = $dataDir . '/access.code.php';
    if (!is_file($file)) return null;
    $raw = (string) file_get_contents($file);
    if (strpos(ltrim($raw), '<?php') === 0) {
        $loaded = include $file;
        if (is_string($loaded) && trim($loaded) !== '') return ['code' => trim($loaded)];
        if (is_array($loaded) && $loaded) return ['users' => $loaded];
        return null;
    }
    $users = [];
    foreach (preg_split('/\R/', $raw) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        if (strpos($line, ':') === false) return ['code' => $line];
        [$user, $pass] = explode(':', $line, 2);
        $user = trim($user);
        $pass = trim($pass);
        if ($user !== '' && $pass !== '') $users[$user] = $pass;
    }
    return $users ? ['users' => $users] : null;
}

function admin_code_ok($dataDir, $hash, $user, $given) {
    $access = load_access($dataDir);
    if ($access === null) return password_verify($given, $hash);
    if (isset($access['code'])) return hash_equals($access['code'], $given);
    $user = trim((string) $user);
    if ($user === '' || !isset($access['users'][$user])) return false;
    $stored = (string) $access['users'][$user];
    if (strncmp($stored, '$2y$', 4) === 0) return password_verify($given, $stored);
    return hash_equals($stored, $given);
}

$error = '';
$saved = isset($_GET['saved']);
$homeSaved = isset($_GET['home']);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['home_save'])) {
    $given = trim((string) ($_POST['code'] ?? ''));
    if (empty($_SESSION['admin_ok'])) {
        if (!admin_code_ok($dataDir, $ACCESS_HASH, (string) ($_POST['user'] ?? ''), $given)) {
            $error = 'Codice non valido.';
        } else {
            $_SESSION['admin_ok'] = true;
        }
    }
    if ($error === '' && !empty($_SESSION['admin_ok'])) {
        $title = trim((string) ($_POST['home_title'] ?? ''));
        $accent = trim((string) ($_POST['home_accent'] ?? ''));
        $lead = trim((string) ($_POST['home_lead'] ?? ''));
        if ($title === '' || $accent === '' || $lead === '') {
            $error = 'Titolo, sottotitolo e testo della foto sono obbligatori.';
        } else {
            $index = (string) file_get_contents($root . '/index.html');
            $current = home_fields($index);
            $image = $current['image'];
            $file = $_FILES['home_photo'] ?? null;
            if ($file && ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK) {
                $ext = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
                if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
                    $error = 'Foto home: usa jpg, png o webp.';
                } elseif (($file['size'] ?? 0) > 8 * 1024 * 1024) {
                    $error = 'Foto home troppo grande (max 8 MB).';
                } else {
                    $dir = $root . '/img/home';
                    if (!is_dir($dir)) mkdir($dir, 0755, true);
                    $name = 'hero-' . bin2hex(random_bytes(4)) . '.' . ($ext === 'jpeg' ? 'jpg' : $ext);
                    if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $name)) {
                        $error = 'Non riesco a salvare la foto della home.';
                    } else {
                        $image = 'img/home/' . $name;
                    }
                }
            }
            if ($error === '' && !save_home($root, $title, $accent, $lead, $image)) {
                $error = 'Non riesco a aggiornare la home. Controlla i permessi di index.html.';
            }
            if ($error === '') {
                $trOk = remember_translations($dataDir, array_merge([$title, $accent], text_pieces(clean_lead($lead))));
                header('Location: 1q2w3e4r5t6y7u8i9o0p.php?home=1&tr=' . ($trOk ? '1' : '0'));
                exit;
            }
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id']) && !empty($_SESSION['admin_ok'])) {
    $id = (string) $_POST['delete_id'];
    $list = array_values(array_filter(load_products($jsonFile), function ($p) use ($id) {
        return ($p['id'] ?? '') !== $id;
    }));
    save_products($jsonFile, $list);
    @unlink($root . '/products/' . $id . '.html');
    header('Location: 1q2w3e4r5t6y7u8i9o0p.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['name'])) {
    $given = trim((string) ($_POST['code'] ?? ''));
    if (!admin_code_ok($dataDir, $ACCESS_HASH, (string) ($_POST['user'] ?? ''), $given) && empty($_SESSION['admin_ok'])) {
        $error = 'Codice non valido.';
    } else {
        $_SESSION['admin_ok'] = true;
        $name = trim((string) $_POST['name']);
        $price = trim((string) $_POST['price']);
        $desc = trim((string) $_POST['description']);
        $catsFile = $dataDir . '/categories.json';
        $known = json_decode((string) @file_get_contents($catsFile), true);
        if (!is_array($known) || !$known) {
            $known = [
                ['id' => 'c172', 'label' => 'Cessna 172'],
                ['id' => 'c152', 'label' => 'Cessna 152'],
                ['id' => 'atc', 'label' => 'ATC Simulator'],
                ['id' => 'drone', 'label' => 'Drone Simulator'],
                ['id' => 'parts', 'label' => 'Cabin & Components'],
            ];
        }
        $newLabel = trim((string) ($_POST['new_category'] ?? ''));
        if ($newLabel !== '') {
            $slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', $newLabel), '-'));
            if ($slug === '') $slug = 'cat-' . bin2hex(random_bytes(2));
            $exists = false;
            foreach ($known as $c) {
                if (($c['id'] ?? '') === $slug) $exists = true;
            }
            if (!$exists) {
                $known[] = ['id' => $slug, 'label' => $newLabel];
                file_put_contents($catsFile, json_encode($known, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }
            $category = $slug;
            $categoryLabel = $newLabel;
        } else {
            $category = (string) ($_POST['category'] ?? 'parts');
            $categoryLabel = $category;
            $okCat = false;
            foreach ($known as $c) {
                if (($c['id'] ?? '') === $category) {
                    $okCat = true;
                    $categoryLabel = $c['label'];
                }
            }
            if (!$okCat) $category = 'parts';
        }
        $editId = trim((string) ($_POST['edit_id'] ?? ''));
        $catalogFile = $dataDir . '/catalog.json';
        $catalog = json_decode((string) @file_get_contents($catalogFile), true);
        if (!is_array($catalog)) $catalog = [];
        $files = $_FILES['images'] ?? null;
        $uploaded = store_uploads($imgDir, $editId !== '' ? $editId : 'extra', $files ?: []);
        if ($name === '' || $price === '' || $desc === '') {
            $error = 'Nome, prezzo e descrizione sono obbligatori.';
        } elseif ($editId !== '') {
            $found = false;
            foreach ($catalog as $i => $p) {
                if (($p['slug'] ?? '') === $editId) {
                    $keep = isset($_POST['keep']) && is_array($_POST['keep']) ? $_POST['keep'] : ($p['images'] ?? []);
                    $images = [];
                    foreach ($keep as $src) {
                        if (in_array($src, $p['images'] ?? [], true)) $images[] = $src;
                    }
                    $images = array_values(array_merge($images, $uploaded));
                    if (!$images) { $error = 'Il prodotto deve avere almeno una foto.'; break; }
                    $oldName = (string) ($p['name'] ?? '');
                    $catalog[$i]['name'] = $name;
                    $catalog[$i]['price'] = $price;
                    $catalog[$i]['description'] = $desc;
                    $catalog[$i]['category'] = $category;
                    $catalog[$i]['images'] = $images;
                    file_put_contents($catalogFile, json_encode($catalog, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                    write_product_html($root, $editId, $name, $price, $desc, $images);
                    rename_visible($root, $oldName, $name);
                    $found = true;
                    break;
                }
            }
            if (!$found && $error === '') {
                $list = load_products($jsonFile);
                foreach ($list as $i => $p) {
                    if (($p['id'] ?? '') === $editId) {
                        $keep = isset($_POST['keep']) && is_array($_POST['keep']) ? $_POST['keep'] : ($p['images'] ?? []);
                        $images = [];
                        foreach ($keep as $src) {
                            if (in_array($src, $p['images'] ?? [], true)) $images[] = $src;
                        }
                        $images = array_values(array_merge($images, $uploaded));
                        if (!$images) { $error = 'Il prodotto deve avere almeno una foto.'; break; }
                        $oldName = (string) ($p['name'] ?? '');
                        $list[$i] = ['id' => $editId, 'name' => $name, 'price' => $price, 'description' => $desc, 'category' => $category, 'categoryLabel' => $categoryLabel, 'images' => $images];
                        save_products($jsonFile, $list);
                        write_product_html($root, $editId, $name, $price, $desc, $images);
                        rename_visible($root, $oldName, $name);
                        $found = true;
                        break;
                    }
                }
            }
            if ($found && $error === '') {
                $lines = preg_split('/\R/u', $desc);
                $trOk = remember_translations($dataDir, array_merge([$name, $desc, $categoryLabel], $lines, text_pieces($desc)));
                header('Location: 1q2w3e4r5t6y7u8i9o0p.php?saved=1&tr=' . ($trOk ? '1' : '0') . '&edit=' . rawurlencode($editId));
                exit;
            }
            if (!$found && $error === '') $error = 'Prodotto non trovato.';
        } elseif (!$uploaded) {
            $error = 'Carica almeno una foto.';
        } else {
            if (!is_dir($imgDir)) mkdir($imgDir, 0755, true);
            $id = 'extra-' . bin2hex(random_bytes(4));
            $images = $uploaded;
            if (!$images) {
                $error = 'Nessuna foto valida. Usa jpg, png o webp.';
            } else {
                $item = ['id' => $id, 'name' => $name, 'price' => $price, 'description' => $desc, 'category' => $category, 'categoryLabel' => $categoryLabel, 'images' => $images];
                $list = load_products($jsonFile);
                $list[] = $item;
                if (!save_products($jsonFile, $list)) {
                    $error = 'Non riesco a salvare. Dai i permessi di scrittura alla cartella 1q2w3e4r5t6y7u8i9o0p/.';
                } else {
                    write_product_html($root, $id, $name, $price, $desc, $images);
                    $lines = preg_split('/\R/u', $desc);
                    $trOk = remember_translations($dataDir, array_merge([$name, $desc, $categoryLabel], $lines, text_pieces($desc)));
                    header('Location: 1q2w3e4r5t6y7u8i9o0p.php?saved=1&tr=' . ($trOk ? '1' : '0'));
                    exit;
                }
            }
        }
    }
}
$list = load_products($jsonFile);
$logged = !empty($_SESSION['admin_ok']);
$catsFile = $dataDir . '/categories.json';
$known = json_decode((string) @file_get_contents($catsFile), true);
if (!is_array($known) || !$known) {
    $known = [
        ['id' => 'c172', 'label' => 'Cessna 172'],
        ['id' => 'c152', 'label' => 'Cessna 152'],
        ['id' => 'atc', 'label' => 'ATC Simulator'],
        ['id' => 'drone', 'label' => 'Drone Simulator'],
        ['id' => 'parts', 'label' => 'Cabin & Components'],
    ];
}
$catalog = json_decode((string) @file_get_contents($dataDir . '/catalog.json'), true);
if (!is_array($catalog)) $catalog = [];
$editId = trim((string) ($_GET['edit'] ?? ''));
$editing = null;
if ($editId !== '') {
    foreach ($catalog as $p) {
        if (($p['slug'] ?? '') === $editId) { $editing = $p; $editing['id'] = $p['slug']; break; }
    }
    if (!$editing) {
        foreach ($list as $p) {
            if (($p['id'] ?? '') === $editId) { $editing = $p; break; }
        }
    }
}
$val = function ($key, $fallback = '') use ($editing) {
    if (!is_array($editing)) return h($fallback);
    return h($editing[$key] ?? $fallback);
};
$home = home_fields((string) @file_get_contents($root . '/index.html'));
?>
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Aggiungi prodotto</title>
  <link rel="stylesheet" href="css/style.css?v=8">
</head>
<body>
  <header class="header"><div class="container header-inner"><a href="./" class="logo"><img src="img/logo.png" alt=""></a><a href="products/" class="btn btn-sm">Catalogo</a><?php if (!empty($_SESSION['admin_ok'])): ?><a href="1q2w3e4r5t6y7u8i9o0p.php?logout=1" class="btn btn-sm">Esci</a><?php endif; ?></div></header>
  <main>
    <section class="section" style="padding-top:8rem">
      <div class="container" style="max-width:720px">
        <h1>Prima schermata</h1>
        <p style="color:var(--muted);margin:0.6rem 0 1rem">Testo grande sopra la foto, testo sulla foto e foto principale della home. Scrivi in inglese: al salvataggio viene tradotto da solo in spagnolo, francese, russo, tedesco, italiano e greco.</p>
        <?php if ($homeSaved): ?><p style="color:#4ade80">Home aggiornata.<?= isset($_GET['tr']) && $_GET['tr'] === '1' ? ' Tradotta in tutte le lingue.' : '' ?></p><?php endif; ?>
        <?php if ($homeSaved && isset($_GET['tr']) && $_GET['tr'] === '0'): ?><p style="color:#fbbf24">Salvata, ma la traduzione automatica non è riuscita. Il server deve poter raggiungere Google.</p><?php endif; ?>
        <?php if ($error && isset($_POST['home_save'])): ?><p style="color:#f87171"><?= h($error) ?></p><?php endif; ?>
        <form class="form" method="post" enctype="multipart/form-data" style="margin-bottom:2.5rem">
          <input type="hidden" name="home_save" value="1">
          <?php if (!$logged): ?>
          <div class="form-row"><label for="home_user">Utente (lascia vuoto)</label><input id="home_user" name="user" autocomplete="username"></div>
          <div class="form-row"><label for="home_code">Codice di accesso</label><input id="home_code" name="code" type="password" required></div>
          <?php endif; ?>
          <div class="form-row"><label>Foto attuale</label><img src="<?= h($home['image']) ?>" alt="" style="width:100%;max-height:220px;object-fit:cover;border-radius:8px;background:#07111f"></div>
          <div class="form-row"><label for="home_title">Titolo *</label><input id="home_title" name="home_title" value="<?= h($home['title']) ?>" required></div>
          <div class="form-row"><label for="home_accent">Seconda riga del titolo *</label><input id="home_accent" name="home_accent" value="<?= h($home['accent']) ?>" required></div>
          <div class="form-row"><label for="home_lead">Testo sulla foto *</label><textarea id="home_lead" name="home_lead" rows="4" required><?= h($home['lead']) ?></textarea></div>
          <div class="form-row"><label for="home_photo">Nuova foto principale</label><input id="home_photo" name="home_photo" type="file" accept="image/jpeg,image/png,image/webp"></div>
          <button class="btn btn-primary" type="submit">Salva la home</button>
        </form>

        <h1><?= $editing ? 'Modifica prodotto' : 'Aggiungi un prodotto' ?></h1>
        <p style="color:var(--muted);margin:0.6rem 0 1rem">Puoi caricare più foto. Sotto la foto grande compaiono le altre dello stesso prodotto. Nome, categoria e descrizione si traducono da soli in tutte le lingue del sito. Scrivili in inglese.</p>
        <?php if ($saved): ?><p style="color:#4ade80">Salvato.<?= isset($_GET['tr']) && $_GET['tr'] === '1' ? ' Tradotto in tutte le lingue.' : '' ?></p><?php endif; ?>
        <?php if ($saved && isset($_GET['tr']) && $_GET['tr'] === '0'): ?><p style="color:#fbbf24">Salvato, ma la traduzione automatica non è riuscita. Il server deve poter raggiungere Google.</p><?php endif; ?>
        <?php if ($error && !isset($_POST['home_save'])): ?><p style="color:#f87171"><?= h($error) ?></p><?php endif; ?>
        <form class="form" method="post" enctype="multipart/form-data">
          <?php if ($editing): ?><input type="hidden" name="edit_id" value="<?= h($editing['id']) ?>"><?php endif; ?>
          <?php if (!$logged): ?>
          <div class="form-row"><label for="user">Utente (lascia vuoto)</label><input id="user" name="user" autocomplete="username"></div>
          <div class="form-row"><label for="code">Codice di accesso</label><input id="code" name="code" type="password" required></div>
          <?php endif; ?>
          <div class="form-row"><label for="name">Nome prodotto *</label><input id="name" name="name" value="<?= $val('name') ?>" required></div>
          <div class="form-row">
            <label for="category">Categoria *</label>
            <select id="category" name="category">
              <?php foreach ($known as $c): ?>
                <option value="<?= h($c['id']) ?>" <?= (is_array($editing) && (($editing['category'] ?? '') === $c['id'])) ? 'selected' : '' ?>><?= h($c['label']) ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="form-row"><label for="new_category">Nuova categoria</label><input id="new_category" name="new_category" placeholder="Se la scrivi, il prodotto va qui"></div>
          <div class="form-row"><label for="price">Prezzo *</label><input id="price" name="price" value="<?= $val('price') ?>" placeholder="12.500 €" required></div>
          <div class="form-row"><label for="description">Descrizione *</label><textarea id="description" name="description" rows="5" required><?= $val('description') ?></textarea></div>
          <?php if (!empty($editing['images'])): ?>
          <div class="form-row"><label>Foto già presenti (togli la spunta per eliminarle)</label>
            <?php foreach ($editing['images'] as $src): ?>
              <label style="display:flex;gap:.6rem;align-items:center;margin:.4rem 0;font-weight:500">
                <input type="checkbox" name="keep[]" value="<?= h($src) ?>" checked>
                <img src="<?= h($src) ?>" alt="" style="width:72px;height:54px;object-fit:contain;background:#07111f;border-radius:6px">
              </label>
            <?php endforeach; ?>
          </div>
          <?php endif; ?>
          <div class="form-row"><label for="images">Foto <?= $editing ? '(aggiungine altre)' : '(una o più) *' ?></label><input id="images" name="images[]" type="file" accept="image/jpeg,image/png,image/webp" multiple <?= $editing ? '' : 'required' ?>></div>
          <button class="btn btn-primary" type="submit"><?= $editing ? 'Salva modifiche' : 'Pubblica nel catalogo' ?></button>
          <?php if ($editing): ?><a class="btn btn-outline" href="1q2w3e4r5t6y7u8i9o0p.php" style="margin-left:.5rem">Annulla</a><?php endif; ?>
        </form>
        <h2 style="margin:2rem 0 1rem">Prodotti</h2>
        <?php
          $rows = [];
          foreach ($catalog as $p) {
              $rows[] = ['id' => $p['slug'], 'name' => $p['name'], 'price' => $p['price'], 'images' => $p['images'] ?? [], 'extra' => false];
          }
          foreach ($list as $p) {
              $rows[] = ['id' => $p['id'], 'name' => $p['name'] ?? '', 'price' => $p['price'] ?? '', 'images' => $p['images'] ?? [], 'extra' => true];
          }
        ?>
        <?php foreach ($rows as $p): ?>
          <div style="display:flex;gap:1rem;align-items:center;margin-bottom:1rem">
            <img src="<?= h($p['images'][0] ?? '') ?>" alt="" style="width:88px;height:64px;object-fit:contain;background:#07111f;border-radius:8px">
            <div style="flex:1"><strong><?= h($p['name']) ?></strong><br><span style="color:var(--muted)"><?= h($p['price']) ?> · <?= count($p['images']) ?> foto</span></div>
            <a class="btn btn-sm btn-primary" href="1q2w3e4r5t6y7u8i9o0p.php?edit=<?= h($p['id']) ?>">Modifica</a>
            <?php if ($logged && $p['extra']): ?>
            <form method="post"><input type="hidden" name="delete_id" value="<?= h($p['id']) ?>"><button class="btn btn-outline btn-sm" type="submit">Elimina</button></form>
            <?php endif; ?>
          </div>
        <?php endforeach; ?>
      </div>
    </section>
  </main>
</body>
</html>
