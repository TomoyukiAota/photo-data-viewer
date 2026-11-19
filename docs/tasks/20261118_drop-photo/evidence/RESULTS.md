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

### The button about drag and drop

The button that the maintainer asked for on 2026-11-19
([the status](../STATUS.md#the-button-about-drag-and-drop)), on the branch
`claude/drop-hint-button`, from `main` at `9bfe790`:

| Check | Result |
| --- | --- |
| `npm run test:all` | Passed: 765 tests in 55 suites |
| `npm run build` | Passed |
| `npm run build:plm` | Passed |
| The browser suite, in Chrome, with the visual comparison | Passed: 51 tests, after 21 screenshots of the Home page were made anew with the button, and `drop-hint.png` was added. Each changed screenshot differs from the one before by the button alone (130 pixels), or, in English at 320 pixels, by the line that it takes under Select Photo |
| `npm run test:electron` | Not run: it opens windows |

The button and its box were looked at in Chrome in English and Japanese at
1280 pixels, in Arabic at 600, and in Polish and Japanese at 320.

### The space beside Select Photo

The space that the maintainer asked for on 2026-11-19
([the status](../STATUS.md#the-space-beside-select-photo)), on the branch
`claude/select-photo-gap-3b8882`, made from `main` at `f46d7b3` and moved
onto `main` at `6ce54e7`, which changed the Language page, before it was
pushed. The checks are on the latter:

| Check | Result |
| --- | --- |
| `npm run test:all` | Passed: 785 tests in 56 suites |
| `npm run build` | Passed |
| `npm run build:plm` | Passed |
| The browser suite, in Chrome, with the visual comparison | Passed: 53 tests, the new one among them, after the 23 screenshots below were made anew |
| `npm run test:electron` | Not run: it opens windows |

**The margin that was not applied.** In the production build of `main`, the
"i" had a `margin-inline-start` of 0. Its class's rule,
`.DropHintButton_button__… { margin-inline-start: 4px }`, was in a
stylesheet of `/_next/static/css/` that comes before the
`<style data-emotion="css">` in which MUI puts
`.css-… { margin: 0; vertical-align: middle }` for a button, and both are a
single class. Building with 8 pixels there changed nothing: the
screenshots of the Home page were the same. From Select Photo's border to
the "i"'s circle, the reference screenshots and the maintainer's
screenshot of the site have about 7 pixels.

**The space now**, measured in Chrome in the production build:

| | Before | After |
| --- | --- | --- |
| Between the two buttons' boxes, on one line | 0 | 8 |
| From Select Photo's border to the circle, on one line | 6.7 | 14.7 |
| From where the line starts to the circle, on the next line | 6.7 | 6.7 |

**At 320 pixels, in the 42 languages.** The "i" takes 30 pixels, and 38
with the space before it. Where Select Photo leaves less, the "i" is on the
next line. These are the eight languages whose Select Photo leaves the
least room; in the others it leaves more than 42.6 pixels:

| Code | Select Photo | Room beside it | The "i" before | The "i" now |
| --- | --- | --- | --- | --- |
| `fr` | 185.5 | 14.5 | Next line | Next line |
| `el` | 184.5 | 15.5 | Next line | Next line |
| `ru` | 184.0 | 16.0 | Next line | Next line |
| `uk` | 176.6 | 23.4 | Next line | Next line |
| `pt-PT` | 171.6 | 28.4 | Next line | Next line |
| `lt` | 165.6 | 34.4 | Beside it | Next line |
| `ca` | 163.5 | 36.5 | Beside it | Next line |
| `hr` | 157.4 | 42.6 | Beside it | Beside it |

On the next line, the "i"'s box starts where the line starts in all seven,
and its middle is 33.3 pixels under Select Photo's, as before. Beside it,
the two are 8 pixels apart in the other 35, at the left in Hebrew and
Arabic, with their middles at one height. No page is wider than the
window. Arabic, put on the next line in a window 240 pixels wide, starts
the "i" at the right, where its line starts.

**The flex box moves nothing else.** Before the gap was set, the flex box
was tried with no gap, in English at 1280 and 320 pixels, in Japanese,
Arabic, Polish, French and Hindi at 320, and in Thai at 1280: the header,
the sentence, Select Photo and the "i" were where they had been, to a
hundredth of a pixel. A margin at the end of Select Photo, which a line's
end hides too, would have done the same without the box; like a margin of
the "i", it would have had to be set in MUI's own styles (`sx`) to be
applied. Where the "i" is not shown, on a phone and in Photo Location Map,
the box holds Select Photo alone, which is where it was: on a touch phone,
in English, Japanese, Arabic, Polish and French, the header, the sentence
and Select Photo were where they are without the box.

**The tests fail when the space is wrong.** With styles put in the page by
a copy of the two checks, not kept: without the gap, as before this change,
the check of the 8 pixels failed (0); with the space as a margin of the "i"
in place of the gap, the check of the next line failed (the "i" 8 pixels in
from where Select Photo starts). Each passed with the other change.

**Screenshots.** Made anew with `--update-snapshots=all`, and each compared
by pixel with the one before and looked at. 22 differ in the 228 pixels
where the "i" was and is, 8 pixels further from Select Photo, and nowhere
else: `home-1280`, `home-1201`, `home-1200`, `home-1199`, `home-600`,
`home-320`, `loaded-general`, `loaded-details`, `loaded-raw`,
`empty-details`, `heif-general`, `layout-menu`, `narrow-loaded`,
`narrow-photo`, `narrow-split-panes`, `narrow-loaded-ja`,
`narrow-loaded-ar`, `loaded-general-ar`, `drop-dialog`, `drop-dialog-ar`,
`drop-veil` and `unsupported-dialog`. `drop-hint.png` differs where the "i"
and the box that hangs from it were and are. Every other screenshot is
the same, byte for byte.

### The Japanese word for drag and drop

The change of the Japanese texts that the maintainer asked for on
2026-11-19 ([the status](../STATUS.md#the-japanese-word-for-drag-and-drop)),
on the branch `claude/ja-drag-drop-ampersand`, from `main` at `bafeb7f`:

| Check | Result |
| --- | --- |
| `npm run test:all` | Passed: 785 tests in 56 suites |
| `npm run build` | Passed |
| `npm run build:plm` | Passed |
| The browser suite, in Chrome, with the visual comparison | Passed: 55 tests, the two new ones among them. No screenshot changed |
| `npm run test:electron` | Not run: it opens windows |

**The sentence in the box**, in Chrome at 1280 pixels, as on Windows and on
a Mac, in lines read from the page by the top of each letter's box:

| Text | Windows | A Mac |
| --- | --- | --- |
| Before, on `main` | エクスプローラーからファイルを / ドラッグアンドドロップして / 選択することもできます。 | Finder からファイルを / ドラッグアンドドロップして / 選択することもできます。 |
| `＆` alone | エクスプローラーからファイルをドラッグ / ＆ドロップして選択することもできます。 | Finder からファイルをドラッグ＆ / ドロップして選択することもできます。 |
| `＆` with a word joiner on each side | エクスプローラーからファイルを / ドラッグ＆ドロップして / 選択することもできます。 | Finder からファイルをドラッグ＆ドロップして / 選択することもできます。 |

The new test failed on both systems with `＆` alone, the word's letters on
two lines, and passed with the joiners. The locale check, which takes a
word joiner for a character that is not drawn
(`src/locales/locales.spec.ts`), passed with the joiners written `\u2060`.

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

## The names of the file managers

The box of the button about drag and drop names the Finder on a Mac and File
Explorer elsewhere. The Finder's name is the one of a page of Apple's Mac User
Guide (`support.apple.com/<language>/guide/mac-help/hlpgl1004/mac`), looked at in
Chinese (Simplified and Traditional), Arabic, Korean, Thai, Russian,
Ukrainian, Greek, Hebrew and Hindi: only Chinese (Simplified) and Arabic
write another name. File Explorer's is the one of Microsoft's page "File
Explorer in Windows" in the language, whose German page says `Explorer`,
and `Datei-Explorer` in its text; its Dutch page `Bestandenverkenner`, and
`Verkenner` in places.

| Code | Finder | File Explorer | Where File Explorer's name is from |
| --- | --- | --- | --- |
| `ar` | فايندر | مستكشف الملفات | Microsoft's page |
| `bg` | Finder | Файлов мениджър | Microsoft's page |
| `ca` | Finder | Explorador de fitxers | No page in the language |
| `cs` | Finder | Průzkumník souborů | Microsoft's page |
| `da` | Finder | Stifinder | Microsoft's page |
| `de` | Finder | Explorer | Microsoft's page |
| `el` | Finder | Εξερεύνηση αρχείων | Microsoft's page |
| `en` | Finder | File Explorer | Microsoft's page |
| `es` | Finder | Explorador de archivos | Microsoft's page |
| `et` | Finder | File Explorer | Microsoft's page |
| `eu` | Finder | File Explorer | No page in the language |
| `fi` | Finder | Resurssienhallinta | Microsoft's page |
| `fr` | Finder | Explorateur de fichiers | Microsoft's page |
| `gl` | Finder | Explorador de ficheiros | No page in the language |
| `he` | Finder | סייר הקבצים | Microsoft's page |
| `hi` | Finder | फ़ाइल एक्सप्लोरर | No page in the language |
| `hr` | Finder | Eksplorer za datoteke | Microsoft's page |
| `hu` | Finder | Fájlkezelő | Microsoft's page |
| `id` | Finder | File Explorer | Microsoft's page |
| `it` | Finder | Esplora file | Microsoft's page |
| `ja` | Finder | エクスプローラー | Microsoft's page |
| `ko` | Finder | 파일 탐색기 | Microsoft's page |
| `lt` | Finder | Failų naršyklė | Microsoft's page |
| `lv` | Finder | Failu pārlūks | Microsoft's page |
| `ms` | Finder | File Explorer | No page in the language |
| `nb` | Finder | Filutforsker | Microsoft's page |
| `nl` | Finder | Bestandenverkenner | Microsoft's page |
| `pl` | Finder | Eksplorator plików | Microsoft's page |
| `pt-BR` | Finder | Explorador de Arquivos | Microsoft's page |
| `pt-PT` | Finder | Explorador de Ficheiros | Microsoft's page |
| `ro` | Finder | Explorer | Microsoft's page |
| `ru` | Finder | Проводник | Microsoft's page |
| `sk` | Finder | Prieskumník | Microsoft's page |
| `sl` | Finder | Raziskovalec | Microsoft's page |
| `sr-Latn` | Finder | Istraživač datoteka | Microsoft's page |
| `sv` | Finder | Utforskaren | Microsoft's page |
| `th` | Finder | File Explorer | Microsoft's page |
| `tr` | Finder | Dosya Gezgini | Microsoft's page |
| `uk` | Finder | Файловий провідник | Microsoft's page |
| `vi` | Finder | File Explorer | Microsoft's page |
| `zh-Hans` | 访达 | 文件资源管理器 | Microsoft's page |
| `zh-Hant` | Finder | 檔案總管 | Microsoft's page |

### The texts of the button about drag and drop

| Code | hintButton | hintFinder | hintFileExplorer |
| --- | --- | --- | --- |
| `ar` | حول السحب والإفلات | يمكنك أيضًا سحب ملف من فايندر وإفلاته لاختياره. | يمكنك أيضًا سحب ملف من مستكشف الملفات وإفلاته لاختياره. |
| `bg` | За плъзгането и пускането | Можете също да изберете файл, като го плъзнете и пуснете от Finder. | Можете също да изберете файл, като го плъзнете и пуснете от Файловия мениджър. |
| `ca` | Quant a arrossegar i deixar anar | També podeu seleccionar un fitxer arrossegant-lo i deixant-lo anar des del Finder. | També podeu seleccionar un fitxer arrossegant-lo i deixant-lo anar des de l’Explorador de fitxers. |
| `cs` | O přetahování | Soubor můžete vybrat také přetažením z Finderu. | Soubor můžete vybrat také přetažením z Průzkumníka souborů. |
| `da` | Om træk og slip | Du kan også vælge en fil ved at trække og slippe den fra Finder. | Du kan også vælge en fil ved at trække og slippe den fra Stifinder. |
| `de` | Über Drag & Drop | Sie können eine Datei auch per Drag & Drop aus dem Finder auswählen. | Sie können eine Datei auch per Drag & Drop aus dem Explorer auswählen. |
| `el` | Σχετικά με τη μεταφορά και απόθεση | Μπορείτε επίσης να επιλέξετε ένα αρχείο σύροντάς το και αφήνοντάς το από το Finder. | Μπορείτε επίσης να επιλέξετε ένα αρχείο σύροντάς το και αφήνοντάς το από την Εξερεύνηση αρχείων. |
| `en` | About drag and drop | You can also drag and drop a file from Finder to select it. | You can also drag and drop a file from File Explorer to select it. |
| `es` | Acerca de arrastrar y soltar | También puedes seleccionar un archivo arrastrándolo y soltándolo desde el Finder. | También puedes seleccionar un archivo arrastrándolo y soltándolo desde el Explorador de archivos. |
| `et` | Lohistamisest | Faili saate valida ka, lohistades selle Finderist. | Faili saate valida ka, lohistades selle File Explorerist. |
| `eu` | Arrastatu eta jaregiteari buruz | Fitxategi bat Finder-etik arrastatuta eta jareginda ere hauta dezakezu. | Fitxategi bat File Explorer-etik arrastatuta eta jareginda ere hauta dezakezu. |
| `fi` | Tietoja vetämisestä ja pudottamisesta | Voit valita tiedoston myös vetämällä ja pudottamalla sen Finderista. | Voit valita tiedoston myös vetämällä ja pudottamalla sen Resurssienhallinnasta. |
| `fr` | À propos du glisser-déposer | Vous pouvez aussi sélectionner un fichier en le faisant glisser depuis le Finder. | Vous pouvez aussi sélectionner un fichier en le faisant glisser depuis l’Explorateur de fichiers. |
| `gl` | Sobre arrastrar e soltar | Tamén podes seleccionar un ficheiro arrastrándoo e soltándoo desde o Finder. | Tamén podes seleccionar un ficheiro arrastrándoo e soltándoo desde o Explorador de ficheiros. |
| `he` | מידע על גרירה ושחרור | אפשר גם לבחור קובץ על ידי גרירה ושחרור מ-Finder. | אפשר גם לבחור קובץ על ידי גרירה ושחרור מסייר הקבצים. |
| `hi` | ड्रैग और ड्रॉप के बारे में | आप Finder से कोई फ़ाइल ड्रैग और ड्रॉप करके भी उसे चुन सकते हैं। | आप फ़ाइल एक्सप्लोरर से कोई फ़ाइल ड्रैग और ड्रॉप करके भी उसे चुन सकते हैं। |
| `hr` | O povlačenju i ispuštanju | Datoteku možete odabrati i tako da je povučete i ispustite iz Findera. | Datoteku možete odabrati i tako da je povučete i ispustite iz Eksplorera za datoteke. |
| `hu` | Tudnivalók az áthúzásról | Fájlt úgy is kiválaszthat, hogy áthúzza a Finderből. | Fájlt úgy is kiválaszthat, hogy áthúzza a Fájlkezelőből. |
| `id` | Tentang seret dan lepas | Anda juga dapat memilih file dengan menyeret dan melepaskannya dari Finder. | Anda juga dapat memilih file dengan menyeret dan melepaskannya dari File Explorer. |
| `it` | Informazioni sul trascinamento | Puoi anche selezionare un file trascinandolo dal Finder. | Puoi anche selezionare un file trascinandolo da Esplora file. |
| `ja` | ドラッグ＆ドロップについて | Finder からファイルをドラッグ＆ドロップして選択することもできます。 | エクスプローラーからファイルをドラッグ＆ドロップして選択することもできます。 |
| `ko` | 끌어서 놓기 정보 | Finder에서 파일을 끌어다 놓아 선택할 수도 있습니다. | 파일 탐색기에서 파일을 끌어다 놓아 선택할 수도 있습니다. |
| `lt` | Apie vilkimą ir numetimą | Failą taip pat galite pasirinkti nuvilkę jį iš „Finder“. | Failą taip pat galite pasirinkti nuvilkę jį iš Failų naršyklės. |
| `lv` | Par vilkšanu un nomešanu | Failu var atlasīt arī, velkot un nometot to no Finder. | Failu var atlasīt arī, velkot un nometot to no Failu pārlūka. |
| `ms` | Perihal seret dan lepas | Anda juga boleh memilih fail dengan menyeret dan melepaskannya dari Finder. | Anda juga boleh memilih fail dengan menyeret dan melepaskannya dari File Explorer. |
| `nb` | Om dra og slipp | Du kan også velge en fil ved å dra og slippe den fra Finder. | Du kan også velge en fil ved å dra og slippe den fra Filutforsker. |
| `nl` | Over slepen en neerzetten | Je kunt ook een bestand selecteren door het vanuit de Finder te slepen en neer te zetten. | Je kunt ook een bestand selecteren door het vanuit Bestandenverkenner te slepen en neer te zetten. |
| `pl` | Informacje o przeciąganiu i upuszczaniu | Możesz też wybrać plik, przeciągając go z Findera i upuszczając. | Możesz też wybrać plik, przeciągając go z Eksploratora plików i upuszczając. |
| `pt-BR` | Sobre arrastar e soltar | Você também pode selecionar um arquivo arrastando-o e soltando-o a partir do Finder. | Você também pode selecionar um arquivo arrastando-o e soltando-o a partir do Explorador de Arquivos. |
| `pt-PT` | Acerca de arrastar e largar | Também pode selecionar um ficheiro arrastando-o e largando-o a partir do Finder. | Também pode selecionar um ficheiro arrastando-o e largando-o a partir do Explorador de Ficheiros. |
| `ro` | Despre glisare și fixare | Puteți selecta un fișier și prin glisarea și fixarea lui din Finder. | Puteți selecta un fișier și prin glisarea și fixarea lui din Explorer. |
| `ru` | О перетаскивании | Файл также можно выбрать, перетащив его из Finder. | Файл также можно выбрать, перетащив его из Проводника. |
| `sk` | O potiahnutí a pustení | Súbor môžete vybrať aj tak, že ho potiahnete a pustíte z Findera. | Súbor môžete vybrať aj tak, že ho potiahnete a pustíte z Prieskumníka. |
| `sl` | O vlečenju in spuščanju | Datoteko lahko izberete tudi tako, da jo povlečete in spustite iz Finderja. | Datoteko lahko izberete tudi tako, da jo povlečete in spustite iz Raziskovalca. |
| `sr-Latn` | O prevlačenju i otpuštanju | Datoteku možete izabrati i tako što ćete je prevući i otpustiti iz Findera. | Datoteku možete izabrati i tako što ćete je prevući i otpustiti iz Istraživača datoteka. |
| `sv` | Om dra och släpp | Du kan också välja en fil genom att dra och släppa den från Finder. | Du kan också välja en fil genom att dra och släppa den från Utforskaren. |
| `th` | เกี่ยวกับการลากและวาง | คุณยังสามารถเลือกไฟล์ได้ด้วยการลากและวางจาก Finder | คุณยังสามารถเลือกไฟล์ได้ด้วยการลากและวางจาก File Explorer |
| `tr` | Sürükle ve bırak hakkında | Bir dosyayı Finder’dan sürükleyip bırakarak da seçebilirsiniz. | Bir dosyayı Dosya Gezgini’nden sürükleyip bırakarak da seçebilirsiniz. |
| `uk` | Про перетягування | Файл також можна вибрати, перетягнувши його з Finder. | Файл також можна вибрати, перетягнувши його з Файлового провідника. |
| `vi` | Giới thiệu về kéo và thả | Bạn cũng có thể chọn tệp bằng cách kéo và thả từ Finder. | Bạn cũng có thể chọn tệp bằng cách kéo và thả từ File Explorer. |
| `zh-Hans` | 关于拖放 | 也可以从访达中拖放文件来进行选择。 | 也可以从文件资源管理器中拖放文件来进行选择。 |
| `zh-Hant` | 關於拖放 | 也可以從 Finder 拖放檔案來選取。 | 也可以從檔案總管拖放檔案來選取。 |
