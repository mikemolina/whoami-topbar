/*
 * SecSettings.js
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
import { ShowDebug } from '../MsgDebug.js';


/**
 * Class SecSettings.
 * Design tab of preferences and his actions for modify appearance of
 * the extension. This actions are: alignment, position and style label.
 */
class SecSettings extends Adw.PreferencesPage {
    static {
	GObject.registerClass(this);
    }

    /**
     * Constructor of tab Settings
     * @param metadata_arg Metadata information
     * @param settings_arg Preferences information
     */
    constructor(metadata_arg, settings_arg) {
	super({
	    title: _("Settings"),
            icon_name: "preferences-other-symbolic"
	});
	this.metadata = metadata_arg;
	this.settings = settings_arg;
	// Layout Group: Extension Settings
	const SettingsGroup = new Adw.PreferencesGroup({
            title: _("Configuration"),
            description: _("Customize the extension")
        });
	// * * * Layout Combo Row: button alignment selector * * *
	const buttonPositions = new Gtk.StringList();
	buttonPositions.append(_("Left"));
	buttonPositions.append(_("Center"));
	buttonPositions.append(_("Right"));
        const SettingsRow1 = new Adw.ComboRow({
	    title: _("Alignment in the top bar"),
            subtitle: _("Sets the alignment of the extension on the panel."),
	    model: buttonPositions,
	    selected: this.settings.get_enum("button-alignment")
        });
	// Layout Row 1
	SettingsGroup.add(SettingsRow1);
	// Declaration of event action-signal row 1
	SettingsRow1.connect("notify::selected", (widget) => {
	    let valueSgn1 = widget.get_selected(); // widget.get_selected() || widget.selected
	    let alignOpt = [_("left"), _("center"), _("right")];
	    // TRANSLATOR_NOTE: %s for string with alignment value
	    ShowDebug(_("Alignment value: %s").format(alignOpt[valueSgn1]), this.metadata.debug);
	    this.settings.set_enum("button-alignment", valueSgn1);
	});
	// * * * Layout Spin Row: spin-button for button position * * *
	const IndexAdjustment = new Gtk.Adjustment({
	    value: this.settings.get_int("button-position" ),
	    lower: -10,
	    upper: 10,
	    step_increment: 1,
	    page_increment: 1,
	    page_size: 0
	});
	const IndexSpin = new Gtk.SpinButton({
	    adjustment: IndexAdjustment,
	    climb_rate: 1,
	    digits: 0,
	    numeric: true,
	    valign: Gtk.Align.CENTER
	});
	const SettingsRow2 = new Adw.ActionRow({
	    title: _("Relative position"),
	    subtitle: _("Sets the position of the extension relative to another."),
	    activatable_widget: IndexSpin
	});
	SettingsRow2.add_suffix(IndexSpin);
	// Layout Row 2
	SettingsGroup.add(SettingsRow2);
	// Declaration of event action-signal row 2
	IndexSpin.connect("value-changed", (widget) => {
	    let valueSgn2 = widget.get_value(); // widget.get_value() || IndexSpin.get_adjustment().value
	    // TRANSLATOR_NOTE: %s for string with position value
	    ShowDebug(_("Position value: %s").format(valueSgn2), this.metadata.debug);
	    this.settings.set_int("button-position", valueSgn2);
	});
	// * * * Layout Switch: selector to disable/enable the extension style * * *
	const StyleSwitch = new Gtk.Switch({
	    valign: Gtk.Align.CENTER,
	    tooltip_text: _("Activate custom style"),
	    active: this.settings.get_boolean("activate-custom-style")
	});
	const SettingsRow3 = new Adw.ActionRow({
	    title: _("Activate custom style"),
	    subtitle: _("This allow to choose between a normal style or custom style for the extension."),
	    activatable_widget: StyleSwitch
	});
	SettingsRow3.add_suffix(StyleSwitch);
	// Layout Row 3
	SettingsGroup.add(SettingsRow3);
	// Declaration of event action-signal row 3
	StyleSwitch.connect("notify::active", (widget) => {
	    let valueSgn3 = widget.get_active();
	    let StyleForm = valueSgn3 ? _("custom") : _("normal");
	    // TRANSLATOR_NOTE: %s for string with style value
	    ShowDebug(_("Current style: %s").format(StyleForm), this.metadata.debug);
	    this.settings.set_boolean("activate-custom-style", valueSgn3);
	});
	// Layout End
	this.add(SettingsGroup);
    }
}

export {
    SecSettings
};
