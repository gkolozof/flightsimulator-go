<?php
session_start();
$root = __DIR__;
$dataDir = $root . '/data';
$jsonFile = $dataDir . '/products.json';
$imgDir = $root . '/img/products/extra';
$code = trim((string) @file_get_contents($dataDir . '/access.code'));
if ($code === '') $code = 'cto';

function load_products($file) {
    $list = json_decode((string) @file_get_contents($file), true);
    return is_array($list) ? $list : [];
}
function save_products($file, $list) {
    return file_put_contents($file, json_encode(array_values($list), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
}
function h($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }

function write_product_html($root, $id, $name, $price, $desc, $images) {
    $thumbs = '';
    foreach ($images as $src) {
        $thumbs .= '<img src="../' . h($src) . '" alt="">';
    }
    $page = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' . h($name) . '</title><link rel="stylesheet" href="../css/style.css"></head><body>'
        . '<header class="header"><div class="container header-inner"><a href="../" class="logo"><img src="../img/logo.png" alt=""></a><a href="./">Products</a></div></header>'
        . '<main><section class="product-hero"><div class="container product-layout"><div class="product-gallery"><div class="gallery-stage"><button type="button" class="g-prev" aria-label="Previous photo">&#8249;</button><img id="mainPhoto" src="../' . h($images[0]) . '" alt="' . h($name) . '"><button type="button" class="g-next" aria-label="Next photo">&#8250;</button></div><div class="thumbs">' . $thumbs . '</div></div>'
        . '<div class="product-info"><h1>' . h($name) . '</h1><p class="price"><strong>' . h($price) . '</strong></p><p class="lead">Delivery time: 2–3 months</p><p>' . nl2br(h($desc)) . '</p>'
        . '<button class="btn btn-primary" type="button" id="buyBtn">Buy</button>'
        . '<form class="form" id="orderForm" action="../order.php" method="post" hidden style="margin-top:1.2rem"><input type="hidden" name="product" value="' . h($name) . '">'
        . '<div class="form-row"><label>Name *</label><input name="name" required></div><div class="form-row"><label>Email *</label><input type="email" name="email" required></div>'
        . '<div class="form-row"><label>Phone</label><input name="phone"></div><div class="form-row"><label>Message</label><textarea name="message" rows="4"></textarea></div>'
        . '<button class="btn btn-primary" type="submit">Send order by email</button></form></div></div></section></main>'
        . '<script>(function(){var imgs=[].slice.call(document.querySelectorAll(".thumbs img"));var seen={};imgs=imgs.filter(function(img){var k=img.getAttribute("src");if(seen[k]){img.remove();return false;}seen[k]=1;return true;});var main=document.getElementById("mainPhoto"),i=0;function show(n){if(!imgs.length)return;i=(n+imgs.length)%imgs.length;main.src=imgs[i].src;imgs.forEach(function(t,k){t.classList.toggle("on",k===i);});}imgs.forEach(function(t,k){t.addEventListener("click",function(){show(k);});});var prev=document.querySelector(".g-prev"),next=document.querySelector(".g-next");if(imgs.length<2){if(prev)prev.hidden=true;if(next)next.hidden=true;}else{prev.addEventListener("click",function(){show(i-1);});next.addEventListener("click",function(){show(i+1);});}show(0);document.getElementById("buyBtn").addEventListener("click",function(){var f=document.getElementById("orderForm");f.hidden=false;f.scrollIntoView({behavior:"smooth"});});})();</script>'
        . '<script src="../js/main.js" defer></script></body></html>';
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

$error = '';
$saved = isset($_GET['saved']);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id']) && !empty($_SESSION['admin_ok'])) {
    $id = (string) $_POST['delete_id'];
    $list = array_values(array_filter(load_products($jsonFile), function ($p) use ($id) {
        return ($p['id'] ?? '') !== $id;
    }));
    save_products($jsonFile, $list);
    @unlink($root . '/products/' . $id . '.html');
    header('Location: admin.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['name'])) {
    $given = trim((string) ($_POST['code'] ?? ''));
    if (!hash_equals($code, $given) && empty($_SESSION['admin_ok'])) {
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
                    $catalog[$i]['name'] = $name;
                    $catalog[$i]['price'] = $price;
                    $catalog[$i]['description'] = $desc;
                    $catalog[$i]['category'] = $category;
                    $catalog[$i]['images'] = $images;
                    file_put_contents($catalogFile, json_encode($catalog, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                    write_product_html($root, $editId, $name, $price, $desc, $images);
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
                        $list[$i] = ['id' => $editId, 'name' => $name, 'price' => $price, 'description' => $desc, 'category' => $category, 'categoryLabel' => $categoryLabel, 'images' => $images];
                        save_products($jsonFile, $list);
                        write_product_html($root, $editId, $name, $price, $desc, $images);
                        $found = true;
                        break;
                    }
                }
            }
            if ($found && $error === '') {
                header('Location: admin.php?saved=1&edit=' . rawurlencode($editId));
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
                    $error = 'Non riesco a salvare. Dai i permessi di scrittura alla cartella data/.';
                } else {
                    write_product_html($root, $id, $name, $price, $desc, $images);
                    header('Location: admin.php?saved=1');
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
?>
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Aggiungi prodotto</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="header"><div class="container header-inner"><a href="./" class="logo"><img src="img/logo.png" alt=""></a><a href="products/" class="btn btn-sm">Catalogo</a></div></header>
  <main>
    <section class="section" style="padding-top:8rem">
      <div class="container" style="max-width:720px">
        <h1><?= $editing ? 'Modifica prodotto' : 'Aggiungi un prodotto' ?></h1>
        <p style="color:var(--muted);margin:0.6rem 0 1rem">Puoi caricare più foto. Sotto la foto grande compaiono le altre dello stesso prodotto.</p>
        <?php if ($saved): ?><p style="color:#4ade80">Salvato.</p><?php endif; ?>
        <?php if ($error): ?><p style="color:#f87171"><?= h($error) ?></p><?php endif; ?>
        <form class="form" method="post" enctype="multipart/form-data">
          <?php if ($editing): ?><input type="hidden" name="edit_id" value="<?= h($editing['id']) ?>"><?php endif; ?>
          <?php if (!$logged): ?>
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
          <?php if ($editing): ?><a class="btn btn-outline" href="admin.php" style="margin-left:.5rem">Annulla</a><?php endif; ?>
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
            <a class="btn btn-sm btn-primary" href="admin.php?edit=<?= h($p['id']) ?>">Modifica</a>
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
