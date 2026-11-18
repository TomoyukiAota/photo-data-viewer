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

### After the merge

The change that the maintainer asked for after the merge
([the status](../STATUS.md#changed-after-the-merge)), on the branch
`claude/drop-dialog-focus-and-colors`, from `main` at `f3034cf`:

| Check | Result |
| --- | --- |
| `npm run test:all` | Passed: 748 tests in 53 suites |
| `npm run build` | Passed |
| `npm run build:plm` | Passed |
| The browser suite, in Chrome, with the visual comparison | Passed: 46 tests. The tests of a dropped photo made `drop-veil.png`, `drop-dialog.png` and `drop-dialog-ar.png` anew; no other screenshot changed |
| `npm run test:electron` | Not run: it opens windows |

The Japanese veil and dialog, of which no test takes a screenshot, were
looked at in Chrome at 320 and 1280 pixels.

Once the other 40 languages followed the English, the same checks passed
again: 748 unit tests, both builds and the 46 browser tests.
`drop-dialog-ar.png` was made anew for the Arabic question. In one run,
`drop-dialog.png` differed by 6 pixels, in how Roboto's letters were
smoothed all over the page; it matched in the three runs after, and was
kept. The texts that grew longest, in Russian, Lithuanian and German, were
looked at at 320 pixels.

## What the tests hold

Unit tests:

- `src/components/drop-photo/drop-photo.spec.ts`: a drag of files is told
  from one of text or a link; the files dropped are given in the browser's
  order without the folders; a drag over a dialog or a menu is told from
  one over the page.
- `src/components/drop-photo/DropPhoto.spec.tsx`, with the dialog: the veil
  while a file is dragged over the page, from one element to another, and
  gone once the file leaves the window or a mouse event comes; the copy
  that the pointer shows; the dialog that names the file, with Cancel
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

- A photo dropped on the Home page: the veil; the dialog, with Cancel
  focused and the colors of the two buttons; Cancel, Escape, and Enter on
  Cancel, which select nothing; Tab and Enter, which select the photo; a
  drag that starts in the page; and the events that reach the analytics
  backend (`Opened Drop Photo Dialog` five times with `fileCount: 1`, and
  `Loaded Photo` with `isDropped: true`).
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
| `drop-dialog.png` | The dialog that asks about `demo.jpg`, over the empty Home page, with Cancel focused and Select in blue |
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
| `ar` | أفلت الصورة لاختيارها. | هل تريد بالتأكيد اختيار الصورة أدناه؟ | إلغاء | اختيار |
| `bg` | Пуснете снимката, за да я изберете. | Наистина ли искате да изберете снимката по-долу? | Отказ | Избор |
| `ca` | Deixeu anar la foto per seleccionar-la. | Segur que voleu seleccionar la foto següent? | Cancel·la | Selecciona |
| `cs` | Pusťte fotku, chcete-li ji vybrat. | Opravdu chcete vybrat následující fotku? | Zrušit | Vybrat |
| `da` | Slip billedet for at vælge det. | Er du sikker på, at du vil vælge billedet nedenfor? | Annuller | Vælg |
| `de` | Legen Sie das Foto ab, um es auszuwählen. | Möchten Sie das folgende Foto wirklich auswählen? | Abbrechen | Auswählen |
| `el` | Αφήστε τη φωτογραφία για να την επιλέξετε. | Θέλετε σίγουρα να επιλέξετε την παρακάτω φωτογραφία; | Ακύρωση | Επιλογή |
| `en` | Drop the photo to select it. | Are you sure you want to select the photo below? | Cancel | Select |
| `es` | Suelta la foto para seleccionarla. | ¿Seguro que quieres seleccionar la foto siguiente? | Cancelar | Seleccionar |
| `et` | Valimiseks laske foto lahti. | Kas soovite kindlasti alloleva foto valida? | Loobu | Vali |
| `eu` | Jaregin argazkia hautatzeko. | Ziur beheko argazkia hautatu nahi duzula? | Utzi | Hautatu |
| `fi` | Pudota kuva valitaksesi sen. | Haluatko varmasti valita alla olevan kuvan? | Peruuta | Valitse |
| `fr` | Déposez la photo pour la sélectionner. | Voulez-vous vraiment sélectionner la photo ci-dessous\u00a0? | Annuler | Sélectionner |
| `gl` | Solta a foto para seleccionala. | Seguro que queres seleccionar a foto seguinte? | Cancelar | Seleccionar |
| `he` | יש לשחרר את התמונה כדי לבחור אותה. | לבחור את התמונה שלהלן? | ביטול | בחירה |
| `hi` | फ़ोटो चुनने के लिए उसे छोड़ें। | क्या आप वाकई नीचे दी गई फ़ोटो चुनना चाहते हैं? | रद्द करें | चुनें |
| `hr` | Ispustite fotografiju da biste je odabrali. | Jeste li sigurni da želite odabrati fotografiju u nastavku? | Odustani | Odaberi |
| `hu` | Engedje el a fotót a kiválasztásához. | Biztosan kiválasztja az alábbi fotót? | Mégsem | Kiválasztás |
| `id` | Lepaskan foto untuk memilihnya. | Apakah Anda yakin ingin memilih foto di bawah ini? | Batal | Pilih |
| `it` | Rilascia la foto per selezionarla. | Vuoi davvero selezionare la foto seguente? | Annulla | Seleziona |
| `ja` | ドロップして写真を選択できます。 | 以下の写真を選択してもよろしいですか？ | キャンセル | 選択 |
| `ko` | 사진을 선택하려면 놓으세요. | 아래 사진을 선택하시겠습니까? | 취소 | 선택 |
| `lt` | Numeskite nuotrauką, kad ją pasirinktumėte. | Ar tikrai norite pasirinkti toliau pateiktą nuotrauką? | Atšaukti | Pasirinkti |
| `lv` | Nometiet fotoattēlu, lai to atlasītu. | Vai tiešām vēlaties atlasīt tālāk norādīto fotoattēlu? | Atcelt | Atlasīt |
| `ms` | Lepaskan foto untuk memilihnya. | Adakah anda pasti mahu memilih foto di bawah? | Batal | Pilih |
| `nb` | Slipp bildet for å velge det. | Er du sikker på at du vil velge bildet nedenfor? | Avbryt | Velg |
| `nl` | Zet de foto neer om deze te selecteren. | Weet je zeker dat je de onderstaande foto wilt selecteren? | Annuleer | Selecteer |
| `pl` | Upuść zdjęcie, aby je wybrać. | Czy na pewno chcesz wybrać poniższe zdjęcie? | Anuluj | Wybierz |
| `pt-BR` | Solte a foto para selecioná-la. | Tem certeza de que deseja selecionar a foto abaixo? | Cancelar | Selecionar |
| `pt-PT` | Largue a fotografia para a selecionar. | Tem a certeza de que pretende selecionar a fotografia abaixo? | Cancelar | Selecionar |
| `ro` | Plasați poza pentru a o selecta. | Sigur doriți să selectați poza de mai jos? | Anulează | Selectează |
| `ru` | Отпустите фотографию, чтобы выбрать её. | Вы действительно хотите выбрать указанную ниже фотографию? | Отмена | Выбрать |
| `sk` | Pustite fotku, ak ju chcete vybrať. | Naozaj chcete vybrať nasledujúcu fotku? | Zrušiť | Vybrať |
| `sl` | Spustite fotografijo, da jo izberete. | Ali ste prepričani, da želite izbrati spodnjo fotografijo? | Prekliči | Izberi |
| `sr-Latn` | Otpustite fotografiju da biste je izabrali. | Da li ste sigurni da želite da izaberete fotografiju ispod? | Otkaži | Izaberi |
| `sv` | Släpp bilden för att välja den. | Vill du verkligen välja bilden nedan? | Avbryt | Välj |
| `th` | วางรูปภาพเพื่อเลือก | คุณแน่ใจหรือไม่ว่าต้องการเลือกรูปภาพด้านล่าง | ยกเลิก | เลือก |
| `tr` | Seçmek için fotoğrafı bırakın. | Aşağıdaki fotoğrafı seçmek istediğinizden emin misiniz? | Vazgeç | Seç |
| `uk` | Відпустіть фотографію, щоб вибрати її. | Ви справді хочете вибрати наведену нижче фотографію? | Скасувати | Вибрати |
| `vi` | Thả ảnh để chọn. | Bạn có chắc chắn muốn chọn ảnh bên dưới không? | Hủy | Chọn |
| `zh-Hans` | 拖放照片即可选择。 | 确定要选择以下照片吗？ | 取消 | 选择 |
| `zh-Hant` | 拖放照片即可選取。 | 確定要選取以下照片嗎？ | 取消 | 選取 |

Some choices in them:

- **The veil tells the user to let go of the file** (`Déposez`, `Upuść`,
  `Slipp`), without "here" since the merge. Russian, Ukrainian and
  Estonian said to drag it here, as their software's drop zones do, and say
  to let go of it now (`Отпустите`, `Відпустіть`, `laske lahti`); so does
  Hungarian (`Engedje el`), whose verb went with "here" (`Dobja ide`).
  Chinese says to drag and drop it (`拖放照片`).
- **"The photo below"** is written as the language's software writes the
  item that follows a sentence (`das folgende Foto`, `la photo ci-dessous`,
  `poniższe zdjęcie`, `以下照片`), since the merge.
- **Forms that name no gender**: Czech and Slovak say "if you want to
  select it" (`chcete-li ji vybrat`), as their past forms would name one;
  Greek and Italian ask "do you really want" (`Θέλετε σίγουρα`, `Vuoi
  davvero`) rather than "are you sure", whose adjective has a gender there.
  Hebrew asks without addressing anyone (`לבחור את התמונה שלהלן?`), as Photo
  Location Map's question to continue does.
- **English and Japanese are the maintainer's** since the merge (see
  [the status](../STATUS.md#changed-after-the-merge)). The Japanese veil's
  text was first `写真を選択するには、ここにドロップしてください。`, which
  left `ここに` alone on a line of a phone, and then
  `ここにドロップすると、この写真を選択します。`, in the form of the header's
  sentence; the question was `この写真を選択してもよろしいですか？`.
- **The other 40 translations follow the English** since the merge, as the
  maintainer asked. They were written first from "Drop the photo here to
  select it." and "Are you sure you want to select this photo?".
