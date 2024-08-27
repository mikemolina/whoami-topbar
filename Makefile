# -*- Makefile -*-
#
# Makefile - Makefile for Whoami top bar GNOME Extension

prefix ?= ~/.local
extname = whoami-topbar
pkgname = $(extname)
pkgversion = 1.1
pkgdist = $(pkgname)-$(pkgversion)
pkgtarball = $(addsuffix .tar.xz,$(pkgdist))
pkgtarballsum = $(addsuffix .sha256,$(pkgtarball))
namespace = mikemolina.github.io
UUID = $(extname)@$(namespace)
SCHEMAID = org.gnome.shell.extensions.$(extname)

# Place installation: local (default) | system
PLACEINSTALL ?= local
# Use DESTDIR variable
ifdef DESTDIR
ifeq ($(PLACEINSTALL),local)
$(error Use DESTDIR variable only for Packaging Workflow)
endif
endif

# Directories
datadir = $(prefix)/share
gsedatadir = $(datadir)/gnome-shell/extensions
GNOME_EXTDIR = $(gsedatadir)/$(UUID)
PREFSDIR = $(GNOME_EXTDIR)/preferences
ifeq ($(PLACEINSTALL),local)
SCHEMASDIR = $(GNOME_EXTDIR)/schemas
LOCALEDIR = $(GNOME_EXTDIR)/locale
else
SCHEMASDIR = $(datadir)/glib-2.0/schemas
LOCALEDIR = $(datadir)/locale
endif

# Module files
MODFILES = extension.js prefs.js MsgDebug.js WhoamiButton.js
# Preferences files
PREFSFILES = SecAbout.js SecSettings.js
# Extension files
EXTNFILES = metadata.json stylesheet.css
# Schema files
SCHEMASRC = ./src/schemas/$(SCHEMAID).gschema.xml
ifeq ($(PLACEINSTALL),local)
SCHEMAOBJ = ./src/schemas/gschemas.compiled
else
SCHEMAOBJ =
endif
# Language to translate in a PO file
PO_LANG ?=
# List of translated po files
CATALOGPO = $(wildcard po/*.po)
CATALOGMO = $(patsubst po%,build%,$(CATALOGPO:.po=.mo))

# Export variables
export extname pkgname pkgversion MODFILES PREFSFILES PO_LANG


all:
	@echo "Makefile for Whoami top bar GNOME Shell Extension."
	@echo "Installation:"
	@echo "  make compile"
	@echo "  make install"
	@echo "Uninstallation:"
	@echo "  make uninstall"
	@echo "Extension package:"
	@echo "  make package"
	@echo "Localization and translation maintenance:"
	@echo "  make update-localization"
	@echo "  make update-translation"
	@echo "  make translation"
	@echo "Package for distribution:"
	@echo "  make dist"
	@echo "  make distcheck"
	@echo "Status project:"
	@echo "  make status"

compile: gschemasobj catalogobj

gschemasobj:  $(SCHEMAOBJ)

$(SCHEMAOBJ): $(SCHEMASRC)
ifeq ($(PLACEINSTALL),local)
	glib-compile-schemas --strict --targetdir=./src/schemas ./src/schemas
endif

catalogobj: $(CATALOGMO)

build/%.mo: po/%.po
	test -d build || mkdir build
	msgfmt -o $@ $<

localization:
	$(MAKE) -C po l10n

update-localization:
	$(MAKE) -C po update-l10n

translation:
ifdef PO_LANG 
	$(MAKE) -C po i18n
endif

update-translation:
	$(MAKE) -C po update-i18n

install: compile
	@if ! [ -d $(DESTDIR)$(GNOME_EXTDIR) ]; then \
	  echo "mkdir -p $(DESTDIR)$(GNOME_EXTDIR)"; \
	  mkdir -p $(DESTDIR)$(GNOME_EXTDIR); \
	fi
	@if ! [ -d  $(DESTDIR)$(PREFSDIR) ]; then \
	  echo "mkdir -p $(DESTDIR)$(PREFSDIR)"; \
	  mkdir -p $(DESTDIR)$(PREFSDIR); \
	fi
	@if ! [ -d  $(DESTDIR)$(SCHEMASDIR) ]; then \
	  echo "mkdir -p $(DESTDIR)$(SCHEMASDIR)"; \
	  mkdir -p $(DESTDIR)$(SCHEMASDIR); \
	fi
	@if ! [ -d $(DESTDIR)$(LOCALEDIR) ]; then \
	  echo "mkdir -p $(DESTDIR)$(LOCALEDIR)"; \
	  mkdir -p $(DESTDIR)$(LOCALEDIR); \
	fi
	@for f in $(EXTNFILES) $(MODFILES); do \
	  echo "cp -f ./src/$$f $(DESTDIR)$(GNOME_EXTDIR)"; \
	  cp -f ./src/$$f $(DESTDIR)$(GNOME_EXTDIR); \
	done
	@for f in $(PREFSFILES); do \
	  echo "cp -f ./src/preferences/$$f $(DESTDIR)$(PREFSDIR)"; \
	  cp -f ./src/preferences/$$f $(DESTDIR)$(PREFSDIR); \
	done
	@for f in $(SCHEMASRC) $(SCHEMAOBJ); do \
	  echo "cp -f $$f $(DESTDIR)$(SCHEMASDIR)"; \
	  cp -f $$f $(DESTDIR)$(SCHEMASDIR); \
	done
	@for m in $(CATALOGMO); do \
	  l=$$(basename $$m .mo); \
	  d=$(DESTDIR)$(LOCALEDIR)/$$l/LC_MESSAGES; \
	  echo "mkdir -p $$d"; \
	  mkdir -p $$d; \
	  echo "cp -f $$m $$d/$(UUID).mo"; \
	  cp -f $$m $$d/$(UUID).mo; \
	done

uninstall:
	@if [ -d $(DESTDIR)$(GNOME_EXTDIR) ]; then \
	  echo "rm -fR $(DESTDIR)$(GNOME_EXTDIR)"; \
	  rm -fR $(DESTDIR)$(GNOME_EXTDIR); \
	fi
ifeq ($(PLACEINSTALL),system)
	rm -f $(DESTDIR)$(SCHEMASDIR)/$(SCHEMAID).gschema.xml
	@for p in $(CATALOGPO); do \
	  l=$$(basename $$p .po); \
	  echo "rm -f $(DESTDIR)$(LOCALEDIR)/$$l/LC_MESSAGES/$(UUID).mo"; \
	  rm -f $(DESTDIR)$(LOCALEDIR)/$$l/LC_MESSAGES/$(UUID).mo; \
	done
endif

package:
	rm -fR ./_pack
	rm -f $(UUID).shell-extension.zip
	cp -R ./src ./_pack
	find ./_pack -type f -name "*~" -exec rm -f {} \;
	( \
	  cd ./_pack; \
	  gnome-extensions pack \
	  --force \
	  --podir=../po \
	  --extra-source=preferences \
	  --extra-source=WhoamiButton.js \
	  --extra-source=MsgDebug.js \
	  --extra-source=../COPYING \
	  --out-dir=..; \
	)
	rm -fR ./_pack
	@echo "Package $(UUID).shell-extension.zip created."

$(pkgtarball): AUTHORS COPYING ChangeLog.md LEAME.md README.md Makefile src po
	mkdir $(pkgdist)
	cp -R ./src $(pkgdist)
	cp -R ./po $(pkgdist)
	cp AUTHORS COPYING ChangeLog.md LEAME.md README.md Makefile $(pkgdist)
	find ./$(pkgdist) -type f -name "*~" -exec rm -f {} \;
	tar -cvJf $@ $(pkgdist)
	test -d $(pkgdist) && rm -fR $(pkgdist)

$(pkgtarballsum): $(pkgtarball)
	sha256sum $< > $@

dist: $(pkgtarball) $(pkgtarballsum)

distcheck: $(pkgtarball) $(pkgtarballsum)
	@if grep '$(shell sha256sum $(pkgtarball))' $(pkgtarballsum) > /dev/null; then \
	  echo "  Package $(pkgtarball) ready for his distribution!"; \
	else \
	  echo "  Error in packging for $(pkgtarball)."; \
	fi

clean:
	rm -f $(SCHEMAOBJ)
	rm -fR build

distclean:
	rm -f $(pkgtarball) $(pkgtarballsum)

status:
	@echo "Status project:"
	@if grep '"debug": true' src/metadata.json > /dev/null; then \
	  echo "  development mode"; \
	else \
	  echo "  distribution mode"; \
	fi
