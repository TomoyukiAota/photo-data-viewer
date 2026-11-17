# Layout of the Home page's panes: the words chosen

The six texts of `home.layout` are machine translation, as the rest of each
language's file is (the table of languages in
[TRANSLATING.md](../../../TRANSLATING.md#languages)); no speaker has
reviewed them. Japanese is for the maintainer to review.

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
- **Side by side** is the words of Word's "View Side by Side" in the language
  (`Nebeneinander`, `Côte à côte`, `En paralelo`, `並べて表示`).
- **Tabs** is the language's word for the tabs of an application, as its
  browsers and Office have it (`Karty`, `Onglets`, `Guias`, `Separadores`,
  `Вкладки`).
- **Japanese and Korean** write the two fixed modes as the way that the
  panes are shown (`並べて表示`, `タブで表示`, `나란히 보기`, `탭으로 보기`),
  as their software writes such choices.

The table is made from `src/locales/*.json`, in the order of the Language
page.

| Code | Word under the icon | Automatic | Side by side | Tabs | Under Automatic |
| --- | --- | --- | --- | --- | --- |
| `id` | TATA LETAK | Otomatis | Berdampingan | Tab | Berdampingan di jendela yang lebar, sebagai tab di jendela yang sempit |
| `ms` | TATALETAK | Automatik | Bersebelahan | Tab | Bersebelahan dalam tetingkap yang lebar, sebagai tab dalam tetingkap yang sempit |
| `ca` | DISPOSICIÓ | Automàtica | Costat a costat | Pestanyes | Costat a costat en una finestra ampla, en pestanyes en una d’estreta |
| `cs` | ROZLOŽENÍ | Automaticky | Vedle sebe | Karty | Vedle sebe v širokém okně, na kartách v úzkém |
| `da` | LAYOUT | Automatisk | Side om side | Faner | Side om side i et bredt vindue, i faner i et smalt |
| `de` | LAYOUT | Automatisch | Nebeneinander | Tabs | Nebeneinander in einem breiten Fenster, Tabs in einem schmalen |
| `et` | PAIGUTUS | Automaatne | Kõrvuti | Vahekaardid | Kõrvuti laias aknas, vahekaartidena kitsas |
| `en` | LAYOUT | Automatic | Side by side | Tabs | Side by side in a wide window, tabs in a narrow one |
| `es` | DISEÑO | Automático | En paralelo | Pestañas | En paralelo en una ventana ancha, en pestañas en una estrecha |
| `eu` | DISEINUA | Automatikoa | Elkarren ondoan | Fitxak | Elkarren ondoan leiho zabal batean, fitxetan leiho estu batean |
| `fr` | DISPOSITION | Automatique | Côte à côte | Onglets | Côte à côte dans une fenêtre large, en onglets dans une fenêtre étroite |
| `gl` | DESEÑO | Automático | Lado a lado | Lapelas | Lado a lado nunha xanela ancha, en lapelas nunha estreita |
| `hr` | RASPORED | Automatski | Jedno uz drugo | Kartice | Jedno uz drugo u širokom prozoru, na karticama u uskom |
| `it` | LAYOUT | Automatico | Affiancati | Schede | Affiancati in una finestra larga, a schede in una stretta |
| `lv` | IZKĀRTOJUMS | Automātiski | Blakus | Cilnes | Blakus platā logā, cilnēs šaurā |
| `lt` | IŠDĖSTYMAS | Automatinis | Greta | Skirtukai | Greta plačiame lange, skirtukuose siaurame |
| `hu` | ELRENDEZÉS | Automatikus | Egymás mellett | Lapok | Széles ablakban egymás mellett, keskeny ablakban lapokon |
| `nl` | INDELING | Automatisch | Naast elkaar | Tabbladen | Naast elkaar in een breed venster, in tabbladen in een smal venster |
| `nb` | OPPSETT | Automatisk | Side ved side | Faner | Side ved side i et bredt vindu, i faner i et smalt |
| `pl` | UKŁAD | Automatyczny | Obok siebie | Karty | Obok siebie w szerokim oknie, na kartach w wąskim |
| `pt-BR` | LAYOUT | Automático | Lado a lado | Guias | Lado a lado em uma janela larga, em guias em uma estreita |
| `pt-PT` | ESQUEMA | Automático | Lado a lado | Separadores | Lado a lado numa janela larga, em separadores numa estreita |
| `ro` | ASPECT | Automat | Unul lângă altul | File | Unul lângă altul într-o fereastră lată, în file într-una îngustă |
| `sk` | ROZLOŽENIE | Automaticky | Vedľa seba | Karty | Vedľa seba v širokom okne, na kartách v úzkom |
| `sl` | POSTAVITEV | Samodejno | Drugo ob drugem | Zavihki | Drugo ob drugem v širokem oknu, na zavihkih v ozkem |
| `sr-Latn` | RASPORED | Automatski | Jedno pored drugog | Kartice | Jedno pored drugog u širokom prozoru, na karticama u uskom |
| `fi` | ASETTELU | Automaattinen | Rinnakkain | Välilehdet | Rinnakkain leveässä ikkunassa, välilehdillä kapeassa |
| `sv` | LAYOUT | Automatiskt | Sida vid sida | Flikar | Sida vid sida i ett brett fönster, i flikar i ett smalt |
| `vi` | BỐ TRÍ | Tự động | Cạnh nhau | Tab | Cạnh nhau khi cửa sổ rộng, dạng tab khi cửa sổ hẹp |
| `tr` | DÜZEN | Otomatik | Yan yana | Sekmeler | Geniş pencerede yan yana, dar pencerede sekmelerde |
| `el` | ΔΙΑΤΑΞΗ | Αυτόματα | Δίπλα-δίπλα | Καρτέλες | Δίπλα-δίπλα σε φαρδύ παράθυρο, σε καρτέλες σε στενό |
| `bg` | ОФОРМЛЕНИЕ | Автоматично | Един до друг | Раздели | Един до друг в широк прозорец и в раздели в тесен |
| `ru` | МАКЕТ | Автоматически | Рядом | Вкладки | Рядом в широком окне, на вкладках в узком |
| `uk` | МАКЕТ | Автоматично | Поруч | Вкладки | Поруч у широкому вікні, на вкладках у вузькому |
| `he` | פריסה | אוטומטית | זה לצד זה | כרטיסיות | זה לצד זה בחלון רחב, בכרטיסיות בחלון צר |
| `ar` | التخطيط | تلقائي | جنبًا إلى جنب | علامات التبويب | جنبًا إلى جنب عندما تكون النافذة عريضة، وعلامات تبويب عندما تكون ضيقة |
| `hi` | लेआउट | स्वचालित | साथ-साथ | टैब | चौड़ी विंडो में साथ-साथ, और संकरी विंडो में टैब के रूप में |
| `th` | เค้าโครง | อัตโนมัติ | เคียงข้างกัน | แท็บ | เคียงข้างกันเมื่อหน้าต่างกว้าง และเป็นแท็บเมื่อหน้าต่างแคบ |
| `ko` | 레이아웃 | 자동 | 나란히 보기 | 탭으로 보기 | 창이 넓으면 나란히 보기, 좁으면 탭으로 보기 |
| `ja` | レイアウト | 自動 | 並べて表示 | タブで表示 | ウィンドウが広いときは並べて表示、狭いときはタブで表示 |
| `zh-Hans` | 布局 | 自动 | 并排 | 标签页 | 窗口较宽时并排显示，较窄时以标签页显示 |
| `zh-Hant` | 版面配置 | 自動 | 並排 | 索引標籤 | 視窗較寬時並排顯示，較窄時以索引標籤顯示 |
