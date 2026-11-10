# More languages: the words chosen

The 40 translations added on 2026-11-11 are machine translation. No speaker
has reviewed them, and no word was looked up in Microsoft's or Apple's
glossaries.

Photo Location Map got the same 42 languages at the same time, and its
translations are the glossary for both applications: for the words that the two
share, this app has Photo Location Map's word in each language, unless its own
is clearly the better one. Its Japanese was reviewed by the maintainer. This
file lists what was taken from there, what is kept different and why, and the
words in each language, so that a reviewer sees them at a glance.

The tables are made from `src/locales/*.json` as they were on 2026-11-11; the
files are what the app shows. A soft hyphen in a text is left out here.

## What was taken from Photo Location Map

320 texts in 40 languages were changed to its words.

- **The texts that are the same in English in both applications** are its
  texts, in every language: Settings, Close, Reload, the six texts of the date
  and time settings, Search, "No languages found", the sentence that welcomes
  translations, and the four texts of the two profile links. The exceptions are
  in the next section.
- **"Use browser setting"** is written as its "Use system setting" is, with the
  word for the browser.
- **A photo** is its word where the two differed: `billede` (`da`), `fotó`
  (`hu`), `poză` (`ro`), and the full word in `ru` and `uk`.
- **Location data** is its word where the two differed: `hi`, `ko`, `nb`, `pl`,
  `sv`, `uk`.
- **EXIF data** has its order of the two words in `bg`, `hr` and `sr-Latn`, and
  its noun in `da`, `nb` and `sv` (`EXIF-oplysninger`, `EXIF-informasjon`,
  `EXIF-information`).
- **Usage data** has its noun in `cs` (`údaje`) and `hr` (`korištenju`).
- **"This application"** is `此应用` and `此應用程式` in Chinese.
- **Google Maps** is the name that Google gives it in the language, in the 18
  languages where Photo Location Map writes it so (`Mapy Google`, `Google
  Карти`, `Google 지도`), in the case that "Show in" asks for. **Google Street
  View** has such a name in `ko`, `zh-Hans` and `zh-Hant`.
- **The form of a command**: the imperative in Dutch (`Sluit`, `Zoek`,
  `Selecteer foto`); the singular imperative in Romanian, with the sentences in
  the polite plural; the informal form in Galician; forms that address no one
  in particular in Hebrew.
- **Capitals** in Indonesian, Malay and Turkish: a capital on the first word
  alone, except for the main button of a page (`Pilih Foto`), as its Open
  Folder button is written, and for the tabs in Indonesian and Malay.

## Kept different from Photo Location Map

| What | Languages | This app | Photo Location Map | Why |
| --- | --- | --- | --- | --- |
| The label "12- or 24-hour" | `cs`, `da`, `nb`, `ro`, `th` | `12/24 hodin`, `12/24 timer`, `12/24 timer`, `12/24 de ore`, `12/24 ชั่วโมง` | `12 nebo 24 hodin`, `12 eller 24 timer`, `12 eller 24 timer`, `12 sau 24 de ore`, `12 หรือ 24 ชั่วโมง` | The label is cut in this app's field, by 1 to 11 pixels. |
| The two texts of the X profile | `ar` | `Twitter` | `تويتر` | A name stays as the English text writes it, which the check of the translation files holds every language to. |
| The sentence that welcomes translations | `fr` | A no-break space before the colon | An ordinary space | French has a no-break space there, so that the colon does not start a line. |
| Rotate | `fi` | `Kierrä kuvaa` | `Käännä miniatyyriä` | `Kierrä` is the word for turning a picture; `Käännä` is the one for flipping it. Not looked up. |
| Usage data, as a heading | `pl` | `Dane o użytkowaniu` | `dane o jej używaniu`, in a sentence | The usual word in a heading. |
| The verb for choosing a photo | `ar`, `hu`, `nb`, `pl`, `sv` | `اختيار`, `kiválasztása`, `Velg`, `Wybierz`, `Välj` | `تحديد`, `kijelölése`, `Marker`, `Zaznacz`, `Markera` | Not the same action: a file is chosen here, and photos are marked there. |
| Map | `ja` | `地図` | `マップ` | Both were reviewed by the maintainer, who is asked which one to keep. |

## Choices that hold for every language

- **Names are not translated**: Photo Data Viewer, Photo Location Map, EXIF,
  exifr, GitHub, GitHub Issues, iOS, X, Twitter. Google's products are written
  as Google names them in the language, with "Google" as it is.
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
  `de`, `ko`, `nb`, `ro`, `sk`, `sv`, `th`, `uk`, `zh-Hans`, `zh-Hant`. Photo
  Location Map has the same in seven of them.
- **Latitude and Longitude** are abbreviated where the full words do not fit on
  one line of the table's column on a phone, and where the plain word would be
  the one for width: `bg`, `cs`, `el`, `hr`, `hu`, `lv`, `pl`, `sk`, `sl`,
  `sr-Latn`.
- **The day of the week in a date** is written plainly, except in Korean,
  which has it in parentheses as Japanese does.
- **Quotation marks** around a button's or a page's name are those of the
  language. Lithuanian has them around a name as well (`„GitHub“`).
- **The register** is the one that software usually has in the language:
  polite forms in `de`, `fr`, `cs`, `ru` and most others, and the informal
  form in `es`, `it`, `nl`, `sv`, `da`, `nb`, `pl`, `fi` and `gl`.

## Words that this app alone has

The word chosen, and the one that was weighed against it.

| Word     | Chosen                                                                                                   | Weighed against it                                                     |
| -------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| About    | `de` Info, `nl` Over, `bg` Информация, `pl` Informacje, `hi` परिचय, `vi` Giới thiệu                       | `de` Über, `nl` Info, `bg` Относно, `pl` O aplikacji, `hi` इसके बारे में, `vi` Thông tin |
| Home     | `de` Start, `nl` Start, `fi` Etusivu, `it` Home                                                          | `de` Startseite, `nl` Home, `fi` Aloitus, `it` Inizio                  |

## Words that Photo Location Map has too

Photo Location Map's words, except where the section above says otherwise.

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
| `es` | Idioma | Ajustes | Buscar | No se encontraron idiomas | Cerrar | Recargar | Cargando... |
| `et` | Keel | Seaded | Otsi | Keeli ei leitud | Sulge | Laadi uuesti | Laadimine... |
| `eu` | Hizkuntza | Ezarpenak | Bilatu | Ez da hizkuntzarik aurkitu | Itxi | Birkargatu | Kargatzen... |
| `fi` | Kieli | Asetukset | Hae | Kieliä ei löytynyt | Sulje | Lataa uudelleen | Ladataan... |
| `fr` | Langue | Paramètres | Rechercher | Aucune langue trouvée | Fermer | Recharger | Chargement... |
| `gl` | Idioma | Configuración | Buscar | Non se atopou ningún idioma | Pechar | Recargar | Cargando... |
| `he` | שפה | הגדרות | חיפוש | לא נמצאו שפות | סגירה | טעינה מחדש | טוען... |
| `hi` | भाषा | सेटिंग | खोजें | कोई भाषा नहीं मिली | बंद करें | फिर से लोड करें | लोड हो रहा है... |
| `hr` | Jezik | Postavke | Pretraži | Nije pronađen nijedan jezik | Zatvori | Ponovno učitaj | Učitavanje... |
| `hu` | Nyelv | Beállítások | Keresés | Nem található nyelv | Bezárás | Újratöltés | Betöltés... |
| `id` | Bahasa | Pengaturan | Cari | Bahasa tidak ditemukan | Tutup | Muat ulang | Memuat... |
| `it` | Lingua | Impostazioni | Cerca | Nessuna lingua trovata | Chiudi | Ricarica | Caricamento... |
| `ja` | 言語 | 設定 | 検索 | 言語が見つかりません | 閉じる | 再読み込み | 読み込み中... |
| `ko` | 언어 | 설정 | 검색 | 언어를 찾을 수 없습니다 | 닫기 | 새로 고침 | 불러오는 중... |
| `lt` | Kalba | Nustatymai | Ieškoti | Kalbų nerasta | Uždaryti | Įkelti iš naujo | Įkeliama... |
| `lv` | Valoda | Iestatījumi | Meklēt | Nav atrasta neviena valoda | Aizvērt | Pārlādēt | Notiek ielāde... |
| `ms` | Bahasa | Tetapan | Cari | Tiada bahasa ditemui | Tutup | Muat semula | Memuatkan... |
| `nb` | Språk | Innstillinger | Søk | Fant ingen språk | Lukk | Last inn på nytt | Laster inn... |
| `nl` | Taal | Instellingen | Zoek | Geen talen gevonden | Sluit | Laad opnieuw | Laden... |
| `pl` | Język | Ustawienia | Szukaj | Nie znaleziono języków | Zamknij | Wczytaj ponownie | Wczytywanie... |
| `pt-BR` | Idioma | Configurações | Buscar | Nenhum idioma encontrado | Fechar | Recarregar | Carregando... |
| `pt-PT` | Idioma | Definições | Pesquisar | Nenhum idioma encontrado | Fechar | Recarregar | A carregar... |
| `ro` | Limbă | Setări | Caută | Nu s-a găsit nicio limbă | Închide | Reîncarcă | Se încarcă... |
| `ru` | Язык | Настройки | Поиск | Языки не найдены | Закрыть | Перезагрузить | Загрузка... |
| `sk` | Jazyk | Nastavenia | Hľadať | Nenašli sa žiadne jazyky | Zavrieť | Načítať znova | Načítava sa... |
| `sl` | Jezik | Nastavitve | Išči | Ni najdenih jezikov | Zapri | Znova naloži | Nalaganje... |
| `sr-Latn` | Jezik | Podešavanja | Pretraži | Nije pronađen nijedan jezik | Zatvori | Učitaj ponovo | Učitavanje... |
| `sv` | Språk | Inställningar | Sök | Inga språk hittades | Stäng | Läs in igen | Läser in... |
| `th` | ภาษา | การตั้งค่า | ค้นหา | ไม่พบภาษา | ปิด | โหลดใหม่ | กำลังโหลด... |
| `tr` | Dil | Ayarlar | Ara | Dil bulunamadı | Kapat | Yeniden yükle | Yükleniyor... |
| `uk` | Мова | Параметри | Пошук | Мов не знайдено | Закрити | Перезавантажити | Завантаження... |
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
| `et` | Kuupäeva ja kellaaja vorming | Kuupäeva vorming | 12 või 24 tundi | 12 tundi | 24 tundi | Näide |
| `eu` | Dataren eta orduaren formatua | Dataren formatua | 12 edo 24 ordu | 12 ordu | 24 ordu | Adibidea |
| `fi` | Päivämäärän ja ajan muoto | Päivämäärän muoto | 12 tai 24 tuntia | 12 tuntia | 24 tuntia | Esimerkki |
| `fr` | Format de la date et de l’heure | Format de la date | 12 ou 24 heures | 12 heures | 24 heures | Exemple |
| `gl` | Formato de data e hora | Formato de data | 12 ou 24 horas | 12 horas | 24 horas | Exemplo |
| `he` | תבנית תאריך ושעה | תבנית תאריך | 12 או 24 שעות | 12 שעות | 24 שעות | דוגמה |
| `hi` | तारीख और समय का फ़ॉर्मैट | तारीख का फ़ॉर्मैट | 12 या 24 घंटे | 12 घंटे | 24 घंटे | उदाहरण |
| `hr` | Format datuma i vremena | Format datuma | 12 ili 24 sata | 12 sati | 24 sata | Primjer |
| `hu` | Dátum- és időformátum | Dátumformátum | 12 vagy 24 órás | 12 órás | 24 órás | Példa |
| `id` | Format tanggal dan waktu | Format tanggal | 12 atau 24 jam | 12 jam | 24 jam | Contoh |
| `it` | Formato di data e ora | Formato della data | 12 o 24 ore | 12 ore | 24 ore | Esempio |
| `ja` | 日時の形式 | 日付の形式 | 12/24 時間制 | 12 時間制 | 24 時間制 | 例 |
| `ko` | 날짜 및 시간 형식 | 날짜 형식 | 12/24시간제 | 12시간제 | 24시간제 | 예 |
| `lt` | Datos ir laiko formatas | Datos formatas | 12 arba 24 val. | 12 valandų | 24 valandos | Pavyzdys |
| `lv` | Datuma un laika formāts | Datuma formāts | 12 vai 24 stundas | 12 stundas | 24 stundas | Piemērs |
| `ms` | Format tarikh dan masa | Format tarikh | 12 atau 24 jam | 12 jam | 24 jam | Contoh |
| `nb` | Dato- og tidsformat | Datoformat | 12/24 timer | 12 timer | 24 timer | Eksempel |
| `nl` | Datum- en tijdnotatie | Datumnotatie | 12 of 24 uur | 12 uur | 24 uur | Voorbeeld |
| `pl` | Format daty i czasu | Format daty | 12 lub 24 godziny | 12 godzin | 24 godziny | Przykład |
| `pt-BR` | Formato de data e hora | Formato da data | 12 ou 24 horas | 12 horas | 24 horas | Exemplo |
| `pt-PT` | Formato de data e hora | Formato da data | 12 ou 24 horas | 12 horas | 24 horas | Exemplo |
| `ro` | Formatul datei și al orei | Formatul datei | 12/24 de ore | 12 ore | 24 de ore | Exemplu |
| `ru` | Формат даты и времени | Формат даты | 12 или 24 часа | 12 часов | 24 часа | Пример |
| `sk` | Formát dátumu a času | Formát dátumu | 12/24 hodín | 12 hodín | 24 hodín | Príklad |
| `sl` | Oblika datuma in ure | Oblika datuma | 12 ali 24 ur | 12 ur | 24 ur | Primer |
| `sr-Latn` | Format datuma i vremena | Format datuma | 12 ili 24 sata | 12 sati | 24 sata | Primer |
| `sv` | Datum- och tidsformat | Datumformat | 12/24 timmar | 12 timmar | 24 timmar | Exempel |
| `th` | รูปแบบวันที่และเวลา | รูปแบบวันที่ | 12/24 ชั่วโมง | 12 ชั่วโมง | 24 ชั่วโมง | ตัวอย่าง |
| `tr` | Tarih ve saat biçimi | Tarih biçimi | 12 veya 24 saat | 12 saat | 24 saat | Örnek |
| `uk` | Формат дати й часу | Формат дати | 12/24 години | 12 годин | 24 години | Приклад |
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
| `cs` | Použít nastavení prohlížeče ({{language}}) | Profil na síti X (dříve Twitter) | Profil na GitHubu |
| `da` | Brug browserens indstilling ({{language}}) | Profil på X (tidligere Twitter) | GitHub-profil |
| `de` | Einstellung des Browsers verwenden ({{language}}) | Profil auf X (ehemals Twitter) | GitHub-Profil |
| `el` | Χρήση της ρύθμισης του προγράμματος περιήγησης ({{language}}) | Προφίλ στο X (πρώην Twitter) | Προφίλ στο GitHub |
| `en` | Use browser setting ({{language}}) | X (Formerly Twitter) Profile | GitHub Profile |
| `es` | Usar el ajuste del navegador ({{language}}) | Perfil de X (antes Twitter) | Perfil de GitHub |
| `et` | Kasuta brauseri seadet ({{language}}) | X-i (endine Twitter) profiil | GitHubi profiil |
| `eu` | Erabili nabigatzailearen ezarpena ({{language}}) | X-ko (lehen Twitter) profila | GitHub-eko profila |
| `fi` | Käytä selaimen asetusta ({{language}}) | X-profiili (aiemmin Twitter) | GitHub-profiili |
| `fr` | Utiliser le réglage du navigateur ({{language}}) | Profil X (anciennement Twitter) | Profil GitHub |
| `gl` | Usar a configuración do navegador ({{language}}) | Perfil de X (antes Twitter) | Perfil de GitHub |
| `he` | שימוש בהגדרת הדפדפן ({{language}}) | פרופיל X (לשעבר Twitter) | פרופיל GitHub |
| `hi` | ब्राउज़र की सेटिंग का उपयोग करें ({{language}}) | X (पहले Twitter) प्रोफ़ाइल | GitHub प्रोफ़ाइल |
| `hr` | Koristi postavku preglednika ({{language}}) | Profil na X-u (bivši Twitter) | Profil na GitHubu |
| `hu` | A böngésző beállításának használata ({{language}}) | X-profil (korábban Twitter) | GitHub-profil |
| `id` | Gunakan pengaturan browser ({{language}}) | Profil X (sebelumnya Twitter) | Profil GitHub |
| `it` | Usa l’impostazione del browser ({{language}}) | Profilo X (in precedenza Twitter) | Profilo GitHub |
| `ja` | ブラウザの設定に従う（{{language}}） | X（旧 Twitter）のプロフィール | GitHub のプロフィール |
| `ko` | 브라우저 설정 따르기 ({{language}}) | X(구 Twitter) 프로필 | GitHub 프로필 |
| `lt` | Naudoti naršyklės nustatymą ({{language}}) | „X“ (anksčiau „Twitter“) profilis | „GitHub“ profilis |
| `lv` | Izmantot pārlūkprogrammas iestatījumu ({{language}}) | X (iepriekš Twitter) profils | GitHub profils |
| `ms` | Guna tetapan pelayar ({{language}}) | Profil X (dahulunya Twitter) | Profil GitHub |
| `nb` | Bruk nettleserens innstilling ({{language}}) | Profil på X (tidligere Twitter) | GitHub-profil |
| `nl` | Gebruik de instelling van de browser ({{language}}) | Profiel op X (voorheen Twitter) | GitHub-profiel |
| `pl` | Użyj ustawienia przeglądarki ({{language}}) | Profil w serwisie X (dawniej Twitter) | Profil w serwisie GitHub |
| `pt-BR` | Usar o ajuste do navegador ({{language}}) | Perfil no X (antigo Twitter) | Perfil no GitHub |
| `pt-PT` | Usar a definição do navegador ({{language}}) | Perfil no X (antigo Twitter) | Perfil no GitHub |
| `ro` | Folosește setarea browserului ({{language}}) | Profil X (fostul Twitter) | Profil GitHub |
| `ru` | Использовать настройку браузера ({{language}}) | Профиль в X (ранее Twitter) | Профиль на GitHub |
| `sk` | Použiť nastavenie prehliadača ({{language}}) | Profil na sieti X (predtým Twitter) | Profil na GitHube |
| `sl` | Uporabi nastavitev brskalnika ({{language}}) | Profil v omrežju X (prej Twitter) | Profil v GitHubu |
| `sr-Latn` | Koristi podešavanje pregledača ({{language}}) | Profil na mreži X (ranije Twitter) | Profil na GitHub-u |
| `sv` | Använd webbläsarens inställning ({{language}}) | Profil på X (tidigare Twitter) | GitHub-profil |
| `th` | ใช้การตั้งค่าของเบราว์เซอร์ ({{language}}) | โปรไฟล์ X (เดิมคือ Twitter) | โปรไฟล์ GitHub |
| `tr` | Tarayıcı ayarını kullan ({{language}}) | X (eski adıyla Twitter) profili | GitHub profili |
| `uk` | Використовувати параметр браузера ({{language}}) | Профіль у X (раніше Twitter) | Профіль на GitHub |
| `vi` | Dùng cài đặt của trình duyệt ({{language}}) | Hồ sơ X (trước đây là Twitter) | Hồ sơ GitHub |
| `zh-Hans` | 跟随浏览器设置（{{language}}） | X（原 Twitter）个人资料 | GitHub 个人资料 |
| `zh-Hant` | 依照瀏覽器設定（{{language}}） | X（前身為 Twitter）個人檔案 | GitHub 個人檔案 |

## Google's products and location data

Photo Location Map has "Open Google Maps", "Open Google Street View" and "No photos with location data exist in the opened folder."

| Code | Show in Google Maps | Show in Google Street View | Location data (latitude and longitude) is not available. |
| --- | --- | --- | --- |
| `ar` | العرض في خرائط Google | العرض في Google Street View | بيانات الموقع (خط العرض وخط الطول) غير متوفرة. |
| `bg` | Показване в Google Карти | Показване в Google Street View | Няма данни за местоположение (географска ширина и дължина). |
| `ca` | Mostra a Google Maps | Mostra a Google Street View | Les dades d'ubicació (latitud i longitud) no estan disponibles. |
| `cs` | Zobrazit v Mapách Google | Zobrazit v Google Street View | Údaje o poloze (zeměpisná šířka a délka) nejsou k dispozici. |
| `da` | Vis i Google Maps | Vis i Google Street View | Lokalitetsdata (breddegrad og længdegrad) er ikke tilgængelige. |
| `de` | In Google Maps anzeigen | In Google Street View anzeigen | Standortdaten (Breiten- und Längengrad) sind nicht verfügbar. |
| `el` | Εμφάνιση στους Χάρτες Google | Εμφάνιση στο Google Street View | Τα δεδομένα τοποθεσίας (γεωγραφικό πλάτος και μήκος) δεν είναι διαθέσιμα. |
| `en` | Show in Google Maps | Show in Google Street View | Location data (latitude and longitude) is not available. |
| `es` | Mostrar en Google Maps | Mostrar en Google Street View | Los datos de ubicación (latitud y longitud) no están disponibles. |
| `et` | Kuva Google Mapsis | Kuva Google Street View's | Asukohaandmed (laius- ja pikkuskraad) pole saadaval. |
| `eu` | Erakutsi Google Maps-en | Erakutsi Google Street View-n | Kokapen-datuak (latitudea eta longitudea) ez daude erabilgarri. |
| `fi` | Näytä Google Mapsissa | Näytä Google Street View'ssa | Sijaintitiedot (leveys- ja pituusaste) eivät ole saatavilla. |
| `fr` | Afficher dans Google Maps | Afficher dans Google Street View | Les données de localisation (latitude et longitude) ne sont pas disponibles. |
| `gl` | Mostrar en Google Maps | Mostrar en Google Street View | Os datos de localización (latitude e lonxitude) non están dispoñibles. |
| `he` | הצגה במפות Google | הצגה ב-Google Street View | נתוני מיקום (קו רוחב וקו אורך) אינם זמינים. |
| `hi` | Google Maps में दिखाएँ | Google Street View में दिखाएँ | जगह की जानकारी (अक्षांश और देशांतर) उपलब्ध नहीं है। |
| `hr` | Prikaži u Google kartama | Prikaži u Google Street View | Podaci o lokaciji (zemljopisna širina i dužina) nisu dostupni. |
| `hu` | Megjelenítés a Google Térképben | Megjelenítés a Google Street View-ban | A helyadatok (földrajzi szélesség és hosszúság) nem érhetők el. |
| `id` | Tampilkan di Google Maps | Tampilkan di Google Street View | Data lokasi (lintang dan bujur) tidak tersedia. |
| `it` | Mostra in Google Maps | Mostra in Google Street View | I dati sulla posizione (latitudine e longitudine) non sono disponibili. |
| `ja` | Google マップで表示 | Google ストリートビューで表示 | 位置情報（緯度・経度）がありません。 |
| `ko` | Google 지도에서 보기 | Google 스트리트 뷰에서 보기 | 위치 정보(위도 및 경도)를 사용할 수 없습니다. |
| `lt` | Rodyti „Google Maps“ | Rodyti „Google Street View“ | Vietos duomenų (platumos ir ilgumos) nėra. |
| `lv` | Rādīt pakalpojumā Google Maps | Rādīt pakalpojumā Google Street View | Atrašanās vietas dati (ģeogrāfiskais platums un garums) nav pieejami. |
| `ms` | Tunjukkan dalam Google Maps | Tunjukkan dalam Google Street View | Data lokasi (latitud dan longitud) tidak tersedia. |
| `nb` | Vis i Google Maps | Vis i Google Street View | Stedsinformasjon (breddegrad og lengdegrad) er ikke tilgjengelig. |
| `nl` | Toon in Google Maps | Toon in Google Street View | Locatiegegevens (breedtegraad en lengtegraad) zijn niet beschikbaar. |
| `pl` | Pokaż w Mapach Google | Pokaż w Google Street View | Dane o położeniu (szerokość i długość geograficzna) są niedostępne. |
| `pt-BR` | Mostrar no Google Maps | Mostrar no Google Street View | Os dados de localização (latitude e longitude) não estão disponíveis. |
| `pt-PT` | Mostrar no Google Maps | Mostrar no Google Street View | Os dados de localização (latitude e longitude) não estão disponíveis. |
| `ro` | Afișează în Google Maps | Afișează în Google Street View | Datele de localizare (latitudine și longitudine) nu sunt disponibile. |
| `ru` | Показать в Google Картах | Показать в Google Street View | Данные о местоположении (широта и долгота) недоступны. |
| `sk` | Zobraziť v Mapách Google | Zobraziť v Google Street View | Údaje o polohe (zemepisná šírka a dĺžka) nie sú k dispozícii. |
| `sl` | Prikaži v Google Zemljevidih | Prikaži v Google Street View | Podatki o lokaciji (zemljepisna širina in dolžina) niso na voljo. |
| `sr-Latn` | Prikaži u Google mapama | Prikaži u Google Street View | Podaci o lokaciji (geografska širina i dužina) nisu dostupni. |
| `sv` | Visa i Google Maps | Visa i Google Street View | Platsinformation (latitud och longitud) är inte tillgänglig. |
| `th` | แสดงใน Google Maps | แสดงใน Google Street View | ไม่มีข้อมูลตำแหน่ง (ละติจูดและลองจิจูด) |
| `tr` | Google Haritalar'da göster | Google Street View'da göster | Konum verileri (enlem ve boylam) kullanılamıyor. |
| `uk` | Показати в Google Картах | Показати в Google Street View | Дані про місцезнаходження (широта й довгота) недоступні. |
| `vi` | Hiển thị trong Google Maps | Hiển thị trong Google Street View | Không có dữ liệu vị trí (vĩ độ và kinh độ). |
| `zh-Hans` | 在 Google 地图中显示 | 在 Google 街景中显示 | 位置数据（纬度和经度）不可用。 |
| `zh-Hant` | 在 Google 地圖中顯示 | 在 Google 街景服務中顯示 | 無法取得位置資料（緯度和經度）。 |

## The menu and the tabs

| Code | Home | Demo | About | Data | Map | Photo | General | Details | Raw Data |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ar` | الرئيسية | عرض توضيحي | حول | البيانات | الخريطة | الصورة | عام | التفاصيل | البيانات الأولية |
| `bg` | Начало | Демо | Информация | Данни | Карта | Снимка | Общи | Подробности | Сурови данни |
| `ca` | Inici | Demostració | Quant a | Dades | Mapa | Foto | General | Detalls | Dades en brut |
| `cs` | Domů | Ukázka | O aplikaci | Data | Mapa | Fotka | Obecné | Podrobnosti | Nezpracovaná data |
| `da` | Hjem | Demo | Om | Data | Kort | Billede | Generelt | Detaljer | Rådata |
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
| `hu` | Kezdőlap | Demó | Névjegy | Adatok | Térkép | Fotó | Általános | Részletek | Nyers adatok |
| `id` | Beranda | Demo | Tentang | Data | Peta | Foto | Umum | Detail | Data Mentah |
| `it` | Home | Demo | Informazioni | Dati | Mappa | Foto | Generale | Dettagli | Dati grezzi |
| `ja` | ホーム | デモ | このアプリについて | データ | 地図 | 写真 | 全般 | 詳細 | 生データ |
| `ko` | 홈 | 데모 | 정보 | 데이터 | 지도 | 사진 | 일반 | 세부 정보 | 원시 데이터 |
| `lt` | Pradžia | Demonstracija | Apie | Duomenys | Žemėlapis | Nuotrauka | Bendra | Išsamiau | Neapdoroti duomenys |
| `lv` | Sākums | Demonstrācija | Par | Dati | Karte | Fotoattēls | Vispārīgi | Detalizēti | Neapstrādātie dati |
| `ms` | Laman utama | Demo | Perihal | Data | Peta | Foto | Umum | Butiran | Data Mentah |
| `nb` | Hjem | Demo | Om | Data | Kart | Bilde | Generelt | Detaljer | Rådata |
| `nl` | Start | Demo | Over | Gegevens | Kaart | Foto | Algemeen | Details | Onbewerkte gegevens |
| `pl` | Strona główna | Demo | Informacje | Dane | Mapa | Zdjęcie | Ogólne | Szczegóły | Surowe dane |
| `pt-BR` | Início | Demo | Sobre | Dados | Mapa | Foto | Geral | Detalhes | Dados brutos |
| `pt-PT` | Início | Demonstração | Acerca | Dados | Mapa | Fotografia | Geral | Detalhes | Dados em bruto |
| `ro` | Acasă | Demo | Despre | Date | Hartă | Poză | General | Detalii | Date brute |
| `ru` | Главная | Демо | О приложении | Данные | Карта | Фотография | Общие | Подробности | Исходные данные |
| `sk` | Domov | Ukážka | O aplikácii | Údaje | Mapa | Fotka | Všeobecné | Podrobnosti | Nespracované údaje |
| `sl` | Domov | Predstavitev | O aplikaciji | Podatki | Zemljevid | Fotografija | Splošno | Podrobnosti | Neobdelani podatki |
| `sr-Latn` | Početna | Demo | O aplikaciji | Podaci | Mapa | Fotografija | Opšte | Detalji | Neobrađeni podaci |
| `sv` | Hem | Demo | Om | Data | Karta | Bild | Allmänt | Detaljer | Rådata |
| `th` | หน้าแรก | สาธิต | เกี่ยวกับ | ข้อมูล | แผนที่ | รูปภาพ | ทั่วไป | รายละเอียด | ข้อมูลดิบ |
| `tr` | Ana sayfa | Demo | Hakkında | Veriler | Harita | Fotoğraf | Genel | Ayrıntılar | Ham veriler |
| `uk` | Головна | Демо | Про програму | Дані | Карта | Фотографія | Загальні | Докладно | Необроблені дані |
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
| `id` | Nama | Nilai | Nama file | Ukuran file | Lebar × Tinggi | Tanggal diambil | Lintang | Bujur | Tidak tersedia |
| `it` | Nome | Valore | Nome file | Dimensione file | Larghezza × Altezza | Data di scatto | Latitudine | Longitudine | Non disponibile |
| `ja` | 名前 | 値 | ファイル名 | ファイルサイズ | 横幅 × 縦幅 | 撮影日時 | 緯度 | 経度 | なし |
| `ko` | 이름 | 값 | 파일 이름 | 파일 크기 | 너비 × 높이 | 촬영 날짜 | 위도 | 경도 | 사용할 수 없음 |
| `lt` | Pavadinimas | Reikšmė | Failo pavadinimas | Failo dydis | Plotis × Aukštis | Fotografavimo data | Platuma | Ilguma | Nėra |
| `lv` | Nosaukums | Vērtība | Faila nosaukums | Faila lielums | Platums × Augstums | Uzņemšanas datums | Ģeogr. platums | Ģeogr. garums | Nav pieejams |
| `ms` | Nama | Nilai | Nama fail | Saiz fail | Lebar × Tinggi | Tarikh diambil | Latitud | Longitud | Tidak tersedia |
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
| `tr` | Ad | Değer | Dosya adı | Dosya boyutu | Genişlik × Yükseklik | Çekim tarihi | Enlem | Boylam | Kullanılamıyor |
| `uk` | Назва | Значення | Ім’я файлу | Розмір файлу | Ширина × Висота | Дата зйомки | Широта | Довгота | Недоступно |
| `vi` | Tên | Giá trị | Tên tệp | Kích thước tệp | Rộng × Cao | Ngày chụp | Vĩ độ | Kinh độ | Không có |
| `zh-Hans` | 名称 | 值 | 文件名 | 文件大小 | 宽度 × 高度 | 拍摄日期 | 纬度 | 经度 | 不可用 |
| `zh-Hant` | 名稱 | 值 | 檔案名稱 | 檔案大小 | 寬度 × 高度 | 拍攝日期 | 緯度 | 經度 | 無法使用 |

## Words inside the sentences

The word for "application" and for "photo" in each language's sentences, in its dictionary form.

| Code | application | photo | Usage Data | EXIF data is not available. |
| --- | --- | --- | --- | --- |
| `ar` | التطبيق | صورة | بيانات الاستخدام | بيانات EXIF غير متوفرة. |
| `bg` | приложение | снимка | Данни за използването | Няма данни EXIF. |
| `ca` | aplicació | foto | Dades d'ús | Les dades EXIF no estan disponibles. |
| `cs` | aplikace | fotka | Údaje o používání | Data EXIF nejsou k dispozici. |
| `da` | app | billede | Brugsdata | EXIF-oplysninger er ikke tilgængelige. |
| `de` | App | Foto | Nutzungsdaten | EXIF-Daten sind nicht verfügbar. |
| `el` | εφαρμογή | φωτογραφία | Δεδομένα χρήσης | Τα δεδομένα EXIF δεν είναι διαθέσιμα. |
| `en` | application | photo | Usage Data | EXIF data is not available. |
| `es` | aplicación | foto | Datos de uso | Los datos EXIF no están disponibles. |
| `et` | rakendus | foto | Kasutusandmed | EXIF-andmed pole saadaval. |
| `eu` | aplikazio | argazki | Erabilera-datuak | EXIF datuak ez daude erabilgarri. |
| `fi` | sovellus | kuva | Käyttötiedot | EXIF-tietoja ei ole saatavilla. |
| `fr` | application | photo | Données d’utilisation | Les données EXIF ne sont pas disponibles. |
| `gl` | aplicación | foto | Datos de uso | Os datos EXIF non están dispoñibles. |
| `he` | יישום | תמונה | נתוני שימוש | נתוני EXIF אינם זמינים. |
| `hi` | ऐप | फ़ोटो | उपयोग डेटा | EXIF डेटा उपलब्ध नहीं है। |
| `hr` | aplikacija | fotografija | Podaci o korištenju | Podaci EXIF nisu dostupni. |
| `hu` | alkalmazás | fotó | Használati adatok | Az EXIF-adatok nem érhetők el. |
| `id` | aplikasi | foto | Data penggunaan | Data EXIF tidak tersedia. |
| `it` | applicazione | foto | Dati di utilizzo | I dati EXIF non sono disponibili. |
| `ja` | アプリ | 写真 | 使用状況データ | EXIF データがありません。 |
| `ko` | 앱 | 사진 | 사용 데이터 | EXIF 데이터를 사용할 수 없습니다. |
| `lt` | programa | nuotrauka | Naudojimo duomenys | EXIF duomenų nėra. |
| `lv` | lietotne | fotoattēls | Lietošanas dati | EXIF dati nav pieejami. |
| `ms` | aplikasi | foto | Data penggunaan | Data EXIF tidak tersedia. |
| `nb` | app | bilde | Bruksdata | EXIF-informasjon er ikke tilgjengelig. |
| `nl` | app | foto | Gebruiksgegevens | EXIF-gegevens zijn niet beschikbaar. |
| `pl` | aplikacja | zdjęcie | Dane o użytkowaniu | Dane EXIF są niedostępne. |
| `pt-BR` | aplicativo | foto | Dados de uso | Os dados EXIF não estão disponíveis. |
| `pt-PT` | aplicação | fotografia | Dados de utilização | Os dados EXIF não estão disponíveis. |
| `ro` | aplicație | poză | Date de utilizare | Datele EXIF nu sunt disponibile. |
| `ru` | приложение | фотография | Данные об использовании | Данные EXIF недоступны. |
| `sk` | aplikácia | fotka | Údaje o používaní | Údaje EXIF nie sú k dispozícii. |
| `sl` | aplikacija | fotografija | Podatki o uporabi | Podatki EXIF niso na voljo. |
| `sr-Latn` | aplikacija | fotografija | Podaci o korišćenju | Podaci EXIF nisu dostupni. |
| `sv` | app | bild | Användningsdata | EXIF-information är inte tillgänglig. |
| `th` | แอป | รูปภาพ | ข้อมูลการใช้งาน | ไม่มีข้อมูล EXIF |
| `tr` | uygulama | fotoğraf | Kullanım verileri | EXIF verileri kullanılamıyor. |
| `uk` | програма | фотографія | Дані про використання | Дані EXIF недоступні. |
| `vi` | ứng dụng | ảnh | Dữ liệu sử dụng | Không có dữ liệu EXIF. |
| `zh-Hans` | 应用 | 照片 | 使用情况数据 | EXIF 数据不可用。 |
| `zh-Hant` | 應用程式 | 照片 | 使用情況資料 | 無法取得 EXIF 資料。 |
