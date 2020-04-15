# Just Halberds

This is my short and simple 2d6 system, inspired by
Norbert G. Matausch's
[Landshut Rules](https://darkwormcolt.blogspot.com/p/landshut-rules.html),
the interview he did with Bob Meyer on
[Ancient-School Roleplaying](https://darkwormcolt.blogspot.com/2020/03/ancient-school-roleplaying-exclusive.html),
and very simple *Dungeon World* alternatives like
[World of Dungeons](https://alexschroeder.ch/pdfs/World%20of%20Dungeons%20(black%20&%20white).pdf)
(including
[the German translation of World of Dungeons](https://alexschroeder.ch/pdfs/Wold%20of%20Dungeons%20(Deutsch).pdf)).

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

Let me know if you found another dependency. I'll be happy to add
them.
