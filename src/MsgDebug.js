/*
 * MsgDebug.js
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

const LEVEL = 1;   /**< Debug level\n
		      1: Show logs with Textual Message severity\n
		      2: Show logs with Debug Message severity */


/**
 * Function to show debug text
 * @param text Text debug
 * @param flag Bool variable for show/hide text
 */
export function ShowDebug(text, flag) {
    if( flag ) {
	switch( LEVEL ) {
	case 1:
	    console.log(text);
	    break;
	case 2:
	    console.debug(text);
	    break;
	}
    }
}
