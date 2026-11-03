/* Language switcher. English is the default. The choice is saved in this browser. */
(function () {
  'use strict';
  var KEY = 'fs_lang';
  var LANGS = [
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Español' },
    { id: 'fr', name: 'Français' },
    { id: 'ru', name: 'Русский' },
    { id: 'de', name: 'Deutsch' },
    { id: 'it', name: 'Italiano' }
  ];
  var FLAGS = {
    en: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#012169"/><path d="M0 0L60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" stroke-width="4"/><path d="M30 0V40M0 20H60" stroke="#fff" stroke-width="13"/><path d="M30 0V40M0 20H60" stroke="#C8102E" stroke-width="8"/></svg>',
    es: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#c60b1e"/><rect y="10" width="60" height="20" fill="#ffc400"/></svg>',
    fr: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="20" height="40" fill="#0055a4"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ef4135"/></svg>',
    ru: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="13.4" fill="#fff"/><rect y="13.3" width="60" height="13.4" fill="#0039a6"/><rect y="26.6" width="60" height="13.4" fill="#d52b1e"/></svg>',
    de: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="13.4" fill="#000"/><rect y="13.3" width="60" height="13.4" fill="#dd0000"/><rect y="26.6" width="60" height="13.4" fill="#ffce00"/></svg>',
    it: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="20" height="40" fill="#009246"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ce2b37"/></svg>'
  };

  function row(en, es, fr, ru, de, it) {
    return { es: es, fr: fr, ru: ru, de: de, it: it, en: en };
  }
  var ROWS = [
    row('Products', 'Productos', 'Produits', 'Продукты', 'Produkte', 'Prodotti'),
    row('How it works', 'Cómo funciona', 'Comment ça marche', 'Как это работает', 'So funktioniert es', 'Come funziona'),
    row('Contact', 'Contacto', 'Contact', 'Контакты', 'Kontakt', 'Contatto'),
    row('Benefits', 'Ventajas', 'Avantages', 'Преимущества', 'Vorteile', 'Vantaggi'),
    row('Buy', 'Comprar', 'Acheter', 'Купить', 'Kaufen', 'Acquista'),
    row('Details', 'Detalles', 'Détails', 'Подробнее', 'Details', 'Dettagli'),
    row('Delivery time: 2–3 months', 'Plazo de entrega: 2–3 meses', 'Délai de livraison : 2–3 mois', 'Срок поставки: 2–3 месяца', 'Lieferzeit: 2–3 Monate', 'Tempi di consegna: 2–3 mesi'),
    row('Name *', 'Nombre *', 'Nom *', 'Имя *', 'Name *', 'Nome *'),
    row('Email *', 'Correo *', 'E-mail *', 'Эл. почта *', 'E-Mail *', 'Email *'),
    row('Phone', 'Teléfono', 'Téléphone', 'Телефон', 'Telefon', 'Telefono'),
    row('Message', 'Mensaje', 'Message', 'Сообщение', 'Nachricht', 'Messaggio'),
    row('Send order by email', 'Enviar pedido por correo', 'Envoyer la commande par e-mail', 'Отправить заказ по почте', 'Bestellung per E-Mail senden', 'Invia ordine via email'),
    row('Quantity, delivery country, questions…', 'Cantidad, país de entrega, preguntas…', 'Quantité, pays de livraison, questions…', 'Количество, страна доставки, вопросы…', 'Menge, Lieferland, Fragen…', 'Quantità, paese di consegna, domande…'),
    row('Catalogue', 'Catálogo', 'Catalogue', 'Каталог', 'Katalog', 'Catalogo'),
    row('All Products', 'Todos los productos', 'Tous les produits', 'Все продукты', 'Alle Produkte', 'Tutti i prodotti'),
    row('18 professional simulators and cockpit components with official prices.', '18 simuladores profesionales y componentes de cabina con precios oficiales.', '18 simulateurs professionnels et composants de cockpit aux prix officiels.', '18 профессиональных тренажёров и компонентов кабины с официальными ценами.', '18 professionelle Simulatoren und Cockpit-Komponenten mit offiziellen Preisen.', '18 simulatori professionali e componenti di cabina con prezzi ufficiali.'),
    row('Full Embedded Simulators – Cessna 172', 'Simuladores Full Embedded – Cessna 172', 'Simulateurs Full Embedded – Cessna 172', 'Тренажёры Full Embedded – Cessna 172', 'Full-Embedded-Simulatoren – Cessna 172', 'Simulatori Full Embedded – Cessna 172'),
    row('Full Embedded Simulators – Cessna 152', 'Simuladores Full Embedded – Cessna 152', 'Simulateurs Full Embedded – Cessna 152', 'Тренажёры Full Embedded – Cessna 152', 'Full-Embedded-Simulatoren – Cessna 152', 'Simulatori Full Embedded – Cessna 152'),
    row('ATC Simulator', 'Simulador ATC', 'Simulateur ATC', 'Тренажёр ATC', 'ATC-Simulator', 'Simulatore ATC'),
    row('Drone Simulator', 'Simulador de drones', 'Simulateur de drone', 'Тренажёр дрона', 'Drohnen-Simulator', 'Simulatore di droni'),
    row('Cabin & Components', 'Cabina y componentes', 'Cabine et composants', 'Кабина и компоненты', 'Kabine und Komponenten', 'Cabina e componenti'),
    row('Added products', 'Productos añadidos', 'Produits ajoutés', 'Добавленные продукты', 'Hinzugefügte Produkte', 'Prodotti aggiunti'),
    row('Official catalogue prices. For configuration and installation:', 'Precios oficiales del catálogo. Para configuración e instalación:', 'Prix officiels du catalogue. Pour la configuration et l’installation :', 'Официальные цены каталога. По комплектации и установке:', 'Offizielle Katalogpreise. Für Konfiguration und Installation:', 'Prezzi ufficiali del catalogo. Per configurazione e installazione:'),
    row('Featured products', 'Productos destacados', 'Produits en vedette', 'Избранные продукты', 'Ausgewählte Produkte', 'Prodotti in evidenza'),
    row('A new order each visit, in rows of four. Cabin and components stay in the full catalogue.', 'Un orden nuevo en cada visita, en filas de cuatro. Cabina y componentes están en el catálogo completo.', 'Un nouvel ordre à chaque visite, par rangées de quatre. Cabine et composants restent dans le catalogue complet.', 'При каждом визите новый порядок, рядами по четыре. Кабина и компоненты — в полном каталоге.', 'Bei jedem Besuch eine neue Reihenfolge, in Viererreihen. Kabine und Komponenten bleiben im Gesamtkatalog.', 'Un ordine nuovo a ogni visita, in righe da quattro. Cabina e componenti restano nel catalogo completo.'),
    row('View full catalogue (18 products)', 'Ver el catálogo completo (18 productos)', 'Voir le catalogue complet (18 produits)', 'Полный каталог (18 продуктов)', 'Gesamtkatalog ansehen (18 Produkte)', 'Vedi il catalogo completo (18 prodotti)'),
    row('View all products', 'Ver todos los productos', 'Voir tous les produits', 'Все продукты', 'Alle Produkte ansehen', 'Vedi tutti i prodotti'),
    row('Why flight schools choose us', 'Por qué nos eligen las escuelas de vuelo', 'Pourquoi les écoles de pilotage nous choisissent', 'Почему лётные школы выбирают нас', 'Warum Flugschulen uns wählen', 'Perché le scuole di volo ci scelgono'),
    row('Up to 92% cost reduction', 'Hasta un 92 % menos de costes', 'Jusqu’à 92 % de coûts en moins', 'До 92 % снижения затрат', 'Bis zu 92 % weniger Kosten', 'Fino al 92% di costi in meno'),
    row('Operating cost ~€3/hour. No fuel, no airframe wear.', 'Coste de operación ~3 €/hora. Sin combustible ni desgaste del avión.', 'Coût d’exploitation ~3 €/heure. Pas de carburant, pas d’usure de la cellule.', 'Эксплуатация ~3 €/час. Без топлива и износа планера.', 'Betriebskosten ca. 3 €/Stunde. Kein Treibstoff, kein Zellenverschleiß.', 'Costo di esercizio ~3 €/ora. Niente carburante, niente usura della cellula.'),
    row('Ready in 65 seconds', 'Listo en 65 segundos', 'Prêt en 65 secondes', 'Готов за 65 секунд', 'Bereit in 65 Sekunden', 'Pronto in 65 secondi'),
    row('Fully automatic. Controlled via iPad/iPhone.', 'Totalmente automático. Controlado con iPad/iPhone.', 'Entièrement automatique. Piloté via iPad/iPhone.', 'Полностью автоматический. Управление с iPad/iPhone.', 'Vollautomatisch. Steuerung über iPad/iPhone.', 'Completamente automatico. Controllato da iPad/iPhone.'),
    row('40% fewer errors', '40 % menos errores', '40 % d’erreurs en moins', 'На 40 % меньше ошибок', '40 % weniger Fehler', '40% di errori in meno'),
    row('University of Illinois research on simulator-trained pilots.', 'Investigación de la Universidad de Illinois sobre pilotos formados en simulador.', 'Recherche de l’Université de l’Illinois sur les pilotes formés au simulateur.', 'Исследование Университета Иллинойса о пилотах, обучавшихся на тренажёре.', 'Forschung der Universität Illinois zu simulatorgeschulten Piloten.', 'Ricerca dell’Università dell’Illinois sui piloti addestrati al simulatore.'),
    row('Always available', 'Siempre disponible', 'Toujours disponible', 'Всегда доступен', 'Immer verfügbar', 'Sempre disponibile'),
    row('Any weather, day or night.', 'Con cualquier tiempo, de día o de noche.', 'Par tous les temps, de jour comme de nuit.', 'В любую погоду, днём и ночью.', 'Bei jedem Wetter, Tag und Nacht.', 'Con qualsiasi meteo, giorno e notte.'),
    row('Compact', 'Compacto', 'Compact', 'Компактный', 'Kompakt', 'Compatto'),
    row('From 2.4 × 2.8 m.', 'Desde 2,4 × 2,8 m.', 'À partir de 2,4 × 2,8 m.', 'От 2,4 × 2,8 м.', 'Ab 2,4 × 2,8 m.', 'Da 2,4 × 2,8 m.'),
    row('Real controls', 'Mandos reales', 'Commandes réelles', 'Настоящие органы управления', 'Echte Bedienelemente', 'Comandi veri'),
    row('Real Primer, Carb Heat and fuses.', 'Primer, Carb Heat y fusibles reales.', 'Vrai Primer, Carb Heat et fusibles.', 'Настоящие Primer, Carb Heat и предохранители.', 'Echter Primer, Carb Heat und Sicherungen.', 'Primer, Carb Heat e fusibili veri.'),
    row('Ready to cut training costs?', '¿Listo para reducir el coste de la formación?', 'Prêt à réduire le coût de la formation ?', 'Готовы снизить стоимость обучения?', 'Bereit, die Ausbildungskosten zu senken?', 'Pronto a tagliare i costi di addestramento?'),
    row('Request a detailed quotation and site assessment.', 'Pida un presupuesto detallado y una evaluación del local.', 'Demandez un devis détaillé et une évaluation du site.', 'Запросите подробное предложение и оценку помещения.', 'Fordern Sie ein detailliertes Angebot und eine Standortprüfung an.', 'Richiedi un preventivo dettagliato e un sopralluogo.'),
    row('Get a quote', 'Pedir presupuesto', 'Demander un devis', 'Запросить цену', 'Angebot anfordern', 'Richiedi un preventivo'),
    row('Professional Cessna 172/152 flight simulators for flight schools and aero clubs.', 'Simuladores profesionales Cessna 172/152 para escuelas de vuelo y aeroclubes.', 'Simulateurs professionnels Cessna 172/152 pour écoles de pilotage et aéroclubs.', 'Профессиональные тренажёры Cessna 172/152 для лётных школ и аэроклубов.', 'Professionelle Cessna-172/152-Simulatoren für Flugschulen und Aeroclubs.', 'Simulatori professionali Cessna 172/152 per scuole di volo e aeroclub.'),
    row('Full catalogue', 'Catálogo completo', 'Catalogue complet', 'Полный каталог', 'Gesamtkatalog', 'Catalogo completo'),
    row('C172 Big', 'C172 Big', 'C172 Big', 'C172 Big', 'C172 Big', 'C172 Big'),
    row('Company', 'Empresa', 'Société', 'Компания', 'Unternehmen', 'Azienda'),
    row('Privacy Policy', 'Política de privacidad', 'Politique de confidentialité', 'Политика конфиденциальности', 'Datenschutz', 'Informativa privacy'),
    row('Privacy', 'Privacidad', 'Confidentialité', 'Конфиденциальность', 'Datenschutz', 'Privacy'),
    row('Flight Simulator. All rights reserved.', 'Flight Simulator. Todos los derechos reservados.', 'Flight Simulator. Tous droits réservés.', 'Flight Simulator. Все права защищены.', 'Flight Simulator. Alle Rechte vorbehalten.', 'Flight Simulator. Tutti i diritti riservati.'),
    row('· Cookies', '· Cookies', '· Cookies', '· Файлы cookie', '· Cookies', '· Cookie'),
    row('Professional Cessna 172/152', 'Cessna 172/152 profesional', 'Cessna 172/152 professionnel', 'Профессиональные Cessna 172/152', 'Professionelle Cessna 172/152', 'Cessna 172/152 professionali'),
    row('Flight Simulators', 'Simuladores de vuelo', 'Simulateurs de vol', 'Авиатренажёры', 'Flugsimulatoren', 'Simulatori di volo'),
    row('The only fully automatic Cessna 172 simulator on the market. Ready to fly in 65 seconds. Now with', 'El único simulador Cessna 172 totalmente automático del mercado. Listo para volar en 65 segundos. Ahora con', 'Le seul simulateur Cessna 172 entièrement automatique du marché. Prêt à voler en 65 secondes. Désormais avec', 'Единственный на рынке полностью автоматический тренажёр Cessna 172. Готов к полёту за 65 секунд. Теперь с', 'Der einzige vollautomatische Cessna-172-Simulator am Markt. In 65 Sekunden flugbereit. Jetzt mit', 'L’unico simulatore Cessna 172 completamente automatico sul mercato. Pronto al volo in 65 secondi. Ora con'),
    row('Primer, Carb Heat & fuses', 'Primer, Carb Heat y fusibles', 'Primer, Carb Heat et fusibles', 'Primer, Carb Heat и предохранители', 'Primer, Carb Heat und Sicherungen', 'Primer, Carb Heat e fusibili'),
    row('. Save 30–92% vs traditional training.', '. Ahorre del 30 al 92 % frente a la formación tradicional.', '. Économisez 30 à 92 % par rapport à la formation traditionnelle.', '. Экономия 30–92 % по сравнению с обычной подготовкой.', '. Sparen Sie 30–92 % gegenüber der klassischen Ausbildung.', '. Risparmia il 30–92% rispetto all’addestramento tradizionale.'),
    row('Operating cost', 'Coste de operación', 'Coût d’exploitation', 'Стоимость часа', 'Betriebskosten', 'Costo di esercizio'),
    row('Ready to fly', 'Listo para volar', 'Prêt à voler', 'Готов к полёту', 'Flugbereit', 'Pronto al volo'),
    row('Fewer errors', 'Menos errores', 'Moins d’erreurs', 'Меньше ошибок', 'Weniger Fehler', 'Meno errori'),
    row('How a professional Cessna flight simulator works', 'Cómo funciona un simulador profesional Cessna', 'Comment fonctionne un simulateur Cessna professionnel', 'Как устроен профессиональный тренажёр Cessna', 'So funktioniert ein professioneller Cessna-Flugsimulator', 'Come funziona un simulatore Cessna professionale'),
    row('This is a full-size training machine for flight schools, not the PC game called Flight Simulator. You choose a Cessna 172 or 152, we deliver it, and it is ready to fly in 65 seconds.', 'Es una máquina de entrenamiento a tamaño real para escuelas de vuelo, no el videojuego Flight Simulator. Elija un Cessna 172 o 152, lo entregamos y está listo para volar en 65 segundos.', 'C’est une machine d’entraînement grandeur nature pour les écoles de pilotage, pas le jeu PC Flight Simulator. Vous choisissez un Cessna 172 ou 152, nous le livrons, et il est prêt à voler en 65 secondes.', 'Это полноразмерный тренажёр для лётных школ, а не компьютерная игра Flight Simulator. Вы выбираете Cessna 172 или 152, мы его доставляем, и он готов к полёту за 65 секунд.', 'Das ist ein Trainingsgerät in Originalgröße für Flugschulen, nicht das PC-Spiel Flight Simulator. Sie wählen eine Cessna 172 oder 152, wir liefern sie, und sie ist in 65 Sekunden flugbereit.', 'È una macchina di addestramento a grandezza naturale per scuole di volo, non il videogioco Flight Simulator. Scegli un Cessna 172 o 152, lo consegniamo ed è pronto al volo in 65 secondi.'),
    row('Select your simulator', 'Elija su simulador', 'Choisissez votre simulateur', 'Выберите тренажёр', 'Wählen Sie Ihren Simulator', 'Scegli il simulatore'),
    row('Choose the Cessna 172 or 152 Magic Full Embedded model that matches your space and training objectives.', 'Elija el modelo Cessna 172 o 152 Magic Full Embedded que se adapte a su espacio y a sus objetivos de formación.', 'Choisissez le Cessna 172 ou 152 Magic Full Embedded adapté à votre espace et à vos objectifs de formation.', 'Выберите Cessna 172 или 152 Magic Full Embedded под ваше помещение и задачи обучения.', 'Wählen Sie das Cessna 172 oder 152 Magic Full Embedded, das zu Ihrem Raum und Ihren Ausbildungszielen passt.', 'Scegli il Cessna 172 o 152 Magic Full Embedded adatto allo spazio e agli obiettivi di addestramento.'),
    row('Receive your simulator', 'Reciba su simulador', 'Recevez votre simulateur', 'Получите тренажёр', 'Simulator entgegennehmen', 'Ricevi il simulatore'),
    row('Full support for installation and maintenance. We stay with you every step.', 'Asistencia completa de instalación y mantenimiento. Le acompañamos en cada paso.', 'Assistance complète à l’installation et à la maintenance. Nous restons à vos côtés à chaque étape.', 'Полная поддержка установки и обслуживания. Мы рядом на каждом этапе.', 'Volle Unterstützung bei Installation und Wartung. Wir begleiten Sie bei jedem Schritt.', 'Supporto completo per installazione e manutenzione. Restiamo con voi in ogni fase.'),
    row('Guaranteed safe delivery', 'Entrega segura garantizada', 'Livraison sûre garantie', 'Гарантированная безопасная доставка', 'Garantiert sichere Lieferung', 'Consegna sicura garantita'),
    row('Turnkey, thoroughly tested solutions delivered safely to your door.', 'Soluciones llave en mano, probadas a fondo y entregadas de forma segura.', 'Des solutions clé en main, testées en profondeur et livrées en toute sécurité.', 'Решения «под ключ», тщательно проверенные и доставленные безопасно.', 'Schlüsselfertige, gründlich geprüfte Lösungen, sicher geliefert.', 'Soluzioni chiavi in mano, collaudate e consegnate in sicurezza.'),
    row('Frequently Asked Questions', 'Preguntas frecuentes', 'Questions fréquentes', 'Частые вопросы', 'Häufige Fragen', 'Domande frequenti'),
    row('What flight simulator models do you offer?', '¿Qué modelos de simulador ofrece?', 'Quels modèles de simulateur proposez-vous ?', 'Какие модели тренажёров вы предлагаете?', 'Welche Flugsimulatoren bieten Sie an?', 'Quali modelli di simulatore offrite?'),
    row('Professional Cessna 172 and Cessna 152 Magic Full Embedded (Big and Mini), ATC Simulator, Drone Simulator and individual cockpit components.', 'Cessna 172 y Cessna 152 Magic Full Embedded profesionales (Big y Mini), simulador ATC, simulador de drones y componentes de cabina.', 'Cessna 172 et Cessna 152 Magic Full Embedded professionnels (Big et Mini), simulateur ATC, simulateur de drone et composants de cockpit.', 'Профессиональные Cessna 172 и Cessna 152 Magic Full Embedded (Big и Mini), тренажёр ATC, тренажёр дрона и отдельные компоненты кабины.', 'Professionelle Cessna 172 und Cessna 152 Magic Full Embedded (Big und Mini), ATC-Simulator, Drohnen-Simulator und einzelne Cockpit-Komponenten.', 'Cessna 172 e Cessna 152 Magic Full Embedded professionali (Big e Mini), simulatore ATC, simulatore di droni e componenti di cabina.'),
    row('What are the purchase costs?', '¿Cuáles son los precios de compra?', 'Quels sont les prix d’achat ?', 'Какова стоимость покупки?', 'Was kosten die Geräte?', 'Quali sono i costi di acquisto?'),
    row('Full-embedded professional units start from approximately €65.000–€70.000. ATC from €350.000. Contact us for a formal quotation.', 'Las unidades profesionales full-embedded parten de unos 65.000–70.000 €. ATC desde 350.000 €. Contáctenos para un presupuesto formal.', 'Les unités professionnelles full-embedded commencent à environ 65 000–70 000 €. ATC à partir de 350 000 €. Contactez-nous pour un devis formel.', 'Профессиональные full-embedded — примерно от 65.000–70.000 €. ATC от 350.000 €. Напишите нам для официального предложения.', 'Professionelle Full-Embedded-Geräte ab etwa 65.000–70.000 €. ATC ab 350.000 €. Kontaktieren Sie uns für ein formelles Angebot.', 'Le unità professionali full-embedded partono da circa 65.000–70.000 €. ATC da 350.000 €. Contattateci per un preventivo formale.'),
    row('How does installation and technical support work?', '¿Cómo funcionan la instalación y el soporte técnico?', 'Comment fonctionnent l’installation et le support technique ?', 'Как устроены установка и техподдержка?', 'Wie funktionieren Installation und Support?', 'Come funzionano installazione e assistenza tecnica?'),
    row('Turnkey delivery and installation support. Typical window 2–3 months. Ongoing remote monitoring and maintenance available.', 'Entrega llave en mano y apoyo a la instalación. Plazo habitual: 2–3 meses. Supervisión remota y mantenimiento continuos disponibles.', 'Livraison clé en main et aide à l’installation. Délai habituel : 2–3 mois. Surveillance à distance et maintenance continues disponibles.', 'Поставка «под ключ» и помощь с установкой. Обычно 2–3 месяца. Доступны удалённый мониторинг и обслуживание.', 'Schlüsselfertige Lieferung und Installationssupport. Üblich sind 2–3 Monate. Laufende Fernüberwachung und Wartung möglich.', 'Consegna chiavi in mano e supporto all’installazione. Tempi tipici: 2–3 mesi. Monitoraggio remoto e manutenzione continuativa disponibili.'),
    row('Are there studies proving effectiveness?', '¿Hay estudios que demuestren la eficacia?', 'Des études prouvent-elles l’efficacité ?', 'Есть ли исследования об эффективности?', 'Gibt es Studien zur Wirksamkeit?', 'Ci sono studi che ne dimostrano l’efficacia?'),
    row('Yes. Research from the University of Illinois indicates approximately 40% fewer errors in first real flight hours after simulator training.', 'Sí. Una investigación de la Universidad de Illinois indica cerca de un 40 % menos de errores en las primeras horas de vuelo real tras el entrenamiento en simulador.', 'Oui. Une recherche de l’Université de l’Illinois indique environ 40 % d’erreurs en moins lors des premières heures de vol réel après un entraînement au simulateur.', 'Да. Исследование Университета Иллинойса показывает примерно на 40 % меньше ошибок в первые часы реального полёта после тренажёрной подготовки.', 'Ja. Eine Studie der Universität Illinois zeigt etwa 40 % weniger Fehler in den ersten echten Flugstunden nach dem Simulatortraining.', 'Sì. Una ricerca dell’Università dell’Illinois indica circa il 40% di errori in meno nelle prime ore di volo reale dopo l’addestramento al simulatore.'),
    row('Is the system fully automatic?', '¿El sistema es totalmente automático?', 'Le système est-il entièrement automatique ?', 'Система полностью автоматическая?', 'Ist das System vollautomatisch?', 'Il sistema è completamente automatico?'),
    row('Yes. Magic Full Embedded is fully automatic and controlled via iPad/iPhone.', 'Sí. Magic Full Embedded es totalmente automático y se controla con iPad/iPhone.', 'Oui. Magic Full Embedded est entièrement automatique et se commande via iPad/iPhone.', 'Да. Magic Full Embedded полностью автоматический и управляется с iPad/iPhone.', 'Ja. Magic Full Embedded ist vollautomatisch und wird über iPad/iPhone gesteuert.', 'Sì. Magic Full Embedded è completamente automatico e si controlla da iPad/iPhone.'),
    row('Contact us for a quote', 'Contáctenos para un presupuesto', 'Contactez-nous pour un devis', 'Свяжитесь с нами для расчёта', 'Kontakt für ein Angebot', 'Contattateci per un preventivo'),
    row('Email:', 'Correo:', 'E-mail :', 'Почта:', 'E-Mail:', 'Email:'),
    row('Contact & Quotation', 'Contacto y presupuesto', 'Contact et devis', 'Контакт и расчёт', 'Kontakt und Angebot', 'Contatto e preventivo'),
    row('Tell us about your school or project and we will prepare a tailored offer.', 'Cuéntenos su escuela o proyecto y prepararemos una oferta a medida.', 'Parlez-nous de votre école ou de votre projet et nous préparerons une offre sur mesure.', 'Расскажите о школе или проекте — подготовим предложение под вас.', 'Erzählen Sie uns von Ihrer Schule oder Ihrem Projekt, wir erstellen ein passendes Angebot.', 'Raccontateci la scuola o il progetto e prepareremo un’offerta su misura.'),
    row('Name / Organisation *', 'Nombre / organización *', 'Nom / organisation *', 'Имя / организация *', 'Name / Organisation *', 'Nome / organizzazione *'),
    row('Interest', 'Interés', 'Intérêt', 'Интерес', 'Interesse', 'Interesse'),
    row('Select…', 'Seleccionar…', 'Choisir…', 'Выбрать…', 'Auswählen…', 'Seleziona…'),
    row('Components / other', 'Componentes / otro', 'Composants / autre', 'Компоненты / другое', 'Komponenten / sonstiges', 'Componenti / altro'),
    row('General enquiry', 'Consulta general', 'Demande générale', 'Общий вопрос', 'Allgemeine Anfrage', 'Richiesta generale'),
    row('Location, space available, training needs, preferred timeline…', 'Ubicación, espacio disponible, necesidades de formación, plazo deseado…', 'Lieu, espace disponible, besoins de formation, délai souhaité…', 'Место, доступная площадь, задачи обучения, желаемые сроки…', 'Ort, verfügbarer Platz, Ausbildungsbedarf, gewünschter Zeitplan…', 'Luogo, spazio disponibile, esigenze di addestramento, tempi preferiti…'),
    row('Send request', 'Enviar solicitud', 'Envoyer la demande', 'Отправить запрос', 'Anfrage senden', 'Invia richiesta'),
    row('Direct contact', 'Contacto directo', 'Contact direct', 'Прямой контакт', 'Direktkontakt', 'Contatto diretto'),
    row('Email is the fastest way to reach us for quotations and technical questions.', 'El correo es la vía más rápida para presupuestos y preguntas técnicas.', 'L’e-mail est le moyen le plus rapide pour un devis ou une question technique.', 'Почта — самый быстрый способ для расчёта и технических вопросов.', 'E-Mail ist der schnellste Weg für Angebote und technische Fragen.', 'L’email è il modo più rapido per preventivi e domande tecniche.'),
    row('Email', 'Correo', 'E-mail', 'Почта', 'E-Mail', 'Email'),
    row('We normally reply within one business day.', 'Normalmente respondemos en un día laborable.', 'Nous répondons en général sous un jour ouvré.', 'Обычно отвечаем в течение одного рабочего дня.', 'Wir antworten in der Regel innerhalb eines Werktags.', 'Di solito rispondiamo entro un giorno lavorativo.'),
    row('Sent ✓', 'Enviado ✓', 'Envoyé ✓', 'Отправлено ✓', 'Gesendet ✓', 'Inviato ✓'),
    row('Thank you. We will reply shortly.', 'Gracias. Responderemos en breve.', 'Merci. Nous répondrons rapidement.', 'Спасибо. Мы скоро ответим.', 'Danke. Wir antworten in Kürze.', 'Grazie. Risponderemo a breve.'),
    row('Page not found', 'Página no encontrada', 'Page introuvable', 'Страница не найдена', 'Seite nicht gefunden', 'Pagina non trovata'),
    row('That address does not exist.', 'Esa dirección no existe.', 'Cette adresse n’existe pas.', 'Такого адреса нет.', 'Diese Adresse gibt es nicht.', 'Questo indirizzo non esiste.'),
    row('Back to the homepage', 'Volver al inicio', 'Retour à l’accueil', 'На главную', 'Zur Startseite', 'Torna alla home'),
    row('View products', 'Ver productos', 'Voir les produits', 'Смотреть продукты', 'Produkte ansehen', 'Vedi i prodotti'),
    row('Back to home', 'Volver al inicio', 'Retour à l’accueil', 'На главную', 'Zur Startseite', 'Torna alla home'),
    row('Privacy Policy & Cookies', 'Política de privacidad y cookies', 'Politique de confidentialité et cookies', 'Конфиденциальность и cookie', 'Datenschutz und Cookies', 'Privacy e cookie'),
    row('Last updated: 2 November 2026', 'Última actualización: 2 de noviembre de 2026', 'Dernière mise à jour : 2 novembre 2026', 'Обновлено: 2 ноября 2026', 'Zuletzt aktualisiert: 2. November 2026', 'Ultimo aggiornamento: 2 novembre 2026'),
    row('1. Data controller', '1. Responsable del tratamiento', '1. Responsable du traitement', '1. Оператор данных', '1. Verantwortlicher', '1. Titolare del trattamento'),
    row('Flight Simulator / VirtualSky. Contact:', 'Flight Simulator / VirtualSky. Contacto:', 'Flight Simulator / VirtualSky. Contact :', 'Flight Simulator / VirtualSky. Контакт:', 'Flight Simulator / VirtualSky. Kontakt:', 'Flight Simulator / VirtualSky. Contatto:'),
    row('2. Data we collect', '2. Datos que recogemos', '2. Données collectées', '2. Какие данные мы собираем', '2. Welche Daten wir erheben', '2. Dati che raccogliamo'),
    row('When you use the contact form we may collect name, organisation, email, phone and message content, solely to respond to your enquiry and provide quotations for our professional flight simulators.', 'Si usa el formulario podemos recoger nombre, organización, correo, teléfono y mensaje, solo para responder y preparar presupuestos de nuestros simuladores profesionales.', 'Via le formulaire nous pouvons collecter nom, organisation, e-mail, téléphone et message, uniquement pour répondre et établir un devis.', 'Через форму мы можем собрать имя, организацию, почту, телефон и текст сообщения — только чтобы ответить и подготовить предложение.', 'Über das Formular können wir Name, Organisation, E-Mail, Telefon und Nachricht erfassen, nur um zu antworten und ein Angebot zu erstellen.', 'Con il modulo possiamo raccogliere nome, organizzazione, email, telefono e messaggio, solo per rispondere e preparare un preventivo.'),
    row('3. Cookies', '3. Cookies', '3. Cookies', '3. Файлы cookie', '3. Cookies', '3. Cookie'),
    row('Necessary cookies', 'Cookies necesarias', 'Cookies nécessaires', 'Необходимые cookie', 'Notwendige Cookies', 'Cookie necessari'),
    row('– required for the site to function (e.g. storing your cookie preference). Always active.', '– necesarias para que el sitio funcione (p. ej. guardar su preferencia). Siempre activas.', '– nécessaires au fonctionnement du site (p. ex. mémoriser votre choix). Toujours actives.', '– нужны для работы сайта (например, чтобы запомнить ваш выбор). Всегда включены.', '– erforderlich für den Betrieb der Website (z. B. Ihre Cookie-Wahl). Immer aktiv.', '– necessari al funzionamento del sito (ad es. ricordare la scelta). Sempre attivi.'),
    row('Analytics cookies', 'Cookies de analítica', 'Cookies d’analyse', 'Аналитические cookie', 'Analyse-Cookies', 'Cookie analitici'),
    row('– only with your consent. We may use Google Analytics 4 with IP anonymisation to understand traffic. You can accept, reject or change this choice at any time via the cookie banner.', '– solo con su consentimiento. Podemos usar Google Analytics 4 con IP anonimizada para entender el tráfico. Puede aceptar, rechazar o cambiar esta elección en cualquier momento.', '– uniquement avec votre consentement. Nous pouvons utiliser Google Analytics 4 avec IP anonymisée pour comprendre le trafic. Vous pouvez accepter, refuser ou modifier ce choix à tout moment.', '– только с вашего согласия. Мы можем использовать Google Analytics 4 с анонимным IP, чтобы понимать трафик. Выбор можно изменить в любой момент.', '– nur mit Ihrer Einwilligung. Wir können Google Analytics 4 mit anonymisierter IP nutzen, um den Verkehr zu verstehen. Sie können dies jederzeit ändern.', '– solo con il tuo consenso. Possiamo usare Google Analytics 4 con IP anonimo per capire il traffico. Puoi accettare, rifiutare o cambiare scelta in qualsiasi momento.'),
    row('4. Legal basis (GDPR)', '4. Base jurídica (RGPD)', '4. Base légale (RGPD)', '4. Правовое основание (GDPR)', '4. Rechtsgrundlage (DSGVO)', '4. Base giuridica (GDPR)'),
    row('Necessary cookies: legitimate interest / contract. Analytics: consent (Art. 6(1)(a) GDPR). Contact form data: pre-contractual steps / legitimate interest in responding to enquiries.', 'Cookies necesarias: interés legítimo / contrato. Analítica: consentimiento (art. 6.1.a RGPD). Formulario: medidas precontractuales / interés legítimo en responder.', 'Cookies nécessaires : intérêt légitime / contrat. Analyse : consentement (art. 6(1)(a) RGPD). Formulaire : mesures précontractuelles / intérêt légitime à répondre.', 'Необходимые cookie: законный интерес / договор. Аналитика: согласие (ст. 6(1)(a) GDPR). Форма: преддоговорные шаги / законный интерес ответить.', 'Notwendige Cookies: berechtigtes Interesse / Vertrag. Analyse: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Formular: vorvertragliche Schritte / berechtigtes Interesse.', 'Cookie necessari: interesse legittimo / contratto. Analitici: consenso (art. 6(1)(a) GDPR). Modulo: misure precontrattuali / interesse legittimo a rispondere.'),
    row('5. Your rights', '5. Sus derechos', '5. Vos droits', '5. Ваши права', '5. Ihre Rechte', '5. I tuoi diritti'),
    row('You may request access, rectification, erasure, restriction, portability or object to processing. Contact', 'Puede solicitar acceso, rectificación, supresión, limitación, portabilidad u oponerse al tratamiento. Contacto', 'Vous pouvez demander l’accès, la rectification, l’effacement, la limitation, la portabilité ou vous opposer au traitement. Contact', 'Вы можете запросить доступ, исправление, удаление, ограничение, переносимость или возразить против обработки. Контакт', 'Sie können Auskunft, Berichtigung, Löschung, Einschränkung, Übertragbarkeit verlangen oder widersprechen. Kontakt', 'Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità o opporti al trattamento. Contatto'),
    row('. You may also lodge a complaint with your local data protection authority.', '. También puede reclamar ante la autoridad de protección de datos de su país.', '. Vous pouvez aussi introduire une réclamation auprès de votre autorité de protection des données.', '. Вы также можете подать жалобу в местный орган по защите данных.', '. Sie können sich auch bei Ihrer Datenschutzbehörde beschweren.', '. Puoi anche reclamare all’autorità di protezione dei dati del tuo paese.'),
    row('6. Cloudflare', '6. Cloudflare', '6. Cloudflare', '6. Cloudflare', '6. Cloudflare', '6. Cloudflare'),
    row('This site may be served through Cloudflare CDN/security. Cloudflare may process technical data (IP, logs) as described in their privacy policy, as a processor/sub-processor for security and performance.', 'Este sitio puede servirse a través de Cloudflare. Cloudflare puede tratar datos técnicos (IP, registros) según su política de privacidad, como encargado, por seguridad y rendimiento.', 'Ce site peut passer par Cloudflare. Cloudflare peut traiter des données techniques (IP, journaux) selon sa politique de confidentialité, comme sous-traitant, pour la sécurité et la performance.', 'Сайт может работать через Cloudflare. Cloudflare может обрабатывать технические данные (IP, журналы) по своей политике конфиденциальности, как обработчик, для безопасности и скорости.', 'Diese Website kann über Cloudflare ausgeliefert werden. Cloudflare kann technische Daten (IP, Logs) laut seiner Datenschutzerklärung als Auftragsverarbeiter für Sicherheit und Leistung verarbeiten.', 'Questo sito può passare da Cloudflare. Cloudflare può trattare dati tecnici (IP, log) come descritto nella sua privacy policy, come responsabile, per sicurezza e prestazioni.'),
    row('Accept all', 'Aceptar todo', 'Tout accepter', 'Принять все', 'Alle akzeptieren', 'Accetta tutto'),
    row('Reject optional', 'Rechazar opcionales', 'Refuser les optionnels', 'Отклонить необязательные', 'Optionale ablehnen', 'Rifiuta facoltativi'),
    row('Settings', 'Ajustes', 'Réglages', 'Настройки', 'Einstellungen', 'Impostazioni'),
    row('Cookie settings', 'Ajustes de cookies', 'Réglages des cookies', 'Настройки cookie', 'Cookie-Einstellungen', 'Impostazioni cookie'),
    row('Necessary', 'Necesarias', 'Nécessaires', 'Необходимые', 'Notwendig', 'Necessari'),
    row('Analytics', 'Analítica', 'Analyse', 'Аналитика', 'Analyse', 'Analitici'),
    row('Save', 'Guardar', 'Enregistrer', 'Сохранить', 'Speichern', 'Salva'),
    row('Save choices', 'Guardar elecciones', 'Enregistrer les choix', 'Сохранить выбор', 'Auswahl speichern', 'Salva scelte'),
    row('Close', 'Cerrar', 'Fermer', 'Закрыть', 'Schließen', 'Chiudi'),
    row('Required for the site to function. Always on.', 'Necesarias para que el sitio funcione. Siempre activas.', 'Nécessaires au fonctionnement du site. Toujours actives.', 'Нужны для работы сайта. Всегда включены.', 'Erforderlich für den Betrieb. Immer an.', 'Necessari al funzionamento del sito. Sempre attivi.'),
    row('Google Analytics with anonymised IP.', 'Google Analytics con IP anonimizada.', 'Google Analytics avec IP anonymisée.', 'Google Analytics с анонимным IP.', 'Google Analytics mit anonymisierter IP.', 'Google Analytics con IP anonimo.'),
    row('We use necessary cookies and, with consent, analytics.', 'Usamos cookies necesarias y, con consentimiento, de analítica.', 'Nous utilisons des cookies nécessaires et, avec consentement, d’analyse.', 'Мы используем необходимые cookie и, с согласия, аналитические.', 'Wir nutzen notwendige Cookies und, mit Einwilligung, Analyse-Cookies.', 'Usiamo cookie necessari e, con consenso, analitici.'),
    row('We use necessary cookies to run the site and, with your consent, analytics cookies (Google Analytics) to improve it. See our', 'Usamos cookies necesarias para el sitio y, con su consentimiento, cookies de analítica (Google Analytics) para mejorarlo. Vea nuestra', 'Nous utilisons des cookies nécessaires au site et, avec votre consentement, des cookies d’analyse (Google Analytics) pour l’améliorer. Voir notre', 'Мы используем необходимые cookie для работы сайта и, с вашего согласия, аналитические (Google Analytics), чтобы его улучшать. См.', 'Wir nutzen notwendige Cookies für den Betrieb und, mit Ihrer Einwilligung, Analyse-Cookies (Google Analytics) zur Verbesserung. Siehe unsere', 'Usiamo cookie necessari per il sito e, con il tuo consenso, cookie analitici (Google Analytics) per migliorarlo. Vedi la'),
    row('Search products…', 'Buscar productos…', 'Rechercher des produits…', 'Поиск продуктов…', 'Produkte suchen…', 'Cerca prodotti…'),
    row('Search products', 'Buscar productos', 'Rechercher des produits', 'Поиск продуктов', 'Produkte suchen', 'Cerca prodotti'),
    row('No products match.', 'Ningún producto coincide.', 'Aucun produit ne correspond.', 'Ничего не найдено.', 'Keine Produkte gefunden.', 'Nessun prodotto corrisponde.'),
    row('No products match', 'Ningún producto coincide con', 'Aucun produit ne correspond à', 'Ничего не найдено по запросу', 'Keine Produkte für', 'Nessun prodotto corrisponde a'),
    row('result', 'resultado', 'résultat', 'результат', 'Ergebnis', 'risultato'),
    row('results', 'resultados', 'résultats', 'результатов', 'Ergebnisse', 'risultati'),
    row('for', 'para', 'pour', 'по', 'für', 'per'),
    row('Menu', 'Menú', 'Menu', 'Меню', 'Menü', 'Menu'),
    row('Previous photo', 'Foto anterior', 'Photo précédente', 'Предыдущее фото', 'Vorheriges Foto', 'Foto precedente'),
    row('Next photo', 'Foto siguiente', 'Photo suivante', 'Следующее фото', 'Nächstes Foto', 'Foto successiva'),
    row('Cookie consent', 'Consentimiento de cookies', 'Consentement cookies', 'Согласие на cookie', 'Cookie-Einwilligung', 'Consenso cookie'),
    row('Professional Cessna 172 Flight Simulator | Flight Schools', 'Simulador profesional Cessna 172 | Escuelas de vuelo', 'Simulateur professionnel Cessna 172 | Écoles de pilotage', 'Профессиональный тренажёр Cessna 172 | Лётные школы', 'Professioneller Cessna-172-Flugsimulator | Flugschulen', 'Simulatore professionale Cessna 172 | Scuole di volo'),
    row('How a Professional Cessna Flight Simulator Works', 'Cómo funciona un simulador profesional Cessna', 'Comment fonctionne un simulateur Cessna professionnel', 'Как устроен профессиональный тренажёр Cessna', 'So funktioniert ein professioneller Cessna-Flugsimulator', 'Come funziona un simulatore Cessna professionale'),
    row('Contact | Request a Quote for Professional Flight Simulators', 'Contacto | Presupuesto de simuladores profesionales', 'Contact | Devis pour simulateurs professionnels', 'Контакты | Запрос цены на профессиональные тренажёры', 'Kontakt | Angebot für professionelle Flugsimulatoren', 'Contatto | Preventivo simulatori professionali'),
    row('Privacy Policy & Cookies | Flight Simulator', 'Privacidad y cookies | Flight Simulator', 'Confidentialité et cookies | Flight Simulator', 'Конфиденциальность и cookie | Flight Simulator', 'Datenschutz und Cookies | Flight Simulator', 'Privacy e cookie | Flight Simulator'),
    row('All Products | Professional Flight Simulators & Components', 'Todos los productos | Simuladores y componentes', 'Tous les produits | Simulateurs et composants', 'Все продукты | Тренажёры и компоненты', 'Alle Produkte | Simulatoren und Komponenten', 'Tutti i prodotti | Simulatori e componenti'),
    row('Page not found | Flight Simulator', 'Página no encontrada | Flight Simulator', 'Page introuvable | Flight Simulator', 'Страница не найдена | Flight Simulator', 'Seite nicht gefunden | Flight Simulator', 'Pagina non trovata | Flight Simulator'),
    row('Home', 'Inicio', 'Accueil', 'Главная', 'Start', 'Home'),
    row('contact us', 'contáctenos', 'contactez-nous', 'свяжитесь с нами', 'kontaktieren Sie uns', 'contattateci'),
    row('Professional Cessna 172/152 cabin shell for building a full flight simulator. Supplied as the complete cabin structure.', 'Carcasa de cabina profesional Cessna 172/152 para construir un simulador completo. Se suministra la estructura completa.', 'Coque de cabine professionnelle Cessna 172/152 pour construire un simulateur complet. Structure de cabine livrée entière.', 'Профессиональный корпус кабины Cessna 172/152 для сборки полного тренажёра. Поставляется вся конструкция кабины.', 'Professionelle Cessna-172/152-Kabinenhülle zum Aufbau eines vollständigen Simulators. Geliefert als komplette Kabinenstruktur.', 'Guscio di cabina professionale Cessna 172/152 per costruire un simulatore completo. Fornito come struttura intera.'),
    row('Cessna magnetic compass for a realistic instrument panel.', 'Brújula magnética Cessna para un panel de instrumentos realista.', 'Compas magnétique Cessna pour un tableau de bord réaliste.', 'Магнитный компас Cessna для реалистичной приборной панели.', 'Magnetkompass Cessna für ein realistisches Instrumentenbrett.', 'Bussola magnetica Cessna per un pannello strumenti realistico.'),
    row('Garmin G1000 glass-cockpit panel for professional simulator builds.', 'Panel de cabina de cristal Garmin G1000 para simuladores profesionales.', 'Panneau glass-cockpit Garmin G1000 pour simulateurs professionnels.', 'Панель Garmin G1000 glass cockpit для профессиональных тренажёров.', 'Garmin-G1000-Glascockpit für professionelle Simulatoren.', 'Pannello glass cockpit Garmin G1000 per simulatori professionali.'),
    row('Garmin G430 GPS / NAV / COM panel for cockpit builds.', 'Panel Garmin G430 GPS / NAV / COM para cabinas de simulador.', 'Panneau Garmin G430 GPS / NAV / COM pour cockpits de simulateur.', 'Панель Garmin G430 GPS / NAV / COM для кабин тренажёров.', 'Garmin-G430-GPS/NAV/COM-Panel für Simulator-Cockpits.', 'Pannello Garmin G430 GPS / NAV / COM per cockpit da simulatore.'),
    row('Garmin G530 GPS / NAV / COM panel for cockpit builds.', 'Panel Garmin G530 GPS / NAV / COM para cabinas de simulador.', 'Panneau Garmin G530 GPS / NAV / COM pour cockpits de simulateur.', 'Панель Garmin G530 GPS / NAV / COM для кабин тренажёров.', 'Garmin-G530-GPS/NAV/COM-Panel für Simulator-Cockpits.', 'Pannello Garmin G530 GPS / NAV / COM per cockpit da simulatore.'),
    row('Professional radio panel for a flight simulator cockpit.', 'Panel de radio profesional para la cabina de un simulador.', 'Panneau radio professionnel pour cockpit de simulateur.', 'Профессиональная радиопанель для кабины тренажёра.', 'Professionelles Funkpanel für ein Simulator-Cockpit.', 'Pannello radio professionale per il cockpit di un simulatore.'),
    row('KT76C transponder unit for professional cockpit builds.', 'Transpondedor KT76C para cabinas profesionales.', 'Transpondeur KT76C pour cockpits professionnels.', 'Транспондер KT76C для профессиональных кабин.', 'KT76C-Transponder für professionelle Cockpits.', 'Transponder KT76C per cockpit professionali.'),
    row('A drone simulator with projectors is an immersive training system for piloting practice, using projectors to create realistic virtual environments on curved or dome screens, simulating 280-degree views like a professional', 'Un simulador de drones con proyectores es un sistema de entrenamiento inmersivo: los proyectores crean entornos virtuales realistas en pantallas curvas o de cúpula, con una vista de 280 grados como un profesional', 'Un simulateur de drone à projecteurs est un système d’entraînement immersif : les projecteurs créent des environnements virtuels réalistes sur écrans courbes ou dômes, avec une vue à 280 degrés, comme un professionnel', 'Тренажёр дрона с проекторами — иммерсивная система обучения: проекторы создают реалистичную среду на изогнутых или купольных экранах, с обзором 280 градусов, как у профессионального', 'Ein Drohnensimulator mit Projektoren ist ein immersives Trainingssystem: Projektoren erzeugen realistische Umgebungen auf gebogenen oder Kuppel-Leinwänden, mit 280-Grad-Sicht wie ein professioneller', 'Un simulatore di droni con proiettori è un sistema di addestramento immersivo: i proiettori creano ambienti virtuali realistici su schermi curvi o a cupola, con visuale a 280 gradi come un professionale'),
    row('This YOKE was designed for specific requirements, in order to position it exactly above the instrument panel, accurately replicating its real placement in relation to the instruments. Magic Yoke This yoke is designed to mount above the monitor without cutting into the cockpit; all electronics are built into the yoke.', 'Este YOKE se diseñó para colocarse exactamente encima del panel de instrumentos, como en el avión real. Magic Yoke se monta sobre el monitor sin recortar la cabina; toda la electrónica va dentro del yoke.', 'Ce YOKE a été conçu pour se placer exactement au-dessus du tableau de bord, comme dans l’avion réel. Magic Yoke se monte au-dessus de l’écran sans découper le cockpit ; toute l’électronique est intégrée au yoke.', 'Этот YOKE сделан так, чтобы стоять точно над приборной панелью, как в настоящем самолёте. Magic Yoke крепится над монитором без выреза в кабине; вся электроника внутри штурвала.', 'Dieses YOKE sitzt genau über dem Instrumentenbrett, wie im echten Flugzeug. Magic Yoke wird über dem Monitor montiert, ohne das Cockpit auszuschneiden; die Elektronik steckt im Yoke.', 'Questo YOKE è progettato per stare esattamente sopra il pannello strumenti, come sull’aereo vero. Magic Yoke si monta sopra il monitor senza tagliare la cabina; tutta l’elettronica è nel volantino.'),
    row('Discover our advanced ATC Simulator , designed specifically for aviation schools and air traffic control (ATC) professionals. This immersive system faithfully replicates real operational conditions, integrating primary/secondary radar, tower view, approach/departure control, and multi-sector management.', 'Descubra nuestro simulador ATC avanzado, pensado para escuelas de aviación y controladores. Reproduce las condiciones reales: radar primario y secundario, vista de torre, control de aproximación y salida, y gestión multisector.', 'Découvrez notre simulateur ATC avancé, conçu pour les écoles d’aviation et les contrôleurs. Il reproduit les conditions réelles : radar primaire et secondaire, vue tour, contrôle approche/départ et gestion multi-secteurs.', 'Профессиональный тренажёр ATC для авиационных школ и диспетчеров. Он воспроизводит реальные условия: первичный и вторичный радар, вид из вышки, контроль подхода и вылета, несколько секторов.', 'Entdecken Sie unseren ATC-Simulator für Flugschulen und Lotsen. Er bildet den echten Betrieb ab: Primär- und Sekundärradar, Tower-Sicht, An- und Abflugkontrolle und mehrere Sektoren.', 'Scopri il simulatore ATC avanzato, pensato per scuole di volo e controllori. Riproduce le condizioni reali: radar primario e secondario, vista torre, controllo di avvicinamento e partenza, gestione multi-settore.')
  ];

  function sim(kind, model, dims) {
    return {
      es: 'Simulador ' + kind + ' para ' + model + '. DIMENSIONES ' + dims + ', totalmente automático y sin controlador externo. Integrado y diseñado para ocupar el mínimo espacio. Se entrega con Primer y Carb Heat.',
      fr: 'Simulateur ' + kind + ' pour ' + model + '. DIMENSIONS ' + dims + ', entièrement automatique, sans contrôleur externe. Intégré et conçu pour réduire l’espace nécessaire. Livré avec Primer et Carb Heat.',
      ru: 'Тренажёр ' + kind + ' для ' + model + '. РАЗМЕРЫ ' + dims + ', полностью автоматический, без внешнего контроллера. Встроенный, чтобы занимать минимум места. В комплекте Primer и Carb Heat.',
      de: kind + '-Simulator für die ' + model + '. ABMESSUNGEN ' + dims + ', vollautomatisch, ohne externen Controller. Integriert und auf minimalen Platz ausgelegt. Geliefert mit Primer und Carb Heat.',
      it: 'Simulatore ' + kind + ' per ' + model + '. DIMENSIONI ' + dims + ', completamente automatico e senza controller esterno. Integrato e progettato per ridurre lo spazio. Fornito con Primer e Carb Heat.'
    };
  }
  [
    ['HOME flight simulator for the Cessna 152 DIMENSIONS 5,2×4,62m, fully automated and not requiring any external controller. The simulator is fully integrated and designed to minimize the required space as much as possible. It is provided together with the PRIME and Carb Heat.', sim('HOME', 'Cessna 152', '5,2×4,62 m')],
    ['HOME flight simulator for the Cessna 152,DIMENSIONS 2,4×2,8m fully automated and not requiring any external controller. The simulator is fully integrated and designed to minimize the required space as much as possible. It is provided together with the PRIME and Carb Heat.', sim('HOME', 'Cessna 152', '2,4×2,8 m')],
    ['PROFESSIONAL flight simulator for the Cessna 172 DIMENSIONS 5,2×4,62m, fully automated and not requiring any external controller. The simulator is fully integrated and designed to minimize the required space as much as possible. It is provided together with the PRIME and Carb Heat.', sim('PROFESSIONAL', 'Cessna 172', '5,2×4,62 m')],
    ['HOME simulator for the Cessna 172 DIMENSIONS 2,4×2,8m, fully automated and not requiring any external controller. The simulator is fully integrated and designed to minimize the required space as much as possible. It is provided together with the PRIME and Carb Heat.', sim('HOME', 'Cessna 172', '2,4×2,8 m')],
    ['PROFESSIONAL simulator for the Cessna 152 DIMENSIONS 5,2×4,62m, fully automated and not requiring any external controller. The simulator is fully integrated and designed to minimize the required space as much as possible. It is provided together with the PRIME and Carb Heat.', sim('PROFESSIONAL', 'Cessna 152', '5,2×4,62 m')],
    ['PROFESSIONAL simulator for the Cessna 152,DIMENSIONS 2,4×2,8m fully automated and not requiring any external controller. The simulator is fully integrated and designed to minimize the required space as much as possible. It is provided together with the PRIME and Carb Heat.', sim('PROFESSIONAL', 'Cessna 152', '2,4×2,8 m')],
    ['PROFESSIONAL simulator for the Cessna 172,DIMENSIONS 2,4×2,8m fully automated and not requiring any external controller. The simulator is fully integrated and designed to minimize the required space as much as possible. It is provided together with the PRIME and Carb Heat.', sim('PROFESSIONAL', 'Cessna 172', '2,4×2,8 m')],
    ['PROFESSIONAL simulator for the Cessna 172 DIMENSIONS 5,2×4,62m, fully automated and not requiring any external controller. The simulator is fully integrated and designed to minimize the required space as much as possible. It is provided together with the PRIME and Carb Heat.', sim('PROFESSIONAL', 'Cessna 172', '5,2×4,62 m')]
  ].forEach(function (pair) {
    var o = pair[1];
    o.en = pair[0];
    ROWS.push(o);
  });

  var DICT = { es: {}, fr: {}, ru: {}, de: {}, it: {} };
  ROWS.forEach(function (r) {
    ['es', 'fr', 'ru', 'de', 'it'].forEach(function (id) { DICT[id][r.en] = r[id]; });
  });

  var current = 'en';
  var origText = new WeakMap();
  var started = false;

  function readSaved() {
    try {
      var v = localStorage.getItem(KEY);
      if (v && LANGS.some(function (l) { return l.id === v; })) return v;
    } catch (e) {}
    return 'en';
  }
  function t(s) {
    if (!s || current === 'en') return s;
    var d = DICT[current];
    return (d && Object.prototype.hasOwnProperty.call(d, s)) ? d[s] : s;
  }
  function skip(node) {
    var el = node.parentElement;
    if (!el) return true;
    if (el.closest('script,style,[data-no-i18n]')) return true;
    var tag = el.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'INPUT') return true;
    return false;
  }
  function walk(node, fn) {
    var kids = node.childNodes;
    for (var i = 0; i < kids.length; i++) {
      var n = kids[i];
      if (n.nodeType === 3) fn(n);
      else if (n.nodeType === 1) walk(n, fn);
    }
  }
  function apply() {
    walk(document.body, function (node) {
      if (skip(node)) return;
      if (!origText.has(node)) origText.set(node, node.nodeValue);
      var raw = origText.get(node);
      var core = raw.trim();
      if (!core) return;
      var next = t(core);
      if (next === core && current !== 'en') {
        node.nodeValue = raw;
        return;
      }
      var lead = raw.match(/^\s*/)[0];
      var trail = raw.match(/\s*$/)[0];
      node.nodeValue = lead + (current === 'en' ? core : next) + trail;
    });
    document.querySelectorAll('[placeholder],[aria-label]').forEach(function (el) {
      if (el.closest('[data-no-i18n]')) return;
      if (el.hasAttribute('placeholder')) {
        if (!el.dataset.enPh) el.dataset.enPh = el.getAttribute('placeholder');
        el.setAttribute('placeholder', t(el.dataset.enPh));
      }
      if (el.hasAttribute('aria-label')) {
        if (!el.dataset.enAl) el.dataset.enAl = el.getAttribute('aria-label');
        el.setAttribute('aria-label', t(el.dataset.enAl));
      }
    });
    var root = document.documentElement;
    if (!root.dataset.enTitle) root.dataset.enTitle = document.title;
    document.title = t(root.dataset.enTitle);
    root.lang = current;
    var btn = document.getElementById('langBtn');
    if (btn) {
      var lang = LANGS.filter(function (l) { return l.id === current; })[0];
      btn.innerHTML = '<span class="flag">' + FLAGS[current] + '</span><span class="lang-code">' + current.toUpperCase() + '</span>';
      btn.setAttribute('aria-label', lang.name);
    }
    document.querySelectorAll('.lang-menu button').forEach(function (b) {
      b.setAttribute('aria-selected', b.dataset.lang === current ? 'true' : 'false');
    });
  }
  function setLang(id) {
    if (!LANGS.some(function (l) { return l.id === id; })) id = 'en';
    current = id;
    try { localStorage.setItem(KEY, id); } catch (e) {}
    apply();
    document.dispatchEvent(new CustomEvent('fs-lang'));
  }
  function closeMenu() {
    var menu = document.getElementById('langMenu');
    var btn = document.getElementById('langBtn');
    if (menu) menu.hidden = true;
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
  function mount() {
    var header = document.querySelector('.header-inner');
    if (!header || document.getElementById('langSwitch')) return;
    var wrap = document.createElement('div');
    wrap.className = 'lang';
    wrap.id = 'langSwitch';
    wrap.setAttribute('data-no-i18n', '');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lang-btn';
    btn.id = 'langBtn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    var menu = document.createElement('ul');
    menu.className = 'lang-menu';
    menu.id = 'langMenu';
    menu.hidden = true;
    menu.setAttribute('role', 'listbox');
    LANGS.forEach(function (l) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.dataset.lang = l.id;
      b.setAttribute('role', 'option');
      b.innerHTML = '<span class="flag">' + FLAGS[l.id] + '</span><span>' + l.name + '</span>';
      b.addEventListener('click', function () {
        setLang(l.id);
        closeMenu();
      });
      li.appendChild(b);
      menu.appendChild(li);
    });
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    wrap.appendChild(btn);
    wrap.appendChild(menu);
    var toggle = header.querySelector('.nav-toggle');
    if (toggle) header.insertBefore(wrap, toggle);
    else header.appendChild(wrap);
  }
  function start() {
    if (started) { apply(); return; }
    started = true;
    current = readSaved();
    mount();
    apply();
    document.dispatchEvent(new CustomEvent('fs-lang'));
  }
  window.FS_I18N = { t: t, apply: apply, start: start, code: function () { return current; } };
  function boot() {
    if (window.__fs_main) start();
    else start();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 0); });
  else setTimeout(start, 0);
})();
