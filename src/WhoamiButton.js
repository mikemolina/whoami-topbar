/*
 * WhoamiButton.js
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

import St from 'gi://St';
import Clutter from 'gi://Clutter'
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import { gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { ShowDebug } from './MsgDebug.js';


/**
 * Function for compatibility of the add_actor method of GNOME Shell
 * version 45 from version 46
 */
// Credits to OpenWeather Refined extension.
// Info: <https://gjs.guide/extensions/upgrading/gnome-shell-46.html#gjs>
function st13AddActor(parent, child) {
    if( parent.add_actor ) {
	parent.add_actor(child);
    } else {
	parent.add_child(child);
    }
}

/**
 * Function for compatibility of the remove_actor method of GNOME Shell
 * version 45 from version 46
 */
// Credits to OpenWeather Refined extension.
// Info: <https://gjs.guide/extensions/upgrading/gnome-shell-46.html#gjs>
function st13RemoveActor(parent, child) {
    if( parent.remove_actor ) {
	parent.remove_actor(child);
    } else {
	parent.remove_child(child);
    }
}

/**
 * Class WhoamiButton.
 * Creates a button and his label, using the return value of the whoami
 * command. Also, is implemented functions and statements for to
 * configure the appearance of the extension, since a preferences
 * window. The actions of configuration are: alignment, position and
 * style for the label.
 */
class WhoamiButton extends PanelMenu.Button {
    static {
	GObject.registerClass(this);
    }

    /**
     * Initialization of the constructor of the button
     * @param uuid_arg Unique identifier
     * @param metadata_arg Metadata information
     * @param settings_arg Preferences information
     */
    _init(uuid_arg, metadata_arg, settings_arg) {
	super._init();
	this.uuid = uuid_arg;
	this.metadata = metadata_arg;
	this.settings = settings_arg;
	this.whoami_Label = null;
	this.whoami_Button = null;
	this.whoami_Alignment = this.settings.get_string("button-alignment");
	this.whoami_Position = this.settings.get_int("button-position");
	this.whoami_StyleBool = this.settings.get_boolean("activate-custom-style");
	this.settingChangedSignals = [];
	this.CreateButton();
	this.connect("destroy", this.goDestroy.bind(this));
    }
    
    /**
     * Creates button, his layout and interactions with the preferences
     */
    CreateButton() {
	// * * * Extension backend: query whoami command * * *
	let username = "";
	let stdout = GLib.get_user_name();
	if( stdout.length > 0) {
	    username = stdout;
	    username = username.replace('\n', '');
	} else {
	    username = "None name";
	}
	if( !(username.match(/none/i) === null) ) {
	    // TRANSLATOR_NOTE: %s for string with boolean result
	    ShowDebug(_("Command result: %s").format(res_bool.toString()), this.metadata.debug);
	    ShowDebug(_("whoami command error."), this.metadata.debug);
	}
	// * * * Extension frontend: text in panel * * *
	let bin = new St.Bin();
	st13AddActor(this, bin);
	// Layout Text
	this.whoami_Label = new St.Label({
	    style_class: "whoami-label_style-0",
	    text : username,
	    y_align: Clutter.ActorAlign.CENTER
	});
	// Layout Button
	this.whoami_Button = new St.Bin({
	    style_class: "panel-button",
	    x_expand: true,
	    y_expand: false
	});
	// Layout Extension
	st13AddActor(this.whoami_Button, this.whoami_Label);
	this.set_track_hover(false);
	st13AddActor(bin, this.whoami_Button);
	// Show 'whoami' command in the panel
	Main.panel.addToStatusArea(
	    this.uuid,
	    this,
	    this.whoami_Position,
	    this.whoami_Alignment
	);
	// Adjust the button alignment
	// TRANSLATOR_NOTE: %s for string with alignment value
	ShowDebug(_("Extension's alignment: %s").format(this.whoami_Alignment), this.metadata.debug);
	this.addSettingChangedSignal("button-alignment", this.MoveToPosition.bind(this));
	// Adjust the button position
	// TRANSLATOR_NOTE: %s for string with position value
	ShowDebug(_("Extension's position: %s").format(this.whoami_Position), this.metadata.debug);
	this.addSettingChangedSignal("button-position", this.MoveToPosition.bind(this));
	// Adjust the label style
	// TRANSLATOR_NOTE: %s for string with style value
	ShowDebug(_("Extension's style: %s").format(this.whoami_StyleBool), this.metadata.debug);
	this.addSettingChangedSignal("activate-custom-style", this.SetStyleLabel.bind(this));
    }
    
    /**
     * Move extension in the top panel
     */
    MoveToPosition() {
	st13RemoveActor(this.get_parent(), this);
	this.whoami_Alignment = this.settings.get_string("button-alignment");
	this.whoami_Position = this.settings.get_int("button-position");
	let places = {
	    left: Main.panel._leftBox,
	    center: Main.panel._centerBox,
	    right: Main.panel._rightBox
	};
	places[this.whoami_Alignment].insert_child_at_index(
	    this,
	    this.whoami_Position
	);
    }
    
    /**
     * Adjust label style
     */
    // Credits to Simple net speed Gnome Extension.
    SetStyleLabel() {
	this.whoami_StyleBool = this.settings.get_boolean("activate-custom-style");
	let style_form = "";
	if( this.whoami_StyleBool ) {
	    style_form = "whoami-label_style-1";
	} else {
	    style_form = "whoami-label_style-0";
	}
	this.whoami_Label .set_style_class_name(style_form);
        return this.whoami_Label;
    }
    
    /**
     * Statement for array handling action-signal event modified in
     * extension preferences
     * @param key Name of the key that changed
     * @param callback Function that receives the signal
     */
    // Credits to Gnome Shell Extension Freon.
    addSettingChangedSignal(key, callback) {
        this.settingChangedSignals.push(this.settings.connect("changed::" + key, callback));
    }
    
    /**
     * Destructor for array handling modified event-action
     */
    goDestroy() {
	for (let signal of this.settingChangedSignals){
	    this.settings.disconnect(signal);
        }
    }
}

export {
    WhoamiButton
};
