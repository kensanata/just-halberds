SHELL=/bin/bash

all: Just-Halberds.pdf Helle-Barden.pdf To-Rob-A-Witch.pdf 2d6-Math.pdf

clean:
	rm -f *.html *.pdf *.data

upload: Just-Halberds.pdf Helle-Barden.pdf To-Rob-A-Witch.pdf 2d6-Math.pdf
	rsync -ai $^ sibirocobombus:alexschroeder.ch/pdfs/

watch:
	@echo Regenerating PDFs whenever the .md or .css files get saved...
	@inotifywait -q -e close_write -m . | \
	while read -r d e f; do \
	  if [[ "$${f,,}" == *\.md \
	     || "$${f,,}" == *\.css \
	     || "$${f,,}" == *\.data \
	     || "$${f,,}" == *\.plot ]]; then \
	    make; \
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

2d6-distribution.data:
	for i in {1..6}; do \
	  for j in {1..6}; do \
	    echo $$(( $$i+$$j )); \
	  done; \
	done > $@

%.png: %.plot %.data
	gnuplot $< > $@

2d6-target.data:
	for i in {1..6}; do \
	  for j in {1..6}; do \
	    n=$$(( $$i+$$j )); \
	    for k in $$(seq 2 $$n); do \
	      echo $$k; \
	    done; \
	  done; \
	done > $@

2d6-beating.data:
	for m in {-10..11}; do \
	  for i1 in {1..6}; do \
	    for j1 in {1..6}; do \
	      for i2 in {1..6}; do \
		for j2 in {1..6}; do \
		  if [[ $$(( $$i1+$$j1+$$m )) -gt $$(( $$i2+$$j2 )) ]]; then \
		    echo $$m; \
		  fi; \
		done; \
	      done; \
	    done; \
	  done; \
	done > $@

2d6-Math.pdf: 2d6-distribution.png 2d6-target.png 2d6-beating.png
