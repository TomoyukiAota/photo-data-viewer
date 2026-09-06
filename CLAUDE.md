# CLAUDE.md

このアプリの中身・開発の進め方は [`README.md`](README.md) と
[`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) にある。ここには
**セッションの入口でだけ必要なこと**を書く。

## 知識はこのリポジトリに置く（memory を使わない）

memory（`~/.claude/projects/…/memory/`）は **clone ごと・マシンごとに別**で
持ち歩けない。同じことを別の PC で作業したときに最初から無い、が実際に起きた。
だから**このリポジトリに関わることは全部リポジトリに置く**——README・`docs/`・
このファイル・コードの隣のコメント。

お願いではなく、[`.claude/settings.json`](.claude/settings.json) で
`"autoMemoryEnabled": false` にして**機能ごと切ってある**（読み書きとも止まる）。
追跡されている設定なので、clone しても PC を変えても効く。

## このリポジトリは公開されている

`TomoyukiAota/photo-data-viewer` は **public**。ここに残るもの——PR のタイトルと
本文、issue、**コミットメッセージ**、ブランチ名、コード中のコメント——は誰でも読める。

**非公開のもの（非公開リポジトリの名前、私的に使っている外部サービス、個人の写真など）
を書かない。** 参照が要る作業でも、出典を示さずに**内容だけ**転記する。
迷ったら書かずに確認する。
