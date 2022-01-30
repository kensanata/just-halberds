SHELL=/bin/bash

all: Helmbarten.pdf Farnthal.pdf Just-Halberds.pdf Helle-Barden.pdf To-Rob-A-Witch.pdf 2d6-Math.pdf

clean:
	rm -f *.html *.pdf *.data

upload: Helmbarten.pdf Farnthal.pdf Just-Halberds.pdf Helle-Barden.pdf To-Rob-A-Witch.pdf 2d6-Math.pdf
	rsync -ai $^ sibirocobombus:alexschroeder.ch/pdfs/
	(echo ""; tail -n +2 images/Farnthal.svg) | \
	~/bin/wikiput -s Update -u Alex -z frodo https://campaignwiki.org/wiki/Helmbarten/Karte

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

%.html.tmp: %.md
	sed 's/¡/{: .highlight}/g' < $< \
	| ./keine-ligaturen \
	| python3 -m markdown \
		--extension=markdown.extensions.tables \
		--extension markdown.extensions.smarty \
		--extension markdown.extensions.attr_list \
		--file=$@

Farnthal.pdf: images/Farnthal.png

Helmbarten.pdf: images/Helmbarten.png

images/Helmbarten.svg: images/Helmbarten.txt
	text-mapper render < $< > $@

images/%.png: images/%.svg
	inkscape --without-gui --export-area-page --file=$< --export-png=$@

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
