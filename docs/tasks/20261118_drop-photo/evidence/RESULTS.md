# Dropping a photo: results

All on 2026-11-18, on macOS, with Node 26.13.0 and npm 11.20.0.

## Checks

| Check | Result |
| --- | --- |
| `npm run test:all` (lint, types, unit tests) | Passed: 680 tests in 43 suites |
| `npm run build` | Passed |
| `npm run build:plm` | Passed |
| The browser suite, in Chrome, with the visual comparison (`PDV_CHROME=1 PDV_VISUAL=1`) | Passed: 30 tests, twice; the first run wrote the three new screenshots |
| The tests of a dropped photo, in Playwright's Chromium and in Firefox | Passed |
| `npm run test:electron` | Not run: it opens windows |

## What the tests hold

Unit tests:

- `src/components/drop-photo/drop-photo.spec.ts`: a drag of files is told
  from one of text or a link; the files dropped are given in the browser's
  order without the folders; a drag over a dialog or a menu is told from
  one over the page.
- `src/components/drop-photo/DropPhoto.spec.tsx`, with the dialog: the veil
  while a file is dragged over the page, from one element to another, and
  gone once the file leaves the window or a mouse event comes; the copy
  that the pointer shows; the dialog that names the file, with Select
  focused; Select, Cancel, Escape and a click outside; the Home page opened
  first from another page; the first of several files, without folders;
  folders alone; text and links left to the browser; a drag that starts in
  the page left to it; a file refused over an open dialog, with the
  pointer's refusal; and nothing listened for in Photo Location Map.
- `src/context/photo/PhotoProvider.spec.tsx`: a dropped photo is recorded
  as dropped, also when it is loaded again after a setting changes, and one
  chosen with the button after it is not.
- `src/analytics/track-event.spec.ts`: `isDropped` in the two events of a
  photo, and `Opened Drop Photo Dialog` with `fileCount`.

Browser tests, in `tests/e2e/browser/regression.spec.mjs`:

- A photo dropped on the Home page: the veil, the dialog, Cancel, Escape,
  Enter, the photo shown, a drag that starts in the page, and the events
  that reach the analytics backend (`Opened Drop Photo Dialog` four times
  with `fileCount: 1`, and `Loaded Photo` with `isDropped: true`).
- A photo dropped on the Settings page is shown on the Home page; of two
  files, the first.
- A file that is not a photo gets the dialog of an unsupported file; a file
  dropped on that dialog is refused; text dragged is left to the browser.
- In Polish at 320 pixels: the veil's text and the dialog are whole, its
  three parts one under another with a space between them, and its two
  buttons whole.
- In Arabic at 320 pixels: the dialog laid out from the right, Cancel at
  the right, and the file's name in its own order.

Each rule was broken once, by hand, to see that its test fails: the drag
that starts in the page taken as one from outside, a dialog over the page
taken as the page, and a reload that does not keep `isDropped`. Each test
failed, and passed again with the rule back.

## Screenshots

Added, of what this change adds; no other screenshot changed:

| Screenshot | What it shows |
| --- | --- |
| `drop-veil.png` | The empty Home page at 1280 pixels, under the veil, while a file is dragged over it |
| `drop-dialog.png` | The dialog that asks about `demo.jpg`, over the empty Home page, with Select focused |
| `drop-dialog-ar.png` | The same dialog in Arabic, at 320 pixels |

The styles of the dialog of an unsupported file moved to
`src/components/dialog/_dialog.scss`, which the two dialogs share. The CSS
that Sass compiles from them differs only in where each part's grid area is
set and in the name of the last area, and `unsupported-dialog.png` is
unchanged.

## The texts

The four texts in every language. Cancel is `common.cancel` of Photo
Location Map's translations, as the words that the two applications share
are the same in both. Select is the verb of the language's `Select Photo`.
The question follows the form in which each language's software asks
"Are you sure you want to …?", in the register that its other texts in this
app have.

| Code | dropHere | title | cancel | select |
| --- | --- | --- | --- | --- |
| `ar` | أفلت الصورة هنا لاختيارها. | هل تريد بالتأكيد اختيار هذه الصورة؟ | إلغاء | اختيار |
| `bg` | Пуснете снимката тук, за да я изберете. | Наистина ли искате да изберете тази снимка? | Отказ | Избор |
| `ca` | Deixeu anar la foto aquí per seleccionar-la. | Segur que voleu seleccionar aquesta foto? | Cancel·la | Selecciona |
| `cs` | Pusťte fotku sem, chcete-li ji vybrat. | Opravdu chcete vybrat tuto fotku? | Zrušit | Vybrat |
| `da` | Slip billedet her for at vælge det. | Er du sikker på, at du vil vælge dette billede? | Annuller | Vælg |
| `de` | Legen Sie das Foto hier ab, um es auszuwählen. | Möchten Sie dieses Foto wirklich auswählen? | Abbrechen | Auswählen |
| `el` | Αφήστε τη φωτογραφία εδώ για να την επιλέξετε. | Θέλετε σίγουρα να επιλέξετε αυτήν τη φωτογραφία; | Ακύρωση | Επιλογή |
| `en` | Drop the photo here to select it. | Are you sure you want to select this photo? | Cancel | Select |
| `es` | Suelta la foto aquí para seleccionarla. | ¿Seguro que quieres seleccionar esta foto? | Cancelar | Seleccionar |
| `et` | Valimiseks lohistage foto siia. | Kas soovite kindlasti selle foto valida? | Loobu | Vali |
| `eu` | Jaregin argazkia hemen hautatzeko. | Ziur argazki hau hautatu nahi duzula? | Utzi | Hautatu |
| `fi` | Pudota kuva tähän valitaksesi sen. | Haluatko varmasti valita tämän kuvan? | Peruuta | Valitse |
| `fr` | Déposez la photo ici pour la sélectionner. | Voulez-vous vraiment sélectionner cette photo ? | Annuler | Sélectionner |
| `gl` | Solta a foto aquí para seleccionala. | Seguro que queres seleccionar esta foto? | Cancelar | Seleccionar |
| `he` | יש לשחרר את התמונה כאן כדי לבחור אותה. | לבחור את התמונה הזו? | ביטול | בחירה |
| `hi` | फ़ोटो चुनने के लिए उसे यहाँ छोड़ें। | क्या आप वाकई यह फ़ोटो चुनना चाहते हैं? | रद्द करें | चुनें |
| `hr` | Ispustite fotografiju ovdje da biste je odabrali. | Jeste li sigurni da želite odabrati ovu fotografiju? | Odustani | Odaberi |
| `hu` | Dobja ide a fotót a kiválasztásához. | Biztosan kiválasztja ezt a fotót? | Mégsem | Kiválasztás |
| `id` | Lepaskan foto di sini untuk memilihnya. | Apakah Anda yakin ingin memilih foto ini? | Batal | Pilih |
| `it` | Rilascia qui la foto per selezionarla. | Vuoi davvero selezionare questa foto? | Annulla | Seleziona |
| `ja` | ここにドロップすると、この写真を選択します。 | この写真を選択してもよろしいですか？ | キャンセル | 選択 |
| `ko` | 사진을 선택하려면 여기에 놓으세요. | 이 사진을 선택하시겠습니까? | 취소 | 선택 |
| `lt` | Numeskite nuotrauką čia, kad ją pasirinktumėte. | Ar tikrai norite pasirinkti šią nuotrauką? | Atšaukti | Pasirinkti |
| `lv` | Nometiet fotoattēlu šeit, lai to atlasītu. | Vai tiešām vēlaties atlasīt šo fotoattēlu? | Atcelt | Atlasīt |
| `ms` | Lepaskan foto di sini untuk memilihnya. | Adakah anda pasti mahu memilih foto ini? | Batal | Pilih |
| `nb` | Slipp bildet her for å velge det. | Er du sikker på at du vil velge dette bildet? | Avbryt | Velg |
| `nl` | Zet de foto hier neer om deze te selecteren. | Weet je zeker dat je deze foto wilt selecteren? | Annuleer | Selecteer |
| `pl` | Upuść zdjęcie tutaj, aby je wybrać. | Czy na pewno chcesz wybrać to zdjęcie? | Anuluj | Wybierz |
| `pt-BR` | Solte a foto aqui para selecioná-la. | Tem certeza de que deseja selecionar esta foto? | Cancelar | Selecionar |
| `pt-PT` | Largue a fotografia aqui para a selecionar. | Tem a certeza de que pretende selecionar esta fotografia? | Cancelar | Selecionar |
| `ro` | Plasați poza aici pentru a o selecta. | Sigur doriți să selectați această poză? | Anulează | Selectează |
| `ru` | Перетащите фотографию сюда, чтобы выбрать её. | Вы действительно хотите выбрать эту фотографию? | Отмена | Выбрать |
| `sk` | Pustite fotku sem, ak ju chcete vybrať. | Naozaj chcete vybrať túto fotku? | Zrušiť | Vybrať |
| `sl` | Spustite fotografijo sem, da jo izberete. | Ali ste prepričani, da želite izbrati to fotografijo? | Prekliči | Izberi |
| `sr-Latn` | Otpustite fotografiju ovde da biste je izabrali. | Da li ste sigurni da želite da izaberete ovu fotografiju? | Otkaži | Izaberi |
| `sv` | Släpp bilden här för att välja den. | Vill du verkligen välja den här bilden? | Avbryt | Välj |
| `th` | วางรูปภาพที่นี่เพื่อเลือก | คุณแน่ใจหรือไม่ว่าต้องการเลือกรูปภาพนี้ | ยกเลิก | เลือก |
| `tr` | Seçmek için fotoğrafı buraya bırakın. | Bu fotoğrafı seçmek istediğinizden emin misiniz? | Vazgeç | Seç |
| `uk` | Перетягніть фотографію сюди, щоб вибрати її. | Ви справді хочете вибрати цю фотографію? | Скасувати | Вибрати |
| `vi` | Thả ảnh vào đây để chọn. | Bạn có chắc chắn muốn chọn ảnh này không? | Hủy | Chọn |
| `zh-Hans` | 将照片拖放到此处进行选择。 | 确定要选择此照片吗？ | 取消 | 选择 |
| `zh-Hant` | 將照片拖放到這裡進行選取。 | 確定要選取這張照片嗎？ | 取消 | 選取 |

Some choices in them:

- **Where a language's software tells the user to let go of a file**, the
  veil says so (`Déposez`, `Upuść`, `Slipp`); Russian, Ukrainian, Estonian
  and Chinese say to drag it here, as their software's drop zones do.
- **Forms that name no gender**: Czech and Slovak say "if you want to
  select it" (`chcete-li ji vybrat`), as their past forms would name one;
  Greek and Italian ask "do you really want" (`Θέλετε σίγουρα`, `Vuoi
  davvero`) rather than "are you sure", whose adjective has a gender there.
  Hebrew asks without addressing anyone (`לבחור את התמונה הזו?`), as Photo
  Location Map's question to continue does.
- **Japanese**: the veil's sentence is in the form of the header's
  (`写真ファイルを選択すると、EXIF データを表示します。`). Its first wording,
  `写真を選択するには、ここにドロップしてください。`, left `ここに` alone on a
  line of a phone.
