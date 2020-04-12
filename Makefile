all: Just-Halberds.pdf Helle-Barden.pdf

clean:
	rm -f *.html *.pdf

upload: Just-Halberds.pdf Helle-Barden.pdf
	rsync -ai $^ sibirocobombus:alexschroeder.ch/pdfs/

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
