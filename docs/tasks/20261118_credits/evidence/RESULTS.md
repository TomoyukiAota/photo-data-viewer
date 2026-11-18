# Credits page: results

Checked on 2026-11-18, on macOS with Node 26.13.0 and npm 11.20.0, against `main`
at `ff0a172`.

## The icons on Flaticon

Each icon's page, read on 2026-11-18 in headless Chrome:

| Icon | Author | What the page says |
| --- | --- | --- |
| google-maps_2642502 | Magnific | Flaticon License: free for personal and commercial use, with attribution |
| street-view_2344085 | srip | Flaticon License |
| earth-globe_616616 | Magnific | Flaticon License |
| undo-arrow_1702 | Magnific | Flaticon License |
| github-logo_25231 | Dave Gandy | Flaticon Editorial License on the icon's page; its pack, Font Awesome, "License CC 3.0 BY. Attribution is required." |

Flaticon's help on attribution asks for "Icon made by <author> from
www.flaticon.com", once for each author, on the page where the icon is shown or
on a page of credits, and says that Dave Gandy's pack is not under Flaticon's
own license.

`git grep` found no use of `folder`, `launchExternalApp`, `play`,
`noThumbnailAvailable` or `generatingThumbnail` outside
`src/icons/icon-data-url.ts`, which is 32 KB smaller without them.

## The texts

The name of the page (`menu.credits` and `credits.title`; the title in the
browser is "<name> - Photo Data Viewer") and the sentence before the credits
(`credits.icons`):

| Code | Name of the page | Sentence before the credits |
| --- | --- | --- |
| `ar` | شكر وتقدير | يستخدم هذا التطبيق أيقونات من Flaticon صمّمها المؤلفون التالية أسماؤهم. |
| `bg` | Благодарности | Това приложение използва икони от Flaticon, създадени от следните автори. |
| `ca` | Crèdits | Aquesta aplicació fa servir icones de Flaticon creades pels autors següents. |
| `cs` | Poděkování | Tato aplikace používá ikony z Flaticonu od následujících autorů. |
| `da` | Kreditering | Denne app bruger ikoner fra Flaticon, som er lavet af følgende ophavspersoner. |
| `de` | Bildnachweise | Diese App verwendet Symbole von Flaticon, die von den folgenden Urhebern stammen. |
| `el` | Ευχαριστίες | Αυτή η εφαρμογή χρησιμοποιεί εικονίδια από το Flaticon, έργα των παρακάτω δημιουργών. |
| `en` | Credits | This application uses icons from Flaticon, made by the following authors. |
| `es` | Créditos | Esta aplicación usa iconos de Flaticon creados por los siguientes autores. |
| `et` | Tänuavaldused | See rakendus kasutab Flaticoni ikoone, mille autorid on järgmised. |
| `eu` | Kredituak | Aplikazio honek Flaticon-eko ikonoak erabiltzen ditu, egile hauek sortuak. |
| `fi` | Tekijät | Tämä sovellus käyttää Flaticonin kuvakkeita, joiden tekijät ovat seuraavat. |
| `fr` | Crédits | Cette application utilise des icônes de Flaticon, créées par les auteurs suivants. |
| `gl` | Créditos | Esta aplicación usa iconas de Flaticon creadas polos seguintes autores. |
| `he` | קרדיטים | היישום משתמש בסמלים מ-Flaticon שיצרו היוצרים הבאים. |
| `hi` | श्रेय | यह ऐप Flaticon के आइकन का उपयोग करता है, जिन्हें नीचे दिए गए रचनाकारों ने बनाया है। |
| `hr` | Zasluge | Ova aplikacija koristi ikone s Flaticona koje su izradili sljedeći autori. |
| `hu` | Köszönetnyilvánítás | Az alkalmazás a Flaticon ikonjait használja, amelyeket a következő alkotók készítettek. |
| `id` | Kredit | Aplikasi ini menggunakan ikon dari Flaticon yang dibuat oleh pembuat berikut. |
| `it` | Riconoscimenti | Questa applicazione usa icone di Flaticon realizzate dai seguenti autori. |
| `ja` | クレジット | このアプリは、次の作者が作成した Flaticon のアイコンを使用しています。 |
| `ko` | 크레딧 | 이 앱은 다음 제작자가 만든 Flaticon 아이콘을 사용합니다. |
| `lt` | Padėkos | Ši programa naudoja „Flaticon“ piktogramas, kurias sukūrė šie autoriai. |
| `lv` | Pateicības | Šī lietotne izmanto Flaticon ikonas, kuru autori ir šādi. |
| `ms` | Kredit | Aplikasi ini menggunakan ikon daripada Flaticon yang dicipta oleh pencipta berikut. |
| `nb` | Kreditering | Denne appen bruker ikoner fra Flaticon, laget av følgende opphavspersoner. |
| `nl` | Credits | Deze app gebruikt pictogrammen van Flaticon, gemaakt door de volgende makers. |
| `pl` | Podziękowania | Ta aplikacja korzysta z ikon z serwisu Flaticon, stworzonych przez następujących autorów. |
| `pt-BR` | Créditos | Este aplicativo usa ícones do Flaticon criados pelos seguintes autores. |
| `pt-PT` | Créditos | Esta aplicação utiliza ícones do Flaticon criados pelos seguintes autores. |
| `ro` | Credite | Această aplicație folosește pictograme de pe Flaticon, create de următorii autori. |
| `ru` | Благодарности | В этом приложении используются значки с Flaticon, созданные следующими авторами. |
| `sk` | Poďakovanie | Táto aplikácia používa ikony z Flaticonu od nasledujúcich autorov. |
| `sl` | Zasluge | Ta aplikacija uporablja ikone s spletnega mesta Flaticon, ki so jih ustvarili naslednji avtorji. |
| `sr-Latn` | Zasluge | Ova aplikacija koristi ikone sa sajta Flaticon koje su izradili sledeći autori. |
| `sv` | Erkännanden | Den här appen använder ikoner från Flaticon, skapade av följande upphovspersoner. |
| `th` | เครดิต | แอปนี้ใช้ไอคอนจาก Flaticon ซึ่งสร้างโดยผู้สร้างต่อไปนี้ |
| `tr` | Emeği Geçenler | Bu uygulama, aşağıdaki yaratıcıların hazırladığı Flaticon simgelerini kullanır. |
| `uk` | Подяки | Ця програма використовує значки з Flaticon, створені такими авторами. |
| `vi` | Ghi công | Ứng dụng này sử dụng các biểu tượng từ Flaticon do các tác giả sau tạo ra. |
| `zh-Hans` | 致谢 | 此应用使用了 Flaticon 上由以下作者制作的图标。 |
| `zh-Hant` | 致謝 | 此應用程式使用了 Flaticon 上由以下作者製作的圖示。 |

## Checks

| Check | Result |
| --- | --- |
| `npm ci` | The three known deprecation warnings |
| `npm run test:all` | Passes; 748 tests |
| `npm run build` | Passes; `/credits` is prerendered for each language |
| `npm run build:plm` | Passes |
| Browser suite in Chrome with the visual comparison | 46 passed, with the new `credits.png` and `credits-ar.png` |
| Browser suite in Chromium | 46 passed |
| `npm run test:electron` | Not run: it opens windows on the machine |

The rotate icon, drawn in `#EEEEEE`, could hardly be seen on the page's white
in the first screenshot; it is on the dark background of the photo's button
now, as in the app.
