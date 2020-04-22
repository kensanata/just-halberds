SHELL=/bin/bash

all: Just-Halberds.pdf Helle-Barden.pdf To-Rob-A-Witch.pdf 2d6-Math.pdf

clean:
	rm -f *.html *.pdf

upload: Just-Halberds.pdf Helle-Barden.pdf To-Rob-A-Witch.pdf 2d6-Math.pdf
	rsync -ai $^ sibirocobombus:alexschroeder.ch/pdfs/

watch:
	@echo Regenerating PDFs whenever the .md or .css files get saved...
	@inotifywait -q -e close_write -m . | \
	while read -r d e f; do \
	  if [[ "$${f,,}" == *\.md ]]; then \
	    make "$${f%md}pdf"; \
	  elif [[ "$${f,,}" == *\.css ]]; then \
	    make "$${f%css}pdf"; \
	  fi; \
        done

%.pdf: %.html %.css
	weasyprint $< $@

%.html: %-prefix %.html.tmp suffix
	cat $^ | sed 's/YYYY-MM-DD/$(shell date -I)/' > $@

%.html.tmp: %.md.tmp
	python3 -m markdown \
		--extension=markdown.extensions.tables \
		--extension markdown.extensions.smarty \
		--extension markdown.extensions.attr_list \
		--file=$@ $<

%.md.tmp: %.md
	sed 's/¡/{: .highlight}/g' < $< > $@

%.pdf: %.svg
	inkscape --without-gui --export-area-page --file=$< --export-pdf=$@

2d6-distribution.ps:
	@echo Use Emacs and calc

2d6-distribution.png: 2d6-distribution.ps
	convert -rotate 90 -background white -alpha deactivate 2d6-distribution.ps 2d6-distribution.png
