# Small Role-Playing Games

These all use a two-step process to create PDF files: write Markdown
and convert it to HTML using Python’s Markdown module; convert the
HTML and a dedicated CSS to PDF using WeasyPrint.

You can find the PDF files online:

* [Helmbarten](https://alexschroeder.ch/pdfs/Helmbarten.pdf)
* [2d6 Math](https://alexschroeder.ch/pdfs/2d6-Math.pdf)
* [Just Halberds](https://alexschroeder.ch/pdfs/Just-Halberds.pdf)
* [Helle Barden](https://alexschroeder.ch/pdfs/Helle-Barden.pdf)
* [To Rob a Witch](https://alexschroeder.ch/pdfs/To-Rob-A-Witch.pdf)

Licensing: The maps in Helmbarten and Farnthal use the Gnomeyland Map
Icons Copyright Gregory B. MacKenzie 2012, Alex Schroeder 2013-2019.
The maps licensed under the Creative Commons Attribution-ShareAlike
3.0 Unported License. To view a copy of this license, visit
http://creativecommons.org/licenses/by-sa/3.0/.

Unless otherwise indicated, the works in this repository are dedicated
to the public domain. To the extent possible under law, the authors of
these works has waived all copyright and related or neighboring rights
to these works.

## Helmbarten

A short and simple 2d6 system, inspired by Traveller, in German.

* [Generator](https://campaignwiki.org/helmbarten/) for charakters and
  initial situation

The data for the generator is stored in the HTML file!

## Just Halberds

This is my short and simple 2d6 system, inspired by
Norbert G. Matausch's
[Landshut Rules](https://darkwormcolt.blogspot.com/p/landshut-rules.html),
the interview he did with Bob Meyer on
[Ancient-School Roleplaying](https://darkwormcolt.blogspot.com/2020/03/ancient-school-roleplaying-exclusive.html),
and very simple *Dungeon World* alternatives like
[World of Dungeons](https://alexschroeder.ch/pdfs/World%20of%20Dungeons%20(black%20&%20white).pdf)
(including
[the German translation of World of Dungeons](https://alexschroeder.ch/pdfs/Wold%20of%20Dungeons%20(Deutsch).pdf)).

## 2d6 Math

Some explanations to make 2d6 Math more approachable.

## To Rob a Witch

A small adventure, originally written for B/X D&D and similar games,
for use with *Just Halberds*.

## Helle Barden

A German translation of *Just Halberds*.

## Dependencies

These are Debian packages:

* `fonts-adf-gillius` for the Gillius ADF font

* `texlive-fonts-extra` for the fbb font (I've had to create symbolic
  links for `fbb-Regular.otf`, `fbb-Italic.otf`, `fbb-Bold.otf`,
  `fbb-BoldItalic.otf` from
  `/usr/share/texlive/texmf-dist/fonts/opentype/public/fbb` to
  `~/.local/share/fonts`
  
* [WeasyPrint](https:/pypi.orgprojectWeasyPrint) requires `python3`
  and `python3-pip` so that you can install it using `pip3 install
  weasyprint`
  
* `make`

* `inotify-tools` if you want to run `make watch` and have the PDF
  update every time you save the Markdown file

* for the German files, you also need `keine-ligaturen` which is a
  Perl script I derived from selnolig; you can get it here:
  https://alexschroeder.ch/cgit/keine-ligaturen/about/

Let me know if you found another dependency. I'll be happy to add
them.
