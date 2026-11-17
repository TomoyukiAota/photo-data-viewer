# Layout of the Home page's panes: the words chosen

The six texts of `home.layout` are machine translation, as the rest of each
language's file is (the table of languages in
[TRANSLATING.md](../../../TRANSLATING.md#languages)); no speaker has
reviewed them. The names of the modes in English and in Japanese are the
maintainer's (2026-11-18): Split panes, Single pane and Automatic, and
`表示領域を分割する`, `表示領域を分割しない` and `自動`.

How they were chosen, in each language:

- **The word for a layout** is the one that Windows' File Explorer and
  Office give the group of layouts (`Układ`, `Disposition`, `Rozložení`,
  `Макет`, `レイアウト`, `版面配置`). It is the word under the button's
  icon, in capitals where the script has them, as the word for the menu is
  (`menu.label`), and the button's name for a screen reader
  (`buttonLabel`), as `menu.buttonLabel` is.
- **Automatic** is the language's word for an automatic setting; where an
  adjective agrees with the word for a layout, it does
  (`Automàtica`, `disposició` in Catalan), and where the language's
  software writes an adverb for such a setting, it is the adverb
  (`Automaticky`, `Samodejno`, `Автоматически`).
- **Split panes** and **Single pane** have the language's word for a pane,
  as Windows names its preview pane and Outlook its reading pane
  (`Bereich`, `volet`, `okienko`, `podokno`, `область`, `窗格`), and its
  word for splitting where it has one for panes (`拆分` as in Excel's
  拆分窗格).
- **Korean and Chinese** name the two modes as their software names split and
  single panes (`분할 창`, `단일 창`; `拆分窗格`, `单个窗格`). Japanese has
  the maintainer's words, which say what is done to the area shown.

The table is made from `src/locales/*.json`, in the order of the Language
page.

| Code | Word under the icon | Automatic | Split panes | Single pane | Under Automatic |
| --- | --- | --- | --- | --- | --- |
| `id` | TATA LETAK | Otomatis | Panel terbagi | Satu panel | Panel terbagi di jendela yang lebar, satu panel di jendela yang sempit |
| `ms` | TATALETAK | Automatik | Anak tetingkap berpisah | Satu anak tetingkap | Anak tetingkap berpisah dalam tetingkap yang lebar, satu anak tetingkap dalam tetingkap yang sempit |
| `ca` | DISPOSICIÓ | Automàtica | Subfinestres dividides | Una sola subfinestra | Subfinestres dividides en una finestra ampla, una sola subfinestra en una d’estreta |
| `cs` | ROZLOŽENÍ | Automaticky | Rozdělená podokna | Jedno podokno | Rozdělená podokna v širokém okně, jedno podokno v úzkém |
| `da` | LAYOUT | Automatisk | Opdelte ruder | Én rude | Opdelte ruder i et bredt vindue, én rude i et smalt |
| `de` | LAYOUT | Automatisch | Geteilte Bereiche | Einzelner Bereich | Geteilte Bereiche in einem breiten Fenster, ein einzelner Bereich in einem schmalen |
| `et` | PAIGUTUS | Automaatne | Jagatud paanid | Üks paan | Jagatud paanid laias aknas, üks paan kitsas |
| `en` | LAYOUT | Automatic | Split panes | Single pane | Split panes in a wide window, a single pane in a narrow one |
| `es` | DISEÑO | Automático | Paneles divididos | Panel único | Paneles divididos en una ventana ancha, panel único en una estrecha |
| `eu` | DISEINUA | Automatikoa | Panel zatituak | Panel bakarra | Panel zatituak leiho zabal batean, panel bakarra leiho estu batean |
| `fr` | DISPOSITION | Automatique | Volets fractionnés | Volet unique | Volets fractionnés dans une fenêtre large, volet unique dans une fenêtre étroite |
| `gl` | DESEÑO | Automático | Paneis divididos | Un só panel | Paneis divididos nunha xanela ancha, un só panel nunha estreita |
| `hr` | RASPORED | Automatski | Podijeljena okna | Jedno okno | Podijeljena okna u širokom prozoru, jedno okno u uskom |
| `it` | LAYOUT | Automatico | Riquadri divisi | Riquadro singolo | Riquadri divisi in una finestra larga, riquadro singolo in una stretta |
| `lv` | IZKĀRTOJUMS | Automātiski | Sadalītas rūtis | Viena rūts | Sadalītas rūtis platā logā, viena rūts šaurā |
| `lt` | IŠDĖSTYMAS | Automatinis | Padalytos sritys | Viena sritis | Padalytos sritys plačiame lange, viena sritis siaurame |
| `hu` | ELRENDEZÉS | Automatikus | Felosztott ablaktáblák | Egy ablaktábla | Széles ablakban felosztott ablaktáblák, keskeny ablakban egy ablaktábla |
| `nl` | INDELING | Automatisch | Gesplitste deelvensters | Eén deelvenster | Gesplitste deelvensters in een breed venster, één deelvenster in een smal venster |
| `nb` | OPPSETT | Automatisk | Delte ruter | Én rute | Delte ruter i et bredt vindu, én rute i et smalt |
| `pl` | UKŁAD | Automatyczny | Podzielone okienka | Jedno okienko | Podzielone okienka w szerokim oknie, jedno okienko w wąskim |
| `pt-BR` | LAYOUT | Automático | Painéis divididos | Painel único | Painéis divididos em uma janela larga, painel único em uma estreita |
| `pt-PT` | ESQUEMA | Automático | Painéis divididos | Painel único | Painéis divididos numa janela larga, painel único numa estreita |
| `ro` | ASPECT | Automat | Panouri împărțite | Un singur panou | Panouri împărțite într-o fereastră lată, un singur panou într-una îngustă |
| `sk` | ROZLOŽENIE | Automaticky | Rozdelené tably | Jedna tabla | Rozdelené tably v širokom okne, jedna tabla v úzkom |
| `sl` | POSTAVITEV | Samodejno | Razdeljena podokna | Eno podokno | Razdeljena podokna v širokem oknu, eno podokno v ozkem |
| `sr-Latn` | RASPORED | Automatski | Podeljena okna | Jedno okno | Podeljena okna u širokom prozoru, jedno okno u uskom |
| `fi` | ASETTELU | Automaattinen | Jaetut ruudut | Yksi ruutu | Jaetut ruudut leveässä ikkunassa, yksi ruutu kapeassa |
| `sv` | LAYOUT | Automatiskt | Delade rutor | En enda ruta | Delade rutor i ett brett fönster, en enda ruta i ett smalt |
| `vi` | BỐ TRÍ | Tự động | Chia ngăn | Một ngăn | Chia ngăn khi cửa sổ rộng, một ngăn khi cửa sổ hẹp |
| `tr` | DÜZEN | Otomatik | Bölünmüş bölmeler | Tek bölme | Geniş pencerede bölünmüş bölmeler, dar pencerede tek bölme |
| `el` | ΔΙΑΤΑΞΗ | Αυτόματα | Διαιρεμένα τμήματα παραθύρου | Ένα τμήμα παραθύρου | Διαιρεμένα τμήματα παραθύρου σε φαρδύ παράθυρο, ένα τμήμα παραθύρου σε στενό |
| `bg` | ОФОРМЛЕНИЕ | Автоматично | Разделени екрани | Един екран | Разделени екрани в широк прозорец и един екран в тесен |
| `ru` | МАКЕТ | Автоматически | Разделенные области | Одна область | Разделенные области в широком окне, одна область в узком |
| `uk` | МАКЕТ | Автоматично | Розділені області | Одна область | Розділені області в широкому вікні, одна область у вузькому |
| `he` | פריסה | אוטומטית | חלוניות מפוצלות | חלונית אחת | חלוניות מפוצלות בחלון רחב, וחלונית אחת בחלון צר |
| `ar` | التخطيط | تلقائي | أجزاء مقسّمة | جزء واحد | أجزاء مقسّمة عندما تكون النافذة عريضة، وجزء واحد عندما تكون ضيقة |
| `hi` | लेआउट | स्वचालित | विभाजित फलक | एकल फलक | चौड़ी विंडो में विभाजित फलक, और संकरी विंडो में एकल फलक |
| `th` | เค้าโครง | อัตโนมัติ | แบ่งบานหน้าต่าง | บานหน้าต่างเดียว | แบ่งบานหน้าต่างเมื่อหน้าต่างกว้าง และใช้บานหน้าต่างเดียวเมื่อหน้าต่างแคบ |
| `ko` | 레이아웃 | 자동 | 분할 창 | 단일 창 | 창이 넓으면 분할 창, 좁으면 단일 창 |
| `ja` | レイアウト | 自動 | 表示領域を分割する | 表示領域を分割しない | ウィンドウが広いときは表示領域を分割し、狭いときは分割しない |
| `zh-Hans` | 布局 | 自动 | 拆分窗格 | 单个窗格 | 窗口较宽时拆分窗格，较窄时使用单个窗格 |
| `zh-Hant` | 版面配置 | 自動 | 分割窗格 | 單一窗格 | 視窗較寬時分割窗格，較窄時使用單一窗格 |
