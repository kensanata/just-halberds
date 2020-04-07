all: Just-Halberds.pdf

clean:
	rm -f *.html *.pdf

upload: Just-Halberds.pdf Helle-Barden.pdf
	scp -P 882 $^ alexschroeder.ch:alexschroeder.ch/pdfs/

%.pdf: %.html %.css
	weasyprint $< $@

%.html: %-prefix %.html.tmp suffix
	cat $^ > $@

%.html.tmp: %.md
	python3 -m markdown \
		--extension=markdown.extensions.tables \
		--extension markdown.extensions.smarty \
		--extension markdown.extensions.attr_list \
		--file=$@ $<
