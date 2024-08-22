/*
 * extension.js
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

import {
    Extension,
    gettext as _
} from 'resource:///org/gnome/shell/extensions/extension.js';
import { WhoamiButton } from './WhoamiButton.js';
import { ShowDebug } from './MsgDebug.js';

const schema = "org.gnome.shell.extensions.whoami-topbar";   /**< Name schema file */


/**
 * Class WhoamiExtension.
 * Implement the adjustable extension in top bar showing the text
 * returned by command whoami.
 */
export default class WhoamiExtension extends Extension {
    /**
     * Initialization class
     * @param metadata Extension metadata information
     */
    constructor(metadata) {
        super(metadata);
    }
    
    /**
     * Enable extension
     */
    enable() {
	// TRANSLATOR_NOTE: %s for string metadata name
	ShowDebug(_("Enabling %s extension").format(this.metadata.name), this.metadata.debug);
	this.whoamiText = new WhoamiButton(
	    this.uuid,
	    this.metadata,
	    this.getSettings(schema)
	);
    }
    
    /**
     * Disable extension
     */
    disable() {
	// TRANSLATOR_NOTE: %s for string metadata name
	ShowDebug(_("Disabling %s extension").format(this.metadata.name), this.metadata.debug);
        this.whoamiText?.destroy();
        this.whoamiText = null;
    }
}
