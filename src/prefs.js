/*
 * prefs.js
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

import Gio from 'gi://Gio';
import {
    ExtensionPreferences,
    gettext as _
} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import { SecSettings } from './preferences/SecSettings.js';
import { SecAbout } from './preferences/SecAbout.js';

const schema = "org.gnome.shell.extensions.whoami-topbar";   /**< Name schema file */


/**
 * Class WhoamiTopBarPreferences.
 * Implements the window of preferences for the extension. The window
 * includes two tabs: Settings and About extension, respectively.
 */
export default class WhoamiTopBarPreferences extends ExtensionPreferences {
    /**
     * Constructor
     * @param metadata Metadata information
     */
    constructor(metadata) {
        super(metadata);
    }

    /**
     * Declaration Preferences Window
     * @param window Preferences window
     */
    fillPreferencesWindow(window) {
	// Extension Settings Section
	const sec_Settings = new SecSettings(this.metadata, this.getSettings(schema));
        window.add(sec_Settings);
	// About Extension Section
	const sec_About = new  SecAbout(this.metadata, this.getSettings(schema));
        window.add(sec_About);
    }
}
