SHELL=/bin/bash
FILES=Halberts.pdf Helmbarten.pdf Farnthal.pdf Just-Halberds.pdf Helle-Barden.pdf To-Rob-A-Witch.pdf 2d6-Math.pdf \
	Altenstein.pdf Halbardier.pdf
all: $(FILES)

clean:
	rm -f *.html *.pdf *.data

upload: $(FILES)
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

# The first sed replaces numbers followed by ¡ with highlights because
# the old code using {: .highligh} no longer seems to work.
%.html: lang=$(shell sed -ne 's/<html lang=\(..\)>/\1/p' < $*-prefix)
%.html: %-prefix %.md suffix
	sed 's/\([0-9]*\)¡/<span class="highlight">\1<\/span>/g' < $*.md \
	| (if test "de" = "$(lang)"; then keine-ligaturen; else cat; fi) \
	| python3 -m markdown \
		--extension=markdown.extensions.tables \
		--extension markdown.extensions.smarty \
		--extension markdown.extensions.attr_list \
	| cat $*-prefix - suffix \
	| sed 's/YYYY-MM-DD/$(shell date -I)/' \
	> $@

Altenstein.pdf: images/Altenstein.svg

Farnthal.pdf: images/Farnthal.svg

Helmbarten.pdf: images/Helmbarten.svg Helmbarten.jpg

Halberts.pdf: images/Helmbarten.png

Knives.pdf: Knives.jpg Knives.css Knives-prefix images/Schweizerkrieger_(1515)_Urs_Graf.jpg

Halbardier.pdf: Halbardier.jpg

images/%.svg: images/%.txt
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
