SHELL=/bin/bash

all: Just-Halberds.pdf Helle-Barden.pdf

clean:
	rm -f *.html *.pdf

upload: Just-Halberds.pdf Helle-Barden.pdf
	rsync -ai $^ sibirocobombus:alexschroeder.ch/pdfs/

watch:
	@echo Regenerating PDFs whenever the .md files get saved...
	@inotifywait -q -e close_write -m . | \
	while read -r d e f; do \
	  if [[ "$${f,,}" == *\.md ]]; then \
	    make "$${f%md}pdf"; \
	  fi; \
        done

%.pdf: %.html %.css
	weasyprint $< $@

%.html: %-prefix %.html.tmp suffix
	cat $^ | sed 's/YYYY-MM-DD/$(shell date -I)/' > $@

%.html.tmp: %.md
	python3 -m markdown \
		--extension=markdown.extensions.tables \
		--extension markdown.extensions.smarty \
		--extension markdown.extensions.attr_list \
		--file=$@ $<
