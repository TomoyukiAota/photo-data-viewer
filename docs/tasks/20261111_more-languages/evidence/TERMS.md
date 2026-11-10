# More languages: the words chosen

The 40 translations added on 2026-11-11 are machine translation. For the words
that every application has, the word that Windows and macOS use in the language
was aimed at, without looking any of them up in Microsoft's or Apple's
glossaries: a reviewer should check these first. This file lists the choices,
so that they can be brought into line with Photo Location Map's translations,
which were written at the same time, and so that a reviewer sees them at a
glance.

The tables are made from `src/locales/*.json` as they were on 2026-11-11; the
files are what the app shows. A soft hyphen in a text is left out here.

## Choices that hold for every language

- **Names are not translated**: Photo Data Viewer, Photo Location Map, EXIF,
  exifr, GitHub, GitHub Issues, iOS, X, Twitter, and also Google Maps and
  Google Street View, as the guide says. Japanese, which the maintainer
  reviewed, writes Google's own Japanese names (Google マップ, Google
  ストリートビュー); the 40 new languages keep the English names.
- **"what kind of photo was loaded"**, in the About page's text on usage data,
  is written as "the file format of the loaded photo", as the Japanese text
  that the maintainer reviewed has it.
- **The menu's entry for the Language page** is the language's word followed by
  `(Language)`, as Photo Location Map writes its Language tab: `Sprache
  (Language)`. The page's title is the word alone.
- **Width × Height** has the multiplication sign `×`, as Japanese does, not the
  letter x of the English text; so has the size itself (`3024 × 4032`).
- **12- or 24-hour** is the label of a narrow field. Where "12 or 24 hours" is
  longer than the field, it is `12/24` and the word for hours: `cs`, `da`,
  `de`, `ko`, `nb`, `ro`, `sk`, `sv`, `th`, `zh-Hans`, `zh-Hant`.
- **Latitude and Longitude** are abbreviated where the full words do not fit on
  one line of the table's column on a phone, and where the plain word would be
  the one for width: `bg`, `cs`, `el`, `hr`, `hu`, `lv`, `pl`, `sk`, `sl`,
  `sr-Latn`.
- **The day of the week in a date** is written plainly, except in Korean,
  which has it in parentheses as Japanese does.
- **Quotation marks** around a button's or a page's name are those of the
  language.
- **The register** is the one that software usually has in the language:
  polite forms in `de`, `fr`, `cs`, `ru` and most others, and the informal
  form in `es`, `it`, `nl`, `sv`, `da`, `nb`, `pl` and `fi`.

## Words that have more than one common translation

The word chosen, and the one that was weighed against it.

| Word     | Chosen                                                                                                   | Weighed against it                                                     |
| -------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Settings | `fr` Paramètres, `es` Configuración, `pt-BR` Configurações, `ru` Настройки, `uk` Налаштування, `id` Pengaturan, `et` Seaded, `sr-Latn` Podešavanja, `lt` Nustatymai | `fr` Réglages, `es` Ajustes, `pt-BR` Ajustes, `ru` Параметры, `uk` Параметри, `id` Setelan, `et` Sätted, `sr-Latn` Postavke, `lt` Parametrai |
| About    | `de` Info, `nl` Over, `bg` Информация, `pl` Informacje, `hi` परिचय, `vi` Giới thiệu                       | `de` Über, `nl` Info, `bg` Относно, `pl` O aplikacji, `hi` इसके बारे में, `vi` Thông tin |
| Home     | `de` Start, `nl` Start, `fi` Etusivu, `it` Home                                                          | `de` Startseite, `nl` Home, `fi` Aloitus, `it` Inizio                  |
| Search   | `fi` Haku, `sl` Iskanje, `ru` Поиск (nouns); `de` Suchen, `fr` Rechercher (verbs) | `fi` Hae, `sl` Išči, `ru` Найти, `de` Suche, `fr` Recherche           |
| application | `de`, `nl`, `da`, `nb`, `sv` App/app; `pt-BR` aplicativo; `uk` програма; `lt` programa; `zh-Hans` 应用 | Anwendung, applicatie, program; app; застосунок; programėlė; App       |
| photo    | `nb` bilde, `sv` bild, `fi` kuva (the word for a picture); `pt-PT` fotografia; `he` תמונה | foto, valokuva; foto; צילום                                            |

## Words that Photo Location Map has too

The first to bring into line with Photo Location Map's translations.

| Code | Language | Settings | Search | No languages found | Close | Reload | Loading... |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `ar` | اللغة | الإعدادات | بحث | لم يُعثر على أي لغة | إغلاق | إعادة التحميل | جارٍ التحميل... |
| `bg` | Език | Настройки | Търсене | Няма намерени езици | Затваряне | Презареждане | Зареждане... |
| `ca` | Idioma | Configuració | Cerca | No s'ha trobat cap idioma | Tanca | Torna a carregar | S'està carregant... |
| `cs` | Jazyk | Nastavení | Hledat | Nebyly nalezeny žádné jazyky | Zavřít | Načíst znovu | Načítání... |
| `da` | Sprog | Indstillinger | Søg | Ingen sprog fundet | Luk | Genindlæs | Indlæser... |
| `de` | Sprache | Einstellungen | Suchen | Keine Sprachen gefunden | Schließen | Neu laden | Wird geladen... |
| `el` | Γλώσσα | Ρυθμίσεις | Αναζήτηση | Δεν βρέθηκαν γλώσσες | Κλείσιμο | Επαναφόρτωση | Φόρτωση... |
| `en` | Language | Settings | Search | No languages found | Close | Reload | Loading... |
| `es` | Idioma | Configuración | Buscar | No se ha encontrado ningún idioma | Cerrar | Volver a cargar | Cargando... |
| `et` | Keel | Seaded | Otsi | Keeli ei leitud | Sule | Laadi uuesti | Laadimine... |
| `eu` | Hizkuntza | Ezarpenak | Bilatu | Ez da hizkuntzarik aurkitu | Itxi | Kargatu berriro | Kargatzen... |
| `fi` | Kieli | Asetukset | Haku | Kieliä ei löytynyt | Sulje | Lataa uudelleen | Ladataan... |
| `fr` | Langue | Paramètres | Rechercher | Aucune langue trouvée | Fermer | Recharger | Chargement... |
| `gl` | Idioma | Configuración | Buscar | Non se atopou ningún idioma | Pechar | Volver cargar | Cargando... |
| `he` | שפה | הגדרות | חיפוש | לא נמצאו שפות | סגירה | טעינה מחדש | טוען... |
| `hi` | भाषा | सेटिंग्स | खोजें | कोई भाषा नहीं मिली | बंद करें | फिर से लोड करें | लोड हो रहा है... |
| `hr` | Jezik | Postavke | Pretraži | Nije pronađen nijedan jezik | Zatvori | Ponovno učitaj | Učitavanje... |
| `hu` | Nyelv | Beállítások | Keresés | Nem található nyelv | Bezárás | Újratöltés | Betöltés... |
| `id` | Bahasa | Pengaturan | Cari | Bahasa tidak ditemukan | Tutup | Muat Ulang | Memuat... |
| `it` | Lingua | Impostazioni | Cerca | Nessuna lingua trovata | Chiudi | Ricarica | Caricamento... |
| `ja` | 言語 | 設定 | 検索 | 言語が見つかりません | 閉じる | 再読み込み | 読み込み中... |
| `ko` | 언어 | 설정 | 검색 | 언어를 찾을 수 없음 | 닫기 | 새로 고침 | 불러오는 중... |
| `lt` | Kalba | Nustatymai | Ieškoti | Kalbų nerasta | Uždaryti | Įkelti iš naujo | Įkeliama... |
| `lv` | Valoda | Iestatījumi | Meklēt | Valodas nav atrastas | Aizvērt | Ielādēt vēlreiz | Notiek ielāde... |
| `ms` | Bahasa | Tetapan | Cari | Tiada bahasa ditemui | Tutup | Muat Semula | Memuatkan... |
| `nb` | Språk | Innstillinger | Søk | Fant ingen språk | Lukk | Last inn på nytt | Laster inn... |
| `nl` | Taal | Instellingen | Zoeken | Geen talen gevonden | Sluiten | Opnieuw laden | Laden... |
| `pl` | Język | Ustawienia | Szukaj | Nie znaleziono języków | Zamknij | Wczytaj ponownie | Wczytywanie... |
| `pt-BR` | Idioma | Configurações | Buscar | Nenhum idioma encontrado | Fechar | Recarregar | Carregando... |
| `pt-PT` | Idioma | Definições | Procurar | Nenhum idioma encontrado | Fechar | Recarregar | A carregar... |
| `ro` | Limbă | Setări | Căutați | Nu s-a găsit nicio limbă | Închideți | Reîncărcați | Se încarcă... |
| `ru` | Язык | Настройки | Поиск | Языки не найдены | Закрыть | Перезагрузить | Загрузка... |
| `sk` | Jazyk | Nastavenia | Hľadať | Nenašli sa žiadne jazyky | Zavrieť | Načítať znova | Načítava sa... |
| `sl` | Jezik | Nastavitve | Iskanje | Ni najdenih jezikov | Zapri | Znova naloži | Nalaganje... |
| `sr-Latn` | Jezik | Podešavanja | Pretraži | Nije pronađen nijedan jezik | Zatvori | Učitaj ponovo | Učitavanje... |
| `sv` | Språk | Inställningar | Sök | Inga språk hittades | Stäng | Läs in igen | Läser in... |
| `th` | ภาษา | การตั้งค่า | ค้นหา | ไม่พบภาษา | ปิด | โหลดใหม่ | กำลังโหลด... |
| `tr` | Dil | Ayarlar | Ara | Dil bulunamadı | Kapat | Yeniden Yükle | Yükleniyor... |
| `uk` | Мова | Налаштування | Пошук | Мов не знайдено | Закрити | Перезавантажити | Завантаження... |
| `vi` | Ngôn ngữ | Cài đặt | Tìm kiếm | Không tìm thấy ngôn ngữ nào | Đóng | Tải lại | Đang tải... |
| `zh-Hans` | 语言 | 设置 | 搜索 | 未找到语言 | 关闭 | 重新加载 | 正在加载... |
| `zh-Hant` | 語言 | 設定 | 搜尋 | 找不到語言 | 關閉 | 重新載入 | 正在載入... |

## Date and time, as in Photo Location Map's settings

| Code | Date & Time Format | Date Format | 12- or 24-hour | 12-hour | 24-hour | Example |
| --- | --- | --- | --- | --- | --- | --- |
| `ar` | تنسيق التاريخ والوقت | تنسيق التاريخ | 12 أو 24 ساعة | 12 ساعة | 24 ساعة | مثال |
| `bg` | Формат на датата и часа | Формат на датата | 12 или 24 часа | 12 часа | 24 часа | Пример |
| `ca` | Format de data i hora | Format de data | 12 o 24 hores | 12 hores | 24 hores | Exemple |
| `cs` | Formát data a času | Formát data | 12/24 hodin | 12 hodin | 24 hodin | Příklad |
| `da` | Dato- og tidsformat | Datoformat | 12/24 timer | 12 timer | 24 timer | Eksempel |
| `de` | Datums- und Uhrzeitformat | Datumsformat | 12/24 Stunden | 12 Stunden | 24 Stunden | Beispiel |
| `el` | Μορφή ημερομηνίας και ώρας | Μορφή ημερομηνίας | 12 ή 24 ώρες | 12 ώρες | 24 ώρες | Παράδειγμα |
| `en` | Date & Time Format | Date Format | 12- or 24-hour | 12-hour | 24-hour | Example |
| `es` | Formato de fecha y hora | Formato de fecha | 12 o 24 horas | 12 horas | 24 horas | Ejemplo |
| `et` | Kuupäeva ja kellaaja vorming | Kuupäevavorming | 12 või 24 tundi | 12 tundi | 24 tundi | Näide |
| `eu` | Data eta orduaren formatua | Dataren formatua | 12 edo 24 ordu | 12 ordu | 24 ordu | Adibidea |
| `fi` | Päivämäärän ja ajan muoto | Päivämäärän muoto | 12 tai 24 tuntia | 12 tuntia | 24 tuntia | Esimerkki |
| `fr` | Format de la date et de l’heure | Format de la date | 12 ou 24 heures | 12 heures | 24 heures | Exemple |
| `gl` | Formato de data e hora | Formato de data | 12 ou 24 horas | 12 horas | 24 horas | Exemplo |
| `he` | תבנית תאריך ושעה | תבנית תאריך | 12 או 24 שעות | 12 שעות | 24 שעות | דוגמה |
| `hi` | तारीख और समय का फ़ॉर्मैट | तारीख का फ़ॉर्मैट | 12 या 24 घंटे | 12 घंटे | 24 घंटे | उदाहरण |
| `hr` | Format datuma i vremena | Format datuma | 12 ili 24 sata | 12 sati | 24 sata | Primjer |
| `hu` | Dátum- és időformátum | Dátumformátum | 12 vagy 24 órás | 12 órás | 24 órás | Példa |
| `id` | Format Tanggal & Waktu | Format Tanggal | 12 atau 24 jam | 12 jam | 24 jam | Contoh |
| `it` | Formato data e ora | Formato data | 12 o 24 ore | 12 ore | 24 ore | Esempio |
| `ja` | 日時の形式 | 日付の形式 | 12/24 時間制 | 12 時間制 | 24 時間制 | 例 |
| `ko` | 날짜 및 시간 형식 | 날짜 형식 | 12/24시간제 | 12시간제 | 24시간제 | 예 |
| `lt` | Datos ir laiko formatas | Datos formatas | 12 arba 24 val. | 12 val. | 24 val. | Pavyzdys |
| `lv` | Datuma un laika formāts | Datuma formāts | 12 vai 24 stundas | 12 stundas | 24 stundas | Piemērs |
| `ms` | Format Tarikh & Masa | Format Tarikh | 12 atau 24 jam | 12 jam | 24 jam | Contoh |
| `nb` | Dato- og tidsformat | Datoformat | 12/24 timer | 12 timer | 24 timer | Eksempel |
| `nl` | Datum- en tijdnotatie | Datumnotatie | 12 of 24 uur | 12 uur | 24 uur | Voorbeeld |
| `pl` | Format daty i godziny | Format daty | 12 lub 24 godz. | 12 godz. | 24 godz. | Przykład |
| `pt-BR` | Formato de data e hora | Formato de data | 12 ou 24 horas | 12 horas | 24 horas | Exemplo |
| `pt-PT` | Formato de data e hora | Formato de data | 12 ou 24 horas | 12 horas | 24 horas | Exemplo |
| `ro` | Format dată și oră | Format dată | 12/24 de ore | 12 ore | 24 de ore | Exemplu |
| `ru` | Формат даты и времени | Формат даты | 12 или 24 часа | 12 часов | 24 часа | Пример |
| `sk` | Formát dátumu a času | Formát dátumu | 12/24 hodín | 12 hodín | 24 hodín | Príklad |
| `sl` | Oblika datuma in ure | Oblika datuma | 12 ali 24 ur | 12 ur | 24 ur | Primer |
| `sr-Latn` | Format datuma i vremena | Format datuma | 12 ili 24 časa | 12 časova | 24 časa | Primer |
| `sv` | Datum- och tidsformat | Datumformat | 12/24 timmar | 12 timmar | 24 timmar | Exempel |
| `th` | รูปแบบวันที่และเวลา | รูปแบบวันที่ | 12/24 ชั่วโมง | 12 ชั่วโมง | 24 ชั่วโมง | ตัวอย่าง |
| `tr` | Tarih ve Saat Biçimi | Tarih Biçimi | 12 veya 24 saat | 12 saat | 24 saat | Örnek |
| `uk` | Формат дати й часу | Формат дати | 12 або 24 години | 12 годин | 24 години | Приклад |
| `vi` | Định dạng ngày và giờ | Định dạng ngày | 12 hoặc 24 giờ | 12 giờ | 24 giờ | Ví dụ |
| `zh-Hans` | 日期和时间格式 | 日期格式 | 12/24 小时制 | 12 小时制 | 24 小时制 | 示例 |
| `zh-Hant` | 日期與時間格式 | 日期格式 | 12/24 小時制 | 12 小時制 | 24 小時制 | 範例 |

## The entry that follows the browser, and the profiles

Photo Location Map has "Use macOS setting", "Use Windows setting" and "Use system setting" for the first, and the same two profiles.

| Code | Use browser setting ({{language}}) | X (Formerly Twitter) Profile | GitHub Profile |
| --- | --- | --- | --- |
| `ar` | استخدام إعداد المتصفح ({{language}}) | الملف الشخصي على X (Twitter سابقًا) | الملف الشخصي على GitHub |
| `bg` | Използване на настройката на браузъра ({{language}}) | Профил в X (преди Twitter) | Профил в GitHub |
| `ca` | Utilitza la configuració del navegador ({{language}}) | Perfil d'X (abans Twitter) | Perfil de GitHub |
| `cs` | Použít nastavení prohlížeče ({{language}}) | Profil na X (dříve Twitter) | Profil na GitHubu |
| `da` | Brug browserens indstilling ({{language}}) | X-profil (tidligere Twitter) | GitHub-profil |
| `de` | Browsereinstellung verwenden ({{language}}) | X-Profil (ehemals Twitter) | GitHub-Profil |
| `el` | Χρήση της ρύθμισης του προγράμματος περιήγησης ({{language}}) | Προφίλ στο X (πρώην Twitter) | Προφίλ στο GitHub |
| `en` | Use browser setting ({{language}}) | X (Formerly Twitter) Profile | GitHub Profile |
| `es` | Usar la configuración del navegador ({{language}}) | Perfil de X (antes Twitter) | Perfil de GitHub |
| `et` | Kasuta brauseri seadet ({{language}}) | X-i (endise Twitteri) profiil | GitHubi profiil |
| `eu` | Erabili nabigatzailearen ezarpena ({{language}}) | X-ko profila (lehen Twitter) | GitHub-eko profila |
| `fi` | Käytä selaimen asetusta ({{language}}) | X-profiili (entinen Twitter) | GitHub-profiili |
| `fr` | Utiliser le réglage du navigateur ({{language}}) | Profil X (anciennement Twitter) | Profil GitHub |
| `gl` | Usar a configuración do navegador ({{language}}) | Perfil de X (antes Twitter) | Perfil de GitHub |
| `he` | שימוש בהגדרת הדפדפן ({{language}}) | פרופיל X (לשעבר Twitter) | פרופיל GitHub |
| `hi` | ब्राउज़र की सेटिंग का उपयोग करें ({{language}}) | X (पहले Twitter) प्रोफ़ाइल | GitHub प्रोफ़ाइल |
| `hr` | Koristi postavku preglednika ({{language}}) | X profil (bivši Twitter) | GitHub profil |
| `hu` | A böngésző beállításának használata ({{language}}) | X-profil (korábban Twitter) | GitHub-profil |
| `id` | Gunakan pengaturan browser ({{language}}) | Profil X (Sebelumnya Twitter) | Profil GitHub |
| `it` | Usa l’impostazione del browser ({{language}}) | Profilo X (in precedenza Twitter) | Profilo GitHub |
| `ja` | ブラウザの設定に従う（{{language}}） | X（旧 Twitter）のプロフィール | GitHub のプロフィール |
| `ko` | 브라우저 설정 사용({{language}}) | X(이전 Twitter) 프로필 | GitHub 프로필 |
| `lt` | Naudoti naršyklės nustatymą ({{language}}) | X (anksčiau „Twitter“) profilis | „GitHub“ profilis |
| `lv` | Izmantot pārlūkprogrammas iestatījumu ({{language}}) | X (agrāk Twitter) profils | GitHub profils |
| `ms` | Guna tetapan pelayar ({{language}}) | Profil X (Dahulunya Twitter) | Profil GitHub |
| `nb` | Bruk nettleserens innstilling ({{language}}) | X-profil (tidligere Twitter) | GitHub-profil |
| `nl` | Browserinstelling gebruiken ({{language}}) | X-profiel (voorheen Twitter) | GitHub-profiel |
| `pl` | Użyj ustawienia przeglądarki ({{language}}) | Profil w serwisie X (dawniej Twitter) | Profil w serwisie GitHub |
| `pt-BR` | Usar a configuração do navegador ({{language}}) | Perfil no X (antigo Twitter) | Perfil no GitHub |
| `pt-PT` | Utilizar a definição do navegador ({{language}}) | Perfil no X (antigo Twitter) | Perfil no GitHub |
| `ro` | Folosiți setarea browserului ({{language}}) | Profil X (fostul Twitter) | Profil GitHub |
| `ru` | Использовать настройку браузера ({{language}}) | Профиль в X (ранее Twitter) | Профиль на GitHub |
| `sk` | Použiť nastavenie prehliadača ({{language}}) | Profil na X (predtým Twitter) | Profil na GitHube |
| `sl` | Uporabi nastavitev brskalnika ({{language}}) | Profil X (prej Twitter) | Profil GitHub |
| `sr-Latn` | Koristi podešavanje pregledača ({{language}}) | X profil (ranije Twitter) | GitHub profil |
| `sv` | Använd webbläsarens inställning ({{language}}) | X-profil (tidigare Twitter) | GitHub-profil |
| `th` | ใช้การตั้งค่าของเบราว์เซอร์ ({{language}}) | โปรไฟล์ X (เดิมคือ Twitter) | โปรไฟล์ GitHub |
| `tr` | Tarayıcı ayarını kullan ({{language}}) | X (Eski Adıyla Twitter) Profili | GitHub Profili |
| `uk` | Використовувати налаштування браузера ({{language}}) | Профіль у X (раніше Twitter) | Профіль на GitHub |
| `vi` | Dùng cài đặt của trình duyệt ({{language}}) | Hồ sơ X (trước đây là Twitter) | Hồ sơ GitHub |
| `zh-Hans` | 使用浏览器设置（{{language}}） | X（原 Twitter）个人资料 | GitHub 个人资料 |
| `zh-Hant` | 使用瀏覽器設定（{{language}}） | X（前身為 Twitter）個人檔案 | GitHub 個人檔案 |

## The menu and the tabs

| Code | Home | Demo | About | Data | Map | Photo | General | Details | Raw Data |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ar` | الرئيسية | عرض توضيحي | حول | البيانات | الخريطة | الصورة | عام | التفاصيل | البيانات الأولية |
| `bg` | Начало | Демо | Информация | Данни | Карта | Снимка | Общи | Подробности | Сурови данни |
| `ca` | Inici | Demostració | Quant a | Dades | Mapa | Foto | General | Detalls | Dades en brut |
| `cs` | Domů | Ukázka | O aplikaci | Data | Mapa | Fotka | Obecné | Podrobnosti | Nezpracovaná data |
| `da` | Hjem | Demo | Om | Data | Kort | Foto | Generelt | Detaljer | Rådata |
| `de` | Start | Demo | Info | Daten | Karte | Foto | Allgemein | Details | Rohdaten |
| `el` | Αρχική | Επίδειξη | Πληροφορίες | Δεδομένα | Χάρτης | Φωτογραφία | Γενικά | Λεπτομέρειες | Ακατέργαστα δεδομένα |
| `en` | Home | Demo | About | Data | Map | Photo | General | Details | Raw Data |
| `es` | Inicio | Demo | Acerca de | Datos | Mapa | Foto | General | Detalles | Datos sin procesar |
| `et` | Avaleht | Demo | Teave | Andmed | Kaart | Foto | Üldine | Üksikasjad | Toorandmed |
| `eu` | Hasiera | Demoa | Honi buruz | Datuak | Mapa | Argazkia | Orokorra | Xehetasunak | Datu gordinak |
| `fi` | Etusivu | Demo | Tietoja | Tiedot | Kartta | Kuva | Yleiset | Lisätiedot | Raakadata |
| `fr` | Accueil | Démo | À propos | Données | Carte | Photo | Général | Détails | Données brutes |
| `gl` | Inicio | Demostración | Acerca de | Datos | Mapa | Foto | Xeral | Detalles | Datos en bruto |
| `he` | בית | הדגמה | אודות | נתונים | מפה | תמונה | כללי | פרטים | נתונים גולמיים |
| `hi` | होम | डेमो | परिचय | डेटा | मैप | फ़ोटो | सामान्य | विवरण | रॉ डेटा |
| `hr` | Početna | Demo | O aplikaciji | Podaci | Karta | Fotografija | Općenito | Detalji | Neobrađeni podaci |
| `hu` | Kezdőlap | Demó | Névjegy | Adatok | Térkép | Fénykép | Általános | Részletek | Nyers adatok |
| `id` | Beranda | Demo | Tentang | Data | Peta | Foto | Umum | Detail | Data Mentah |
| `it` | Home | Demo | Informazioni | Dati | Mappa | Foto | Generale | Dettagli | Dati grezzi |
| `ja` | ホーム | デモ | このアプリについて | データ | 地図 | 写真 | 全般 | 詳細 | 生データ |
| `ko` | 홈 | 데모 | 정보 | 데이터 | 지도 | 사진 | 일반 | 세부 정보 | 원시 데이터 |
| `lt` | Pradžia | Demonstracija | Apie | Duomenys | Žemėlapis | Nuotrauka | Bendra | Išsamiau | Neapdoroti duomenys |
| `lv` | Sākums | Demonstrācija | Par | Dati | Karte | Fotoattēls | Vispārīgi | Detalizēti | Neapstrādātie dati |
| `ms` | Laman Utama | Demo | Perihal | Data | Peta | Foto | Umum | Butiran | Data Mentah |
| `nb` | Hjem | Demo | Om | Data | Kart | Bilde | Generelt | Detaljer | Rådata |
| `nl` | Start | Demo | Over | Gegevens | Kaart | Foto | Algemeen | Details | Onbewerkte gegevens |
| `pl` | Strona główna | Demo | Informacje | Dane | Mapa | Zdjęcie | Ogólne | Szczegóły | Surowe dane |
| `pt-BR` | Início | Demo | Sobre | Dados | Mapa | Foto | Geral | Detalhes | Dados brutos |
| `pt-PT` | Início | Demonstração | Acerca | Dados | Mapa | Fotografia | Geral | Detalhes | Dados em bruto |
| `ro` | Acasă | Demo | Despre | Date | Hartă | Fotografie | General | Detalii | Date brute |
| `ru` | Главная | Демо | О приложении | Данные | Карта | Фото | Общие | Подробности | Исходные данные |
| `sk` | Domov | Ukážka | O aplikácii | Údaje | Mapa | Fotka | Všeobecné | Podrobnosti | Nespracované údaje |
| `sl` | Domov | Predstavitev | O aplikaciji | Podatki | Zemljevid | Fotografija | Splošno | Podrobnosti | Neobdelani podatki |
| `sr-Latn` | Početna | Demo | O aplikaciji | Podaci | Mapa | Fotografija | Opšte | Detalji | Neobrađeni podaci |
| `sv` | Hem | Demo | Om | Data | Karta | Bild | Allmänt | Detaljer | Rådata |
| `th` | หน้าแรก | สาธิต | เกี่ยวกับ | ข้อมูล | แผนที่ | รูปภาพ | ทั่วไป | รายละเอียด | ข้อมูลดิบ |
| `tr` | Ana Sayfa | Demo | Hakkında | Veriler | Harita | Fotoğraf | Genel | Ayrıntılar | Ham Veriler |
| `uk` | Головна | Демо | Про програму | Дані | Карта | Фото | Загальні | Докладно | Необроблені дані |
| `vi` | Trang chủ | Demo | Giới thiệu | Dữ liệu | Bản đồ | Ảnh | Chung | Chi tiết | Dữ liệu thô |
| `zh-Hans` | 主页 | 演示 | 关于 | 数据 | 地图 | 照片 | 常规 | 详细信息 | 原始数据 |
| `zh-Hant` | 首頁 | 示範 | 關於 | 資料 | 地圖 | 照片 | 一般 | 詳細資料 | 原始資料 |

## The table of a photo's data

| Code | Name | Value | File Name | File Size | Width x Height | Date Taken | Latitude | Longitude | Not Available |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ar` | الاسم | القيمة | اسم الملف | حجم الملف | العرض × الارتفاع | تاريخ الالتقاط | خط العرض | خط الطول | غير متوفر |
| `bg` | Име | Стойност | Име на файла | Размер на файла | Ширина × Височина | Дата на заснемане | Геогр. шир. | Геогр. дълж. | Не е налично |
| `ca` | Nom | Valor | Nom del fitxer | Mida del fitxer | Amplada × Alçada | Data de captura | Latitud | Longitud | No disponible |
| `cs` | Název | Hodnota | Název souboru | Velikost souboru | Šířka × Výška | Datum pořízení | Zeměp. šířka | Zeměp. délka | Není k dispozici |
| `da` | Navn | Værdi | Filnavn | Filstørrelse | Bredde × Højde | Optagelsesdato | Breddegrad | Længdegrad | Ikke tilgængelig |
| `de` | Name | Wert | Dateiname | Dateigröße | Breite × Höhe | Aufnahmedatum | Breitengrad | Längengrad | Nicht verfügbar |
| `el` | Όνομα | Τιμή | Όνομα αρχείου | Μέγεθος αρχείου | Πλάτος × Ύψος | Ημερομηνία λήψης | Γεωγρ. πλάτος | Γεωγρ. μήκος | Μη διαθέσιμο |
| `en` | Name | Value | File Name | File Size | Width x Height | Date Taken | Latitude | Longitude | Not Available |
| `es` | Nombre | Valor | Nombre de archivo | Tamaño de archivo | Ancho × Alto | Fecha de captura | Latitud | Longitud | No disponible |
| `et` | Nimi | Väärtus | Faili nimi | Faili suurus | Laius × Kõrgus | Pildistamise kuupäev | Laiuskraad | Pikkuskraad | Pole saadaval |
| `eu` | Izena | Balioa | Fitxategi-izena | Fitxategi-tamaina | Zabalera × Altuera | Ateratze-data | Latitudea | Longitudea | Ez dago erabilgarri |
| `fi` | Nimi | Arvo | Tiedostonimi | Tiedostokoko | Leveys × Korkeus | Kuvauspäivä | Leveysaste | Pituusaste | Ei saatavilla |
| `fr` | Nom | Valeur | Nom du fichier | Taille du fichier | Largeur × Hauteur | Date de prise de vue | Latitude | Longitude | Non disponible |
| `gl` | Nome | Valor | Nome do ficheiro | Tamaño do ficheiro | Largura × Altura | Data de captura | Latitude | Lonxitude | Non dispoñible |
| `he` | שם | ערך | שם הקובץ | גודל הקובץ | רוחב × גובה | תאריך הצילום | קו רוחב | קו אורך | לא זמין |
| `hi` | नाम | मान | फ़ाइल का नाम | फ़ाइल का आकार | चौड़ाई × ऊँचाई | लेने की तारीख | अक्षांश | देशांतर | उपलब्ध नहीं |
| `hr` | Naziv | Vrijednost | Naziv datoteke | Veličina datoteke | Širina × Visina | Datum snimanja | Zemlj. širina | Zemlj. dužina | Nije dostupno |
| `hu` | Név | Érték | Fájlnév | Fájlméret | Szélesség × Magasság | Készítés dátuma | Földr. szél. | Földr. hossz. | Nem érhető el |
| `id` | Nama | Nilai | Nama File | Ukuran File | Lebar × Tinggi | Tanggal Diambil | Lintang | Bujur | Tidak Tersedia |
| `it` | Nome | Valore | Nome file | Dimensione file | Larghezza × Altezza | Data di scatto | Latitudine | Longitudine | Non disponibile |
| `ja` | 名前 | 値 | ファイル名 | ファイルサイズ | 横幅 × 縦幅 | 撮影日時 | 緯度 | 経度 | なし |
| `ko` | 이름 | 값 | 파일 이름 | 파일 크기 | 너비 × 높이 | 촬영 날짜 | 위도 | 경도 | 사용할 수 없음 |
| `lt` | Pavadinimas | Reikšmė | Failo pavadinimas | Failo dydis | Plotis × Aukštis | Fotografavimo data | Platuma | Ilguma | Nėra |
| `lv` | Nosaukums | Vērtība | Faila nosaukums | Faila lielums | Platums × Augstums | Uzņemšanas datums | Ģeogr. platums | Ģeogr. garums | Nav pieejams |
| `ms` | Nama | Nilai | Nama Fail | Saiz Fail | Lebar × Tinggi | Tarikh Diambil | Latitud | Longitud | Tidak Tersedia |
| `nb` | Navn | Verdi | Filnavn | Filstørrelse | Bredde × Høyde | Opptaksdato | Breddegrad | Lengdegrad | Ikke tilgjengelig |
| `nl` | Naam | Waarde | Bestandsnaam | Bestandsgrootte | Breedte × Hoogte | Opnamedatum | Breedtegraad | Lengtegraad | Niet beschikbaar |
| `pl` | Nazwa | Wartość | Nazwa pliku | Rozmiar pliku | Szerokość × Wysokość | Data wykonania | Szer. geogr. | Dł. geogr. | Niedostępne |
| `pt-BR` | Nome | Valor | Nome do arquivo | Tamanho do arquivo | Largura × Altura | Data da captura | Latitude | Longitude | Não disponível |
| `pt-PT` | Nome | Valor | Nome do ficheiro | Tamanho do ficheiro | Largura × Altura | Data da captura | Latitude | Longitude | Não disponível |
| `ro` | Nume | Valoare | Nume fișier | Dimensiune fișier | Lățime × Înălțime | Data fotografierii | Latitudine | Longitudine | Indisponibil |
| `ru` | Название | Значение | Имя файла | Размер файла | Ширина × Высота | Дата съёмки | Широта | Долгота | Недоступно |
| `sk` | Názov | Hodnota | Názov súboru | Veľkosť súboru | Šírka × Výška | Dátum nasnímania | Zemep. šírka | Zemep. dĺžka | Nie je k dispozícii |
| `sl` | Ime | Vrednost | Ime datoteke | Velikost datoteke | Širina × Višina | Datum posnetka | Zem. širina | Zem. dolžina | Ni na voljo |
| `sr-Latn` | Naziv | Vrednost | Naziv datoteke | Veličina datoteke | Širina × Visina | Datum snimanja | Geogr. širina | Geogr. dužina | Nije dostupno |
| `sv` | Namn | Värde | Filnamn | Filstorlek | Bredd × Höjd | Fotodatum | Latitud | Longitud | Inte tillgängligt |
| `th` | ชื่อ | ค่า | ชื่อไฟล์ | ขนาดไฟล์ | กว้าง × สูง | วันที่ถ่าย | ละติจูด | ลองจิจูด | ไม่มี |
| `tr` | Ad | Değer | Dosya Adı | Dosya Boyutu | Genişlik × Yükseklik | Çekim Tarihi | Enlem | Boylam | Kullanılamıyor |
| `uk` | Назва | Значення | Ім’я файлу | Розмір файлу | Ширина × Висота | Дата зйомки | Широта | Довгота | Недоступно |
| `vi` | Tên | Giá trị | Tên tệp | Kích thước tệp | Rộng × Cao | Ngày chụp | Vĩ độ | Kinh độ | Không có |
| `zh-Hans` | 名称 | 值 | 文件名 | 文件大小 | 宽度 × 高度 | 拍摄日期 | 纬度 | 经度 | 不可用 |
| `zh-Hant` | 名稱 | 值 | 檔案名稱 | 檔案大小 | 寬度 × 高度 | 拍攝日期 | 緯度 | 經度 | 無法使用 |

## Words inside the sentences

The word for "application" and for "photo" in each language's sentences, in its dictionary form.

| Code | application | photo | Usage Data |
| --- | --- | --- | --- |
| `ar` | التطبيق | صورة | بيانات الاستخدام |
| `bg` | приложение | снимка | Данни за използването |
| `ca` | aplicació | foto | Dades d'ús |
| `cs` | aplikace | fotka | Data o používání |
| `da` | app | foto | Brugsdata |
| `de` | App | Foto | Nutzungsdaten |
| `el` | εφαρμογή | φωτογραφία | Δεδομένα χρήσης |
| `en` | application | photo | Usage Data |
| `es` | aplicación | foto | Datos de uso |
| `et` | rakendus | foto | Kasutusandmed |
| `eu` | aplikazio | argazki | Erabilera-datuak |
| `fi` | sovellus | kuva | Käyttötiedot |
| `fr` | application | photo | Données d’utilisation |
| `gl` | aplicación | foto | Datos de uso |
| `he` | יישום | תמונה | נתוני שימוש |
| `hi` | ऐप | फ़ोटो | उपयोग डेटा |
| `hr` | aplikacija | fotografija | Podaci o upotrebi |
| `hu` | alkalmazás | fénykép | Használati adatok |
| `id` | aplikasi | foto | Data Penggunaan |
| `it` | applicazione | foto | Dati di utilizzo |
| `ja` | アプリ | 写真 | 使用状況データ |
| `ko` | 앱 | 사진 | 사용 데이터 |
| `lt` | programa | nuotrauka | Naudojimo duomenys |
| `lv` | lietotne | fotoattēls | Lietošanas dati |
| `ms` | aplikasi | foto | Data Penggunaan |
| `nb` | app | bilde | Bruksdata |
| `nl` | app | foto | Gebruiksgegevens |
| `pl` | aplikacja | zdjęcie | Dane o użytkowaniu |
| `pt-BR` | aplicativo | foto | Dados de uso |
| `pt-PT` | aplicação | fotografia | Dados de utilização |
| `ro` | aplicație | fotografie | Date de utilizare |
| `ru` | приложение | фото | Данные об использовании |
| `sk` | aplikácia | fotka | Údaje o používaní |
| `sl` | aplikacija | fotografija | Podatki o uporabi |
| `sr-Latn` | aplikacija | fotografija | Podaci o korišćenju |
| `sv` | app | bild | Användningsdata |
| `th` | แอป | รูปภาพ | ข้อมูลการใช้งาน |
| `tr` | uygulama | fotoğraf | Kullanım Verileri |
| `uk` | програма | фото | Дані про використання |
| `vi` | ứng dụng | ảnh | Dữ liệu sử dụng |
| `zh-Hans` | 应用 | 照片 | 使用数据 |
| `zh-Hant` | 應用程式 | 照片 | 使用資料 |
