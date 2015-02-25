"use strict";
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2013 Grant Galitz
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * version 2 as published by the Free Software Foundation.
 * The full license is available at http://www.gnu.org/licenses/gpl.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 */
module.exports = getInputFunctions;
var keyZones = [
    //Use this to control the key mapping:
                ["right", [39]],
                ["left", [37]],
                ["up", [38]],
                ["down", [40]],
                ["a", [88, 74]],
                ["b", [90, 81, 89]],
                ["select", [16]],
                ["start", [13]],
                ["r", [50]],
                ["l", [49]]
];
function getInputFunctions(gba) {
  return {
    keyDown: curryKeyDown,
    keyUp: curryKeyUp,
    keyUpPreprocess: curryKeyUpPreprocess
  };

  function curryKeyDown(ev) {
    return keyDown(gba, ev);
  }

  function curryKeyUp(ev) {
    return keyUp(gba, ev);
  }

  function curryKeyUpPreprocess(ev) {
    return keyUpPreprocess(gba, ev);
  }
}
function keyDown(Iodine, e) {
    var keyCode = e.keyCode;
    var keyMapLength = keyZones.length;
    for (var keyMapIndex = 0; keyMapIndex < keyMapLength; ++keyMapIndex) {
        var keyCheck = keyZones[keyMapIndex];
        var keysMapped = keyCheck[1];
        var keysTotal = keysMapped.length;
        for (var index = 0; index < keysTotal; ++index) {
            if (keysMapped[index] == keyCode) {
                Iodine.keyDown(keyCheck[0]);
                try {
                    e.preventDefault();
                }
                catch (error) { }
            }
        }
    }
}
function keyUp(Iodine, e) {
    var keyCode = e.keyCode;
    var keyMapLength = keyZones.length;
    for (var keyMapIndex = 0; keyMapIndex < keyMapLength; ++keyMapIndex) {
        var keyCheck = keyZones[keyMapIndex];
        var keysMapped = keyCheck[1];
        var keysTotal = keysMapped.length;
        for (var index = 0; index < keysTotal; ++index) {
            if (keysMapped[index] == keyCode) {
                Iodine.keyUp(keyCheck[0]);
                try {
                    e.preventDefault();
                }
                catch (error) { }
            }
        }
    }
}
function keyUpPreprocess(Iodine, e) {
    switch (e.keyCode) {
        case 68:
            Iodine.incrementVolume(-0.04);
            break;
        case 82:
            Iodine.incrementVolume(0.04);
            break;
        case 51:
            Iodine.incrementSpeed(0.10);
            break;
        case 52:
            Iodine.incrementSpeed(-0.10);
            break;
        default:
            //Control keys / other
            keyUp(Iodine, e);
    }
}
