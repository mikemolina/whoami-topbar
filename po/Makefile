# -*- Makefile -*-
#
# po/Makefile - Makefile for Whoami top bar GNOME Shell Extension

# PO template file
POTFILE = $(extname).pot
# Localization in files
L10NFILES = $(addprefix ../src/, $(MODFILES)) \
	$(addprefix ../src/preferences/, $(PREFSFILES))


##############################
######## Localization ########
##############################

# Create PO template file with strings for the first time
l10n: $(POTFILE)
	@echo "A PO template file already exists for the '$(extname)' project."

$(POTFILE):
	test -f $@ || xgettext \
	  -L JavaScript \
	  -k_ \
	  --add-comments="TRANSLATOR_NOTE:" \
	  --from-code=utf-8 \
	  --no-wrap \
	  --copyright-holder="Miguel Molina" \
	  --package-name=$(pkgname) \
	  --package-version=$(pkgversion) \
	  -o $@ \
	  $(L10NFILES)
	msgfmt --statistics -o /dev/null $@
	@echo "$@ created."

# Update PO template file with new strings
# https://stackoverflow.com/q/7496156
update-l10n: $(POTFILE)
	touch addstrings.pot
	xgettext \
	  -L JavaScript \
	  -k_ \
	  --add-comments="TRANSLATOR_NOTE:" \
	  --from-code=utf-8 \
	  --no-wrap \
	  -o addstrings.pot \
	  $(L10NFILES)
	msgmerge \
	  --no-fuzzy-matching \
	  --no-wrap \
	  $(POTFILE) addstrings.pot > new.pot
	rm -f $(POTFILE) addstrings.pot
	mv new.pot $<
	msgfmt --statistics -o /dev/null $<
	@echo "$< updated."

##############################
#### Internationalization ####
##############################

# Create PO file with translations for language particular
# Use the ISO 639 standard  for defines the code language.  More info:
# https://www.gnu.org/software/gettext/manual/html_node/Language-Codes.html
i18n: $(POTFILE)
	@if ! [ -f $(PO_LANG).po ]; then \
	  echo "msginit --no-translator --no-wrap \\"; \
	  echo "  -l $(PO_LANG) -o $(PO_LANG).po -i $<"; \
	  msginit \
	    --no-translator \
	    --no-wrap \
	    -l $(PO_LANG) \
	    -o $(PO_LANG).po \
	    -i $<; \
	  echo "msgfmt --statistics -o /dev/null $(PO_LANG).po"; \
	  msgfmt --statistics -o /dev/null $(PO_LANG).po; \
	  echo "Edit the '$(PO_LANG).po' file to add your translations."; \
	else \
	  echo "A PO file already exists for the '$(PO_LANG)' language."; \
	fi

# Update translations catalog after add/modification the PO template file
update-i18n: $(POTFILE)
	@for f in *.po; do \
	  l=$$(basename $$f .po); \
	  echo "msgmerge -U -N --backup=none --no-wrap \\"; \
	  echo "  $$f $<"; \
	  msgmerge \
	  --update \
	  --no-fuzzy-matching \
	  --backup=none \
	  --no-wrap \
	  $$f $<; \
	  echo "Language '$$l' updated."; \
	  msgfmt -c -v -o /dev/null $$f; \
	done
