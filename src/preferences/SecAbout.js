/*
 * SecAbout.js
 *
 * Whoami top bar GNOME Extension
 * Copyright (C) 2024 Miguel Molina
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import GObject from 'gi://GObject';
import { gettext as _ } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";
import { PACKAGE_VERSION } from "resource:///org/gnome/Shell/Extensions/js/misc/config.js";


/**
 * Class SecAbout.
 * Design tab for information about the extension. Here: title,
 * description, release version, GS version, author and license.
 */
class SecAbout extends Adw.PreferencesPage {
    static {
	GObject.registerClass(this);
    }
    
    /**
     * Constructor of tab About
     * @param metadata_arg Metadata information
     * @param settings_arg Preferences information
     */
    constructor(metadata_arg, settings_arg) {
	super({
	    title: _("About"),
            icon_name: "dialog-information-symbolic",
	});
	// Layout Group
	const AboutGroup = new Adw.PreferencesGroup();
	// Layout Box
	const AboutBox = new Gtk.Box({
	    orientation: Gtk.Orientation.VERTICAL,
	    hexpand: false,
	    vexpand: false
	});
	// Extension title
	const WhoamiExtensionTitle = new Gtk.Label({
	    label: '<span size="x-large" background="#003366" foreground="#DEDDDA"><b>Whoami Extension</b></span>',
	    use_markup: true,
	    margin_bottom: 15,
	    vexpand: true,
	    valign: Gtk.Align.FILL
	});
	// Extension description
	const WhoamiExtensionDescription = new Gtk.Label({
	    label: _("Show the effective user id in the top bar returned by whoami command."),
	    margin_bottom: 3,
	    hexpand: false,
	    vexpand: false
	});	
	// Layout Group
	const InfoGroup = new Adw.PreferencesGroup();
	// Extension version
	const ReleaseVersion = String(metadata_arg["version-name"] ?? _("Unknown"));
	const WhoamiExtensionVersion = new Adw.ActionRow({
	    title: _("Whoami Extension version")
	});
	WhoamiExtensionVersion.add_suffix(
	    new Gtk.Label({
		label: ReleaseVersion
	    })
	);
	// GNOME Shell version for the extension
	const GNOMEShellVersion = String(PACKAGE_VERSION);
	const WhoamiExtensionSupport = new Adw.ActionRow({
	    title: _("GNOME Shell version")
	});
	WhoamiExtensionSupport.add_suffix(
	    new Gtk.Label({
		label: GNOMEShellVersion
	    })
	);
	// Extension author
	const RepoGitHub = "<a href=\"https://github.com/mikemolina/whoami-topbar\">%s</a>";
	const WhoamiExtensionAuthor = new Adw.ActionRow({
	    title: _("Developer"),
	    tooltip_text: _("View in GitHub")
	});
	WhoamiExtensionAuthor.add_suffix(
	    new Gtk.Label({
		label: "%s".format(RepoGitHub.format("Mike Molina")),
		use_markup: true,
		hexpand: false,
		vexpand: false
	    })
	);	
	// Layout Group
	const LicenseGroup = new Adw.PreferencesGroup();
	// Layout Box
	const LicenseBox = new Gtk.Box({
	    orientation: Gtk.Orientation.VERTICAL,
	    valign: Gtk.Align.END,
	    vexpand: true
	});
	// Extension license
	const GPLv3 =
	      '<span size="small">' +
	      _("This program comes with ABSOLUTELY NO WARRANTY.") +
	      "\n" +
	      _("See the") +
	      ' <a href="https://www.gnu.org/licenses/gpl-3.0.html">' +
	      _("GNU General Public License, version 3 or later") +
	      "</a> " +
	      _("for details.") +
	      "</span>";
	const LicenseLabel = new Gtk.Label({
	    label: GPLv3,
	    use_markup: true,
	    justify: Gtk.Justification.CENTER,
	});
	// Layout About Extension Section
	AboutBox.append(WhoamiExtensionTitle);
	AboutBox.append(WhoamiExtensionDescription);
	AboutGroup.add(AboutBox);
	this.add(AboutGroup);
	InfoGroup.add(WhoamiExtensionVersion);
	InfoGroup.add(WhoamiExtensionSupport);
	InfoGroup.add(WhoamiExtensionAuthor);
	this.add(InfoGroup);
	LicenseBox.append(LicenseLabel);
	LicenseGroup.add(LicenseBox);
	this.add(LicenseGroup);
    }
}

export {
    SecAbout
};
