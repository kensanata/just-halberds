all: Just-Halberds.pdf

clean:
	rm -f *.html *.pdf

%.pdf: %.html %.css
	weasyprint $< $@


%.html: %.html.tmp prefix suffix
	cat prefix $< suffix > $@

%.html.tmp: %.md
	python3 -m markdown \
		--extension=markdown.extensions.tables \
		--extension markdown.extensions.smarty \
		--file=$@ $<
