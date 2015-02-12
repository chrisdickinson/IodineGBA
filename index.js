"use strict";
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function getInt8Array(size_t) {
    try {
        return new Int8Array(size_t);
    }
    catch (error) {
        return getArray(size_t);
    }
}
function getUint8Array(size_t) {
    try {
        return new Uint8Array(size_t);
    }
    catch (error) {
        return getArray(size_t);
    }
}
function getInt16Array(size_t) {
    try {
        return new Int16Array(size_t);
    }
    catch (error) {
        return getArray(size_t);
    }
}
function getUint16Array(size_t) {
    try {
        return new Uint16Array(size_t);
    }
    catch (error) {
        return getArray(size_t);
    }
}
function getUint16View(typed_array) {
    try {
        return new Uint16Array(typed_array.buffer);
    }
    catch (error) {
        return null;
    }
}
function getInt32Array(size_t) {
    try {
        return new Int32Array(size_t);
    }
    catch (error) {
        return getArray(size_t);
    }
}
function getInt32View(typed_array) {
    try {
        return new Int32Array(typed_array.buffer);
    }
    catch (error) {
        return null;
    }
}
function getUint32Array(size_t) {
    try {
        return new Uint32Arrasy(size_t);
    }
    catch (error) {
        return getArray(size_t);
    }
}
function getFloat32Array(size_t) {
    try {
        return new Float32Array(size_t);
    }
    catch (error) {
        return getArray(size_t);
    }
}
function getArray(size_t) {
    var genericArray = [];
    for (var size_index = 0; size_index < size_t; ++size_index) {
        genericArray[size_index] = 0;
    }
    return genericArray;
}
var __VIEWS_SUPPORTED__ = getUint16View(getInt32Array(1)) !== null;
var __LITTLE_ENDIAN__ = (function () {
    if (__VIEWS_SUPPORTED__) {
        var test = getInt32Array(1);
        test[0] = 1;
        var test2 = getUint16View(test);
        if (test2[0] == 1) {
            return true;
        }
    }
    return false;
})();
;
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceCartridge(IOCore) {
    this.IOCore = IOCore;
    this.initialize();
}
GameBoyAdvanceCartridge.prototype.initialize = function () {
    this.flash_is128 = false;
    this.flash_isAtmel = false;
    this.ROM = this.getROMArray(this.IOCore.ROM);
    this.ROM16 = getUint16View(this.ROM);
    this.ROM32 = getInt32View(this.ROM);
    this.decodeName();
    this.decodeFlashType();
}
GameBoyAdvanceCartridge.prototype.getROMArray = function (old_array) {
    this.ROMLength = Math.min((old_array.length >> 2) << 2, 0x2000000);
    this.EEPROMStart = ((this.ROMLength | 0) > 0x1000000) ? Math.max(this.ROMLength | 0, 0x1FFFF00) : 0x1000000;
    var newArray = getUint8Array(this.ROMLength | 0);
    for (var index = 0; (index | 0) < (this.ROMLength | 0); index = ((index | 0) + 1) | 0) {
        newArray[index | 0] = old_array[index | 0] | 0;
    }
    return newArray;
}
GameBoyAdvanceCartridge.prototype.decodeName = function () {
    this.name = "GUID_";
    if ((this.ROMLength | 0) >= 0xC0) {
        for (var address = 0xAC; (address | 0) < 0xB3; address = ((address | 0) + 1) | 0) {
            if ((this.ROM[address | 0] | 0) > 0) {
                this.name += String.fromCharCode(this.ROM[address | 0] | 0);
            }
            else {
                this.name += "_";
            }
        }
    }
}
GameBoyAdvanceCartridge.prototype.decodeFlashType = function () {
    this.flash_is128 = false;
    this.flash_isAtmel = false;
    var flash_types = 0;
    var F = ("F").charCodeAt(0) & 0xFF;
    var L = ("L").charCodeAt(0) & 0xFF;
    var A = ("A").charCodeAt(0) & 0xFF;
    var S = ("S").charCodeAt(0) & 0xFF;
    var H = ("H").charCodeAt(0) & 0xFF;
    var underScore = ("_").charCodeAt(0) & 0xFF;
    var five = ("5").charCodeAt(0) & 0xFF;
    var one = ("1").charCodeAt(0) & 0xFF;
    var two = ("2").charCodeAt(0) & 0xFF;
    var M = ("M").charCodeAt(0) & 0xFF;
    var V = ("V").charCodeAt(0) & 0xFF;
    var length = ((this.ROM.length | 0) - 12) | 0;
    for (var index = 0; (index | 0) < (length | 0); index = ((index | 0) + 4) | 0) {
        if ((this.ROM[index | 0] | 0) == (F | 0)) {
            if ((this.ROM[index | 1] | 0) == (L | 0)) {
                if ((this.ROM[index | 2] | 0) == (A | 0)) {
                    if ((this.ROM[index | 3] | 0) == (S | 0)) {
                        var tempIndex = ((index | 0) + 4) | 0;
                        if ((this.ROM[tempIndex | 0] | 0) == (H | 0)) {
                            if ((this.ROM[tempIndex | 1] | 0) == (underScore | 0)) {
                                if ((this.ROM[tempIndex | 2] | 0) == (V | 0)) {
                                    flash_types |= 1;
                                }
                            }
                            else if ((this.ROM[tempIndex | 1] | 0) == (five | 0)) {
                                if ((this.ROM[tempIndex | 2] | 0) == (one | 0)) {
                                    if ((this.ROM[tempIndex | 3] | 0) == (two | 0)) {
                                        tempIndex = ((tempIndex | 0) + 4) | 0;
                                        if ((this.ROM[tempIndex | 0] | 0) == (underScore | 0)) {
                                            if ((this.ROM[tempIndex | 1] | 0) == (V | 0)) {
                                                flash_types |= 2;
                                            }
                                        }
                                    }
                                }
                            }
                            else if ((this.ROM[tempIndex | 1] | 0) == (one | 0)) {
                                if ((this.ROM[tempIndex | 2] | 0) == (M | 0)) {
                                    if ((this.ROM[tempIndex | 3] | 0) == (underScore | 0)) {
                                        tempIndex = ((tempIndex | 0) + 4) | 0;
                                        if ((this.ROM[tempIndex | 0] | 0) == (V | 0)) {
                                            flash_types |= 4;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    this.flash_is128 = ((flash_types | 0) >= 4);
    this.flash_isAtmel = ((flash_types | 0) <= 1);
}
GameBoyAdvanceCartridge.prototype.readROMOnly8 = function (address) {
    address = address | 0;
    var data = 0;
    if ((address | 0) < (this.ROMLength | 0)) {
        data = this.ROM[address & 0x1FFFFFF] | 0;
    }
    return data | 0;
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceCartridge.prototype.readROMOnly16 = function (address) {
        address = address | 0;
        var data = 0;
        if ((address | 0) < (this.ROMLength | 0)) {
            data = this.ROM16[(address >> 1) & 0xFFFFFF] | 0;
        }
        return data | 0;
    }
    GameBoyAdvanceCartridge.prototype.readROMOnly32 = function (address) {
        address = address | 0;
        var data = 0;
        if ((address | 0) < (this.ROMLength | 0)) {
            data = this.ROM32[(address >> 2) & 0x7FFFFF] | 0;
        }
        return data | 0;
    }
}
else {
    GameBoyAdvanceCartridge.prototype.readROMOnly16 = function (address) {
        address = address | 0;
        var data = 0;
        if ((address | 0) < (this.ROMLength | 0)) {
            data = this.ROM[address] | (this.ROM[address | 1] << 8);
        }
        return data | 0;
    }
    GameBoyAdvanceCartridge.prototype.readROMOnly32 = function (address) {
        address = address | 0;
        var data = 0;
        if ((address | 0) < (this.ROMLength | 0)) {
            data = this.ROM[address] | (this.ROM[address | 1] << 8) | (this.ROM[address | 2] << 16)  | (this.ROM[address | 3] << 24);
        }
        return data | 0;
    }
}
GameBoyAdvanceCartridge.prototype.readROM8 = function (address) {
    address = address | 0;
    var data = 0;
    if ((address | 0) > 0xC9) {
        //Definitely ROM:
        data = this.readROMOnly8(address | 0) | 0;
    }
    else {
        //Possibly GPIO:
        data = this.IOCore.saves.readGPIO8(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceCartridge.prototype.readROM16 = function (address) {
    address = address | 0;
    var data = 0;
    if ((address | 0) > 0xC9) {
        //Definitely ROM:
        data = this.readROMOnly16(address | 0) | 0;
    }
    else {
        //Possibly GPIO:
        data = this.IOCore.saves.readGPIO16(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceCartridge.prototype.readROM32 = function (address) {
    address = address | 0;
    var data = 0;
    if ((address | 0) > 0xC9) {
        //Definitely ROM:
        data = this.readROMOnly32(address | 0) | 0;
    }
    else {
        //Possibly GPIO:
        data = this.IOCore.saves.readGPIO32(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceCartridge.prototype.readROM8Space2 = function (address) {
    address = address | 0;
    var data = 0;
    if ((address | 0) >= 0xC4 && (address | 0) < 0xCA) {
        //Possibly GPIO:
        data = this.IOCore.saves.readGPIO8(address | 0) | 0;
    }
    else if ((address | 0) >= (this.EEPROMStart | 0)) {
        //Possibly EEPROM:
        data = this.IOCore.saves.readEEPROM8(address | 0) | 0;
    }
    else {
        //Definitely ROM:
        data = this.readROMOnly8(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceCartridge.prototype.readROM16Space2 = function (address) {
    address = address | 0;
    var data = 0;
    if ((address | 0) >= 0xC4 && (address | 0) < 0xCA) {
        //Possibly GPIO:
        data = this.IOCore.saves.readGPIO16(address | 0) | 0;
    }
    else if ((address | 0) >= (this.EEPROMStart | 0)) {
        //Possibly EEPROM:
        data = this.IOCore.saves.readEEPROM16(address | 0) | 0;
    }
    else {
        //Definitely ROM:
        data = this.readROMOnly16(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceCartridge.prototype.readROM32Space2 = function (address) {
    address = address | 0;
    var data = 0;
    if ((address | 0) >= 0xC4 && (address | 0) < 0xCA) {
        //Possibly GPIO:
        data = this.IOCore.saves.readGPIO32(address | 0) | 0;
    }
    else if ((address | 0) >= (this.EEPROMStart | 0)) {
        //Possibly EEPROM:
        data = this.IOCore.saves.readEEPROM32(address | 0) | 0;
    }
    else {
        //Definitely ROM:
        data = this.readROMOnly32(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceCartridge.prototype.writeROM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((address | 0) >= 0xC4 && (address | 0) < 0xCA) {
        //GPIO Chip (RTC):
        this.IOCore.saves.writeGPIO8(address | 0, data | 0);
    }
    else if ((address | 0) >= (this.EEPROMStart | 0)) {
        //Possibly EEPROM:
        this.IOCore.saves.writeEEPROM8(address | 0, data | 0);
    }
}
GameBoyAdvanceCartridge.prototype.writeROM16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((address | 0) >= 0xC4 && (address | 0) < 0xCA) {
        //GPIO Chip (RTC):
        this.IOCore.saves.writeGPIO16(address | 0, data | 0);
    }
    else if ((address | 0) >= (this.EEPROMStart | 0)) {
        //Possibly EEPROM:
        this.IOCore.saves.writeEEPROM16(address | 0, data | 0);
    }
}
GameBoyAdvanceCartridge.prototype.writeROM32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((address | 0) >= 0xC4 && (address | 0) < 0xCA) {
        //GPIO Chip (RTC):
        this.IOCore.saves.writeGPIO32(address | 0, data | 0);
    }
    else if ((address | 0) >= (this.EEPROMStart | 0)) {
        //Possibly EEPROM:
        this.IOCore.saves.writeEEPROM32(address | 0, data | 0);
    }
}
GameBoyAdvanceCartridge.prototype.nextIRQEventTime = function () {
    //Nothing yet implement that would fire an IRQ:
    return -1;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceDMA(IOCore) {
    this.IOCore = IOCore;
    this.initialize();
}
GameBoyAdvanceDMA.prototype.DMA_REQUEST_TYPE = {
    PROHIBITED:        0,
    IMMEDIATE:         0x1,
    V_BLANK:           0x2,
    H_BLANK:           0x4,
    FIFO_A:            0x8,
    FIFO_B:            0x10,
    DISPLAY_SYNC:      0x20
}
GameBoyAdvanceDMA.prototype.initialize = function () {
    this.channels = [
        new GameBoyAdvanceDMA0(this),
        new GameBoyAdvanceDMA1(this),
        new GameBoyAdvanceDMA2(this),
        new GameBoyAdvanceDMA3(this)
    ];
    this.currentMatch = -1;
    this.fetch = 0;
    this.currentDMA = null;
}
GameBoyAdvanceDMA.prototype.writeDMASource0 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMASource0(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMASource1 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMASource1(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMASource2 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMASource2(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMASource3 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMASource3(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMADestination0 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMADestination0(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMADestination1 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMADestination1(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMADestination2 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMADestination2(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMADestination3 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMADestination3(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMAWordCount0 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMAWordCount0(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMAWordCount1 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMAWordCount1(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMAControl0 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMAControl0(data | 0);
}
GameBoyAdvanceDMA.prototype.readDMAControl0 = function (dmaChannel) {
    dmaChannel = dmaChannel | 0;
    return this.channels[dmaChannel | 0].readDMAControl0() | 0;
}
GameBoyAdvanceDMA.prototype.writeDMAControl1 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMAControl1(data | 0);
}
GameBoyAdvanceDMA.prototype.readDMAControl1 = function (dmaChannel) {
    dmaChannel = dmaChannel | 0;
    return this.channels[dmaChannel | 0].readDMAControl1() | 0;
}
GameBoyAdvanceDMA.prototype.getCurrentFetchValue = function () {
    return this.fetch | 0;
}
GameBoyAdvanceDMA.prototype.soundFIFOARequest = function () {
    this.channels[1].requestDMA(this.DMA_REQUEST_TYPE.FIFO_A | 0);
}
GameBoyAdvanceDMA.prototype.soundFIFOBRequest = function () {
    this.channels[2].requestDMA(this.DMA_REQUEST_TYPE.FIFO_B | 0);
}
GameBoyAdvanceDMA.prototype.gfxHBlankRequest = function () {
    this.requestDMA(this.DMA_REQUEST_TYPE.H_BLANK | 0);
}
GameBoyAdvanceDMA.prototype.gfxVBlankRequest = function () {
    this.requestDMA(this.DMA_REQUEST_TYPE.V_BLANK | 0);
}
GameBoyAdvanceDMA.prototype.gfxDisplaySyncRequest = function () {
    this.channels[3].requestDMA(this.DMA_REQUEST_TYPE.DISPLAY_SYNC | 0);
}
GameBoyAdvanceDMA.prototype.gfxDisplaySyncEnableCheck = function () {
	//Reset the display sync & reassert DMA enable line:
    this.channels[3].enabled &= ~this.DMA_REQUEST_TYPE.DISPLAY_SYNC;
	this.channels[3].requestDisplaySync();
    this.update();
}
GameBoyAdvanceDMA.prototype.requestDMA = function (DMAType) {
    DMAType = DMAType | 0;
    this.channels[0].requestDMA(DMAType | 0);
    this.channels[1].requestDMA(DMAType | 0);
    this.channels[2].requestDMA(DMAType | 0);
    this.channels[3].requestDMA(DMAType | 0);
}
GameBoyAdvanceDMA.prototype.update = function () {
    var lowestDMAFound = 4;
    for (var dmaPriority = 0; (dmaPriority | 0) < 4; dmaPriority = ((dmaPriority | 0) + 1) | 0) {
        if ((this.channels[dmaPriority | 0].enabled & this.channels[dmaPriority | 0].pending) > 0) {
            lowestDMAFound = dmaPriority | 0;
            break;
        }
    }
    if ((lowestDMAFound | 0) < 4) {
        //Found an active DMA:
        if ((this.currentMatch | 0) == -1) {
            this.IOCore.flagDMA();
        }
        if ((this.currentMatch | 0) != (lowestDMAFound | 0)) {
            //Re-broadcasting on address bus, so non-seq:
            this.IOCore.wait.NonSequentialBroadcast();
            this.currentMatch = lowestDMAFound | 0;
            //Get the current active DMA:
            this.currentDMA = this.channels[this.currentMatch & 0x3];
        }
    }
    else if ((this.currentMatch | 0) != -1) {
        //No active DMA found:
        this.currentMatch = -1;
        this.IOCore.deflagDMA();
        this.IOCore.updateCoreSpill();
    }
}
GameBoyAdvanceDMA.prototype.perform = function () {
    //Call the correct channel to process:
    this.currentDMA.handleDMACopy();
}
GameBoyAdvanceDMA.prototype.nextEventTime = function () {
    var clocks = this.channels[0].nextEventTime() | 0;
    var workbench = this.channels[1].nextEventTime() | 0;
    if ((clocks | 0) >= 0) {
        if ((workbench | 0) >= 0) {
            clocks = Math.min(clocks | 0, workbench | 0) | 0;
        }
    }
    else {
        clocks = workbench | 0;
    }
    workbench = this.channels[2].nextEventTime() | 0;
    if ((clocks | 0) >= 0) {
        if ((workbench | 0) >= 0) {
            clocks = Math.min(clocks | 0, workbench | 0) | 0;
        }
    }
    else {
        clocks = workbench | 0;
    }
    workbench = this.channels[3].nextEventTime() | 0;
    if ((clocks | 0) >= 0) {
        if ((workbench | 0) >= 0) {
            clocks = Math.min(clocks | 0, workbench | 0) | 0;
        }
    }
    else {
        clocks = workbench | 0;
    }
    return clocks | 0;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceEmulator() {
    this.settings = {
        "SKIPBoot":false,                   //Skip the BIOS boot screen.
        "audioVolume":1,                    //Starting audio volume.
        "audioBufferUnderrunLimit":8,       //Audio buffer minimum span amount over x interpreter iterations.
        "audioBufferDynamicLimit":2,        //Audio buffer dynamic minimum span amount over x interpreter iterations.
        "audioBufferSize":20,               //Audio buffer maximum span amount over x interpreter iterations.
        "timerIntervalRate":16,             //How often the emulator core is called into (in milliseconds).
        "emulatorSpeed":1,                  //Speed multiplier of the emulator.
        "metricCollectionMinimum":30,       //How many cycles to collect before determining speed.
        "dynamicSpeed":true                 //Whether to actively change the target speed for best user experience.
    }
    this.audioFound = false;                  //Do we have audio output sink found yet?
    this.loaded = false;                      //Did we initialize IodineGBA?
    this.faultFound = false;                  //Did we run into a fatal error?
    this.paused = true;                       //Are we paused?
    this.offscreenWidth = 240;                //Width of the GBA screen.
    this.offscreenHeight = 160;               //Height of the GBA screen.
    this.BIOS = [];                           //Initialize BIOS as not existing.
    this.ROM = [];                            //Initialize BIOS as not existing.
    //Cache some frame buffer lengths:
    this.offscreenRGBCount = this.offscreenWidth * this.offscreenHeight * 3;
    //Graphics buffers to generate in advance:
    this.frameBuffer = getInt32Array(this.offscreenRGBCount);        //The internal buffer to composite to.
    this.swizzledFrame = getUint8Array(this.offscreenRGBCount);      //The swizzled output buffer that syncs to the internal framebuffer on v-blank.
    this.audioUpdateState = false;            //Do we need to update the sound core with new info?
    this.saveExportHandler = null;            //Save export handler attached by GUI.
    this.saveImportHandler = null;            //Save import handler attached by GUI.
    this.speedCallback = null;                //Speed report handler attached by GUI.
    this.graphicsFrameCallback = null;        //Graphics blitter handler attached by GUI.
    this.clockCyclesSinceStart = 0;           //Clocking hueristics reference
    this.metricCollectionCounted = 0;         //Clocking hueristics reference
    this.metricStart = null;                  //Date object reference.
    this.dynamicSpeedCounter = 0;             //Rate limiter counter for dynamic speed.
    this.audioNumSamplesTotal = 0;            //Buffer size.
    this.calculateTimings();                  //Calculate some multipliers against the core emulator timer.
    this.generateCoreExposed();               //Generate a limit API for the core to call this shell object.
}
GameBoyAdvanceEmulator.prototype.generateCoreExposed = function () {
    var parentObj = this;
    this.coreExposed = {
        "outputAudio":function (l, r) {
            parentObj.outputAudio(l, r);
        },
        "frameBuffer":parentObj.frameBuffer,
        "prepareFrame":function () {
            parentObj.prepareFrame();
        }
    }
}
GameBoyAdvanceEmulator.prototype.play = function () {
    if (this.paused) {
        this.startTimer();
        this.paused = false;
        if (!this.loaded) {
            this.initializeCore();
            this.loaded = true;
            this.importSave();
        }
    }
}
GameBoyAdvanceEmulator.prototype.pause = function () {
    if (!this.paused) {
        this.clearTimer();
        this.exportSave();
        this.paused = true;
    }
}
GameBoyAdvanceEmulator.prototype.stop = function () {
    this.faultFound = false;
    this.loaded = false;
    this.audioUpdateState = this.audioFound;
    this.pause();
}
GameBoyAdvanceEmulator.prototype.restart = function () {
    if (this.loaded) {
        this.faultFound = false;
        this.exportSave();
        this.initializeCore();
        this.importSave();
        this.audioUpdateState = this.audioFound;
        this.setSpeed(1);
    }
}
GameBoyAdvanceEmulator.prototype.clearTimer = function () {
    clearInterval(this.timer);
    this.resetMetrics();
}
GameBoyAdvanceEmulator.prototype.startTimer = function () {
    this.clearTimer();
    var parentObj = this;
    this.timer = setInterval(function (){parentObj.timerCallback()}, this.settings.timerIntervalRate);
}
GameBoyAdvanceEmulator.prototype.timerCallback = function () {
    //Check to see if web view is not hidden, if hidden don't run due to JS timers being inaccurate on page hide:
    if (!document.hidden && !document.msHidden && !document.mozHidden && !document.webkitHidden) {
        if (!this.faultFound && this.loaded) {                          //Any error pending or no ROM loaded is a show-stopper!
            this.iterationStartSequence();                              //Run start of iteration stuff.
            this.IOCore.enter(this.CPUCyclesTotal | 0);               //Step through the emulation core loop.
            this.iterationEndSequence();                                //Run end of iteration stuff.
        }
        else {
            this.pause();                                                //Some pending error is preventing execution, so pause.
        }
    }
}
GameBoyAdvanceEmulator.prototype.iterationStartSequence = function () {
    this.calculateSpeedPercentage();                                    //Calculate the emulator realtime run speed heuristics.
    this.faultFound = true;                                             //If the end routine doesn't unset this, then we are marked as having crashed.
    this.audioUnderrunAdjustment();                                     //If audio is enabled, look to see how much we should overclock by to maintain the audio buffer.
    this.audioPushNewState();                                           //Check to see if we need to update the audio core for any output changes.
}
GameBoyAdvanceEmulator.prototype.iterationEndSequence = function () {
    this.faultFound = false;                                            //If core did not throw while running, unset the fatal error flag.
    this.clockCyclesSinceStart += this.CPUCyclesTotal;                  //Accumulate tracking.
}
GameBoyAdvanceEmulator.prototype.attachROM = function (ROM) {
    this.stop();
    this.ROM = ROM;
}
GameBoyAdvanceEmulator.prototype.attachBIOS = function (BIOS) {
    this.stop();
    this.BIOS = BIOS;
}
GameBoyAdvanceEmulator.prototype.getGameName = function () {
    if (!this.faultFound && this.loaded) {
        return this.IOCore.cartridge.name;
    }
    else {
        return "";
    }
}
GameBoyAdvanceEmulator.prototype.attachSaveExportHandler = function (handler) {
    if (typeof handler == "function") {
        this.saveExportHandler = handler;
    }
}
GameBoyAdvanceEmulator.prototype.attachSaveImportHandler = function (handler) {
    if (typeof handler == "function") {
        this.saveImportHandler = handler;
    }
}
GameBoyAdvanceEmulator.prototype.attachSpeedHandler = function (handler) {
    if (typeof handler == "function") {
        this.speedCallback = handler;
    }
}
GameBoyAdvanceEmulator.prototype.importSave = function () {
    if (this.saveImportHandler) {
        var name = this.getGameName();
        if (name != "") {
            var save = this.saveImportHandler(name);
            var saveType = this.saveImportHandler("TYPE_" + name);
            if (save && saveType && !this.faultFound && this.loaded) {
                var length = save.length | 0;
                var convertedSave = getUint8Array(length | 0);
                if ((length | 0) > 0) {
                    for (var index = 0; (index | 0) < (length | 0); index = ((index | 0) + 1) | 0) {
                        convertedSave[index | 0] = save[index | 0] & 0xFF;
                    }
                    this.IOCore.saves.importSave(convertedSave, saveType | 0);
                }
            }
        }
    }
}
GameBoyAdvanceEmulator.prototype.exportSave = function () {
    if (this.saveExportHandler && !this.faultFound && this.loaded) {
        var save = this.IOCore.saves.exportSave();
        var saveType = this.IOCore.saves.exportSaveType();
        if (save != null && saveType != null) {
            this.saveExportHandler(this.IOCore.cartridge.name, save);
            this.saveExportHandler("TYPE_" + this.IOCore.cartridge.name, saveType | 0);
        }
    }
}
GameBoyAdvanceEmulator.prototype.setSpeed = function (speed) {
    var speed = Math.min(Math.max(parseFloat(speed), 0.01), 10);
    this.resetMetrics();
    if (speed != this.settings.emulatorSpeed) {
        this.settings.emulatorSpeed = speed;
        this.calculateTimings();
        this.reinitializeAudio();
    }
}
GameBoyAdvanceEmulator.prototype.incrementSpeed = function (delta) {
    this.setSpeed(parseFloat(delta) + this.settings.emulatorSpeed);
}
GameBoyAdvanceEmulator.prototype.getSpeed = function (speed) {
    return this.settings.emulatorSpeed;
}
GameBoyAdvanceEmulator.prototype.changeCoreTimer = function (newTimerIntervalRate) {
    this.settings.timerIntervalRate = Math.max(parseInt(newTimerIntervalRate, 10), 1);
    if (!this.paused) {                        //Set up the timer again if running.
        this.clearTimer();
        this.startTimer();
    }
    this.calculateTimings();
    this.reinitializeAudio();
}
GameBoyAdvanceEmulator.prototype.resetMetrics = function () {
    this.clockCyclesSinceStart = 0;
    this.metricCollectionCounted = 0;
    this.metricStart = new Date();
}
GameBoyAdvanceEmulator.prototype.calculateTimings = function () {
    this.clocksPerSecond = this.settings.emulatorSpeed * 0x1000000;
    this.CPUCyclesTotal = this.CPUCyclesPerIteration = (this.clocksPerSecond / 1000 * this.settings.timerIntervalRate) | 0;
    this.dynamicSpeedCounter = 0;
}
GameBoyAdvanceEmulator.prototype.calculateSpeedPercentage = function () {
    if (this.metricStart) {
        if (this.metricCollectionCounted >= this.settings.metricCollectionMinimum) {
            if (this.speedCallback) {
                var metricEnd = new Date();
                var timeDiff = Math.max(metricEnd.getTime() - this.metricStart.getTime(), 1);
                var result = ((this.settings.timerIntervalRate * this.clockCyclesSinceStart / timeDiff) / this.CPUCyclesPerIteration) * 100;
                this.speedCallback(result.toFixed(2) + "%");
            }
            this.resetMetrics();
        }
    }
    else {
        this.resetMetrics();
    }
    ++this.metricCollectionCounted;
}
GameBoyAdvanceEmulator.prototype.initializeCore = function () {
    //Setup a new instance of the i/o core:
    this.IOCore = new GameBoyAdvanceIO(this.settings, this.coreExposed, this.BIOS, this.ROM);
}
GameBoyAdvanceEmulator.prototype.keyDown = function (keyPressed) {
    if (!this.paused) {
        this.IOCore.joypad.keyPress(keyPressed);
    }
}
GameBoyAdvanceEmulator.prototype.keyUp = function (keyReleased) {
    if (!this.paused) {
        this.IOCore.joypad.keyRelease(keyReleased);
    }
}
GameBoyAdvanceEmulator.prototype.attachGraphicsFrameHandler = function (handler) {
    if (typeof handler == "function") {
        this.graphicsFrameCallback = handler;
    }
}
GameBoyAdvanceEmulator.prototype.attachAudioHandler = function (mixerInputHandler) {
    if (mixerInputHandler) {
        this.audio = mixerInputHandler;
    }
}
GameBoyAdvanceEmulator.prototype.swizzleFrameBuffer = function () {
    //Convert our dirty 15-bit (15-bit, with internal render flags above it) framebuffer to an 8-bit buffer with separate indices for the RGB channels:
    var bufferIndex = 0;
    for (var canvasIndex = 0; canvasIndex < this.offscreenRGBCount;) {
        this.swizzledFrame[canvasIndex++] = (this.frameBuffer[bufferIndex] & 0x1F) << 3;            //Red
        this.swizzledFrame[canvasIndex++] = (this.frameBuffer[bufferIndex] & 0x3E0) >> 2;            //Green
        this.swizzledFrame[canvasIndex++] = (this.frameBuffer[bufferIndex++] & 0x7C00) >> 7;        //Blue
    }
}
GameBoyAdvanceEmulator.prototype.prepareFrame = function () {
    //Copy the internal frame buffer to the output buffer:
    this.swizzleFrameBuffer();
    this.requestDraw();
}
GameBoyAdvanceEmulator.prototype.requestDraw = function () {
    if (this.graphicsFrameCallback) {
        //We actually updated the graphics internally, so copy out:
        this.graphicsFrameCallback(this.swizzledFrame);
    }
}
GameBoyAdvanceEmulator.prototype.enableAudio = function () {
    if (!this.audioFound && this.audio) {
        //Calculate the variables for the preliminary downsampler first:
        this.audioResamplerFirstPassFactor = Math.max(Math.min(Math.floor(this.clocksPerSecond / 44100), Math.floor(0x7FFFFFFF / 0x3FF)), 1);
        this.audioDownSampleInputDivider = (2 / 0x3FF) / this.audioResamplerFirstPassFactor;
        this.audioSetState(true);    //Set audio to 'found' by default.
        //Attempt to enable audio:
        var parentObj = this;
        this.audio.initialize(2, this.clocksPerSecond / this.audioResamplerFirstPassFactor, Math.max(this.CPUCyclesPerIteration * this.settings.audioBufferSize / this.audioResamplerFirstPassFactor, 8192) << 1, this.settings.audioVolume, function () {
                                     //Disable audio in the callback here:
                                     parentObj.disableAudio();
        });
        this.audio.register();
        if (this.audioFound) {
            //Only run this if audio was found to save memory on disabled output:
            this.initializeAudioBuffering();
        }
    }
}
GameBoyAdvanceEmulator.prototype.disableAudio = function () {
    if (this.audioFound) {
        this.audio.unregister();
        this.audioSetState(false);
        this.calculateTimings();    //Re-Fix timing if it was adjusted by our audio code.
    }
}
GameBoyAdvanceEmulator.prototype.initializeAudioBuffering = function () {
    this.audioDestinationPosition = 0;
    this.audioBufferContainAmount = Math.max(this.CPUCyclesPerIteration * this.settings.audioBufferUnderrunLimit / this.audioResamplerFirstPassFactor, 4096) << 1;
    this.audioBufferDynamicContainAmount = Math.max(this.CPUCyclesPerIteration * this.settings.audioBufferDynamicLimit / this.audioResamplerFirstPassFactor, 2048) << 1;
    var audioNumSamplesTotal = Math.max(this.CPUCyclesPerIteration / this.audioResamplerFirstPassFactor, 1) << 1;
    if (audioNumSamplesTotal != this.audioNumSamplesTotal) {
        this.audioNumSamplesTotal = audioNumSamplesTotal;
        this.audioBuffer = getFloat32Array(this.audioNumSamplesTotal);
    }
}
GameBoyAdvanceEmulator.prototype.changeVolume = function (newVolume) {
    this.settings.audioVolume = Math.min(Math.max(parseFloat(newVolume), 0), 1);
    if (this.audioFound) {
        this.audio.changeVolume(this.settings.audioVolume);
    }
}
GameBoyAdvanceEmulator.prototype.incrementVolume = function (delta) {
    this.changeVolume(parseFloat(delta) + this.settings.audioVolume);
}
GameBoyAdvanceEmulator.prototype.outputAudio = function (downsampleInputLeft, downsampleInputRight) {
    downsampleInputLeft = downsampleInputLeft | 0;
    downsampleInputRight = downsampleInputRight | 0;
    this.audioBuffer[this.audioDestinationPosition++] = (downsampleInputLeft * this.audioDownSampleInputDivider) - 1;
    this.audioBuffer[this.audioDestinationPosition++] = (downsampleInputRight * this.audioDownSampleInputDivider) - 1;
    if (this.audioDestinationPosition == this.audioNumSamplesTotal) {
        this.audio.push(this.audioBuffer);
        this.audioDestinationPosition = 0;
    }
}
GameBoyAdvanceEmulator.prototype.audioUnderrunAdjustment = function () {
    this.CPUCyclesTotal = this.CPUCyclesPerIteration | 0;
    if (this.audioFound) {
        var remainingAmount = this.audio.remainingBuffer();
        if (typeof remainingAmount == "number") {
            remainingAmount = Math.max(remainingAmount, 0);
            var underrunAmount = this.audioBufferContainAmount - remainingAmount;
            if (underrunAmount > 0) {
                if (this.settings.dynamicSpeed) {
                    if (this.dynamicSpeedCounter > this.settings.metricCollectionMinimum) {
                        if ((this.audioBufferDynamicContainAmount - remainingAmount) > 0) {
                            var speed = this.getSpeed();
                            speed = Math.max(speed - 0.1, 0.1);
                            this.setSpeed(speed);
                        }
                        else {
                            this.dynamicSpeedCounter = this.settings.metricCollectionMinimum;
                        }
                    }
                    this.dynamicSpeedCounter++;
                }
                this.CPUCyclesTotal = Math.min(((this.CPUCyclesTotal | 0) + ((underrunAmount >> 1) * this.audioResamplerFirstPassFactor)) | 0, this.CPUCyclesTotal << 1, 0x7FFFFFFF) | 0;
            }
            else if (this.settings.dynamicSpeed) {
                if (this.dynamicSpeedCounter > this.settings.metricCollectionMinimum) {
                    var speed = this.getSpeed();
                    if (speed < 1) {
                        speed = Math.min(speed + 0.05, 1);
                        this.setSpeed(speed);
                    }
                    else {
                        this.dynamicSpeedCounter = this.settings.metricCollectionMinimum;
                    }
                }
                this.dynamicSpeedCounter++;
            }
        }
    }
}
GameBoyAdvanceEmulator.prototype.audioPushNewState = function () {
    if (this.audioUpdateState) {
        this.IOCore.sound.initializeOutput(this.audioFound, this.audioResamplerFirstPassFactor | 0);
        this.audioUpdateState = false;
    }
}
GameBoyAdvanceEmulator.prototype.audioSetState = function (audioFound) {
    if (this.audioFound != audioFound) {
        this.audioFound = audioFound;
        this.audioUpdateState = true;
    }
}
GameBoyAdvanceEmulator.prototype.reinitializeAudio = function () {
    if (this.audioFound) {                    //Set up the audio again if enabled.
        this.disableAudio();
        this.enableAudio();
    }
}
GameBoyAdvanceEmulator.prototype.enableSkipBootROM = function () {
    this.settings.SKIPBoot = true;
}
GameBoyAdvanceEmulator.prototype.disableSkipBootROM = function () {
    this.settings.SKIPBoot = false;
}
GameBoyAdvanceEmulator.prototype.enableDynamicSpeed = function () {
    this.settings.dynamicSpeed = true;
}
GameBoyAdvanceEmulator.prototype.disableDynamicSpeed = function () {
    this.settings.dynamicSpeed = false;
    this.setSpeed(1);
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceGraphics(IOCore) {
    this.IOCore = IOCore;
    this.settings = IOCore.settings;
    this.coreExposed = IOCore.coreExposed;
    this.initializeIO();
    this.initializeRenderer();
}
GameBoyAdvanceGraphics.prototype.initializeIO = function () {
    //Initialize Pre-Boot:
    this.BGMode = 0;
    this.HBlankIntervalFree = false;
    this.VRAMOneDimensional = false;
    this.forcedBlank = true;
    this.isRendering = false;
    this.isOAMRendering = false;
    this.display = 0;
    this.greenSwap = false;
    this.inVBlank = false;
    this.inHBlank = false;
    this.renderedScanLine = false;
    this.VCounterMatch = false;
    this.IRQVBlank = false;
    this.IRQHBlank = false;
    this.IRQVCounter = false;
    this.VCounter = 0;
    this.currentScanLine = 0;
    this.BGPriority = getUint8Array(0x4);
    this.BGCharacterBaseBlock = getUint8Array(0x4);
    this.BGMosaic = [false, false, false, false];
    this.BGPalette256 = [false, false, false, false];
    this.BGScreenBaseBlock = getUint8Array(0x4);
    this.BGDisplayOverflow = [false, false];
    this.BGScreenSize = getUint8Array(0x4);
    this.WINOutside = 0;
    this.paletteRAM = getUint8Array(0x400);
    this.VRAM = getUint8Array(0x18000);
    this.VRAM16 = getUint16View(this.VRAM);
    this.VRAM32 = getInt32View(this.VRAM);
    this.paletteRAM16 = getUint16View(this.paletteRAM);
    this.paletteRAM32 = getInt32View(this.paletteRAM);
    this.lineBuffer = getInt32Array(240);
    this.frameBuffer = this.coreExposed.frameBuffer;
    this.LCDTicks = 0;
    this.totalLinesPassed = 0;
    this.queuedScanLines = 0;
    this.lastUnrenderedLine = 0;
    if (!this.IOCore.BIOSFound || this.IOCore.settings.SKIPBoot) {
        //BIOS entered the ROM at line 0x7C:
        this.currentScanLine = 0x7C;
        this.lastUnrenderedLine = 0x7C;
    }
    this.backdrop = 0x3A00000;
}
GameBoyAdvanceGraphics.prototype.initializeRenderer = function () {
    this.initializePaletteStorage();
    this.compositor = new GameBoyAdvanceCompositor(this);
    this.bg0Renderer = new GameBoyAdvanceBGTEXTRenderer(this, 0);
    this.bg1Renderer = new GameBoyAdvanceBGTEXTRenderer(this, 1);
    this.bg2TextRenderer = new GameBoyAdvanceBGTEXTRenderer(this, 2);
    this.bg3TextRenderer = new GameBoyAdvanceBGTEXTRenderer(this, 3);
    this.bgAffineRenderer = [
                             new GameBoyAdvanceAffineBGRenderer(this, 2),
                             new GameBoyAdvanceAffineBGRenderer(this, 3)
                             ];
    this.bg2MatrixRenderer = new GameBoyAdvanceBGMatrixRenderer(this, 2);
    this.bg3MatrixRenderer = new GameBoyAdvanceBGMatrixRenderer(this, 3);
    this.bg2FrameBufferRenderer = new GameBoyAdvanceBG2FrameBufferRenderer(this);
    this.objRenderer = new GameBoyAdvanceOBJRenderer(this);
    this.window0Renderer = new GameBoyAdvanceWindowRenderer(this);
    this.window1Renderer = new GameBoyAdvanceWindowRenderer(this);
    this.objWindowRenderer = new GameBoyAdvanceOBJWindowRenderer(this);
    this.mosaicRenderer = new GameBoyAdvanceMosaicRenderer(this);
    this.colorEffectsRenderer = new GameBoyAdvanceColorEffectsRenderer();
    this.mode0Renderer = new GameBoyAdvanceMode0Renderer(this);
    this.mode1Renderer = new GameBoyAdvanceMode1Renderer(this);
    this.mode2Renderer = new GameBoyAdvanceMode2Renderer(this);
    this.modeFrameBufferRenderer = new GameBoyAdvanceModeFrameBufferRenderer(this);

    this.compositorPreprocess();
}
GameBoyAdvanceGraphics.prototype.initializePaletteStorage = function () {
    //Both BG and OAM in unified storage:
    this.palette256 = getInt32Array(0x100);
    this.palette256[0] = 0x3800000;
    this.paletteOBJ256 = getInt32Array(0x100);
    this.paletteOBJ256[0] = 0x3800000;
    this.palette16 = getInt32Array(0x100);
    this.paletteOBJ16 = getInt32Array(0x100);
    for (var index = 0; index < 0x10; ++index) {
        this.palette16[index << 4] = 0x3800000;
        this.paletteOBJ16[index << 4] = 0x3800000;
    }
}
GameBoyAdvanceGraphics.prototype.addClocks = function (clocks) {
    clocks = clocks | 0;
    //Call this when clocking the state some more:
    this.LCDTicks = ((this.LCDTicks | 0) + (clocks | 0)) | 0;
    this.clockLCDState();
}
GameBoyAdvanceGraphics.prototype.clockLCDState = function () {
    if ((this.LCDTicks | 0) >= 960) {
        this.clockScanLine();                                                //Line finishes drawing at clock 960.
        this.clockLCDStatePostRender();                                      //Check for hblank and clocking into next line.
    }
}
GameBoyAdvanceGraphics.prototype.clockScanLine = function () {
    if (!this.renderedScanLine) {                                            //If we rendered the scanline, don't run this again.
        this.renderedScanLine = true;                                        //Mark rendering.
        if ((this.currentScanLine | 0) < 160) {
            this.incrementScanLineQueue();                                   //Tell the gfx JIT to queue another line to draw.
        }
    }
}
GameBoyAdvanceGraphics.prototype.clockLCDStatePostRender = function () {
    if ((this.LCDTicks | 0) >= 1006) {
        //HBlank Event Occurred:
        this.updateHBlank();
        if ((this.LCDTicks | 0) >= 1232) {
            //Clocking to next line occurred:
            this.clockLCDNextLine();
        }
    }
}
GameBoyAdvanceGraphics.prototype.clockLCDNextLine = function () {
    /*We've now overflowed the LCD scan line state machine counter,
     which tells us we need to be on a new scan-line and refresh over.*/
    this.renderedScanLine = this.inHBlank = false;                  //Un-mark HBlank and line render.
    //De-clock for starting on new scan-line:
    this.LCDTicks = ((this.LCDTicks | 0) - 1232) | 0;               //We start out at the beginning of the next line.
    //Increment scanline counter:
    this.currentScanLine = ((this.currentScanLine | 0) + 1) | 0;    //Increment to the next scan line.
    //Handle switching in/out of vblank:
    if ((this.currentScanLine | 0) >= 160) {
        //Handle special case scan lines of vblank:
        switch (this.currentScanLine | 0) {
            case 160:
                this.updateVBlankStart();                           //Update state for start of vblank.
            case 161:
                this.IOCore.dma.gfxDisplaySyncRequest();            //Display Sync. DMA trigger.
                break;
            case 162:
                this.IOCore.dma.gfxDisplaySyncEnableCheck();        //Display Sync. DMA reset on start of line 162.
                break;
            case 227:
                this.inVBlank = false;                              //Un-mark VBlank on start of last vblank line.
                break;
            case 228:
                this.currentScanLine = 0;                           //Reset scan-line to zero (First line of draw).
        }
    }
    else if ((this.currentScanLine | 0) > 1) {
        this.IOCore.dma.gfxDisplaySyncRequest();                    //Display Sync. DMA trigger.
    }
    this.checkVCounter();                                           //We're on a new scan line, so check the VCounter for match.
    this.isRenderingCheckPreprocess();                              //Update a check value.
    //Recursive clocking of the LCD state:
    this.clockLCDState();
}
GameBoyAdvanceGraphics.prototype.updateHBlank = function () {
    if (!this.inHBlank) {                                           //If we were last in HBlank, don't run this again.
        this.inHBlank = true;                                       //Mark HBlank.
        if (this.IRQHBlank) {
            this.IOCore.irq.requestIRQ(0x2);                        //Check for IRQ.
        }
        if ((this.currentScanLine | 0) < 160) {
            this.IOCore.dma.gfxHBlankRequest();                     //Check for HDMA Trigger.
        }
        this.isRenderingCheckPreprocess();                          //Update a check value.
    }
}
GameBoyAdvanceGraphics.prototype.checkVCounter = function () {
    if ((this.currentScanLine | 0) == (this.VCounter | 0)) {        //Check for VCounter match.
        this.VCounterMatch = true;
        if (this.IRQVCounter) {                                     //Check for VCounter IRQ.
            this.IOCore.irq.requestIRQ(0x4);
        }
    }
    else {
        this.VCounterMatch = false;
    }
}
GameBoyAdvanceGraphics.prototype.nextVBlankIRQEventTime = function () {
    var nextEventTime = -1;
    if (this.IRQVBlank) {
        //Only give a time if we're allowed to irq:
        nextEventTime = this.nextVBlankEventTime() | 0;
    }
    return nextEventTime | 0;
}
GameBoyAdvanceGraphics.prototype.nextHBlankEventTime = function () {
    var time = (1006 - (this.LCDTicks | 0)) | 0;
    if ((time | 0) <= 0) {
        time = ((time | 0) + 1232) | 0;
    }
    return time | 0;
}
GameBoyAdvanceGraphics.prototype.nextHBlankIRQEventTime = function () {
    var nextEventTime = -1;
    if (this.IRQHBlank) {
        //Only give a time if we're allowed to irq:
        nextEventTime = this.nextHBlankEventTime() | 0;
    }
    return nextEventTime | 0;
}
GameBoyAdvanceGraphics.prototype.nextVCounterIRQEventTime = function () {
    var nextEventTime = -1;
    if (this.IRQVCounter) {
        //Only give a time if we're allowed to irq:
        nextEventTime = this.nextVCounterEventTime() | 0;
    }
    return nextEventTime | 0;
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceGraphics.prototype.nextVBlankEventTime = function () {
        var nextEventTime = (160 - (this.currentScanLine | 0)) | 0;
        if ((nextEventTime | 0) <= 0) {
            nextEventTime = ((nextEventTime | 0) + 160) | 0;
        }
        nextEventTime = Math.imul(nextEventTime | 0, 1232) | 0;
        nextEventTime = ((nextEventTime | 0) - (this.LCDTicks | 0)) | 0;
        return nextEventTime | 0;
    }
    GameBoyAdvanceGraphics.prototype.nextHBlankDMAEventTime = function () {
        var nextEventTime = -1
        if ((this.currentScanLine | 0) < 159 || (!this.inHBlank && (this.currentScanLine | 0) == 159)) {
            //Go to next HBlank time inside screen draw:
            nextEventTime = this.nextHBlankEventTime() | 0;
        }
        else {
            //No HBlank DMA in VBlank:
            nextEventTime = (228 - (this.currentScanLine | 0)) | 0
            nextEventTime = Math.imul(nextEventTime | 0, 1232) | 0;
            nextEventTime = ((nextEventTime | 0) + 1006) | 0;
            nextEventTime = ((nextEventTime | 0) - (this.LCDTicks | 0)) | 0;
        }
        return nextEventTime | 0;
    }
    GameBoyAdvanceGraphics.prototype.nextVCounterEventTime = function () {
        var nextEventTime = -1;
        if ((this.VCounter | 0) <= 227) {
            //Only match lines within screen or vblank:
            nextEventTime = ((this.VCounter | 0) - (this.currentScanLine | 0)) | 0;
            if ((nextEventTime | 0) <= 0) {
                nextEventTime = ((nextEventTime | 0) + 228) | 0;
            }
            nextEventTime = Math.imul(nextEventTime | 0, 1232) | 0;
            nextEventTime = ((nextEventTime | 0) - (this.LCDTicks | 0)) | 0;
        }
        return nextEventTime | 0;
    }
    GameBoyAdvanceGraphics.prototype.nextDisplaySyncEventTime = function () {
        var nextEventTime = 0;
        if ((this.currentScanLine | 0) == 0) {
            //Doesn't start until line 2:
            nextEventTime = (2464 - (this.LCDTicks | 0)) | 0;
        }
        else if ((this.currentScanLine | 0) < 161) {
            //Line 2 through line 161:
            nextEventTime = (1232 - (this.LCDTicks | 0)) | 0;
        }
        else {
            //Skip to line 2 metrics:
            nextEventTime = (230 - (this.currentScanLine | 0)) | 0;
            nextEventTime = Math.imul(nextEventTime | 0, 1232) | 0;
            nextEventTime = ((nextEventTime | 0) - (this.LCDTicks | 0)) | 0;
        }
        return nextEventTime | 0;
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceGraphics.prototype.nextVBlankEventTime = function () {
        return (((387 - this.currentScanLine) % 228) * 1232) + 1232 - this.LCDTicks;
    }
    GameBoyAdvanceGraphics.prototype.nextHBlankDMAEventTime = function () {
        if (this.currentScanLine < 159 || (!this.inHBlank && this.currentScanLine == 159)) {
            //Go to next HBlank time inside screen draw:
            return this.nextHBlankEventTime();
        }
        else {
            //No HBlank DMA in VBlank:
            return ((228 - this.currentScanLine) * 1232) + 1006 - this.LCDTicks;
        }
    }
    GameBoyAdvanceGraphics.prototype.nextVCounterEventTime = function () {
        if (this.VCounter <= 227) {
            //Only match lines within screen or vblank:
            return (((227 + this.VCounter - this.currentScanLine) % 228) * 1232) + 1232 - this.LCDTicks;
        }
        else {
            return -1;
        }
    }
    GameBoyAdvanceGraphics.prototype.nextDisplaySyncEventTime = function () {
        if (this.currentScanLine == 0) {
            //Doesn't start until line 2:
            return 2464 - this.LCDTicks;
        }
        else if (this.currentScanLine < 161) {
            //Line 2 through line 161:
            return 1232 - this.LCDTicks;
        }
        else {
            //Skip to line 2 metrics:
            return ((230 - this.currentScanLine) * 1232) - this.LCDTicks;
        }
    }
}
GameBoyAdvanceGraphics.prototype.updateVBlankStart = function () {
    this.inVBlank = true;                                //Mark VBlank.
    if (this.IRQVBlank) {                                //Check for VBlank IRQ.
        this.IOCore.irq.requestIRQ(0x1);
    }
    //Ensure JIT framing alignment:
    if ((this.totalLinesPassed | 0) < 160) {
        //Make sure our gfx are up-to-date:
        this.graphicsJITVBlank();
        //Draw the frame:
        this.coreExposed.prepareFrame();
    }
    this.IOCore.dma.gfxVBlankRequest();
}
GameBoyAdvanceGraphics.prototype.graphicsJIT = function () {
    this.totalLinesPassed = 0;            //Mark frame for ensuring a JIT pass for the next framebuffer output.
    this.graphicsJITScanlineGroup();
}
GameBoyAdvanceGraphics.prototype.graphicsJITVBlank = function () {
    //JIT the graphics to v-blank framing:
    this.totalLinesPassed = ((this.totalLinesPassed | 0) + (this.queuedScanLines | 0)) | 0;
    this.graphicsJITScanlineGroup();
}
GameBoyAdvanceGraphics.prototype.renderScanLine = function () {
    switch (this.BGMode | 0) {
        case 0:
            this.mode0Renderer.renderScanLine(this.lastUnrenderedLine | 0);
            break;
        case 1:
            this.mode1Renderer.renderScanLine(this.lastUnrenderedLine | 0);
            break;
        case 2:
            this.mode2Renderer.renderScanLine(this.lastUnrenderedLine | 0);
            break;
        default:
            this.modeFrameBufferRenderer.renderScanLine(this.lastUnrenderedLine | 0);
    }
    //Update the affine bg counters:
    this.updateReferenceCounters();
}
GameBoyAdvanceGraphics.prototype.updateReferenceCounters = function () {
    if ((this.lastUnrenderedLine | 0) == 159) {
        //Reset some affine bg counters on roll-over to line 0:
        this.bgAffineRenderer[0].resetReferenceCounters();
        this.bgAffineRenderer[1].resetReferenceCounters();
    }
    else {
        //Increment the affine bg counters:
        this.bgAffineRenderer[0].incrementReferenceCounters();
        this.bgAffineRenderer[1].incrementReferenceCounters();
    }
}
GameBoyAdvanceGraphics.prototype.graphicsJITScanlineGroup = function () {
    //Normal rendering JIT, where we try to do groups of scanlines at once:
    while ((this.queuedScanLines | 0) > 0) {
        this.renderScanLine();
        if ((this.lastUnrenderedLine | 0) < 159) {
            this.lastUnrenderedLine = ((this.lastUnrenderedLine | 0) + 1) | 0;
        }
        else {
            this.lastUnrenderedLine = 0;
        }
        this.queuedScanLines = ((this.queuedScanLines | 0) - 1) | 0;
    }
}
GameBoyAdvanceGraphics.prototype.incrementScanLineQueue = function () {
    if ((this.queuedScanLines | 0) < 160) {
        this.queuedScanLines = ((this.queuedScanLines | 0) + 1) | 0;
    }
    else {
        if ((this.lastUnrenderedLine | 0) < 159) {
            this.lastUnrenderedLine = ((this.lastUnrenderedLine | 0) + 1) | 0;
        }
        else {
            this.lastUnrenderedLine = 0;
        }
    }
}
GameBoyAdvanceGraphics.prototype.isRenderingCheckPreprocess = function () {
    var isInVisibleLines = (!this.forcedBlank && !this.inVBlank);
    this.isRendering = (isInVisibleLines && !this.inHBlank);
    this.isOAMRendering = (isInVisibleLines && (!this.inHBlank || !this.HBlankIntervalFree));
}
GameBoyAdvanceGraphics.prototype.compositorPreprocess = function () {
    this.compositor.preprocess((this.WINOutside & 0x20) == 0x20 || (this.display & 0xE0) == 0);
}
GameBoyAdvanceGraphics.prototype.compositeLayers = function (OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer) {
    //Arrange our layer stack so we can remove disabled and order for correct edge case priority:
    if ((this.display & 0xE0) > 0) {
        //Window registers can further disable background layers if one or more window layers enabled:
        OBJBuffer = ((this.WINOutside & 0x10) == 0x10) ? OBJBuffer : null;
        BG0Buffer = ((this.WINOutside & 0x1) == 0x1) ? BG0Buffer : null;
        BG1Buffer = ((this.WINOutside & 0x2) == 0x2) ? BG1Buffer : null;
        BG2Buffer = ((this.WINOutside & 0x4) == 0x4) ? BG2Buffer : null;
        BG3Buffer = ((this.WINOutside & 0x8) == 0x8) ? BG3Buffer : null;
    }
    this.compositor.renderScanLine(0, 240, this.lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer);
}
GameBoyAdvanceGraphics.prototype.copyLineToFrameBuffer = function (line) {
    line = line | 0;
    var offsetStart = ((line | 0) * 240) | 0;
    var position = 0;
    if (this.forcedBlank) {
        for (; (position | 0) < 240; offsetStart = ((offsetStart | 0) + 1) | 0, position = ((position | 0) + 1) | 0) {
            this.frameBuffer[offsetStart | 0] = 0x7FFF;
        }
    }
    else {
        if (!this.greenSwap) {
            if (!!this.frameBuffer.set) {
                this.frameBuffer.set(this.lineBuffer, offsetStart | 0);
            }
            else {
                for (; (position | 0) < 240; offsetStart = ((offsetStart | 0) + 1) | 0, position = ((position | 0) + 1) | 0) {
                    this.frameBuffer[offsetStart | 0] = this.lineBuffer[position | 0] | 0;
                }
            }
        }
        else {
            var pixel0 = 0;
            var pixel1 = 0;
            while (position < 240) {
                pixel0 = this.lineBuffer[position | 0] | 0;
                position = ((position | 0) + 1) | 0;
                pixel1 = this.lineBuffer[position | 0] | 0;
                position = ((position | 0) + 1) | 0;
                this.frameBuffer[offsetStart | 0] = (pixel0 & 0x7C1F) | (pixel1 & 0x3E0);
                offsetStart = ((offsetStart | 0) + 1) | 0;
                this.frameBuffer[offsetStart | 0] = (pixel1 & 0x7C1F) | (pixel0 & 0x3E0);
                offsetStart = ((offsetStart | 0) + 1) | 0;
            }
        }
    }
}
GameBoyAdvanceGraphics.prototype.writeDISPCNT0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.BGMode = data & 0x07;
    this.bg2FrameBufferRenderer.writeFrameSelect((data & 0x10) << 27);
    this.HBlankIntervalFree = ((data & 0x20) == 0x20);
    this.VRAMOneDimensional = ((data & 0x40) == 0x40);
    this.forcedBlank = ((data & 0x80) == 0x80);
    this.isRenderingCheckPreprocess();
    if ((this.BGMode | 0) > 2) {
        this.modeFrameBufferRenderer.preprocess(Math.min(this.BGMode | 0, 5) | 0);
    }
}
GameBoyAdvanceGraphics.prototype.readDISPCNT0 = function () {
    return (this.BGMode |
    ((this.bg2FrameBufferRenderer.frameSelect > 0) ? 0x10 : 0) |
    (this.HBlankIntervalFree ? 0x20 : 0) | 
    (this.VRAMOneDimensional ? 0x40 : 0) |
    (this.forcedBlank ? 0x80 : 0));
}
GameBoyAdvanceGraphics.prototype.writeDISPCNT1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.display = data & 0xFF;
    this.compositorPreprocess();
}
GameBoyAdvanceGraphics.prototype.readDISPCNT1 = function () {
    return this.display | 0;
}
GameBoyAdvanceGraphics.prototype.writeGreenSwap = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.greenSwap = ((data & 0x01) == 0x01);
}
GameBoyAdvanceGraphics.prototype.readGreenSwap = function () {
    return (this.greenSwap ? 0x1 : 0);
}
GameBoyAdvanceGraphics.prototype.writeDISPSTAT0 = function (data) {
    data = data | 0;
    //VBlank flag read only.
    //HBlank flag read only.
    //V-Counter flag read only.
    //Only LCD IRQ generation enablers can be set here:
    this.IRQVBlank = ((data & 0x08) == 0x08);
    this.IRQHBlank = ((data & 0x10) == 0x10);
    this.IRQVCounter = ((data & 0x20) == 0x20);
}
GameBoyAdvanceGraphics.prototype.readDISPSTAT0 = function () {
    return ((this.inVBlank ? 0x1 : 0) |
    (this.inHBlank ? 0x2 : 0) |
    (this.VCounterMatch ? 0x4 : 0) |
    (this.IRQVBlank ? 0x8 : 0) |
    (this.IRQHBlank ? 0x10 : 0) |
    (this.IRQVCounter ? 0x20 : 0));
}
GameBoyAdvanceGraphics.prototype.writeDISPSTAT1 = function (data) {
    data = data | 0;
    //V-Counter match value:
    if ((data | 0) != (this.VCounter | 0)) {
        this.VCounter = data | 0;
        this.checkVCounter();
    }
}
GameBoyAdvanceGraphics.prototype.readDISPSTAT1 = function () {
    return this.VCounter | 0;
}
GameBoyAdvanceGraphics.prototype.readVCOUNT = function () {
    return this.currentScanLine | 0;
}
GameBoyAdvanceGraphics.prototype.writeBG0CNT0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.BGPriority[0] = data & 0x3;
    this.BGCharacterBaseBlock[0] = (data & 0xC) >> 2;
    //Bits 5-6 always 0.
    this.BGMosaic[0] = ((data & 0x40) == 0x40);
    this.BGPalette256[0] = ((data & 0x80) == 0x80);
    this.bg0Renderer.palettePreprocess();
    this.bg0Renderer.priorityPreprocess();
    this.bg0Renderer.characterBaseBlockPreprocess();
}
GameBoyAdvanceGraphics.prototype.readBG0CNT0 = function () {
    return (this.BGPriority[0] |
    (this.BGCharacterBaseBlock[0] << 2) |
    (this.BGMosaic[0] ? 0x40 : 0) |
    (this.BGPalette256[0] ? 0x80 : 0));
}
GameBoyAdvanceGraphics.prototype.writeBG0CNT1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.BGScreenBaseBlock[0] = data & 0x1F;
    this.BGScreenSize[0] = (data & 0xC0) >> 6;
    this.bg0Renderer.screenSizePreprocess();
    this.bg0Renderer.screenBaseBlockPreprocess();
}
GameBoyAdvanceGraphics.prototype.readBG0CNT1 = function () {
    return (this.BGScreenBaseBlock[0] |
    (this.BGScreenSize[0] << 6));
}
GameBoyAdvanceGraphics.prototype.writeBG1CNT0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.BGPriority[1] = data & 0x3;
    this.BGCharacterBaseBlock[1] = (data & 0xC) >> 2;
    //Bits 5-6 always 0.
    this.BGMosaic[1] = ((data & 0x40) == 0x40);
    this.BGPalette256[1] = ((data & 0x80) == 0x80);
    this.bg1Renderer.palettePreprocess();
    this.bg1Renderer.priorityPreprocess();
    this.bg1Renderer.characterBaseBlockPreprocess();
}
GameBoyAdvanceGraphics.prototype.readBG1CNT0 = function () {
    return (this.BGPriority[1] |
    (this.BGCharacterBaseBlock[1] << 2) |
    (this.BGMosaic[1] ? 0x40 : 0) |
    (this.BGPalette256[1] ? 0x80 : 0));
}
GameBoyAdvanceGraphics.prototype.writeBG1CNT1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.BGScreenBaseBlock[1] = data & 0x1F;
    this.BGScreenSize[1] = (data & 0xC0) >> 6;
    this.bg1Renderer.screenSizePreprocess();
    this.bg1Renderer.screenBaseBlockPreprocess();
}
GameBoyAdvanceGraphics.prototype.readBG1CNT1 = function () {
    return (this.BGScreenBaseBlock[1] |
    (this.BGScreenSize[1] << 6));
}
GameBoyAdvanceGraphics.prototype.writeBG2CNT0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.BGPriority[2] = data & 0x3;
    this.BGCharacterBaseBlock[2] = (data & 0xC) >> 2;
    //Bits 5-6 always 0.
    this.BGMosaic[2] = ((data & 0x40) == 0x40);
    this.BGPalette256[2] = ((data & 0x80) == 0x80);
    this.bg2TextRenderer.palettePreprocess();
    this.bg2TextRenderer.priorityPreprocess();
    this.bgAffineRenderer[0].priorityPreprocess();
    this.bg2TextRenderer.characterBaseBlockPreprocess();
    this.bg2MatrixRenderer.characterBaseBlockPreprocess();
}
GameBoyAdvanceGraphics.prototype.readBG2CNT0 = function () {
    return (this.BGPriority[2] |
    (this.BGCharacterBaseBlock[2] << 2) |
    (this.BGMosaic[2] ? 0x40 : 0) |
    (this.BGPalette256[2] ? 0x80 : 0));
}
GameBoyAdvanceGraphics.prototype.writeBG2CNT1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.BGScreenBaseBlock[2] = data & 0x1F;
    this.BGDisplayOverflow[0] = ((data & 0x20) == 0x20);
    this.BGScreenSize[2] = (data & 0xC0) >> 6;
    this.bg2TextRenderer.screenSizePreprocess();
    this.bg2MatrixRenderer.screenSizePreprocess();
    this.bg2TextRenderer.screenBaseBlockPreprocess();
    this.bg2MatrixRenderer.screenBaseBlockPreprocess();
    this.bg2MatrixRenderer.displayOverflowPreprocess();
}
GameBoyAdvanceGraphics.prototype.readBG2CNT1 = function () {
    return (this.BGScreenBaseBlock[2] |
    (this.BGDisplayOverflow[0] ? 0x20 : 0) |
    (this.BGScreenSize[2] << 6));
}
GameBoyAdvanceGraphics.prototype.writeBG3CNT0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.BGPriority[3] = data & 0x3;
    this.BGCharacterBaseBlock[3] = (data & 0xC) >> 2;
    //Bits 5-6 always 0.
    this.BGMosaic[3] = ((data & 0x40) == 0x40);
    this.BGPalette256[3] = ((data & 0x80) == 0x80);
    this.bg3TextRenderer.palettePreprocess();
    this.bg3TextRenderer.priorityPreprocess();
    this.bgAffineRenderer[1].priorityPreprocess();
    this.bg3TextRenderer.characterBaseBlockPreprocess();
    this.bg3MatrixRenderer.characterBaseBlockPreprocess();
}
GameBoyAdvanceGraphics.prototype.readBG3CNT0 = function () {
    return (this.BGPriority[3] |
    (this.BGCharacterBaseBlock[3] << 2) |
    (this.BGMosaic[3] ? 0x40 : 0) |
    (this.BGPalette256[3] ? 0x80 : 0));
}
GameBoyAdvanceGraphics.prototype.writeBG3CNT1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.BGScreenBaseBlock[3] = data & 0x1F;
    this.BGDisplayOverflow[1] = ((data & 0x20) == 0x20);
    this.BGScreenSize[3] = (data & 0xC0) >> 6;
    this.bg3TextRenderer.screenSizePreprocess();
    this.bg3MatrixRenderer.screenSizePreprocess();
    this.bg3TextRenderer.screenBaseBlockPreprocess();
    this.bg3MatrixRenderer.screenBaseBlockPreprocess();
    this.bg3MatrixRenderer.displayOverflowPreprocess();
}
GameBoyAdvanceGraphics.prototype.readBG3CNT1 = function () {
    return (this.BGScreenBaseBlock[3] |
    (this.BGDisplayOverflow[1] ? 0x20 : 0) |
    (this.BGScreenSize[3] << 6));
}
GameBoyAdvanceGraphics.prototype.writeBG0HOFS0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg0Renderer.writeBGHOFS0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG0HOFS1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg0Renderer.writeBGHOFS1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG0VOFS0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg0Renderer.writeBGVOFS0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG0VOFS1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg0Renderer.writeBGVOFS1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG1HOFS0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg1Renderer.writeBGHOFS0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG1HOFS1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg1Renderer.writeBGHOFS1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG1VOFS0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg1Renderer.writeBGVOFS0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG1VOFS1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg1Renderer.writeBGVOFS1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2HOFS0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg2TextRenderer.writeBGHOFS0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2HOFS1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg2TextRenderer.writeBGHOFS1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2VOFS0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg2TextRenderer.writeBGVOFS0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2VOFS1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg2TextRenderer.writeBGVOFS1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3HOFS0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg3TextRenderer.writeBGHOFS0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3HOFS1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg3TextRenderer.writeBGHOFS1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3VOFS0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg3TextRenderer.writeBGVOFS0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3VOFS1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bg3TextRenderer.writeBGVOFS1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2PA0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGPA0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2PA1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGPA1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2PB0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGPB0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2PB1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGPB1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2PC0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGPC0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2PC1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGPC1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2PD0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGPD0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2PD1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGPD1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3PA0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGPA0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3PA1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGPA1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3PB0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGPB0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3PB1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGPB1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3PC0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGPC0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3PC1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGPC1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3PD0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGPD0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3PD1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGPD1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2X_L0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGX_L0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2X_L1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGX_L1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2X_H0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGX_H0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2X_H1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGX_H1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2Y_L0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGY_L0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2Y_L1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGY_L1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2Y_H0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGY_H0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG2Y_H1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[0].writeBGY_H1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3X_L0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGX_L0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3X_L1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGX_L1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3X_H0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGX_H0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3X_H1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGX_H1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3Y_L0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGY_L0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3Y_L1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGY_L1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3Y_H0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGY_H0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBG3Y_H1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.bgAffineRenderer[1].writeBGY_H1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeWIN0H0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.window0Renderer.writeWINH0(data | 0);        //Window x-coord goes up to this minus 1.
}
GameBoyAdvanceGraphics.prototype.writeWIN0H1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.window0Renderer.writeWINH1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeWIN1H0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.window1Renderer.writeWINH0(data | 0);        //Window x-coord goes up to this minus 1.
}
GameBoyAdvanceGraphics.prototype.writeWIN1H1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.window1Renderer.writeWINH1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeWIN0V0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.window0Renderer.writeWINV0(data | 0);        //Window y-coord goes up to this minus 1.
}
GameBoyAdvanceGraphics.prototype.writeWIN0V1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.window0Renderer.writeWINV1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeWIN1V0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.window1Renderer.writeWINV0(data | 0);        //Window y-coord goes up to this minus 1.
}
GameBoyAdvanceGraphics.prototype.writeWIN1V1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.window1Renderer.writeWINV1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeWININ0 = function (data) {
    data = data | 0;
    //Window 0:
    this.graphicsJIT();
    this.window0Renderer.writeWININ(data | 0);
}
GameBoyAdvanceGraphics.prototype.readWININ0 = function () {
    //Window 0:
    return this.window0Renderer.readWININ() | 0;
}
GameBoyAdvanceGraphics.prototype.writeWININ1 = function (data) {
    data = data | 0;
    //Window 1:
    this.graphicsJIT();
    this.window1Renderer.writeWININ(data | 0);
}
GameBoyAdvanceGraphics.prototype.readWININ1 = function () {
    //Window 1:
    return this.window1Renderer.readWININ() | 0;
}
GameBoyAdvanceGraphics.prototype.writeWINOUT0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.WINOutside = data & 0x3F;
    this.compositorPreprocess();
}
GameBoyAdvanceGraphics.prototype.readWINOUT0 = function () {
    return this.WINOutside | 0;
}
GameBoyAdvanceGraphics.prototype.writeWINOUT1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.objWindowRenderer.writeWINOUT1(data | 0);
}
GameBoyAdvanceGraphics.prototype.readWINOUT1 = function () {
    return this.objWindowRenderer.readWINOUT1() | 0;
}
GameBoyAdvanceGraphics.prototype.writeMOSAIC0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.mosaicRenderer.writeMOSAIC0(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeMOSAIC1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.mosaicRenderer.writeMOSAIC1(data | 0);
}
GameBoyAdvanceGraphics.prototype.writeBLDCNT0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.colorEffectsRenderer.writeBLDCNT0(data | 0);
}
GameBoyAdvanceGraphics.prototype.readBLDCNT0 = function () {
    return this.colorEffectsRenderer.readBLDCNT0() | 0;
}
GameBoyAdvanceGraphics.prototype.writeBLDCNT1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.colorEffectsRenderer.writeBLDCNT1(data | 0);
}
GameBoyAdvanceGraphics.prototype.readBLDCNT1 = function () {
    return this.colorEffectsRenderer.readBLDCNT1() | 0;
}
GameBoyAdvanceGraphics.prototype.writeBLDALPHA0 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.colorEffectsRenderer.writeBLDALPHA0(data | 0);
}
GameBoyAdvanceGraphics.prototype.readBLDALPHA0 = function () {
    return this.colorEffectsRenderer.readBLDALPHA0() | 0;
}
GameBoyAdvanceGraphics.prototype.writeBLDALPHA1 = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.colorEffectsRenderer.writeBLDALPHA1(data | 0);
}
GameBoyAdvanceGraphics.prototype.readBLDALPHA1 = function () {
    return this.colorEffectsRenderer.readBLDALPHA1() | 0;
}
GameBoyAdvanceGraphics.prototype.writeBLDY = function (data) {
    data = data | 0;
    this.graphicsJIT();
    this.colorEffectsRenderer.writeBLDY(data | 0);
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceGraphics.prototype.writeVRAM8 = function (address, data) {
        address = address | 0;
        data = data | 0;
        if ((address & 0x10000) == 0 || ((address & 0x17FFF) < 0x14000 && (this.BGMode | 0) >= 3)) {
            this.graphicsJIT();
            address = address & (((address & 0x10000) >> 1) ^ address);
            this.VRAM16[(address >> 1) & 0xFFFF] = Math.imul(data & 0xFF, 0x101) | 0;
        }
    }
    GameBoyAdvanceGraphics.prototype.writeVRAM16 = function (address, data) {
        address = address | 0;
        data = data | 0;
        this.graphicsJIT();
        address = address & (((address & 0x10000) >> 1) ^ address);
        this.VRAM16[(address >> 1) & 0xFFFF] = data & 0xFFFF;
    }
    GameBoyAdvanceGraphics.prototype.writeVRAM32 = function (address, data) {
        address = address | 0;
        data = data | 0;
        this.graphicsJIT();
        address = address & (((address & 0x10000) >> 1) ^ address);
        this.VRAM32[(address >> 2) & 0x7FFF] = data | 0;
    }
    GameBoyAdvanceGraphics.prototype.readVRAM16 = function (address) {
        address = address | 0;
        address = address & (((address & 0x10000) >> 1) ^ address);
        return this.VRAM16[(address >> 1) & 0xFFFF] | 0;
    }
    GameBoyAdvanceGraphics.prototype.readVRAM32 = function (address) {
        address = address | 0;
        address = address & (((address & 0x10000) >> 1) ^ address);
        return this.VRAM32[(address >> 2) & 0x7FFF] | 0;
    }
    GameBoyAdvanceGraphics.prototype.writePalette16 = function (address, data) {
        data = data | 0;
        address = address >> 1;
        this.graphicsJIT();
        this.paletteRAM16[address & 0x1FF] = data | 0;
        data = data & 0x7FFF;
        this.writePalette256Color(address | 0, data | 0);
        this.writePalette16Color(address | 0, data | 0);
    }
    GameBoyAdvanceGraphics.prototype.writePalette32 = function (address, data) {
        data = data | 0;
        address = address >> 1;
        this.graphicsJIT();
        this.paletteRAM32[(address >> 1) & 0xFF] = data | 0;
        var palette = data & 0x7FFF;
        this.writePalette256Color(address | 0, palette | 0);
        this.writePalette16Color(address | 0, palette | 0);
        palette = (data >> 16) & 0x7FFF;
        this.writePalette256Color(address | 1, palette | 0);
        this.writePalette16Color(address | 1, palette | 0);
    }
    GameBoyAdvanceGraphics.prototype.readPalette16 = function (address) {
        address = address | 0;
        return this.paletteRAM16[(address >> 1) & 0x1FF] | 0;
    }
    GameBoyAdvanceGraphics.prototype.readPalette32 = function (address) {
        address = address | 0;
        return this.paletteRAM32[(address >> 2) & 0xFF] | 0;
    }
}
else {
    GameBoyAdvanceGraphics.prototype.writeVRAM8 = function (address, data) {
        address &= 0x1FFFE & (((address & 0x10000) >> 1) ^ address);
        if (address < 0x10000 || ((address & 0x17FFF) < 0x14000 && this.BGMode >= 3)) {
            this.graphicsJIT();
            this.VRAM[address++] = data & 0xFF;
            this.VRAM[address] = data & 0xFF;
        }
    }
    GameBoyAdvanceGraphics.prototype.writeVRAM16 = function (address, data) {
        address &= 0x1FFFE & (((address & 0x10000) >> 1) ^ address);
        this.graphicsJIT();
        this.VRAM[address++] = data & 0xFF;
        this.VRAM[address] = (data >> 8) & 0xFF;
    }
    GameBoyAdvanceGraphics.prototype.writeVRAM32 = function (address, data) {
        address &= 0x1FFFC & (((address & 0x10000) >> 1) ^ address);
        this.graphicsJIT();
        this.VRAM[address++] = data & 0xFF;
        this.VRAM[address++] = (data >> 8) & 0xFF;
        this.VRAM[address++] = (data >> 16) & 0xFF;
        this.VRAM[address] = data >>> 24;
    }
    GameBoyAdvanceGraphics.prototype.readVRAM16 = function (address) {
        address &= 0x1FFFE & (((address & 0x10000) >> 1) ^ address);
        return this.VRAM[address] | (this.VRAM[address + 1] << 8);
    }
    GameBoyAdvanceGraphics.prototype.readVRAM32 = function (address) {
        address &= 0x1FFFC & (((address & 0x10000) >> 1) ^ address);
        return this.VRAM[address] | (this.VRAM[address + 1] << 8) | (this.VRAM[address + 2] << 16) | (this.VRAM[address + 3] << 24);
    }
    GameBoyAdvanceGraphics.prototype.writePalette16 = function (address, data) {
        this.graphicsJIT();
        this.paletteRAM[address] = data & 0xFF;
        this.paletteRAM[address | 1] = data >> 8;
        data &= 0x7FFF;
        address >>= 1;
        this.writePalette256Color(address, data);
        this.writePalette16Color(address, data);
    }
    GameBoyAdvanceGraphics.prototype.writePalette32 = function (address, data) {
        this.graphicsJIT();
        this.paletteRAM[address] = data & 0xFF;
        this.paletteRAM[address | 1] = (data >> 8) & 0xFF;
        this.paletteRAM[address | 2] = (data >> 16) & 0xFF;
        this.paletteRAM[address | 3] = data >>> 24;
        address >>= 1;
        var palette = data & 0x7FFF;
        this.writePalette256Color(address, palette);
        this.writePalette16Color(address, palette);
        palette = (data >> 16) & 0x7FFF;
        address |= 1;
        this.writePalette256Color(address, palette);
        this.writePalette16Color(address, palette);
    }
    GameBoyAdvanceGraphics.prototype.readPalette16 = function (address) {
        return this.paletteRAM[address] | (this.paletteRAM[address | 1] << 8);
    }
    GameBoyAdvanceGraphics.prototype.readPalette32 = function (address) {
        return this.paletteRAM[address] | (this.paletteRAM[address | 1] << 8) | (this.paletteRAM[address | 2] << 16)  | (this.paletteRAM[address | 3] << 24);
    }
}
GameBoyAdvanceGraphics.prototype.readVRAM8 = function (address) {
    address = address | 0;
    address = address & (((address & 0x10000) >> 1) ^ address);
    return this.VRAM[address & 0x1FFFF] | 0;
}
GameBoyAdvanceGraphics.prototype.writeOAM16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.graphicsJIT();
    this.objRenderer.writeOAM16(address >> 1, data | 0);
}
GameBoyAdvanceGraphics.prototype.writeOAM32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.graphicsJIT();
    this.objRenderer.writeOAM32(address >> 2, data | 0);
}
GameBoyAdvanceGraphics.prototype.readOAM = function (address) {
    return this.objRenderer.readOAM(address | 0) | 0;
}
GameBoyAdvanceGraphics.prototype.readOAM16 = function (address) {
    return this.objRenderer.readOAM16(address | 0) | 0;
}
GameBoyAdvanceGraphics.prototype.readOAM32 = function (address) {
    return this.objRenderer.readOAM32(address | 0) | 0;
}
GameBoyAdvanceGraphics.prototype.writePalette256Color = function (address, palette) {
    address = address | 0;
    palette = palette | 0;
    if ((address & 0xFF) == 0) {
        palette = 0x3800000 | palette;
        if (address == 0) {
            this.backdrop = palette | 0x200000;
        }
    }
    if ((address | 0) < 0x100) {
        this.palette256[address & 0xFF] = palette | 0;
    }
    else {
        this.paletteOBJ256[address & 0xFF] = palette | 0;
    }
}
GameBoyAdvanceGraphics.prototype.writePalette16Color = function (address, palette) {
    address = address | 0;
    palette = palette | 0;
    if ((address & 0xF) == 0) {
        palette = 0x3800000 | palette;
    }
    if ((address | 0) < 0x100) {
        //BG Layer Palette:
        this.palette16[address & 0xFF] = palette | 0;
    }
    else {
        //OBJ Layer Palette:
        this.paletteOBJ16[address & 0xFF] = palette | 0;
    }
}
GameBoyAdvanceGraphics.prototype.readPalette = function (address) {
    return this.paletteRAM[address & 0x3FF] | 0;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceIO(settings, coreExposed, BIOS, ROM) {
    //State Machine Tracking:
    this.systemStatus = 0;
    this.cyclesToIterate = 0;
    this.cyclesOveriteratedPreviously = 0;
    this.accumulatedClocks = 0;
    this.graphicsClocks = 0;
    this.timerClocks = 0;
    this.serialClocks = 0;
    this.nextEventClocks = 0;
    this.BIOSFound = false;
    //References passed to us:
    this.settings = settings;
    this.coreExposed = coreExposed;
    this.BIOS = BIOS;
    this.ROM = ROM;
    //Initialize the various handler objects:
    this.memory = new GameBoyAdvanceMemory(this);
    this.dma = new GameBoyAdvanceDMA(this);
    this.gfx = new GameBoyAdvanceGraphics(this);
    this.sound = new GameBoyAdvanceSound(this);
    this.timer = new GameBoyAdvanceTimer(this);
    this.irq = new GameBoyAdvanceIRQ(this);
    this.serial = new GameBoyAdvanceSerial(this);
    this.joypad = new GameBoyAdvanceJoyPad(this);
    this.cartridge = new GameBoyAdvanceCartridge(this);
    this.saves = new GameBoyAdvanceSaves(this);
    this.wait = new GameBoyAdvanceWait(this);
    this.cpu = new GameBoyAdvanceCPU(this);
    this.ARM = this.cpu.ARM;
    this.THUMB = this.cpu.THUMB;
    this.memory.loadReferences();
}
GameBoyAdvanceIO.prototype.enter = function (CPUCyclesTotal) {
    //Find out how many clocks to iterate through this run:
    this.cyclesToIterate = ((CPUCyclesTotal | 0) + (this.cyclesOveriteratedPreviously | 0)) | 0;
    //An extra check to make sure we don't do stuff if we did too much last run:
    if ((this.cyclesToIterate | 0) > 0) {
        //Update our core event prediction:
        this.updateCoreEventTime();
        //If clocks remaining, run iterator:
        this.run();
        //Spill our core event clocking:
        this.updateCoreClocking();
        //Ensure audio buffers at least once per iteration:
        this.sound.audioJIT();
    }
    //If we clocked just a little too much, subtract the extra from the next run:
    this.cyclesOveriteratedPreviously = this.cyclesToIterate | 0;
}
GameBoyAdvanceIO.prototype.run = function () {
    //Clock through the state machine:
    while (true) {
        //Dispatch to optimized run loops:
        switch (this.systemStatus & 0x84) {
            case 0:
                //ARM instruction set:
                this.runARM();
                break;
            case 0x4:
                //THUMB instruction set:
                this.runTHUMB();
                break;
            default:
                //End of stepping:
                this.deflagIterationEnd();
                return;
        }
    }
}
GameBoyAdvanceIO.prototype.runARM = function () {
    //Clock through the state machine:
    while (true) {
        //Handle the current system state selected:
        switch (this.systemStatus | 0) {
            case 0: //CPU Handle State (Normal ARM)
                this.ARM.executeIteration();
                break;
            case 1:
            case 2: //CPU Handle State (Bubble ARM)
                this.ARM.executeBubble();
                this.tickBubble();
                break;
            default: //Handle lesser called / End of stepping
                //Dispatch on IRQ/DMA/HALT/STOP/END bit flags
                switch (this.systemStatus >> 2) {
                    case 0x2:
                        //IRQ Handle State:
                        this.handleIRQARM();
                        break;
                    case 0x4:
                    case 0x6:
                        //DMA Handle State
                    case 0xC:
                    case 0xE:
                        //DMA Inside Halt State
                        this.handleDMA();
                        break;
                    case 0x8:
                    case 0xA:
                        //Handle Halt State
                        this.handleHalt();
                        break;
                    default: //Handle Stop State
                        //THUMB flagged stuff falls to here intentionally:
                        //End of Stepping and/or CPU run loop switch:
                        if ((this.systemStatus & 0x84) != 0) {
                            return;
                        }
                        this.handleStop();
                }
        }
    }
}
GameBoyAdvanceIO.prototype.runTHUMB = function () {
    //Clock through the state machine:
    while (true) {
        //Handle the current system state selected:
        switch (this.systemStatus | 0) {
            case 4: //CPU Handle State (Normal THUMB)
                this.THUMB.executeIteration();
                break;
            case 5:
            case 6: //CPU Handle State (Bubble THUMB)
                this.THUMB.executeBubble();
                this.tickBubble();
                break;
            default: //Handle lesser called / End of stepping
                //Dispatch on IRQ/DMA/HALT/STOP/END bit flags
                switch (this.systemStatus >> 2) {
                    case 0x3:
                        //IRQ Handle State:
                        this.handleIRQThumb();
                        break;
                    case 0x5:
                    case 0x7:
                        //DMA Handle State
                    case 0xD:
                    case 0xF:
                        //DMA Inside Halt State
                        this.handleDMA();
                        break;
                    case 0x9:
                    case 0x11:
                        //Handle Halt State
                        this.handleHalt();
                        break;
                    default: //Handle Stop State
                        //ARM flagged stuff falls to here intentionally:
                        //End of Stepping and/or CPU run loop switch:
                        if ((this.systemStatus & 0x84) != 0x4) {
                            return;
                        }
                        this.handleStop();
                }
        }
    }
}
GameBoyAdvanceIO.prototype.updateCore = function (clocks) {
    clocks = clocks | 0;
    //This is used during normal/dma modes of operation:
    this.accumulatedClocks = ((this.accumulatedClocks | 0) + (clocks | 0)) | 0;
    if ((this.accumulatedClocks | 0) >= (this.nextEventClocks | 0)) {
        this.updateCoreSpill();
    }
}
GameBoyAdvanceIO.prototype.updateCoreSingle = function () {
    //This is used during normal/dma modes of operation:
    this.accumulatedClocks = ((this.accumulatedClocks | 0) + 1) | 0;
    if ((this.accumulatedClocks | 0) >= (this.nextEventClocks | 0)) {
        this.updateCoreSpill();
    }
}
GameBoyAdvanceIO.prototype.updateCoreTwice = function () {
    //This is used during normal/dma modes of operation:
    this.accumulatedClocks = ((this.accumulatedClocks | 0) + 2) | 0;
    if ((this.accumulatedClocks | 0) >= (this.nextEventClocks | 0)) {
        this.updateCoreSpill();
    }
}
GameBoyAdvanceIO.prototype.updateCoreSpill = function () {
    //Invalidate & recompute new event times:
    this.updateCoreClocking();
    this.updateCoreEventTime();
}
GameBoyAdvanceIO.prototype.updateCoreSpillRetain = function () {
    //Keep the last prediction, just decrement it out, as it's still valid:
    this.nextEventClocks = ((this.nextEventClocks | 0) - (this.accumulatedClocks | 0)) | 0;
    this.updateCoreClocking();
}
GameBoyAdvanceIO.prototype.updateCoreClocking = function () {
    var clocks = this.accumulatedClocks | 0;
    //Decrement the clocks per iteration counter:
    this.cyclesToIterate = ((this.cyclesToIterate | 0) - (clocks | 0)) | 0;
    //Clock all components:
    this.gfx.addClocks(((clocks | 0) - (this.graphicsClocks | 0)) | 0);
    this.timer.addClocks(((clocks | 0) - (this.timerClocks | 0)) | 0);
    this.serial.addClocks(((clocks | 0) - (this.serialClocks | 0)) | 0);
    this.accumulatedClocks = 0;
    this.graphicsClocks = 0;
    this.timerClocks = 0;
    this.serialClocks = 0;
}
GameBoyAdvanceIO.prototype.updateGraphicsClocking = function () {
    //Clock gfx component:
    this.gfx.addClocks(((this.accumulatedClocks | 0) - (this.graphicsClocks | 0)) | 0);
    this.graphicsClocks = this.accumulatedClocks | 0;
}
GameBoyAdvanceIO.prototype.updateTimerClocking = function () {
    //Clock timer component:
    this.timer.addClocks(((this.accumulatedClocks | 0) - (this.timerClocks | 0)) | 0);
    this.timerClocks = this.accumulatedClocks | 0;
}
GameBoyAdvanceIO.prototype.updateSerialClocking = function () {
    //Clock serial component:
    this.serial.addClocks(((this.accumulatedClocks | 0) - (this.serialClocks | 0)) | 0);
    this.serialClocks = this.accumulatedClocks | 0;
}
GameBoyAdvanceIO.prototype.updateCoreEventTime = function () {
    //Predict how many clocks until the next DMA or IRQ event:
    this.nextEventClocks = this.cyclesUntilNextEvent() | 0;
}
GameBoyAdvanceIO.prototype.getRemainingCycles = function () {
    //Return the number of cycles left until iteration end:
    if ((this.cyclesToIterate | 0) < 1) {
        //Change our stepper to our end sequence:
        this.flagIterationEnd();
        return 0;
    }
    return this.cyclesToIterate | 0;
}
GameBoyAdvanceIO.prototype.handleIRQARM = function () {
    if ((this.systemStatus | 0) > 0x8) {
        //CPU Handle State (Bubble ARM)
        this.ARM.executeBubble();
        this.tickBubble();
    }
    else {
        //CPU Handle State (IRQ)
        this.cpu.IRQinARM();
    }
}
GameBoyAdvanceIO.prototype.handleIRQThumb = function () {
    if ((this.systemStatus | 0) > 0xC) {
        //CPU Handle State (Bubble THUMB)
        this.THUMB.executeBubble();
        this.tickBubble();
    }
    else {
        //CPU Handle State (IRQ)
        this.cpu.IRQinTHUMB();
    }
}
GameBoyAdvanceIO.prototype.handleDMA = function () {
    /*
     Loop our state status in here as
     an optimized iteration, as DMA stepping instances
     happen in quick succession of each other, and
     aren't often done for one memory word only.
     */
    do {
        //Perform a DMA read and write:
        this.dma.perform();
    } while ((this.systemStatus & 0x90) == 0x10);
}
GameBoyAdvanceIO.prototype.handleHalt = function () {
    if (!this.irq.IRQMatch()) {
        //Clock up to next IRQ match or DMA:
        this.updateCore(this.cyclesUntilNextHALTEvent() | 0);
    }
    else {
        //Exit HALT promptly:
        this.deflagHalt();
    }
}
GameBoyAdvanceIO.prototype.handleStop = function () {
    //Update sound system to add silence to buffer:
    this.sound.addClocks(this.getRemainingCycles() | 0);
    this.cyclesToIterate = 0;
    //Exits when user presses joypad or from an external irq outside of GBA internal.
}
GameBoyAdvanceIO.prototype.cyclesUntilNextHALTEvent = function () {
    //Find the clocks to the next HALT leave or DMA event:
    var haltClocks = this.irq.nextEventTime() | 0;
    var dmaClocks = this.dma.nextEventTime() | 0;
    return this.solveClosestTime(haltClocks | 0, dmaClocks | 0) | 0;
}
GameBoyAdvanceIO.prototype.cyclesUntilNextEvent = function () {
    //Find the clocks to the next IRQ or DMA event:
    var irqClocks = this.irq.nextIRQEventTime() | 0;
    var dmaClocks = this.dma.nextEventTime() | 0;
    return this.solveClosestTime(irqClocks | 0, dmaClocks | 0) | 0;
}
GameBoyAdvanceIO.prototype.solveClosestTime = function (clocks1, clocks2) {
    clocks1 = clocks1 | 0;
    clocks2 = clocks2 | 0;
    //Find the clocks closest to the next event:
    var clocks = this.getRemainingCycles() | 0;
    if ((clocks1 | 0) >= 0) {
        if ((clocks2 | 0) >= 0) {
            clocks = Math.min(clocks | 0, clocks1 | 0, clocks2 | 0) | 0;
        }
        else {
            clocks = Math.min(clocks | 0, clocks1 | 0) | 0;
        }
    }
    else if (clocks2 >= 0) {
        clocks = Math.min(clocks | 0, clocks2 | 0) | 0;
    }
    return clocks | 0;
}
GameBoyAdvanceIO.prototype.flagBubble = function () {
    //Flag a CPU pipeline bubble to step through:
    this.systemStatus = this.systemStatus | 0x2;
}
GameBoyAdvanceIO.prototype.tickBubble = function () {
    //Tick down a CPU pipeline bubble to step through:
    this.systemStatus = ((this.systemStatus | 0) - 1) | 0;
}
GameBoyAdvanceIO.prototype.flagTHUMB = function () {
    //Flag a CPU IRQ to step through:
    this.systemStatus = this.systemStatus | 0x4;
}
GameBoyAdvanceIO.prototype.deflagTHUMB = function () {
    //Deflag a CPU IRQ to step through:
    this.systemStatus = this.systemStatus & 0xFB;
}
GameBoyAdvanceIO.prototype.flagIRQ = function () {
    //Flag THUMB CPU mode to step through:
    this.systemStatus = this.systemStatus | 0x8;
}
GameBoyAdvanceIO.prototype.deflagIRQ = function () {
    //Deflag THUMB CPU mode to step through:
    this.systemStatus = this.systemStatus & 0xF7;
}
GameBoyAdvanceIO.prototype.flagDMA = function () {
    //Flag a DMA event to step through:
    this.systemStatus = this.systemStatus | 0x10;
}
GameBoyAdvanceIO.prototype.deflagDMA = function () {
    //Deflag a DMA event to step through:
    this.systemStatus = this.systemStatus & 0xEF;
}
GameBoyAdvanceIO.prototype.flagHalt = function () {
    //Flag a halt event to step through:
    this.systemStatus = this.systemStatus | 0x20;
}
GameBoyAdvanceIO.prototype.deflagHalt = function () {
    //Deflag a halt event to step through:
    this.systemStatus = this.systemStatus & 0xDF;
}
GameBoyAdvanceIO.prototype.flagStop = function () {
    //Flag a halt event to step through:
    this.systemStatus = this.systemStatus | 0x40;
}
GameBoyAdvanceIO.prototype.deflagStop = function () {
    //Deflag a halt event to step through:
    this.systemStatus = this.systemStatus & 0xBF;
}
GameBoyAdvanceIO.prototype.flagIterationEnd = function () {
    //Flag a run loop kill event to step through:
    this.systemStatus = this.systemStatus | 0x80;
}
GameBoyAdvanceIO.prototype.deflagIterationEnd = function () {
    //Deflag a run loop kill event to step through:
    this.systemStatus = this.systemStatus & 0x7F;
}
GameBoyAdvanceIO.prototype.isStopped = function () {
    //Sound system uses this to emulate a unpowered audio output:
    return ((this.systemStatus & 0x40) == 0x40);
}
GameBoyAdvanceIO.prototype.inDMA = function () {
    //Save system uses this to detect dma:
    return ((this.systemStatus & 0x10) == 0x10);
}
GameBoyAdvanceIO.prototype.getCurrentFetchValue = function () {
    //Last valid value output for bad reads:
    var fetch = 0;
    if ((this.systemStatus & 0x10) == 0) {
        fetch = this.cpu.getCurrentFetchValue() | 0;
    }
    else {
        fetch = this.dma.getCurrentFetchValue() | 0;
    }
    return fetch | 0;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceMemory(IOCore) {
    //Reference to the emulator core:
    this.IOCore = IOCore;
    //WRAM Map Control Stuff:
    this.WRAMControlFlags = 0x20;
    //Load the BIOS:
    this.BIOS = getUint8Array(0x4000);
    this.BIOS16 = getUint16View(this.BIOS);
    this.BIOS32 = getInt32View(this.BIOS);
    this.loadBIOS();
    //Initialize Some RAM:
    this.externalRAM = getUint8Array(0x40000);
    this.externalRAM16 = getUint16View(this.externalRAM);
    this.externalRAM32 = getInt32View(this.externalRAM);
    this.internalRAM = getUint8Array(0x8000);
    this.internalRAM16 = getUint16View(this.internalRAM);
    this.internalRAM32 = getInt32View(this.internalRAM);
    this.lastBIOSREAD = 0;        //BIOS read bus last.
    //After all sub-objects initialized, initialize dispatches:
    var generator = new GameBoyAdvanceMemoryDispatchGenerator(this);
    this.readIO8 = generator.generateMemoryReadIO8();
    this.readIO16 = generator.generateMemoryReadIO16();
    this.writeIO8 = generator.generateMemoryWriteIO8();
    this.writeIO16 = generator.generateMemoryWriteIO16();
    this.memoryRead8 = this.memoryRead8Generated[1];
    this.memoryWrite8 = this.memoryWrite8Generated[1];
    this.memoryRead16 = this.memoryRead16Generated[1];
    this.memoryReadCPU16 = this.memoryReadCPU16Generated[1];
    this.memoryWrite16 = this.memoryWrite16Generated[1];
    this.memoryRead32 = this.memoryRead32Generated[1];
    this.memoryReadCPU32 = this.memoryReadCPU32Generated[1];
    this.memoryWrite32 = this.memoryWrite32Generated[1];
}
GameBoyAdvanceMemory.prototype.loadReferences = function () {
    //Initialize the various handler objects:
    this.dma = this.IOCore.dma;
    this.gfx = this.IOCore.gfx;
    this.sound = this.IOCore.sound;
    this.timer = this.IOCore.timer;
    this.irq = this.IOCore.irq;
    this.serial = this.IOCore.serial;
    this.joypad = this.IOCore.joypad;
    this.cartridge = this.IOCore.cartridge;
    this.wait = this.IOCore.wait;
    this.cpu = this.IOCore.cpu;
    this.saves = this.IOCore.saves;
}
GameBoyAdvanceMemory.prototype.writeExternalWRAM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    //External WRAM:
    this.wait.WRAMAccess();
    this.externalRAM[address & 0x3FFFF] = data & 0xFF;
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceMemory.prototype.writeExternalWRAM16 = function (address, data) {
        address = address | 0;
        data = data | 0;
        //External WRAM:
        this.wait.WRAMAccess();
        this.externalRAM16[(address >> 1) & 0x1FFFF] = data & 0xFFFF;
    }
    GameBoyAdvanceMemory.prototype.writeExternalWRAM32 = function (address, data) {
        address = address | 0;
        data = data | 0;
        //External WRAM:
        this.wait.WRAMAccess32();
        this.externalRAM32[(address >> 2) & 0xFFFF] = data | 0;
    }
}
else {
    GameBoyAdvanceMemory.prototype.writeExternalWRAM16 = function (address, data) {
        //External WRAM:
        this.wait.WRAMAccess();
        address &= 0x3FFFE;
        this.externalRAM[address++] = data & 0xFF;
        this.externalRAM[address] = (data >> 8) & 0xFF;
    }
    GameBoyAdvanceMemory.prototype.writeExternalWRAM32 = function (address, data) {
        //External WRAM:
        this.wait.WRAMAccess32();
        address &= 0x3FFFC;
        this.externalRAM[address++] = data & 0xFF;
        this.externalRAM[address++] = (data >> 8) & 0xFF;
        this.externalRAM[address++] = (data >> 16) & 0xFF;
        this.externalRAM[address] = data >>> 24;
    }
}
GameBoyAdvanceMemory.prototype.writeInternalWRAM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    //Internal WRAM:
    this.wait.singleClock();
    this.internalRAM[address & 0x7FFF] = data & 0xFF;
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceMemory.prototype.writeInternalWRAM16 = function (address, data) {
        address = address | 0;
        data = data | 0;
        //Internal WRAM:
        this.wait.singleClock();
        this.internalRAM16[(address >> 1) & 0x3FFF] = data & 0xFFFF;
    }
    GameBoyAdvanceMemory.prototype.writeInternalWRAM32 = function (address, data) {
        address = address | 0;
        data = data | 0;
        //Internal WRAM:
        this.wait.singleClock();
        this.internalRAM32[(address >> 2) & 0x1FFF] = data | 0;
    }
}
else {
    GameBoyAdvanceMemory.prototype.writeInternalWRAM16 = function (address, data) {
        //Internal WRAM:
        this.wait.singleClock();
        address &= 0x7FFE;
        this.internalRAM[address++] = data & 0xFF;
        this.internalRAM[address] = (data >> 8) & 0xFF;
    }
    GameBoyAdvanceMemory.prototype.writeInternalWRAM32 = function (address, data) {
        //Internal WRAM:
        this.wait.singleClock();
        address &= 0x7FFC;
        this.internalRAM[address++] = data & 0xFF;
        this.internalRAM[address++] = (data >> 8) & 0xFF;
        this.internalRAM[address++] = (data >> 16) & 0xFF;
        this.internalRAM[address] = data >>> 24;
    }
}
GameBoyAdvanceMemory.prototype.writeIODispatch8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.singleClock();
    if ((address | 0) < 0x4000302) {
        //IO Write:
        this.writeIO8[address & 0x3FF](this, data & 0xFF);
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        this.wait.writeConfigureWRAM8(address | 0, data & 0xFF);
    }
}
GameBoyAdvanceMemory.prototype.writeIODispatch16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.singleClock();
    if ((address | 0) < 0x4000302) {
        //IO Write:
        address = address >> 1;
        this.writeIO16[address & 0x1FF](this, data & 0xFFFF);
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        this.wait.writeConfigureWRAM16(address | 0, data & 0xFFFF);
    }
}
GameBoyAdvanceMemory.prototype.writeIODispatch32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.singleClock();
    if ((address | 0) < 0x4000304) {
        //IO Write:
        switch ((address >> 2) & 0xFF) {
            //4000000h - DISPCNT - LCD Control (Read/Write)
            //4000002h - Undocumented - Green Swap (R/W)
            case 0:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeDISPCNT0(data & 0xFF);
                this.gfx.writeDISPCNT1((data >> 8) & 0xFF);
                this.gfx.writeGreenSwap((data >> 16) & 0xFF);
                break;
            //4000004h - DISPSTAT - General LCD Status (Read/Write)
            //4000006h - VCOUNT - Vertical Counter (Read only)
            case 0x1:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeDISPSTAT0(data & 0xFF);
                this.gfx.writeDISPSTAT1((data >> 8) & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
            //400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
            case 0x2:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG0CNT0(data & 0xFF);
                this.gfx.writeBG0CNT1((data >> 8) & 0xFF);
                this.gfx.writeBG1CNT0((data >> 16) & 0xFF);
                this.gfx.writeBG1CNT1(data >>> 24);
                break;
            //400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
            //400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
            case 0x3:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG2CNT0(data & 0xFF);
                this.gfx.writeBG2CNT1((data >> 8) & 0xFF);
                this.gfx.writeBG3CNT0((data >> 16) & 0xFF);
                this.gfx.writeBG3CNT1(data >>> 24);
                break;
            //4000010h - BG0HOFS - BG0 X-Offset (W)
            //4000012h - BG0VOFS - BG0 Y-Offset (W)
            case 0x4:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG0HOFS0(data & 0xFF);
                this.gfx.writeBG0HOFS1((data >> 8) & 0xFF);
                this.gfx.writeBG0VOFS0((data >> 16) & 0xFF);
                this.gfx.writeBG0VOFS1(data >>> 24);
                break;
            //4000014h - BG1HOFS - BG1 X-Offset (W)
            //4000016h - BG1VOFS - BG1 Y-Offset (W)
            case 0x5:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG1HOFS0(data & 0xFF);
                this.gfx.writeBG1HOFS1((data >> 8) & 0xFF);
                this.gfx.writeBG1VOFS0((data >> 16) & 0xFF);
                this.gfx.writeBG1VOFS1(data >>> 24);
                break;
            //4000018h - BG2HOFS - BG2 X-Offset (W)
            //400001Ah - BG2VOFS - BG2 Y-Offset (W)
            case 0x6:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG2HOFS0(data & 0xFF);
                this.gfx.writeBG2HOFS1((data >> 8) & 0xFF);
                this.gfx.writeBG2VOFS0((data >> 16) & 0xFF);
                this.gfx.writeBG2VOFS1(data >>> 24);
                break;
            //400001Ch - BG3HOFS - BG3 X-Offset (W)
            //400001Eh - BG3VOFS - BG3 Y-Offset (W)
            case 0x7:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG3HOFS0(data & 0xFF);
                this.gfx.writeBG3HOFS1((data >> 8) & 0xFF);
                this.gfx.writeBG3VOFS0((data >> 16) & 0xFF);
                this.gfx.writeBG3VOFS1(data >>> 24);
                break;
            //4000020h - BG2PA - BG2 Rotation/Scaling Parameter A (alias dx) (W)
            //4000022h - BG2PB - BG2 Rotation/Scaling Parameter B (alias dmx) (W)
            case 0x8:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG2PA0(data & 0xFF);
                this.gfx.writeBG2PA1((data >> 8) & 0xFF);
                this.gfx.writeBG2PB0((data >> 16) & 0xFF);
                this.gfx.writeBG2PB1(data >>> 24);
                break;
            //4000024h - BG2PC - BG2 Rotation/Scaling Parameter C (alias dy) (W)
            //4000026h - BG2PD - BG2 Rotation/Scaling Parameter D (alias dmy) (W)
            case 0x9:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG2PC0(data & 0xFF);
                this.gfx.writeBG2PC1((data >> 8) & 0xFF);
                this.gfx.writeBG2PD0((data >> 16) & 0xFF);
                this.gfx.writeBG2PD1(data >>> 24);
                break;
            //4000028h - BG2X_L - BG2 Reference Point X-Coordinate, lower 16 bit (W)
            //400002Ah - BG2X_H - BG2 Reference Point X-Coordinate, upper 12 bit (W)
            case 0xA:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG2X_L0(data & 0xFF);
                this.gfx.writeBG2X_L1((data >> 8) & 0xFF);
                this.gfx.writeBG2X_H0((data >> 16) & 0xFF);
                this.gfx.writeBG2X_H1(data >>> 24);
                break;
            //400002Ch - BG2Y_L - BG2 Reference Point Y-Coordinate, lower 16 bit (W)
            //400002Eh - BG2Y_H - BG2 Reference Point Y-Coordinate, upper 12 bit (W)
            case 0xB:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG2Y_L0(data & 0xFF);
                this.gfx.writeBG2Y_L1((data >> 8) & 0xFF);
                this.gfx.writeBG2Y_H0((data >> 16) & 0xFF);
                this.gfx.writeBG2Y_H1(data >>> 24);
                break;
            //4000030h - BG3PA - BG3 Rotation/Scaling Parameter A (alias dx) (W)
            //4000032h - BG3PB - BG3 Rotation/Scaling Parameter B (alias dmx) (W)
            case 0xC:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG3PA0(data & 0xFF);
                this.gfx.writeBG3PA1((data >> 8) & 0xFF);
                this.gfx.writeBG3PB0((data >> 16) & 0xFF);
                this.gfx.writeBG3PB1(data >>> 24);
                break;
            //4000034h - BG3PC - BG3 Rotation/Scaling Parameter C (alias dy) (W)
            //4000036h - BG3PD - BG3 Rotation/Scaling Parameter D (alias dmy) (W)
            case 0xD:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG3PC0(data & 0xFF);
                this.gfx.writeBG3PC1((data >> 8) & 0xFF);
                this.gfx.writeBG3PD0((data >> 16) & 0xFF);
                this.gfx.writeBG3PD1(data >>> 24);
                break;
            //4000038h - BG3X_L - BG3 Reference Point X-Coordinate, lower 16 bit (W)
            //400003Ah - BG3X_H - BG3 Reference Point X-Coordinate, upper 12 bit (W)
            case 0xE:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG3X_L0(data & 0xFF);
                this.gfx.writeBG3X_L1((data >> 8) & 0xFF);
                this.gfx.writeBG3X_H0((data >> 16) & 0xFF);
                this.gfx.writeBG3X_H1(data >>> 24);
                break;
            //400003Ch - BG3Y_L - BG3 Reference Point Y-Coordinate, lower 16 bit (W)
            //400003Eh - BG3Y_H - BG3 Reference Point Y-Coordinate, upper 12 bit (W)
            case 0xF:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG3Y_L0(data & 0xFF);
                this.gfx.writeBG3Y_L1((data >> 8) & 0xFF);
                this.gfx.writeBG3Y_H0((data >> 16) & 0xFF);
                this.gfx.writeBG3Y_H1(data >>> 24);
                break;
            //4000040h - WIN0H - Window 0 Horizontal Dimensions (W)
            //4000042h - WIN1H - Window 1 Horizontal Dimensions (W)
            case 0x10:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeWIN0H0(data & 0xFF);
                this.gfx.writeWIN0H1((data >> 8) & 0xFF);
                this.gfx.writeWIN1H0((data >> 16) & 0xFF);
                this.gfx.writeWIN1H1(data >>> 24);
                break;
            //4000044h - WIN0V - Window 0 Vertical Dimensions (W)
            //4000046h - WIN1V - Window 1 Vertical Dimensions (W)
            case 0x11:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeWIN0V0(data & 0xFF);
                this.gfx.writeWIN0V1((data >> 8) & 0xFF);
                this.gfx.writeWIN1V0((data >> 16) & 0xFF);
                this.gfx.writeWIN1V1(data >>> 24);
                break;
            //4000048h - WININ - Control of Inside of Window(s) (R/W)
            //400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
            case 0x12:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeWININ0(data & 0xFF);
                this.gfx.writeWININ1((data >> 8) & 0xFF);
                this.gfx.writeWINOUT0((data >> 16) & 0xFF);
                this.gfx.writeWINOUT1(data >>> 24);
                break;
            //400004Ch - MOSAIC - Mosaic Size (W)
            //400004Eh - NOT USED - ZERO
            case 0x13:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeMOSAIC0(data & 0xFF);
                this.gfx.writeMOSAIC1((data >> 8) & 0xFF);
                break;
            //4000050h - BLDCNT - Color Special Effects Selection (R/W)
            //4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
            case 0x14:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBLDCNT0(data & 0xFF);
                this.gfx.writeBLDCNT1((data >> 8) & 0xFF);
                this.gfx.writeBLDALPHA0((data >> 16) & 0xFF);
                this.gfx.writeBLDALPHA1(data >>> 24);
                break;
            //4000054h - BLDY - Brightness (Fade-In/Out) Coefficient (W)
            case 0x15:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBLDY(data & 0xFF);
                break;
            //4000055h through 400005Fh - NOT USED - ZERO/GLITCHED
            //4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
            //4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
            case 0x18:
                    //NR10:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND1CNT_L(data & 0xFF);
                    //NR11:
                this.sound.writeSOUND1CNT_H0((data >> 16) & 0xFF);
                    //NR12:
                this.sound.writeSOUND1CNT_H1(data >>> 24);
                break;
            //4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
            //4000066h - NOT USED - ZERO
            case 0x19:
                    //NR13:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND1CNT_X0(data & 0xFF);
                    //NR14:
                this.sound.writeSOUND1CNT_X1((data >> 8) & 0xFF);
                break;
            //4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
            //400006Ah - NOT USED - ZERO
            case 0x1A:
                    //NR21:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND2CNT_L0(data & 0xFF);
                    //NR22:
                this.sound.writeSOUND2CNT_L1((data >> 8) & 0xFF);
                break;
            //400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
            //400006Eh - NOT USED - ZERO
            case 0x1B:
                    //NR23:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND2CNT_H0(data & 0xFF);
                    //NR24:
                this.sound.writeSOUND2CNT_H1((data >> 8) & 0xFF);
                break;
            //4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
            //4000072h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
            case 0x1C:
                    //NR30:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND3CNT_L(data & 0xFF);
                    //NR31:
                this.sound.writeSOUND3CNT_H0((data >> 16) & 0xFF);
                    //NR32:
                this.sound.writeSOUND3CNT_H1(data >>> 24);
                break;
            //4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
            //4000076h - NOT USED - ZERO
            case 0x1D:
                    //NR33:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND3CNT_X0(data & 0xFF);
                    //NR34:
                this.sound.writeSOUND3CNT_X1((data >> 8) & 0xFF);
                break;
            //4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
            //400007Ah - NOT USED - ZERO
            case 0x1E:
                    //NR41:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND4CNT_L0(data & 0xFF);
                    //NR42:
                this.sound.writeSOUND4CNT_L1((data >> 8) & 0xFF);
                break;
            //400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
            //400007Eh - NOT USED - ZERO
            case 0x1F:
                    //NR43:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND4CNT_H0(data & 0xFF);
                    //NR44:
                this.sound.writeSOUND4CNT_H1((data >> 8) & 0xFF);
                break;
            //4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
            //4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
            case 0x20:
                    //NR50:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUNDCNT_L0(data & 0xFF);
                    //NR51:
                this.sound.writeSOUNDCNT_L1((data >> 8) & 0xFF);
                this.sound.writeSOUNDCNT_H0((data >> 16) & 0xFF);
                this.sound.writeSOUNDCNT_H1(data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
            //4000086h - NOT USED - ZERO
            case 0x21:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUNDCNT_X(data & 0xFF);
                break;
            //4000088h - SOUNDBIAS - Sound PWM Control (R/W)
            case 0x22:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUNDBIAS0(data & 0xFF);
                this.sound.writeSOUNDBIAS1((data >> 8) & 0xFF);
                break;
            //400008Ah through 400008Fh - NOT USED - ZERO/GLITCHED
            //4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
            //4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
            case 0x24:
                this.IOCore.updateTimerClocking();
                this.sound.writeWAVE(0, data & 0xFF);
                this.sound.writeWAVE(0x1, (data >> 8) & 0xFF);
                this.sound.writeWAVE(0x2, (data >> 16) & 0xFF);
                this.sound.writeWAVE(0x3, data >>> 24);
                break;
            //4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
            //4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
            case 0x25:
                this.IOCore.updateTimerClocking();
                this.sound.writeWAVE(0x4, data & 0xFF);
                this.sound.writeWAVE(0x5, (data >> 8) & 0xFF);
                this.sound.writeWAVE(0x6, (data >> 16) & 0xFF);
                this.sound.writeWAVE(0x7, data >>> 24);
                break;
            //4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
            //400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
            case 0x26:
                this.IOCore.updateTimerClocking();
                this.sound.writeWAVE(0x8, data & 0xFF);
                this.sound.writeWAVE(0x9, (data >> 8) & 0xFF);
                this.sound.writeWAVE(0xA, (data >> 16) & 0xFF);
                this.sound.writeWAVE(0xB, data >>> 24);
                break;
            //400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
            //400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
            case 0x27:
                this.IOCore.updateTimerClocking();
                this.sound.writeWAVE(0xC, data & 0xFF);
                this.sound.writeWAVE(0xD, (data >> 8) & 0xFF);
                this.sound.writeWAVE(0xE, (data >> 16) & 0xFF);
                this.sound.writeWAVE(0xF, data >>> 24);
                break;
            //40000A0h - FIFO_A_L - FIFO Channel A First Word (W)
            //40000A2h - FIFO_A_H - FIFO Channel A Second Word (W)
            case 0x28:
                this.IOCore.updateTimerClocking();
                this.sound.writeFIFOA(data & 0xFF);
                this.sound.writeFIFOA((data >> 8) & 0xFF);
                this.sound.writeFIFOA((data >> 16) & 0xFF);
                this.sound.writeFIFOA(data >>> 24);
                break;
            //40000A4h - FIFO_B_L - FIFO Channel B First Word (W)
            //40000A6h - FIFO_B_H - FIFO Channel B Second Word (W)
            case 0x29:
                this.IOCore.updateTimerClocking();
                this.sound.writeFIFOB(data & 0xFF);
                this.sound.writeFIFOB((data >> 8) & 0xFF);
                this.sound.writeFIFOB((data >> 16) & 0xFF);
                this.sound.writeFIFOB(data >>> 24);
                break;
            //40000A8h through 40000AFh - NOT USED - GLITCHED
            //40000B0h - DMA0SAH - DMA 0 Source Address (W) (internal memory)
            //40000B2h - DMA0SAD - DMA 0 Source Address (W) (internal memory)
            case 0x2C:
                this.dma.writeDMASource0(0, data & 0xFF);
                this.dma.writeDMASource1(0, (data >> 8) & 0xFF);
                this.dma.writeDMASource2(0, (data >> 16) & 0xFF);
                this.dma.writeDMASource3(0, (data >> 24) & 0x7);    //Mask out the unused bits.
                break;
            //40000B4h - DMA0DAD - DMA 0 Destination Address (W) (internal memory)
            //40000B6h - DMA0DAH - DMA 0 Destination Address (W) (internal memory)
            case 0x2D:
                this.dma.writeDMADestination0(0, data & 0xFF);
                this.dma.writeDMADestination1(0, (data >> 8) & 0xFF);
                this.dma.writeDMADestination2(0, (data >> 16) & 0xFF);
                this.dma.writeDMADestination3(0, (data >> 24) & 0x7);
                break;
            //40000B8h - DMA0CNT_L - DMA 0 Word Count (W) (14 bit, 1..4000h)
            //40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
            case 0x2E:
                this.dma.writeDMAWordCount0(0, data & 0xFF);
                this.dma.writeDMAWordCount1(0, (data >> 8) & 0x3F);
                this.dma.writeDMAControl0(0, (data >> 16) & 0xFF);
                this.IOCore.updateCoreClocking();
                this.dma.writeDMAControl1(0, data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //40000BCh - DMA1SAD - DMA 1 Source Address (W) (internal memory)
            //40000BEh - DMA1SAH - DMA 1 Source Address (W) (internal memory)
            case 0x2F:
                this.dma.writeDMASource0(1, data & 0xFF);
                this.dma.writeDMASource1(1, (data >> 8) & 0xFF);
                this.dma.writeDMASource2(1, (data >> 16) & 0xFF);
                this.dma.writeDMASource3(1, (data >> 24) & 0xF);    //Mask out the unused bits.
                break;
            //40000C0h - DMA1DAD - DMA 1 Destination Address (W) (internal memory)
            //40000C2h - DMA1DAH - DMA 1 Destination Address (W) (internal memory)
            case 0x30:
                this.dma.writeDMADestination0(1, data & 0xFF);
                this.dma.writeDMADestination1(1, (data >> 8) & 0xFF);
                this.dma.writeDMADestination2(1, (data >> 16) & 0xFF);
                this.dma.writeDMADestination3(1, (data >> 24) & 0x7);
                break;
            //40000C4h - DMA1CNT_L - DMA 1 Word Count (W) (14 bit, 1..4000h)
            //40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
            case 0x31:
                this.dma.writeDMAWordCount0(1, data & 0xFF);
                this.dma.writeDMAWordCount1(1, (data >> 8) & 0x3F);
                this.dma.writeDMAControl0(1, (data >> 16) & 0xFF);
                this.IOCore.updateCoreClocking();
                this.dma.writeDMAControl1(1, data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //40000C8h - DMA2SAD - DMA 2 Source Address (W) (internal memory)
            //40000CAh - DMA2SAH - DMA 2 Source Address (W) (internal memory)
            case 0x32:
                this.dma.writeDMASource0(2, data & 0xFF);
                this.dma.writeDMASource1(2, (data >> 8) & 0xFF);
                this.dma.writeDMASource2(2, (data >> 16) & 0xFF);
                this.dma.writeDMASource3(2, (data >> 24) & 0xF);    //Mask out the unused bits.
                break;
            //40000CCh - DMA2DAD - DMA 2 Destination Address (W) (internal memory)
            //40000CEh - DMA2DAH - DMA 2 Destination Address (W) (internal memory)
            case 0x33:
                this.dma.writeDMADestination0(2, data & 0xFF);
                this.dma.writeDMADestination1(2, (data >> 8) & 0xFF);
                this.dma.writeDMADestination2(2, (data >> 16) & 0xFF);
                this.dma.writeDMADestination3(2, (data >> 24) & 0x7);
                break;
            //40000D0h - DMA2CNT_L - DMA 2 Word Count (W) (14 bit, 1..4000h)
            //40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
            case 0x34:
                this.dma.writeDMAWordCount0(2, data & 0xFF);
                this.dma.writeDMAWordCount1(2, (data >> 8) & 0x3F);
                this.dma.writeDMAControl0(2, (data >> 16) & 0xFF);
                this.IOCore.updateCoreClocking();
                this.dma.writeDMAControl1(2, data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //40000D4h - DMA3SAD - DMA 3 Source Address (W) (internal memory)
            //40000D6h - DMA3SAH - DMA 3 Source Address (W) (internal memory)
            case 0x35:
                this.dma.writeDMASource0(3, data & 0xFF);
                this.dma.writeDMASource1(3, (data >> 8) & 0xFF);
                this.dma.writeDMASource2(3, (data >> 16) & 0xFF);
                this.dma.writeDMASource3(3, (data >> 24) & 0xF);    //Mask out the unused bits.
                break;
            //40000D8h - DMA3DAD - DMA 3 Destination Address (W) (internal memory)
            //40000DAh - DMA3DAH - DMA 3 Destination Address (W) (internal memory)
            case 0x36:
                this.dma.writeDMADestination0(3, data & 0xFF);
                this.dma.writeDMADestination1(3, (data >> 8) & 0xFF);
                this.dma.writeDMADestination2(3, (data >> 16) & 0xFF);
                this.dma.writeDMADestination3(3, (data >> 24) & 0xF);
                break;
            //40000DCh - DMA3CNT_L - DMA 3 Word Count (W) (16 bit, 1..10000h)
            //40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
            case 0x37:
                this.dma.writeDMAWordCount0(3, data & 0xFF);
                this.dma.writeDMAWordCount1(3, (data >> 8) & 0xFF);
                this.dma.writeDMAControl0(3, (data >> 16) & 0xFF);
                this.IOCore.updateCoreClocking();
                this.dma.writeDMAControl1(3, data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //40000E0h through 40000FFh - NOT USED - GLITCHED
            //4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
            //4000102h - TM0CNT_H - Timer 0 Control (R/W)
            case 0x40:
                this.IOCore.updateTimerClocking();
                this.timer.writeTM0CNT_L0(data & 0xFF);
                this.timer.writeTM0CNT_L1((data >> 8) & 0xFF);
                this.timer.writeTM0CNT_H((data >> 16) & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
            //4000106h - TM1CNT_H - Timer 1 Control (R/W)
            case 0x41:
                this.IOCore.updateTimerClocking();
                this.timer.writeTM1CNT_L0(data & 0xFF);
                this.timer.writeTM1CNT_L1((data >> 8) & 0xFF);
                this.timer.writeTM1CNT_H((data >> 16) & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
            //400010Ah - TM2CNT_H - Timer 2 Control (R/W)
            case 0x42:
                this.IOCore.updateTimerClocking();
                this.timer.writeTM2CNT_L0(data & 0xFF);
                this.timer.writeTM2CNT_L1((data >> 8) & 0xFF);
                this.timer.writeTM2CNT_H((data >> 16) & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
            //400010Eh - TM3CNT_H - Timer 3 Control (R/W)
            case 0x43:
                this.IOCore.updateTimerClocking();
                this.timer.writeTM3CNT_L0(data & 0xFF);
                this.timer.writeTM3CNT_L1((data >> 8) & 0xFF);
                this.timer.writeTM3CNT_H((data >> 16) & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000110h through 400011Fh - NOT USED - GLITCHED
            //4000120h - Serial Data A (R/W)
            //4000122h - Serial Data B (R/W)
            case 0x48:
                this.IOCore.updateSerialClocking();
                this.serial.writeSIODATA_A0(data & 0xFF);
                this.serial.writeSIODATA_A1((data >> 8) & 0xFF);
                this.serial.writeSIODATA_B0((data >> 16) & 0xFF);
                this.serial.writeSIODATA_B1(data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //4000124h - Serial Data C (R/W)
            //4000126h - Serial Data D (R/W)
            case 0x49:
                this.IOCore.updateSerialClocking();
                this.serial.writeSIODATA_C0(data & 0xFF);
                this.serial.writeSIODATA_C1((data >> 8) & 0xFF);
                this.serial.writeSIODATA_D0((data >> 16) & 0xFF);
                this.serial.writeSIODATA_D1(data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //4000128h - SIOCNT - SIO Sub Mode Control (R/W)
            //400012Ah - SIOMLT_SEND - Data Send Register (R/W)
            case 0x4A:
                this.IOCore.updateSerialClocking();
                this.serial.writeSIOCNT0(data & 0xFF);
                this.serial.writeSIOCNT1((data >> 8) & 0xFF);
                this.serial.writeSIODATA8_0((data >> 16) & 0xFF);
                this.serial.writeSIODATA8_1(data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //400012Ch through 400012Fh - NOT USED - GLITCHED
            //4000130h - KEYINPUT - Key Status (R)
            //4000132h - KEYCNT - Key Interrupt Control (R/W)
            case 0x4C:
                this.joypad.writeKeyControl0((data >> 16) & 0xFF);
                this.joypad.writeKeyControl1(data >>> 24);
                break;
            //4000134h - RCNT (R/W) - Mode Selection
            case 0x4D:
                this.IOCore.updateSerialClocking();
                this.serial.writeRCNT0(data & 0xFF);
                this.serial.writeRCNT1((data >> 8) & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000136h through 400013Fh - NOT USED - GLITCHED
            //4000140h - JOYCNT - JOY BUS Control Register (R/W)
            case 0x50:
                this.IOCore.updateSerialClocking();
                this.serial.writeJOYCNT(data & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000142h through 400014Fh - NOT USED - GLITCHED
            //4000150h - JoyBus Receive (R/W)
            //4000152h - JoyBus Receive (R/W)
            case 0x54:
                this.IOCore.updateSerialClocking();
                this.serial.writeJOYBUS_RECV0(data & 0xFF);
                this.serial.writeJOYBUS_RECV1((data >> 8) & 0xFF);
                this.serial.writeJOYBUS_RECV2((data >> 16) & 0xFF);
                this.serial.writeJOYBUS_RECV3(data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //4000154h - JoyBus Send (R/W)
            //4000156h - JoyBus Send (R/W)
            case 0x55:
                this.IOCore.updateSerialClocking();
                this.serial.writeJOYBUS_SEND0(data & 0xFF);
                this.serial.writeJOYBUS_SEND1((data >> 8) & 0xFF);
                this.serial.writeJOYBUS_SEND2((data >> 16) & 0xFF);
                this.serial.writeJOYBUS_SEND3(data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //4000158h - JoyBus Stat (R/W)
            case 0x56:
                this.IOCore.updateSerialClocking();
                this.serial.writeJOYBUS_STAT(data & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000159h through 40001FFh - NOT USED - GLITCHED
            //4000200h - IE - Interrupt Enable Register (R/W)
            //4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
            case 0x80:
                this.IOCore.updateCoreClocking();
                this.irq.writeIE0(data & 0xFF);
                this.irq.writeIE1((data >> 8) & 0xFF);
                this.irq.writeIF0((data >> 16) & 0xFF);
                this.irq.writeIF1(data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //4000204h - WAITCNT - Waitstate Control (R/W)
            //4000206h - WAITCNT - Waitstate Control (R/W)
            case 0x81:
                this.wait.writeWAITCNT0(data & 0xFF);
                this.wait.writeWAITCNT1((data >> 8) & 0xFF);
                break;
            //4000208h - IME - Interrupt Master Enable Register (R/W)
            case 0x82:
                this.IOCore.updateCoreClocking();
                this.irq.writeIME(data & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000209h through 40002FFh - NOT USED - GLITCHED
            //4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
            //4000302h - NOT USED - ZERO
            case 0xC0:
                this.wait.writePOSTBOOT(data & 0xFF);
                this.wait.writeHALTCNT((data >> 8) & 0xFF);
        }
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        this.wait.writeConfigureWRAM32(data | 0);
    }
}
GameBoyAdvanceMemory.prototype.writeVRAM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    this.gfx.writeVRAM8(address | 0, data | 0);
}
GameBoyAdvanceMemory.prototype.writeVRAM16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    this.gfx.writeVRAM16(address | 0, data | 0);
}
GameBoyAdvanceMemory.prototype.writeVRAM32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess32();
    this.gfx.writeVRAM32(address | 0, data | 0);
}
GameBoyAdvanceMemory.prototype.writeOAM8 = function (address, data) {
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccess();
}
GameBoyAdvanceMemory.prototype.writeOAM16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccess();
    this.gfx.writeOAM16(address & 0x3FE, data & 0xFFFF);
}
GameBoyAdvanceMemory.prototype.writeOAM32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccess();
    this.gfx.writeOAM32(address & 0x3FC, data | 0);
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceMemory.prototype.writePalette8 = function (address, data) {
        address = address | 0;
        data = data | 0;
        this.IOCore.updateGraphicsClocking();
        this.wait.VRAMAccess();
        this.gfx.writePalette16(address & 0x3FE, Math.imul(data & 0xFF, 0x101) | 0);
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceMemory.prototype.writePalette8 = function (address, data) {
        data = data & 0xFF;
        this.IOCore.updateGraphicsClocking();
        this.wait.VRAMAccess();
        this.gfx.writePalette16(address & 0x3FE, (data * 0x101) | 0);
    }
}
GameBoyAdvanceMemory.prototype.writePalette16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    this.gfx.writePalette16(address & 0x3FE, data & 0xFFFF);
}
GameBoyAdvanceMemory.prototype.writePalette32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess32();
    this.gfx.writePalette32(address & 0x3FC, data | 0);
}
GameBoyAdvanceMemory.prototype.writeROM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.ROMAccess(address | 0);
    this.cartridge.writeROM8(address & 0x1FFFFFF, data & 0xFF);
}
GameBoyAdvanceMemory.prototype.writeROM16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.ROMAccess(address | 0);
    this.cartridge.writeROM16(address & 0x1FFFFFE, data & 0xFFFF);
}
GameBoyAdvanceMemory.prototype.writeROM32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.ROMAccess32(address | 0);
    this.cartridge.writeROM32(address & 0x1FFFFFC, data | 0);
}
GameBoyAdvanceMemory.prototype.writeSRAM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.SRAMAccess();
    this.saves.writeSRAM(address & 0xFFFF, data & 0xFF);
}
GameBoyAdvanceMemory.prototype.writeSRAM16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.SRAMAccess();
    this.saves.writeSRAM(address & 0xFFFE, (data >> ((address & 0x2) << 3)) & 0xFF);
}
GameBoyAdvanceMemory.prototype.writeSRAM32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.SRAMAccess();
    this.saves.writeSRAM(address & 0xFFFC, data & 0xFF);
}
GameBoyAdvanceMemory.prototype.NOP = function (parentObj, data) {
    //Ignore the data write...
}
GameBoyAdvanceMemory.prototype.writeUnused = function () {
    //Ignore the data write...
    this.wait.singleClock();
}
GameBoyAdvanceMemory.prototype.remapWRAM = function (data) {
    data = data & 0x21;
    if ((data | 0) != (this.WRAMControlFlags | 0)) {
        switch (data | 0) {
            case 0:
                //Mirror Internal RAM to External:
                this.memoryWrite8 = this.memoryWrite8Generated[0];
                this.memoryRead8 = this.memoryRead8Generated[0];
                this.memoryWrite16 = this.memoryWrite16Generated[0];
                this.memoryRead16 = this.memoryRead16Generated[0];
                this.memoryReadCPU16 = this.memoryReadCPU16Generated[0];
                this.memoryWrite32 = this.memoryWrite32Generated[0];
                this.memoryRead32 = this.memoryRead32Generated[0];
                this.memoryReadCPU32 = this.memoryReadCPU32Generated[0];
                break;
            case 0x20:
                //Use External RAM:
                this.memoryWrite8 = this.memoryWrite8Generated[1];
                this.memoryRead8 = this.memoryRead8Generated[1];
                this.memoryWrite16 = this.memoryWrite16Generated[1];
                this.memoryRead16 = this.memoryRead16Generated[1];
                this.memoryReadCPU16 = this.memoryReadCPU16Generated[1];
                this.memoryWrite32 = this.memoryWrite32Generated[1];
                this.memoryRead32 = this.memoryRead32Generated[1];
                this.memoryReadCPU32 = this.memoryReadCPU32Generated[1];
                break;
            default:
                this.memoryWrite8 = this.memoryWrite8Generated[2];
                this.memoryRead8 = this.memoryRead8Generated[2];
                this.memoryWrite16 = this.memoryWrite16Generated[2];
                this.memoryRead16 = this.memoryRead16Generated[2];
                this.memoryReadCPU16 = this.memoryReadCPU16Generated[2];
                this.memoryWrite32 = this.memoryWrite32Generated[2];
                this.memoryRead32 = this.memoryRead32Generated[2];
                this.memoryReadCPU32 = this.memoryReadCPU32Generated[2];
        }
        this.WRAMControlFlags = data | 0;
    }
}
GameBoyAdvanceMemory.prototype.readBIOS8 = function (address) {
    address = address | 0;
    var data = 0;
    this.wait.singleClock();
    if ((address | 0) < 0x4000) {
        if ((this.cpu.registers[15] | 0) < 0x4000) {
            //If reading from BIOS while executing it:
            data = this.BIOS[address & 0x3FFF] | 0;
        }
        else {
            //Not allowed to read from BIOS while executing outside of it:
            data = (this.lastBIOSREAD >> ((address & 0x3) << 3)) & 0xFF;
        }
    }
    else {
        data = this.readUnused8IO(address | 0) | 0;
    }
    return data | 0;
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceMemory.prototype.readBIOS16 = function (address) {
        address = address | 0;
        var data = 0;
        this.wait.singleClock();
        if ((address | 0) < 0x4000) {
            address = address >> 1;
            if ((this.cpu.registers[15] | 0) < 0x4000) {
                //If reading from BIOS while executing it:
                data = this.BIOS16[address & 0x1FFF] | 0;
            }
            else {
                //Not allowed to read from BIOS while executing outside of it:
                data = (this.lastBIOSREAD >> ((address & 0x1) << 4)) & 0xFFFF;
            }
        }
        else {
            data = this.readUnused16IO(address | 0) | 0;
        }
        return data | 0;
    }
    GameBoyAdvanceMemory.prototype.readBIOS16CPU = function (address) {
        address = address | 0;
        var data = 0;
        this.IOCore.updateCoreSingle();
        if ((address | 0) < 0x4000) {
            address = address >> 1;
            //If reading from BIOS while executing it:
            data = this.BIOS16[address & 0x1FFF] | 0;
            this.lastBIOSREAD = data | 0;
        }
        else {
            data = this.readUnused16IO(address | 0) | 0;
        }
        return data | 0;
    }
    GameBoyAdvanceMemory.prototype.readBIOS32 = function (address) {
        address = address | 0;
        var data = 0;
        this.wait.singleClock();
        if ((address | 0) < 0x4000) {
            address = address >> 2;
            if ((this.cpu.registers[15] | 0) < 0x4000) {
                //If reading from BIOS while executing it:
                data = this.BIOS32[address & 0xFFF] | 0;
            }
            else {
                //Not allowed to read from BIOS while executing outside of it:
                data = this.lastBIOSREAD | 0;
            }
        }
        else {
            data = this.IOCore.getCurrentFetchValue() | 0;
        }
        return data | 0;
    }
    GameBoyAdvanceMemory.prototype.readBIOS32CPU = function (address) {
        address = address | 0;
        var data = 0;
        this.IOCore.updateCoreSingle();
        if ((address | 0) < 0x4000) {
            address = address >> 2;
            //If reading from BIOS while executing it:
            data = this.BIOS32[address & 0xFFF] | 0;
            this.lastBIOSREAD = data | 0;
        }
        else {
            data = this.IOCore.getCurrentFetchValue() | 0;
        }
        return data | 0;
    }
}
else {
    GameBoyAdvanceMemory.prototype.readBIOS16 = function (address) {
        this.wait.singleClock();
        if (address < 0x4000) {
            if (this.cpu.registers[15] < 0x4000) {
                //If reading from BIOS while executing it:
                return this.BIOS[address & -2] | (this.BIOS[address | 1] << 8);
            }
            else {
                //Not allowed to read from BIOS while executing outside of it:
                return (this.lastBIOSREAD >> ((address & 0x2) << 3)) & 0xFFFF;
            }
        }
        else {
            return this.readUnused16IO(address);
        }
    }
    GameBoyAdvanceMemory.prototype.readBIOS16CPU = function (address) {
        this.IOCore.updateCoreSingle();
        if (address < 0x4000) {
            //If reading from BIOS while executing it:
            var data = this.BIOS[address & -2] | (this.BIOS[address | 1] << 8);
            this.lastBIOSREAD = data;
            return data;
        }
        else {
            return this.readUnused16IO(address);
        }
    }
    GameBoyAdvanceMemory.prototype.readBIOS32 = function (address) {
        this.wait.singleClock();
        if (address < 0x4000) {
            if (this.cpu.registers[15] < 0x4000) {
                //If reading from BIOS while executing it:
                address &= -4;
                return this.BIOS[address] | (this.BIOS[address + 1] << 8) | (this.BIOS[address + 2] << 16)  | (this.BIOS[address + 3] << 24);
            }
            else {
                //Not allowed to read from BIOS while executing outside of it:
                return this.lastBIOSREAD;
            }
        }
        else {
            return this.IOCore.getCurrentFetchValue();
        }
    }
    GameBoyAdvanceMemory.prototype.readBIOS32CPU = function (address) {
        this.IOCore.updateCoreSingle();
        if (address < 0x4000) {
            //If reading from BIOS while executing it:
            address &= -4;
            var data = this.BIOS[address] | (this.BIOS[address + 1] << 8) | (this.BIOS[address + 2] << 16)  | (this.BIOS[address + 3] << 24);
            this.lastBIOSREAD = data;
            return data;
        }
        else {
            return this.IOCore.getCurrentFetchValue();
        }
    }
}
GameBoyAdvanceMemory.prototype.readExternalWRAM8 = function (address) {
    address = address | 0;
    //External WRAM:
    this.wait.WRAMAccess();
    return this.externalRAM[address & 0x3FFFF] | 0;
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceMemory.prototype.readExternalWRAM16 = function (address) {
        address = address | 0;
        //External WRAM:
        this.wait.WRAMAccess();
        return this.externalRAM16[(address >> 1) & 0x1FFFF] | 0;
    }
    GameBoyAdvanceMemory.prototype.readExternalWRAM16CPU = function (address) {
        address = address | 0;
        //External WRAM:
        this.wait.WRAMAccess16CPU();
        return this.externalRAM16[(address >> 1) & 0x1FFFF] | 0;
    }
    GameBoyAdvanceMemory.prototype.readExternalWRAM32 = function (address) {
        address = address | 0;
        //External WRAM:
        this.wait.WRAMAccess32();
        return this.externalRAM32[(address >> 2) & 0xFFFF] | 0;
    }
    GameBoyAdvanceMemory.prototype.readExternalWRAM32CPU = function (address) {
        address = address | 0;
        //External WRAM:
        this.wait.WRAMAccess32CPU();
        return this.externalRAM32[(address >> 2) & 0xFFFF] | 0;
    }
}
else {
    GameBoyAdvanceMemory.prototype.readExternalWRAM16 = function (address) {
        //External WRAM:
        this.wait.WRAMAccess();
        address &= 0x3FFFE;
        return this.externalRAM[address] | (this.externalRAM[address + 1] << 8);
    }
    GameBoyAdvanceMemory.prototype.readExternalWRAM16CPU = function (address) {
        //External WRAM:
        this.wait.WRAMAccess16CPU();
        address &= 0x3FFFE;
        return this.externalRAM[address] | (this.externalRAM[address + 1] << 8);
    }
    GameBoyAdvanceMemory.prototype.readExternalWRAM32 = function (address) {
        //External WRAM:
        this.wait.WRAMAccess32();
        address &= 0x3FFFC;
        return this.externalRAM[address] | (this.externalRAM[address + 1] << 8) | (this.externalRAM[address + 2] << 16) | (this.externalRAM[address + 3] << 24);
    }
    GameBoyAdvanceMemory.prototype.readExternalWRAM32CPU = function (address) {
        //External WRAM:
        this.wait.WRAMAccess32CPU();
        address &= 0x3FFFC;
        return this.externalRAM[address] | (this.externalRAM[address + 1] << 8) | (this.externalRAM[address + 2] << 16) | (this.externalRAM[address + 3] << 24);
    }
}
GameBoyAdvanceMemory.prototype.readInternalWRAM8 = function (address) {
    address = address | 0;
    //Internal WRAM:
    this.wait.singleClock();
    return this.internalRAM[address & 0x7FFF] | 0;
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceMemory.prototype.readInternalWRAM16 = function (address) {
        address = address | 0;
        //Internal WRAM:
        this.wait.singleClock();
        return this.internalRAM16[(address >> 1) & 0x3FFF] | 0;
    }
    GameBoyAdvanceMemory.prototype.readInternalWRAM16CPU = function (address) {
        address = address | 0;
        //Internal WRAM:
        this.IOCore.updateCoreSingle();
        return this.internalRAM16[(address >> 1) & 0x3FFF] | 0;
    }
    GameBoyAdvanceMemory.prototype.readInternalWRAM32 = function (address) {
        address = address | 0;
        //Internal WRAM:
        this.wait.singleClock();
        return this.internalRAM32[(address >> 2) & 0x1FFF] | 0;
    }
    GameBoyAdvanceMemory.prototype.readInternalWRAM32CPU = function (address) {
        address = address | 0;
        //Internal WRAM:
        this.IOCore.updateCoreSingle();
        return this.internalRAM32[(address >> 2) & 0x1FFF] | 0;
    }
}
else {
    GameBoyAdvanceMemory.prototype.readInternalWRAM16 = function (address) {
        //Internal WRAM:
        this.wait.singleClock();
        address &= 0x7FFE;
        return this.internalRAM[address] | (this.internalRAM[address + 1] << 8);
    }
    GameBoyAdvanceMemory.prototype.readInternalWRAM16CPU = function (address) {
        //Internal WRAM:
        this.IOCore.updateCoreSingle();
        address &= 0x7FFE;
        return this.internalRAM[address] | (this.internalRAM[address + 1] << 8);
    }
    GameBoyAdvanceMemory.prototype.readInternalWRAM32 = function (address) {
        //Internal WRAM:
        this.wait.singleClock();
        address &= 0x7FFC;
        return this.internalRAM[address] | (this.internalRAM[address + 1] << 8) | (this.internalRAM[address + 2] << 16) | (this.internalRAM[address + 3] << 24);
    }
    GameBoyAdvanceMemory.prototype.readInternalWRAM32CPU = function (address) {
        //Internal WRAM:
        this.IOCore.updateCoreSingle();
        address &= 0x7FFC;
        return this.internalRAM[address] | (this.internalRAM[address + 1] << 8) | (this.internalRAM[address + 2] << 16) | (this.internalRAM[address + 3] << 24);
    }
}
GameBoyAdvanceMemory.prototype.readIODispatch8 = function (address) {
    address = address | 0;
    var data = 0;
    this.wait.singleClock();
    if ((address | 0) < 0x4000304) {
        //IO Read:
        data = this.readIO8[address & 0x3FF](this) | 0;
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        data = this.wait.readConfigureWRAM8(address | 0) | 0;
    }
    else {
        data = this.readUnused8IO(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceMemory.prototype.readIODispatch16 = function (address) {
    address = address | 0;
    var data = 0;
    this.wait.singleClock();
    if ((address | 0) < 0x4000304) {
        //IO Read:
        address = address >> 1;
        data = this.readIO16[address & 0x1FF](this) | 0;
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        data = this.wait.readConfigureWRAM16(address | 0) | 0;
    }
    else {
        data = this.readUnused16IO(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceMemory.prototype.readIODispatch16CPU = function (address) {
    address = address | 0;
    var data = 0;
    this.IOCore.updateCoreSingle();
    if ((address | 0) < 0x4000304) {
        //IO Read:
        address = address >> 1;
        data = this.readIO16[address & 0x1FF](this) | 0;
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        data = this.wait.readConfigureWRAM16(address | 0) | 0;
    }
    else {
        data = this.readUnused16IO(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceMemory.prototype.readIODispatch32 = function (address) {
    address = address | 0;
    var data = 0;
    this.wait.singleClock();
    if ((address | 0) < 0x4000304) {
        //IO Read:
        data = this.readIO32(address | 0) | 0;
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        data = this.wait.readConfigureWRAM32() | 0;
    }
    else {
        data = this.IOCore.getCurrentFetchValue() | 0;
    }
    return data | 0;
}
GameBoyAdvanceMemory.prototype.readIODispatch32CPU = function (address) {
    address = address | 0;
    var data = 0;
    this.IOCore.updateCoreSingle();
    if ((address | 0) < 0x4000304) {
        //IO Read:
        data = this.readIO32(address | 0) | 0;
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        data = this.wait.readConfigureWRAM32() | 0;
    }
    else {
        data = this.IOCore.getCurrentFetchValue() | 0;
    }
    return data | 0;
}
GameBoyAdvanceMemory.prototype.readIO32 = function (address) {
    address = address >> 2;
    var data = 0;
    switch (address & 0xFF) {
        //4000000h - DISPCNT - LCD Control (Read/Write)
        //4000002h - Undocumented - Green Swap (R/W)
        case 0:
            data = this.gfx.readDISPCNT0() |
            (this.gfx.readDISPCNT1() << 8) |
            (this.gfx.readGreenSwap() << 16);
            break;
        //4000004h - DISPSTAT - General LCD Status (Read/Write)
        //4000006h - VCOUNT - Vertical Counter (Read only)
        case 0x1:
            this.IOCore.updateGraphicsClocking();
            data = this.gfx.readDISPSTAT0() |
            (this.gfx.readDISPSTAT1() << 8) |
            (this.gfx.readVCOUNT() << 16);
            break;
        //4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
        //400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
        case 0x2:
            data = this.gfx.readBG0CNT0() |
            (this.gfx.readBG0CNT1() << 8) |
            (this.gfx.readBG1CNT0() << 16) |
            (this.gfx.readBG1CNT1() << 24);
            break;
        //400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
        //400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
        case 0x3:
            data = this.gfx.readBG2CNT0() |
            (this.gfx.readBG2CNT1() << 8) |
            (this.gfx.readBG3CNT0() << 16) |
            (this.gfx.readBG3CNT1() << 24);
            break;
        //4000010h through 4000047h - WRITE ONLY
        //4000048h - WININ - Control of Inside of Window(s) (R/W)
        //400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
        case 0x12:
            data = this.gfx.readWININ0() |
            (this.gfx.readWININ1() << 8) |
            (this.gfx.readWINOUT0() << 16) |
            (this.gfx.readWINOUT1() << 24);
            break;
        //400004Ch - MOSAIC - Mosaic Size (W)
        //4000050h - BLDCNT - Color Special Effects Selection (R/W)
        //4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
        case 0x14:
            data = this.gfx.readBLDCNT0() |
            (this.gfx.readBLDCNT1() << 8) |
            (this.gfx.readBLDALPHA0() << 16) |
            (this.gfx.readBLDALPHA1() << 24);
            break;
        //4000054h through 400005Fh - NOT USED - GLITCHED
        //4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
        //4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
        case 0x18:
            //NR10:
            //NR11:
            //NR12:
            data = this.sound.readSOUND1CNT_L() |
            (this.sound.readSOUND1CNT_H0() << 16) |
            (this.sound.readSOUND1CNT_H1() << 24);
            break;
        //4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
        //4000066h - NOT USED - ZERO
        case 0x19:
            //NR14:
            data = this.sound.readSOUND1CNT_X() << 8;
            break;
        //4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
        //400006Ah - NOT USED - ZERO
        case 0x1A:
            //NR21:
            //NR22:
            data = this.sound.readSOUND2CNT_L0() | (this.sound.readSOUND2CNT_L1() << 8);
            break;
        //400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
        //400006Eh - NOT USED - ZERO
        case 0x1B:
            //NR24:
            data = this.sound.readSOUND2CNT_H() << 8;
            break;
        //4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
        //4000073h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
        case 0x1C:
            //NR30:
            //NR32:
            data = this.sound.readSOUND3CNT_L() | (this.sound.readSOUND3CNT_H() << 24);
            break;
        //4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
        //4000076h - NOT USED - ZERO
        case 0x1D:
            //NR34:
            data = this.sound.readSOUND3CNT_X() << 8;
            break;
        //4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
        //400007Ah - NOT USED - ZERO
        case 0x1E:
            //NR42:
            data = this.sound.readSOUND4CNT_L() << 8;
            break;
        //400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
        //400007Eh - NOT USED - ZERO
        case 0x1F:
            //NR43:
            //NR44:
            data = this.sound.readSOUND4CNT_H0() | (this.sound.readSOUND4CNT_H1() << 8);
            break;
        //4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
        //4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
        case 0x20:
            //NR50:
            //NR51:
            data = this.sound.readSOUNDCNT_L0() |
            (this.sound.readSOUNDCNT_L1() << 8) |
            (this.sound.readSOUNDCNT_H0() << 16) |
            (this.sound.readSOUNDCNT_H1() << 24);
            break;
        //4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
        //4000086h - NOT USED - ZERO
        case 0x21:
            this.IOCore.updateTimerClocking();
            data = this.sound.readSOUNDCNT_X() | 0;
            break;
        //4000088h - SOUNDBIAS - Sound PWM Control (R/W, see below)
        //400008Ah - NOT USED - ZERO
        case 0x22:
            data = this.sound.readSOUNDBIAS0() | (this.sound.readSOUNDBIAS1() << 8);
            break;
        //400008Ch - NOT USED - GLITCHED
        //400008Eh - NOT USED - GLITCHED
        //4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
        //4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
        case 0x24:
            this.IOCore.updateTimerClocking();
            data = this.sound.readWAVE(0) |
            (this.sound.readWAVE(1) << 8) |
            (this.sound.readWAVE(2) << 16) |
            (this.sound.readWAVE(3) << 24);
            break;
        //4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
        //4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
        case 0x25:
            this.IOCore.updateTimerClocking();
            data = this.sound.readWAVE(4) |
            (this.sound.readWAVE(5) << 8) |
            (this.sound.readWAVE(6) << 16) |
            (this.sound.readWAVE(7) << 24);
            break;
        //4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
        //400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
        case 0x26:
            this.IOCore.updateTimerClocking();
            data = this.sound.readWAVE(8) |
            (this.sound.readWAVE(9) << 8) |
            (this.sound.readWAVE(10) << 16) |
            (this.sound.readWAVE(11) << 24);
            break;
        //400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
        //400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
        case 0x27:
            this.IOCore.updateTimerClocking();
            data = this.sound.readWAVE(12) |
            (this.sound.readWAVE(13) << 8) |
            (this.sound.readWAVE(14) << 16) |
            (this.sound.readWAVE(15) << 24);
            break;
        //40000A0h through 40000B9h - WRITE ONLY
        //40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
        case 0x2E:
            data = (this.dma.readDMAControl0(0) << 16) | (this.dma.readDMAControl1(0) << 24);
            break;
        //40000BCh through 40000C5h - WRITE ONLY
        //40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
        case 0x31:
            data = (this.dma.readDMAControl0(1) << 16) | (this.dma.readDMAControl1(1) << 24);
            break;
        //40000C8h through 40000D1h - WRITE ONLY
        //40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
        case 0x34:
            data = (this.dma.readDMAControl0(2) << 16) | (this.dma.readDMAControl1(2) << 24);
            break;
        //40000D4h through 40000DDh - WRITE ONLY
        //40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
        case 0x37:
            data = (this.dma.readDMAControl0(3) << 16) | (this.dma.readDMAControl1(3) << 24);
            break;
        //40000E0h through 40000FFh - NOT USED - GLITCHED
        //40000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
        //40000102h - TM0CNT_H - Timer 0 Control (R/W)
        case 0x40:
            this.IOCore.updateTimerClocking();
            data = this.timer.readTM0CNT_L0() |
            (this.timer.readTM0CNT_L1() << 8) |
            (this.timer.readTM0CNT_H() << 16);
            break;
        //40000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
        //40000106h - TM1CNT_H - Timer 1 Control (R/W)
        case 0x41:
            this.IOCore.updateTimerClocking();
            data = this.timer.readTM1CNT_L0() |
            (this.timer.readTM1CNT_L1() << 8) |
            (this.timer.readTM1CNT_H() << 16);
            break;
        //40000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
        //4000010Ah - TM2CNT_H - Timer 2 Control (R/W)
        case 0x42:
            this.IOCore.updateTimerClocking();
            data = this.timer.readTM2CNT_L0() |
            (this.timer.readTM2CNT_L1() << 8) |
            (this.timer.readTM2CNT_H() << 16);
            break;
        //4000010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
        //4000010Eh - TM3CNT_H - Timer 3 Control (R/W)
        case 0x43:
            this.IOCore.updateTimerClocking();
            data = this.timer.readTM3CNT_L0() |
            (this.timer.readTM3CNT_L1() << 8) |
            (this.timer.readTM3CNT_H() << 16);
            break;
        //40000110h through 400011Fh - NOT USED - GLITCHED
        //40000120h - Serial Data A (R/W)
        //40000122h - Serial Data B (R/W)
        case 0x48:
            this.IOCore.updateSerialClocking();
            data = this.serial.readSIODATA_A0() |
            (this.serial.readSIODATA_A1() << 8) |
            (this.serial.readSIODATA_B0() << 16) |
            (this.serial.readSIODATA_B1() << 24);
            break;
        //40000124h - Serial Data C (R/W)
        //40000126h - Serial Data D (R/W)
        case 0x49:
            this.IOCore.updateSerialClocking();
            data = this.serial.readSIODATA_C0() |
            (this.serial.readSIODATA_C1() << 8) |
            (this.serial.readSIODATA_D0() << 16) |
            (this.serial.readSIODATA_D1() << 24);
            break;
        //40000128h - SIOCNT - SIO Sub Mode Control (R/W)
        //4000012Ah - SIOMLT_SEND - Data Send Register (R/W)
        case 0x4A:
            this.IOCore.updateSerialClocking();
            data = this.serial.readSIOCNT0() |
            (this.serial.readSIOCNT1() << 8) |
            (this.serial.readSIODATA8_0() << 16) |
            (this.serial.readSIODATA8_1() << 24);
            break;
        //4000012Ch through 400012Fh - NOT USED - GLITCHED
        //40000130h - KEYINPUT - Key Status (R)
        //40000132h - KEYCNT - Key Interrupt Control (R/W)
        case 0x4C:
            data = this.joypad.readKeyStatus0() |
            (this.joypad.readKeyStatus1() << 8) |
            (this.joypad.readKeyControl0() << 16) |
            (this.joypad.readKeyControl1() << 24);
            break;
        //40000134h - RCNT (R/W) - Mode Selection
        //40000136h - NOT USED - ZERO
        case 0x4D:
            this.IOCore.updateSerialClocking();
            data = this.serial.readRCNT0() | (this.serial.readRCNT1() << 8);
            break;
        //40000138h through 400013Fh - NOT USED - GLITCHED
        //40000140h - JOYCNT - JOY BUS Control Register (R/W)
        //40000142h - NOT USED - ZERO
        case 0x50:
            this.IOCore.updateSerialClocking();
            data = this.serial.readJOYCNT() | 0;
            break;
        //40000144h through 400014Fh - NOT USED - GLITCHED
        //40000150h - JoyBus Receive (R/W)
        //40000152h - JoyBus Receive (R/W)
        case 0x54:
            this.IOCore.updateSerialClocking();
            data = this.serial.readJOYBUS_RECV0() |
            (this.serial.readJOYBUS_RECV1() << 8) |
            (this.serial.readJOYBUS_RECV2() << 16) |
            (this.serial.readJOYBUS_RECV3() << 24);
            break;
        //40000154h - JoyBus Send (R/W)
        //40000156h - JoyBus Send (R/W)
        case 0x55:
            this.IOCore.updateSerialClocking();
            data = this.serial.readJOYBUS_SEND0() |
            (this.serial.readJOYBUS_SEND1() << 8) |
            (this.serial.readJOYBUS_SEND2() << 16) |
            (this.serial.readJOYBUS_SEND3() << 24);
            break;
        //40000158h - JoyBus Stat (R/W)
        //4000015Ah - NOT USED - ZERO
        case 0x56:
            this.IOCore.updateSerialClocking();
            data = this.serial.readJOYBUS_STAT() | 0;
            break;
        //4000015Ch through 40001FFh - NOT USED - GLITCHED
        //40000200h - IE - Interrupt Enable Register (R/W)
        //40000202h - IF - Interrupt Request Flags / IRQ Acknowledge
        case 0x80:
            this.IOCore.updateCoreSpillRetain();
            data = this.irq.readIE0() |
            (this.irq.readIE1() << 8) |
            (this.irq.readIF0() << 16) |
            (this.irq.readIF1() << 24);
            break;
        //40000204h - WAITCNT - Waitstate Control (R/W)
        //40000206h - NOT USED - ZERO
        case 0x81:
            data = this.wait.readWAITCNT0() | (this.wait.readWAITCNT1() << 8);
            break;
        //40000208h - IME - Interrupt Master Enable Register (R/W)
        //4000020Ah - NOT USED - ZERO
        case 0x82:
            data = this.irq.readIME() | 0;
            break;
        //4000020Ch through 40002FFh - NOT USED - GLITCHED
        //40000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
        //40000302h - NOT USED - ZERO
        case 0xC0:
            data = this.wait.readPOSTBOOT() | 0;
            break;
        //UNDEFINED / ILLEGAL:
        default:
            data = this.IOCore.getCurrentFetchValue() | 0;
    }
    return data | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM8 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    return this.gfx.readVRAM8(address | 0) | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM16 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    return this.gfx.readVRAM16(address | 0) | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM16CPU = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    return this.gfx.readVRAM16(address | 0) | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM32 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess32();
    return this.gfx.readVRAM32(address | 0) | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM32CPU = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess32CPU();
    return this.gfx.readVRAM32(address | 0) | 0;
}
GameBoyAdvanceMemory.prototype.readOAM8 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccess();
    return this.gfx.readOAM(address & 0x3FF) | 0;
}
GameBoyAdvanceMemory.prototype.readOAM16 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccess();
    return this.gfx.readOAM16(address & 0x3FE) | 0;
}
GameBoyAdvanceMemory.prototype.readOAM16CPU = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccessCPU();
    return this.gfx.readOAM16(address & 0x3FE) | 0;
}
GameBoyAdvanceMemory.prototype.readOAM32 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccess();
    return this.gfx.readOAM32(address & 0x3FC) | 0;
}
GameBoyAdvanceMemory.prototype.readOAM32CPU = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccessCPU();
    return this.gfx.readOAM32(address & 0x3FC) | 0;
}
GameBoyAdvanceMemory.prototype.readPalette8 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    return this.gfx.readPalette(address & 0x3FF) | 0;
}
GameBoyAdvanceMemory.prototype.readPalette16 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    return this.gfx.readPalette16(address & 0x3FE) | 0;
}
GameBoyAdvanceMemory.prototype.readPalette16CPU = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess16CPU();
    return this.gfx.readPalette16(address & 0x3FE) | 0;
}
GameBoyAdvanceMemory.prototype.readPalette32 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess32();
    return this.gfx.readPalette32(address & 0x3FC) | 0;
}
GameBoyAdvanceMemory.prototype.readPalette32CPU = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess32CPU();
    return this.gfx.readPalette32(address & 0x3FC) | 0;
}
GameBoyAdvanceMemory.prototype.readROM8 = function (address) {
    address = address | 0;
    this.wait.ROMAccess(address | 0);
    return this.cartridge.readROM8(address & 0x1FFFFFF) | 0;
}
GameBoyAdvanceMemory.prototype.readROM16 = function (address) {
    address = address | 0;
    this.wait.ROMAccess(address | 0);
    return this.cartridge.readROM16(address & 0x1FFFFFE) | 0;
}
GameBoyAdvanceMemory.prototype.readROM16CPU = function (address) {
    address = address | 0;
    this.wait.ROMAccess16CPU(address | 0);
    return this.cartridge.readROM16(address & 0x1FFFFFE) | 0;
}
GameBoyAdvanceMemory.prototype.readROM32 = function (address) {
    address = address | 0;
    this.wait.ROMAccess32(address | 0);
    return this.cartridge.readROM32(address & 0x1FFFFFC) | 0;
}
GameBoyAdvanceMemory.prototype.readROM32CPU = function (address) {
    address = address | 0;
    this.wait.ROMAccess32CPU(address | 0);
    return this.cartridge.readROM32(address & 0x1FFFFFC) | 0;
}
GameBoyAdvanceMemory.prototype.readROM28 = function (address) {
    address = address | 0;
    this.wait.ROMAccess(address | 0);
    return this.cartridge.readROM8Space2(address & 0x1FFFFFF) | 0;
}
GameBoyAdvanceMemory.prototype.readROM216 = function (address) {
    address = address | 0;
    this.wait.ROMAccess(address | 0);
    return this.cartridge.readROM16Space2(address & 0x1FFFFFE) | 0;
}
GameBoyAdvanceMemory.prototype.readROM216CPU = function (address) {
    address = address | 0;
    this.wait.ROMAccess16CPU(address | 0);
    return this.cartridge.readROM16Space2(address & 0x1FFFFFE) | 0;
}
GameBoyAdvanceMemory.prototype.readROM232 = function (address) {
    address = address | 0;
    this.wait.ROMAccess32(address | 0);
    return this.cartridge.readROM32Space2(address & 0x1FFFFFC) | 0;
}
GameBoyAdvanceMemory.prototype.readROM232CPU = function (address) {
    address = address | 0;
    this.wait.ROMAccess32CPU(address | 0);
    return this.cartridge.readROM32Space2(address & 0x1FFFFFC) | 0;
}
GameBoyAdvanceMemory.prototype.readSRAM8 = function (address) {
    address = address | 0;
    this.wait.SRAMAccess();
    return this.saves.readSRAM(address & 0xFFFF) | 0;
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceMemory.prototype.readSRAM16 = function (address) {
        address = address | 0;
        this.wait.SRAMAccess();
        return Math.imul(this.saves.readSRAM(address & 0xFFFE) | 0, 0x101) | 0;
    }
    GameBoyAdvanceMemory.prototype.readSRAM16CPU = function (address) {
        address = address | 0;
        this.wait.SRAMAccessCPU();
        return Math.imul(this.saves.readSRAM(address & 0xFFFE) | 0, 0x101) | 0;
    }
    GameBoyAdvanceMemory.prototype.readSRAM32 = function (address) {
        address = address | 0;
        this.wait.SRAMAccess();
        return Math.imul(this.saves.readSRAM(address & 0xFFFC) | 0, 0x1010101) | 0;
    }
    GameBoyAdvanceMemory.prototype.readSRAM32CPU = function (address) {
        address = address | 0;
        this.wait.SRAMAccessCPU();
        return Math.imul(this.saves.readSRAM(address & 0xFFFC) | 0, 0x1010101) | 0;
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceMemory.prototype.readSRAM16 = function (address) {
        address = address | 0;
        this.wait.SRAMAccess();
        return ((this.saves.readSRAM(address & 0xFFFE) | 0) * 0x101) | 0;
    }
    GameBoyAdvanceMemory.prototype.readSRAM16CPU = function (address) {
        address = address | 0;
        this.wait.SRAMAccessCPU();
        return ((this.saves.readSRAM(address & 0xFFFE) | 0) * 0x101) | 0;
    }
    GameBoyAdvanceMemory.prototype.readSRAM32 = function (address) {
        address = address | 0;
        this.wait.SRAMAccess();
        return ((this.saves.readSRAM(address & 0xFFFC) | 0) * 0x1010101) | 0;
    }
    GameBoyAdvanceMemory.prototype.readSRAM32CPU = function (address) {
        address = address | 0;
        this.wait.SRAMAccessCPU();
        return ((this.saves.readSRAM(address & 0xFFFC) | 0) * 0x1010101) | 0;
    }
}
GameBoyAdvanceMemory.prototype.readZero = function (parentObj) {
    return 0;
}
GameBoyAdvanceMemory.prototype.readUnused8 = function (address) {
    address = address | 0;
    this.wait.singleClock();
    return (this.IOCore.getCurrentFetchValue() >> ((address & 0x3) << 3)) & 0xFF;
}
GameBoyAdvanceMemory.prototype.readUnused8IO = function (address) {
    address = address | 0;
    return (this.IOCore.getCurrentFetchValue() >> ((address & 0x3) << 3)) & 0xFF;
}
GameBoyAdvanceMemory.prototype.readUnused16IO1 = function (parentObj) {
    return parentObj.IOCore.getCurrentFetchValue() & 0xFFFF;
}
GameBoyAdvanceMemory.prototype.readUnused16IO2 = function (parentObj) {
    return parentObj.IOCore.getCurrentFetchValue() >>> 16;
}
GameBoyAdvanceMemory.prototype.readUnused16 = function (address) {
    address = address | 0;
    this.wait.singleClock();
    return (this.IOCore.getCurrentFetchValue() >> ((address & 0x2) << 3)) & 0xFFFF;
}
GameBoyAdvanceMemory.prototype.readUnused16IO = function (address) {
    address = address | 0;
    return (this.IOCore.getCurrentFetchValue() >> ((address & 0x2) << 3)) & 0xFFFF;
}
GameBoyAdvanceMemory.prototype.readUnused16CPU = function (address) {
    address = address | 0;
    this.IOCore.updateCoreSingle();
    return (this.IOCore.getCurrentFetchValue() >> ((address & 0x2) << 3)) & 0xFFFF;
}
GameBoyAdvanceMemory.prototype.readUnused32 = function () {
    this.wait.singleClock();
    return this.IOCore.getCurrentFetchValue() | 0;
}
GameBoyAdvanceMemory.prototype.readUnused32CPU = function () {
    this.IOCore.updateCoreSingle();
    return this.IOCore.getCurrentFetchValue() | 0;
}
GameBoyAdvanceMemory.prototype.readUnused0 = function (parentObj) {
    return parentObj.IOCore.getCurrentFetchValue() & 0xFF;
}
GameBoyAdvanceMemory.prototype.readUnused1 = function (parentObj) {
    return (parentObj.IOCore.getCurrentFetchValue() >> 8) & 0xFF;
}
GameBoyAdvanceMemory.prototype.readUnused2 = function (parentObj) {
    return (parentObj.IOCore.getCurrentFetchValue() >> 16) & 0xFF;
}
GameBoyAdvanceMemory.prototype.readUnused3 = function (parentObj) {
    return parentObj.IOCore.getCurrentFetchValue() >>> 24;
}
GameBoyAdvanceMemory.prototype.loadBIOS = function () {
    //Ensure BIOS is of correct length:
    if ((this.IOCore.BIOS.length | 0) == 0x4000) {
        this.IOCore.BIOSFound = true;
        for (var index = 0; (index | 0) < 0x4000; index = ((index | 0) + 1) | 0) {
            this.BIOS[index & 0x3FFF] = this.IOCore.BIOS[index & 0x3FFF] & 0xFF;
        }
    }
    else {
        this.IOCore.BIOSFound = false;
    }
}
function generateMemoryTopLevelDispatch() {
    function compileMemoryReadDispatch(readUnused, readExternalWRAM, readInternalWRAM,
                                       readIODispatch, readPalette, readVRAM, readOAM,
                                       readROM, readROM2, readSRAM, readBIOS) {
        var code = "address = address | 0;var data = 0;switch (address >> 24) {";
        /*
         Decoder for the nibble at bits 24-27
         (Top 4 bits of the address falls through to default (unused),
         so the next nibble down is used for dispatch.):
         */
        /*
         BIOS Area (00000000-00003FFF)
         Unused (00004000-01FFFFFF)
         */
        code += "case 0:{data = this." + readBIOS + "(address | 0) | 0;break};";
        /*
         Unused (00004000-01FFFFFF)
         */
        /*
         WRAM - On-board Work RAM (02000000-0203FFFF)
         Unused (02040000-02FFFFFF)
         */
        code += "case 0x2:{data = this." + readExternalWRAM + "(address | 0) | 0;break};";
        /*
         WRAM - In-Chip Work RAM (03000000-03007FFF)
         Unused (03008000-03FFFFFF)
         */
        code += "case 0x3:{data = this." + readInternalWRAM + "(address | 0) | 0;break};";
        /*
         I/O Registers (04000000-040003FE)
         Unused (04000400-04FFFFFF)
         */
        code += "case 0x4:{data = this." + readIODispatch + "(address | 0) | 0;break};";
        /*
         BG/OBJ Palette RAM (05000000-050003FF)
         Unused (05000400-05FFFFFF)
         */
        code += "case 0x5:{data = this." + readPalette + "(address | 0) | 0;break};";
        /*
         VRAM - Video RAM (06000000-06017FFF)
         Unused (06018000-06FFFFFF)
         */
        code += "case 0x6:{data = this." + readVRAM + "(address | 0) | 0;break};";
        /*
         OAM - OBJ Attributes (07000000-070003FF)
         Unused (07000400-07FFFFFF)
         */
        code += "case 0x7:{data = this." + readOAM + "(address | 0) | 0;break};";
        /*
         Game Pak ROM (max 16MB) - Wait State 0 (08000000-08FFFFFF)
         */
        code += "case 0x8:";
        /*
         Game Pak ROM/FlashROM (max 16MB) - Wait State 0 (09000000-09FFFFFF)
         */
        code += "case 0x9:";
        /*
         Game Pak ROM (max 16MB) - Wait State 1 (0A000000-0AFFFFFF)
         */
        code += "case 0xA:";
        /*
         Game Pak ROM/FlashROM (max 16MB) - Wait State 1 (0B000000-0BFFFFFF)
         */
        code += "case 0xB:{data = this." + readROM + "(address | 0) | 0;break};";
        /*
         Game Pak ROM (max 16MB) - Wait State 2 (0C000000-0CFFFFFF)
         */
        code += "case 0xC:";
        /*
         Game Pak ROM/FlashROM (max 16MB) - Wait State 2 (0D000000-0DFFFFFF)
         */
        code += "case 0xD:{data = this." + readROM2 + "(address | 0) | 0;break};";
        /*
         Game Pak SRAM  (max 64 KBytes) - 8bit Bus width (0E000000-0E00FFFF)
         */
        code += "case 0xE:";
        /*
         Game Pak SRAM  (max 64 KBytes) - 8bit Bus width (0E000000-0E00FFFF)
         --UNDOCUMENTED MIRROR--
         */
        code += "case 0xF:{data = this." + readSRAM + "(address | 0) | 0;break};";
        /*
         Unused (0F000000-FFFFFFFF)
         */
        code += "default:{data = this." + readUnused + "(" + ((readUnused.slice(0, 12) == "readUnused32") ? "" : "address | 0") + ") | 0};";
        //Generate the function:
        code += "}return data | 0;";
        return Function("address", code);
    }
    function compileMemoryWriteDispatch(writeUnused, writeExternalWRAM, writeInternalWRAM,
                                        writeIODispatch, writePalette, writeVRAM,
                                        writeOAM, writeROM, writeSRAM) {
        var code = "address = address | 0;data = data | 0;switch (address >> 24) {";
        /*
         Decoder for the nibble at bits 24-27
         (Top 4 bits of the address falls through to default (unused),
         so the next nibble down is used for dispatch.):
         */
        /*
         BIOS Area (00000000-00003FFF)
         Unused (00004000-01FFFFFF)
         */
        /*
         Unused (00004000-01FFFFFF)
         */
        /*
         WRAM - On-board Work RAM (02000000-0203FFFF)
         Unused (02040000-02FFFFFF)
         */
        code += "case 0x2:{this." + writeExternalWRAM + "(address | 0, data | 0);break};";
        /*
         WRAM - In-Chip Work RAM (03000000-03007FFF)
         Unused (03008000-03FFFFFF)
         */
        code += "case 0x3:{this." + writeInternalWRAM + "(address | 0, data | 0);break};";
        /*
         I/O Registers (04000000-040003FE)
         Unused (04000400-04FFFFFF)
         */
        code += "case 0x4:{this." + writeIODispatch + "(address | 0, data | 0);break};";
        /*
         BG/OBJ Palette RAM (05000000-050003FF)
         Unused (05000400-05FFFFFF)
         */
        code += "case 0x5:{this." + writePalette + "(address | 0, data | 0);break};";
        /*
         VRAM - Video RAM (06000000-06017FFF)
         Unused (06018000-06FFFFFF)
         */
        code += "case 0x6:{this." + writeVRAM + "(address | 0, data | 0);break};";
        /*
         OAM - OBJ Attributes (07000000-070003FF)
         Unused (07000400-07FFFFFF)
         */
        code += "case 0x7:{this." + writeOAM + "(address | 0, data | 0);break};";
        /*
         Game Pak ROM (max 16MB) - Wait State 0 (08000000-08FFFFFF)
         */
        code += "case 0x8:";
        /*
         Game Pak ROM/FlashROM (max 16MB) - Wait State 0 (09000000-09FFFFFF)
         */
        code += "case 0x9:";
        /*
         Game Pak ROM (max 16MB) - Wait State 1 (0A000000-0AFFFFFF)
         */
        code += "case 0xA:";
        /*
         Game Pak ROM/FlashROM (max 16MB) - Wait State 1 (0B000000-0BFFFFFF)
         */
        code += "case 0xB:";
        /*
         Game Pak ROM (max 16MB) - Wait State 2 (0C000000-0CFFFFFF)
         */
        code += "case 0xC:";
        /*
         Game Pak ROM/FlashROM (max 16MB) - Wait State 2 (0D000000-0DFFFFFF)
         */
        code += "case 0xD:{this." + writeROM + "(address | 0, data | 0);break};";
        /*
         Game Pak SRAM  (max 64 KBytes) - 8bit Bus width (0E000000-0E00FFFF)
         */
        code += "case 0xE:";
        /*
         Game Pak SRAM  (max 64 KBytes) - 8bit Bus width (0E000000-0E00FFFF)
         --UNDOCUMENTED MIRROR--
         */
        code += "case 0xF:{this." + writeSRAM + "(address | 0, data | 0);break};";
        /*
         Unused (0F000000-FFFFFFFF)
         */
        code += "default:{this." + writeUnused + "()}";
        //Generate the function:
        code += "}";
        return Function("address", "data", code);
    }
    GameBoyAdvanceMemory.prototype.memoryRead8Generated = [
                                                             compileMemoryReadDispatch(
                                                                                        "readUnused8",
                                                                                        "readInternalWRAM8",
                                                                                        "readInternalWRAM8",
                                                                                        "readIODispatch8",
                                                                                        "readPalette8",
                                                                                        "readVRAM8",
                                                                                        "readOAM8",
                                                                                        "readROM8",
                                                                                        "readROM28",
                                                                                        "readSRAM8",
                                                                                        "readBIOS8"
                                                                                        ),
                                                             compileMemoryReadDispatch(
                                                                                        "readUnused8",
                                                                                        "readExternalWRAM8",
                                                                                        "readInternalWRAM8",
                                                                                        "readIODispatch8",
                                                                                        "readPalette8",
                                                                                        "readVRAM8",
                                                                                        "readOAM8",
                                                                                        "readROM8",
                                                                                        "readROM28",
                                                                                        "readSRAM8",
                                                                                        "readBIOS8"
                                                                                        ),
                                                             compileMemoryReadDispatch(
                                                                                        "readUnused8",
                                                                                        "readUnused8",
                                                                                        "readUnused8",
                                                                                        "readIODispatch8",
                                                                                        "readPalette8",
                                                                                        "readVRAM8",
                                                                                        "readOAM8",
                                                                                        "readROM8",
                                                                                        "readROM28",
                                                                                        "readSRAM8",
                                                                                        "readBIOS8"
                                                                                        )
                                                             ];
    GameBoyAdvanceMemory.prototype.memoryWrite8Generated = [
                                                             compileMemoryWriteDispatch(
                                                                                         "writeUnused",
                                                                                         "writeInternalWRAM8",
                                                                                         "writeInternalWRAM8",
                                                                                         "writeIODispatch8",
                                                                                         "writePalette8",
                                                                                         "writeVRAM8",
                                                                                         "writeOAM8",
                                                                                         "writeROM8",
                                                                                         "writeSRAM8"
                                                                                         ),
                                                             compileMemoryWriteDispatch(
                                                                                         "writeUnused",
                                                                                         "writeExternalWRAM8",
                                                                                         "writeInternalWRAM8",
                                                                                         "writeIODispatch8",
                                                                                         "writePalette8",
                                                                                         "writeVRAM8",
                                                                                         "writeOAM8",
                                                                                         "writeROM8",
                                                                                         "writeSRAM8"
                                                                                         ),
                                                             compileMemoryWriteDispatch(
                                                                                         "writeUnused",
                                                                                         "writeUnused",
                                                                                         "writeUnused",
                                                                                         "writeIODispatch8",
                                                                                         "writePalette8",
                                                                                         "writeVRAM8",
                                                                                         "writeOAM8",
                                                                                         "writeROM8",
                                                                                         "writeSRAM8"
                                                                                         )
                                                             ];
    GameBoyAdvanceMemory.prototype.memoryRead16Generated = [
                                                              compileMemoryReadDispatch(
                                                                                         "readUnused16",
                                                                                         "readInternalWRAM16",
                                                                                         "readInternalWRAM16",
                                                                                         "readIODispatch16",
                                                                                         "readPalette16",
                                                                                         "readVRAM16",
                                                                                         "readOAM16",
                                                                                         "readROM16",
                                                                                         "readROM216",
                                                                                         "readSRAM16",
                                                                                         "readBIOS16"
                                                                                         ),
                                                              compileMemoryReadDispatch(
                                                                                         "readUnused16",
                                                                                         "readExternalWRAM16",
                                                                                         "readInternalWRAM16",
                                                                                         "readIODispatch16",
                                                                                         "readPalette16",
                                                                                         "readVRAM16",
                                                                                         "readOAM16",
                                                                                         "readROM16",
                                                                                         "readROM216",
                                                                                         "readSRAM16",
                                                                                         "readBIOS16"
                                                                                         ),
                                                              compileMemoryReadDispatch(
                                                                                         "readUnused16",
                                                                                         "readUnused16",
                                                                                         "readUnused16",
                                                                                         "readIODispatch16",
                                                                                         "readPalette16",
                                                                                         "readVRAM16",
                                                                                         "readOAM16",
                                                                                         "readROM16",
                                                                                         "readROM216",
                                                                                         "readSRAM16",
                                                                                         "readBIOS16"
                                                                                         )
                                                              ];
    GameBoyAdvanceMemory.prototype.memoryReadCPU16Generated = [
                                                                 compileMemoryReadDispatch(
                                                                                            "readUnused16CPU",
                                                                                            "readInternalWRAM16CPU",
                                                                                            "readInternalWRAM16CPU",
                                                                                            "readIODispatch16CPU",
                                                                                            "readPalette16CPU",
                                                                                            "readVRAM16CPU",
                                                                                            "readOAM16CPU",
                                                                                            "readROM16CPU",
                                                                                            "readROM216CPU",
                                                                                            "readSRAM16CPU",
                                                                                            "readBIOS16CPU"
                                                                                            ),
                                                                 compileMemoryReadDispatch(
                                                                                            "readUnused16CPU",
                                                                                            "readExternalWRAM16CPU",
                                                                                            "readInternalWRAM16CPU",
                                                                                            "readIODispatch16CPU",
                                                                                            "readPalette16CPU",
                                                                                            "readVRAM16CPU",
                                                                                            "readOAM16CPU",
                                                                                            "readROM16CPU",
                                                                                            "readROM216CPU",
                                                                                            "readSRAM16CPU",
                                                                                            "readBIOS16CPU"
                                                                                            ),
                                                                 compileMemoryReadDispatch(
                                                                                            "readUnused16CPU",
                                                                                            "readUnused16CPU",
                                                                                            "readUnused16CPU",
                                                                                            "readIODispatch16CPU",
                                                                                            "readPalette16CPU",
                                                                                            "readVRAM16CPU",
                                                                                            "readOAM16CPU",
                                                                                            "readROM16CPU",
                                                                                            "readROM216CPU",
                                                                                            "readSRAM16CPU",
                                                                                            "readBIOS16CPU"
                                                                                            )
                                                                 ];
    GameBoyAdvanceMemory.prototype.memoryWrite16Generated = [
                                                              compileMemoryWriteDispatch(
                                                                                          "writeUnused",
                                                                                          "writeInternalWRAM16",
                                                                                          "writeInternalWRAM16",
                                                                                          "writeIODispatch16",
                                                                                          "writePalette16",
                                                                                          "writeVRAM16",
                                                                                          "writeOAM16",
                                                                                          "writeROM16",
                                                                                          "writeSRAM16"
                                                                                          ),
                                                              compileMemoryWriteDispatch(
                                                                                          "writeUnused",
                                                                                          "writeExternalWRAM16",
                                                                                          "writeInternalWRAM16",
                                                                                          "writeIODispatch16",
                                                                                          "writePalette16",
                                                                                          "writeVRAM16",
                                                                                          "writeOAM16",
                                                                                          "writeROM16",
                                                                                          "writeSRAM16"
                                                                                          ),
                                                              compileMemoryWriteDispatch(
                                                                                          "writeUnused",
                                                                                          "writeUnused",
                                                                                          "writeUnused",
                                                                                          "writeIODispatch16",
                                                                                          "writePalette16",
                                                                                          "writeVRAM16",
                                                                                          "writeOAM16",
                                                                                          "writeROM16",
                                                                                          "writeSRAM16"
                                                                                          )
                                                              ];
    GameBoyAdvanceMemory.prototype.memoryRead32Generated = [
                                                              compileMemoryReadDispatch(
                                                                                         "readUnused32",
                                                                                         "readInternalWRAM32",
                                                                                         "readInternalWRAM32",
                                                                                         "readIODispatch32",
                                                                                         "readPalette32",
                                                                                         "readVRAM32",
                                                                                         "readOAM32",
                                                                                         "readROM32",
                                                                                         "readROM232",
                                                                                         "readSRAM32",
                                                                                         "readBIOS32"
                                                                                         ),
                                                              compileMemoryReadDispatch(
                                                                                         "readUnused32",
                                                                                         "readExternalWRAM32",
                                                                                         "readInternalWRAM32",
                                                                                         "readIODispatch32",
                                                                                         "readPalette32",
                                                                                         "readVRAM32",
                                                                                         "readOAM32",
                                                                                         "readROM32",
                                                                                         "readROM232",
                                                                                         "readSRAM32",
                                                                                         "readBIOS32"
                                                                                         ),
                                                              compileMemoryReadDispatch(
                                                                                         "readUnused32",
                                                                                         "readUnused32",
                                                                                         "readUnused32",
                                                                                         "readIODispatch32",
                                                                                         "readPalette32",
                                                                                         "readVRAM32",
                                                                                         "readOAM32",
                                                                                         "readROM32",
                                                                                         "readROM232",
                                                                                         "readSRAM32",
                                                                                         "readBIOS32"
                                                                                         )
                                                              ];
    GameBoyAdvanceMemory.prototype.memoryReadCPU32Generated = [
                                                                 compileMemoryReadDispatch(
                                                                                            "readUnused32CPU",
                                                                                            "readInternalWRAM32CPU",
                                                                                            "readInternalWRAM32CPU",
                                                                                            "readIODispatch32CPU",
                                                                                            "readPalette32CPU",
                                                                                            "readVRAM32CPU",
                                                                                            "readOAM32CPU",
                                                                                            "readROM32CPU",
                                                                                            "readROM232CPU",
                                                                                            "readSRAM32CPU",
                                                                                            "readBIOS32CPU"
                                                                                            ),
                                                                 compileMemoryReadDispatch(
                                                                                            "readUnused32CPU",
                                                                                            "readExternalWRAM32CPU",
                                                                                            "readInternalWRAM32CPU",
                                                                                            "readIODispatch32CPU",
                                                                                            "readPalette32CPU",
                                                                                            "readVRAM32CPU",
                                                                                            "readOAM32CPU",
                                                                                            "readROM32CPU",
                                                                                            "readROM232CPU",
                                                                                            "readSRAM32CPU",
                                                                                            "readBIOS32CPU"
                                                                                            ),
                                                                 compileMemoryReadDispatch(
                                                                                            "readUnused32CPU",
                                                                                            "readUnused32CPU",
                                                                                            "readUnused32CPU",
                                                                                            "readIODispatch32CPU",
                                                                                            "readPalette32CPU",
                                                                                            "readVRAM32CPU",
                                                                                            "readOAM32CPU",
                                                                                            "readROM32CPU",
                                                                                            "readROM232CPU",
                                                                                            "readSRAM32CPU",
                                                                                            "readBIOS32CPU"
                                                                                            )
                                                                 ];
    GameBoyAdvanceMemory.prototype.memoryWrite32Generated = [
                                                              compileMemoryWriteDispatch(
                                                                                          "writeUnused",
                                                                                          "writeInternalWRAM32",
                                                                                          "writeInternalWRAM32",
                                                                                          "writeIODispatch32",
                                                                                          "writePalette32",
                                                                                          "writeVRAM32",
                                                                                          "writeOAM32",
                                                                                          "writeROM32",
                                                                                          "writeSRAM32"
                                                                                          ),
                                                              compileMemoryWriteDispatch(
                                                                                          "writeUnused",
                                                                                          "writeExternalWRAM32",
                                                                                          "writeInternalWRAM32",
                                                                                          "writeIODispatch32",
                                                                                          "writePalette32",
                                                                                          "writeVRAM32",
                                                                                          "writeOAM32",
                                                                                          "writeROM32",
                                                                                          "writeSRAM32"
                                                                                          ),
                                                              compileMemoryWriteDispatch(
                                                                                          "writeUnused",
                                                                                          "writeUnused",
                                                                                          "writeUnused",
                                                                                          "writeIODispatch32",
                                                                                          "writePalette32",
                                                                                          "writeVRAM32",
                                                                                          "writeOAM32",
                                                                                          "writeROM32",
                                                                                          "writeSRAM32"
                                                                                          )
                                                              ];
}
generateMemoryTopLevelDispatch();;
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceIRQ(IOCore) {
    //Build references:
    this.IOCore = IOCore;
    this.initializeIRQState();
}
GameBoyAdvanceIRQ.prototype.initializeIRQState = function () {
    this.interruptsEnabled = 0;
    this.interruptsRequested = 0;
    this.IME = false;
}
GameBoyAdvanceIRQ.prototype.IRQMatch = function () {
    //Used to exit HALT:
    return ((this.interruptsEnabled & this.interruptsRequested) != 0);
}
GameBoyAdvanceIRQ.prototype.checkForIRQFire = function () {
    //Tell the CPU core when the emulated hardware is triggering an IRQ:
    this.IOCore.cpu.triggerIRQ((this.interruptsEnabled & this.interruptsRequested) != 0 && this.IME);
}
GameBoyAdvanceIRQ.prototype.requestIRQ = function (irqLineToSet) {
    irqLineToSet = irqLineToSet | 0;
    this.interruptsRequested |= irqLineToSet | 0;
    this.checkForIRQFire();
}
GameBoyAdvanceIRQ.prototype.writeIME = function (data) {
    data = data | 0;
    this.IME = ((data & 0x1) == 0x1);
    this.checkForIRQFire();
}
GameBoyAdvanceIRQ.prototype.readIME = function () {
    return (this.IME ? 1 : 0);
}
GameBoyAdvanceIRQ.prototype.writeIE0 = function (data) {
    data = data | 0;
    this.interruptsEnabled &= 0x3F00;
    this.interruptsEnabled |= data | 0;
    this.checkForIRQFire();
}
GameBoyAdvanceIRQ.prototype.readIE0 = function () {
    return this.interruptsEnabled & 0xFF;
}
GameBoyAdvanceIRQ.prototype.writeIE1 = function (data) {
    data = data | 0;
    this.interruptsEnabled &= 0xFF;
    this.interruptsEnabled |= (data << 8) & 0x3F00;
    this.checkForIRQFire();
}
GameBoyAdvanceIRQ.prototype.readIE1 = function () {
    return this.interruptsEnabled >> 8;
}
GameBoyAdvanceIRQ.prototype.writeIF0 = function (data) {
    data = data | 0;
    this.interruptsRequested &= ~data;
    this.checkForIRQFire();
}
GameBoyAdvanceIRQ.prototype.readIF0 = function () {
    return this.interruptsRequested & 0xFF;
}
GameBoyAdvanceIRQ.prototype.writeIF1 = function (data) {
    data = data | 0;
    this.interruptsRequested &= ~(data << 8);
    this.checkForIRQFire();
}
GameBoyAdvanceIRQ.prototype.readIF1 = function () {
    return this.interruptsRequested >> 8;
}
GameBoyAdvanceIRQ.prototype.nextEventTime = function () {
    var clocks = -1;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.gfx.nextVBlankIRQEventTime() | 0, 0x1) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.gfx.nextHBlankIRQEventTime() | 0, 0x2) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.gfx.nextVCounterIRQEventTime() | 0, 0x4) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.timer.nextTimer0IRQEventTime() | 0, 0x8) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.timer.nextTimer1IRQEventTime() | 0, 0x10) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.timer.nextTimer2IRQEventTime() | 0, 0x20) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.timer.nextTimer3IRQEventTime() | 0, 0x40) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.serial.nextIRQEventTime() | 0, 0x80) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.dma.channels[0].nextIRQEventTime() | 0, 0x100) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.dma.channels[1].nextIRQEventTime() | 0, 0x200) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.dma.channels[2].nextIRQEventTime() | 0, 0x400) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.dma.channels[3].nextIRQEventTime() | 0, 0x800) | 0;
    //JoyPad input state should never update while we're in halt:
    //clocks = this.findClosestEvent(clocks | 0, this.IOCore.joypad.nextIRQEventTime() | 0, 0x1000) | 0;
    //clocks = this.findClosestEvent(clocks | 0, this.IOCore.cartridge.nextIRQEventTime() | 0, 0x2000) | 0;
    return clocks | 0;
}
GameBoyAdvanceIRQ.prototype.nextIRQEventTime = function () {
    var clocks = -1;
    //Checks IME:
    if (this.IME) {
        clocks = this.nextEventTime() | 0;
    }
    return clocks | 0;
}
GameBoyAdvanceIRQ.prototype.findClosestEvent = function (oldClocks, newClocks, flagID) {
    oldClocks = oldClocks | 0;
    newClocks = newClocks | 0;
    flagID = flagID | 0;
    if ((this.interruptsEnabled & flagID) != 0) {
        if ((newClocks | 0) >= 0) {
            if ((oldClocks | 0) >= 0) {
                oldClocks = Math.min(oldClocks | 0, newClocks | 0) | 0;
            }
            else {
                oldClocks = newClocks | 0;
            }
        }
    }
    return oldClocks | 0;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceJoyPad(IOCore) {
    this.IOCore = IOCore;
    this.initialize();
}
GameBoyAdvanceJoyPad.prototype.initialize = function () {
    this.keyInput = 0x3FF;
    this.keyInterrupt = 0;
}
GameBoyAdvanceJoyPad.prototype.keyPress = function (keyPressed) {
    switch (keyPressed.toUpperCase()) {
        case "A":
            this.keyInput &= ~0x1;
            break;
        case "B":
            this.keyInput &= ~0x2;
            break;
        case "SELECT":
            this.keyInput &= ~0x4;
            break;
        case "START":
            this.keyInput &= ~0x8;
            break;
        case "RIGHT":
            this.keyInput &= ~0x10;
            break;
        case "LEFT":
            this.keyInput &= ~0x20;
            break;
        case "UP":
            this.keyInput &= ~0x40;
            break;
        case "DOWN":
            this.keyInput &= ~0x80;
            break;
        case "R":
            this.keyInput &= ~0x100;
            break;
        case "L":
            this.keyInput &= ~0x200;
            break;
        default:
            return;
    }
    this.checkForMatch();
}
GameBoyAdvanceJoyPad.prototype.keyRelease = function (keyReleased) {
    switch (keyReleased.toUpperCase()) {
        case "A":
            this.keyInput |= 0x1;
            break;
        case "B":
            this.keyInput |= 0x2;
            break;
        case "SELECT":
            this.keyInput |= 0x4;
            break;
        case "START":
            this.keyInput |= 0x8;
            break;
        case "RIGHT":
            this.keyInput |= 0x10;
            break;
        case "LEFT":
            this.keyInput |= 0x20;
            break;
        case "UP":
            this.keyInput |= 0x40;
            break;
        case "DOWN":
            this.keyInput |= 0x80;
            break;
        case "R":
            this.keyInput |= 0x100;
            break;
        case "L":
            this.keyInput |= 0x200;
            break;
        default:
            return;
    }
    this.checkForMatch();
}
GameBoyAdvanceJoyPad.prototype.checkForMatch = function () {
    if ((this.keyInterrupt & 0x8000) == 0x8000) {
        if (((~this.keyInput) & this.keyInterrupt & 0x3FF) == (this.keyInterrupt & 0x3FF)) {
            this.IOCore.deflagStop();
            this.checkForIRQ();
        }
    }
    else if (((~this.keyInput) & this.keyInterrupt & 0x3FF) != 0) {
        this.IOCore.deflagStop();
        this.checkForIRQ();
    }
}
GameBoyAdvanceJoyPad.prototype.checkForIRQ = function () {
    if ((this.keyInterrupt & 0x4000) == 0x4000) {
        this.IOCore.irq.requestIRQ(0x1000);
    }
}
/*GameBoyAdvanceJoyPad.prototype.nextIRQEventTime = function {
    //Always return -1 here, as we don't input joypad updates at the same time we're running the interp loop:
    return -1;
}*/
GameBoyAdvanceJoyPad.prototype.readKeyStatus0 = function () {
    return this.keyInput & 0xFF;
}
GameBoyAdvanceJoyPad.prototype.readKeyStatus1 = function () {
    return (this.keyInput >> 8) & 0x3;
}
GameBoyAdvanceJoyPad.prototype.writeKeyControl0 = function (data) {
    data = data | 0;
    this.keyInterrupt = this.keyInterrupt & 0xC300;
    this.keyInterrupt = this.keyInterrupt | data;
}
GameBoyAdvanceJoyPad.prototype.readKeyControl0 = function () {
    return this.keyInterrupt & 0xFF;
}
GameBoyAdvanceJoyPad.prototype.writeKeyControl1 = function (data) {
    data = data | 0;
    this.keyInterrupt = this.keyInterrupt & 0xFF;
    this.keyInterrupt = this.keyInterrupt | (data << 8);
}
GameBoyAdvanceJoyPad.prototype.readKeyControl1 = function () {
    return (this.keyInterrupt >> 8) & 0xC3;
};
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
function GameBoyAdvanceSerial(IOCore) {
    this.IOCore = IOCore;
    this.initialize();
}
GameBoyAdvanceSerial.prototype.initialize = function () {
    this.SIODATA_A = 0xFFFF;
    this.SIODATA_B = 0xFFFF;
    this.SIODATA_C = 0xFFFF;
    this.SIODATA_D = 0xFFFF;
    this.SIOShiftClockExternal = true;
    this.SIOShiftClockDivider = 0x40;
    this.SIOCNT0_DATA = 0x0C;
    this.SIOTransferStarted = false;
    this.SIOMULT_PLAYER_NUMBER = 0;
    this.SIOCOMMERROR = false;
    this.SIOBaudRate = 0;
    this.SIOCNT_UART_CTS = false;
    this.SIOCNT_UART_MISC = 0;
    this.SIOCNT_UART_FIFO = 0;
    this.SIOCNT_IRQ = false;
    this.SIOCNT_MODE = 0;
    this.SIOCNT_UART_RECV_ENABLE = false;
    this.SIOCNT_UART_SEND_ENABLE = false;
    this.SIOCNT_UART_PARITY_ENABLE = false;
    this.SIOCNT_UART_FIFO_ENABLE = false;
    this.SIODATA8 = 0xFFFF;
    this.RCNTMode = 0;
    this.RCNTIRQ = false;
    this.RCNTDataBits = 0;
    this.RCNTDataBitFlow = 0;
    this.JOYBUS_IRQ = false;
    this.JOYBUS_CNTL_FLAGS = 0;
    this.JOYBUS_RECV0 = 0xFF;
    this.JOYBUS_RECV1 = 0xFF;
    this.JOYBUS_RECV2 = 0xFF;
    this.JOYBUS_RECV3 = 0xFF;
    this.JOYBUS_SEND0 = 0xFF;
    this.JOYBUS_SEND1 = 0xFF;
    this.JOYBUS_SEND2 = 0xFF;
    this.JOYBUS_SEND3 = 0xFF;
    this.JOYBUS_STAT = 0;
    this.shiftClocks = 0;
    this.serialBitsShifted = 0;
}
GameBoyAdvanceSerial.prototype.SIOMultiplayerBaudRate = [
      9600,
     38400,
     57600,
    115200
];
GameBoyAdvanceSerial.prototype.addClocks = function (clocks) {
    if (this.RCNTMode < 2) {
        switch (this.SIOCNT_MODE) {
            case 0:
            case 1:
                if (this.SIOTransferStarted && !this.SIOShiftClockExternal) {
                    this.shiftClocks += clocks;
                    while (this.shiftClocks >= this.SIOShiftClockDivider) {
                        this.shiftClocks -= this.SIOShiftClockDivider;
                        this.clockSerial();
                    }
                }
                break;
            case 2:
                if (this.SIOTransferStarted && this.SIOMULT_PLAYER_NUMBER == 0) {
                    this.shiftClocks += clocks;
                    while (this.shiftClocks >= this.SIOShiftClockDivider) {
                        this.shiftClocks -= this.SIOShiftClockDivider;
                        this.clockMultiplayer();
                    }
                }
                break;
            case 3:
                if (this.SIOCNT_UART_SEND_ENABLE && !this.SIOCNT_UART_CTS) {
                    this.shiftClocks += clocks;
                    while (this.shiftClocks >= this.SIOShiftClockDivider) {
                        this.shiftClocks -= this.SIOShiftClockDivider;
                        this.clockUART();
                    }
                }
        }
    }
}
GameBoyAdvanceSerial.prototype.clockSerial = function () {
    //Emulate as if no slaves connected:
    ++this.serialBitsShifted;
    if (this.SIOCNT_MODE == 0) {
        //8-bit
        this.SIODATA8 = ((this.SIODATA8 << 1) | 1) & 0xFFFF;
        if (this.serialBitsShifted == 8) {
            this.SIOTransferStarted = false;
            this.serialBitsShifted = 0;
            if (this.SIOCNT_IRQ) {
                //this.IOCore.irq.requestIRQ(0x80);
            }
        }
    }
    else {
        //32-bit
        this.SIODATA_D = ((this.SIODATA_D << 1) & 0xFE) | (this.SIODATA_C >> 7);
        this.SIODATA_C = ((this.SIODATA_C << 1) & 0xFE) | (this.SIODATA_B >> 7);
        this.SIODATA_B = ((this.SIODATA_B << 1) & 0xFE) | (this.SIODATA_A >> 7);
        this.SIODATA_A = ((this.SIODATA_A << 1) & 0xFE) | 1;
        if (this.serialBitsShifted == 32) {
            this.SIOTransferStarted = false;
            this.serialBitsShifted = 0;
            if (this.SIOCNT_IRQ) {
                //this.IOCore.irq.requestIRQ(0x80);
            }
        }
    }
}
GameBoyAdvanceSerial.prototype.clockMultiplayer = function () {
    //Emulate as if no slaves connected:
    this.SIODATA_A = this.SIODATA8;
    this.SIODATA_B = 0xFFFF;
    this.SIODATA_C = 0xFFFF;
    this.SIODATA_D = 0xFFFF;
    this.SIOTransferStarted = false;
    this.SIOCOMMERROR = true;
    if (this.SIOCNT_IRQ) {
        //this.IOCore.irq.requestIRQ(0x80);
    }
}
GameBoyAdvanceSerial.prototype.clockUART = function () {
    ++this.serialBitsShifted;
    if (this.SIOCNT_UART_FIFO_ENABLE) {
        if (this.serialBitsShifted == 8) {
            this.serialBitsShifted = 0;
            this.SIOCNT_UART_FIFO = Math.max(this.SIOCNT_UART_FIFO - 1, 0);
            if (this.SIOCNT_UART_FIFO == 0 && this.SIOCNT_IRQ) {
                //this.IOCore.irq.requestIRQ(0x80);
            }
        }
    }
    else {
        if (this.serialBitsShifted == 8) {
            this.serialBitsShifted = 0;
            if (this.SIOCNT_IRQ) {
                //this.IOCore.irq.requestIRQ(0x80);
            }
        }
    }
}
GameBoyAdvanceSerial.prototype.writeSIODATA_A0 = function (data) {
    this.SIODATA_A &= 0xFF00;
    this.SIODATA_A |= data;
}
GameBoyAdvanceSerial.prototype.readSIODATA_A0 = function () {
    return this.SIODATA_A & 0xFF;
}
GameBoyAdvanceSerial.prototype.writeSIODATA_A1 = function (data) {
    this.SIODATA_A &= 0xFF;
    this.SIODATA_A |= data << 8;
}
GameBoyAdvanceSerial.prototype.readSIODATA_A1 = function () {
    return this.SIODATA_A >> 8;
}
GameBoyAdvanceSerial.prototype.writeSIODATA_B0 = function (data) {
    this.SIODATA_B &= 0xFF00;
    this.SIODATA_B |= data;
}
GameBoyAdvanceSerial.prototype.readSIODATA_B0 = function () {
    return this.SIODATA_B & 0xFF;
}
GameBoyAdvanceSerial.prototype.writeSIODATA_B1 = function (data) {
    this.SIODATA_B &= 0xFF;
    this.SIODATA_B |= data << 8;
}
GameBoyAdvanceSerial.prototype.readSIODATA_B1 = function () {
    return this.SIODATA_B >> 8;
}
GameBoyAdvanceSerial.prototype.writeSIODATA_C0 = function (data) {
    this.SIODATA_C &= 0xFF00;
    this.SIODATA_C |= data;
}
GameBoyAdvanceSerial.prototype.readSIODATA_C0 = function () {
    return this.SIODATA_C & 0xFF;
}
GameBoyAdvanceSerial.prototype.writeSIODATA_C1 = function (data) {
    this.SIODATA_C &= 0xFF;
    this.SIODATA_C |= data << 8;
}
GameBoyAdvanceSerial.prototype.readSIODATA_C1 = function () {
    return this.SIODATA_C >> 8;
}
GameBoyAdvanceSerial.prototype.writeSIODATA_D0 = function (data) {
    this.SIODATA_D &= 0xFF00;
    this.SIODATA_D |= data;
}
GameBoyAdvanceSerial.prototype.readSIODATA_D0 = function () {
    return this.SIODATA_D & 0xFF;
}
GameBoyAdvanceSerial.prototype.writeSIODATA_D1 = function (data) {
    this.SIODATA_D &= 0xFF;
    this.SIODATA_D |= data << 8;
}
GameBoyAdvanceSerial.prototype.readSIODATA_D1 = function () {
    return this.SIODATA_D >> 8;
}
GameBoyAdvanceSerial.prototype.writeSIOCNT0 = function (data) {
    if (this.RCNTMode < 0x2) {
        switch (this.SIOCNT_MODE) {
            //8-Bit:
            case 0:
            //32-Bit:
            case 1:
                this.SIOShiftClockExternal = ((data & 0x1) == 0x1);
                this.SIOShiftClockDivider = ((data & 0x2) == 0x2) ? 0x8 : 0x40;
                this.SIOCNT0_DATA = data & 0xB;
                if ((data & 0x80) == 0x80) {
                    if (!this.SIOTransferStarted) {
                        this.SIOTransferStarted = true;
                        this.serialBitsShifted = 0;
                        this.shiftClocks = 0;
                    }
                }
                else {
                    this.SIOTransferStarted = false;
                }
                break;
            //Multiplayer:
            case 2:
                this.SIOBaudRate = data & 0x3;
                this.SIOShiftClockDivider = this.SIOMultiplayerBaudRate[this.SIOBaudRate];
                this.SIOMULT_PLAYER_NUMBER = (data >> 4) & 0x3;
                this.SIOCOMMERROR = ((data & 0x40) == 0x40);
                if ((data & 0x80) == 0x80) {
                    if (!this.SIOTransferStarted) {
                        this.SIOTransferStarted = true;
                        if (this.SIOMULT_PLAYER_NUMBER == 0) {
                            this.SIODATA_A = 0xFFFF;
                            this.SIODATA_B = 0xFFFF;
                            this.SIODATA_C = 0xFFFF;
                            this.SIODATA_D = 0xFFFF;
                        }
                        this.serialBitsShifted = 0;
                        this.shiftClocks = 0;
                    }
                }
                else {
                    this.SIOTransferStarted = false;
                }
                break;
            //UART:
            case 3:
                this.SIOBaudRate = data & 0x3;
                this.SIOShiftClockDivider = this.SIOMultiplayerBaudRate[this.SIOBaudRate];
                this.SIOCNT_UART_MISC = (data & 0xCF) >> 2;
                this.SIOCNT_UART_CTS = ((data & 0x4) == 0x4);
        }
    }
}
GameBoyAdvanceSerial.prototype.readSIOCNT0 = function () {
    if (this.RCNTMode < 0x2) {
        switch (this.SIOCNT_MODE) {
            //8-Bit:
            case 0:
            //32-Bit:
            case 1:
                return ((this.SIOTransferStarted) ? 0x80 : 0) | 0x74 | this.SIOCNT0_DATA;
            //Multiplayer:
            case 2:
                return ((this.SIOTransferStarted) ? 0x80 : 0) | ((this.SIOCOMMERROR) ? 0x40 : 0) | (this.SIOMULT_PLAYER_NUMBER << 4) | this.SIOBaudRate;
            //UART:
            case 3:
                return (this.SIOCNT_UART_MISC << 2) | ((this.SIOCNT_UART_FIFO == 4) ? 0x10 : 0) | 0x20 | this.SIOBaudRate;
        }
    }
    return 0xFF;
}
GameBoyAdvanceSerial.prototype.writeSIOCNT1 = function (data) {
    this.SIOCNT_IRQ = ((data & 0x40) == 0x40);
    this.SIOCNT_MODE = (data >> 4) & 0x3;
    this.SIOCNT_UART_RECV_ENABLE = ((data & 0x8) == 0x8);
    this.SIOCNT_UART_SEND_ENABLE = ((data & 0x4) == 0x4);
    this.SIOCNT_UART_PARITY_ENABLE = ((data & 0x2) == 0x2);
    this.SIOCNT_UART_FIFO_ENABLE = ((data & 0x1) == 0x1);
}
GameBoyAdvanceSerial.prototype.readSIOCNT1 = function () {
    return (0x80 | (this.SIOCNT_IRQ ? 0x40 : 0) | (this.SIOCNT_MODE << 4) | ((this.SIOCNT_UART_RECV_ENABLE) ? 0x8 : 0) |
    ((this.SIOCNT_UART_SEND_ENABLE) ? 0x4 : 0) | ((this.SIOCNT_UART_PARITY_ENABLE) ? 0x2 : 0) | ((this.SIOCNT_UART_FIFO_ENABLE) ? 0x2 : 0));
}
GameBoyAdvanceSerial.prototype.writeSIODATA8_0 = function (data) {
    this.SIODATA8 &= 0xFF00;
    this.SIODATA8 |= data;
    if (this.RCNTMode < 0x2 && this.SIOCNT_MODE == 3 && this.SIOCNT_UART_FIFO_ENABLE) {
        this.SIOCNT_UART_FIFO = Math.min(this.SIOCNT_UART_FIFO + 1, 4);
    }
}
GameBoyAdvanceSerial.prototype.readSIODATA8_0 = function () {
    return this.SIODATA8 & 0xFF;
}
GameBoyAdvanceSerial.prototype.writeSIODATA8_1 = function (data) {
    this.SIODATA8 &= 0xFF;
    this.SIODATA8 |= data << 8;
}
GameBoyAdvanceSerial.prototype.readSIODATA8_1 = function () {
    return this.SIODATA8 >> 8;
}
GameBoyAdvanceSerial.prototype.writeRCNT0 = function (data) {
    if (this.RCNTMode == 0x2) {
        //General Comm:
        var oldDataBits = this.RCNTDataBits;
        this.RCNTDataBits = data & 0xF;    //Device manually controls SI/SO/SC/SD here.
        this.RCNTDataBitFlow = data >> 4;
        if (this.RCNTIRQ && ((oldDataBits ^ this.RCNTDataBits) & oldDataBits & 0x4) == 0x4) {
            //SI fell low, trigger IRQ:
            //this.IOCore.irq.requestIRQ(0x80);
        }
    }
}
GameBoyAdvanceSerial.prototype.readRCNT0 = function () {
    return (this.RCNTDataBitFlow << 4) | this.RCNTDataBits;
}
GameBoyAdvanceSerial.prototype.writeRCNT1 = function (data) {
    this.RCNTMode = data >> 6;
    this.RCNTIRQ = ((data & 0x1) == 0x1);
    if (this.RCNTMode != 0x2) {
        //Force SI/SO/SC/SD to low as we're never "hooked" up:
        this.RCNTDataBits = 0;
        this.RCNTDataBitFlow = 0;
    }
}
GameBoyAdvanceSerial.prototype.readRCNT1 = function () {
    return (this.RCNTMode << 6) | 0x3E | ((this.RCNTIRQ) ? 0x1 : 0);
}
GameBoyAdvanceSerial.prototype.writeJOYCNT = function (data) {
    this.JOYBUS_IRQ = ((data & 0x40) == 0x40);
    this.JOYBUS_CNTL_FLAGS &= ~(data & 0x7);
}
GameBoyAdvanceSerial.prototype.readJOYCNT = function () {
    return 0xB8 | ((this.JOYBUS_IRQ) ? 0x40 : 0) | this.JOYBUS_CNTL_FLAGS;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_RECV0 = function (data) {
    this.JOYBUS_RECV0 = data;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_RECV0 = function () {
    this.JOYBUS_STAT &= 0xF7;
    return this.JOYBUS_RECV0;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_RECV1 = function (data) {
    this.JOYBUS_RECV1 = data;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_RECV1 = function () {
    this.JOYBUS_STAT &= 0xF7;
    return this.JOYBUS_RECV1;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_RECV2 = function (data) {
    this.JOYBUS_RECV2 = data;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_RECV2 = function () {
    this.JOYBUS_STAT &= 0xF7;
    return this.JOYBUS_RECV2;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_RECV3 = function (data) {
    this.JOYBUS_RECV3 = data;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_RECV3 = function () {
    this.JOYBUS_STAT &= 0xF7;
    return this.JOYBUS_RECV3;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_SEND0 = function (data) {
    this.JOYBUS_SEND0 = data;
    this.JOYBUS_STAT |= 0x2;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_SEND0 = function () {
    return this.JOYBUS_SEND0;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_SEND1 = function (data) {
    this.JOYBUS_SEND1 = data;
    this.JOYBUS_STAT |= 0x2;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_SEND1 = function () {
    return this.JOYBUS_SEND1;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_SEND2 = function (data) {
    this.JOYBUS_SEND2 = data;
    this.JOYBUS_STAT |= 0x2;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_SEND2 = function () {
    return this.JOYBUS_SEND2;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_SEND3 = function (data) {
    this.JOYBUS_SEND3 = data;
    this.JOYBUS_STAT |= 0x2;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_SEND3 = function () {
    return this.JOYBUS_SEND3;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_STAT = function (data) {
    this.JOYBUS_STAT = data;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_STAT = function () {
    return 0xC5 | this.JOYBUS_STAT;
}
GameBoyAdvanceSerial.prototype.nextIRQEventTime = function (clocks) {
    return -1;  //Short-circuit serial IRQ support for now.
    if (this.SIOCNT_IRQ && this.RCNTMode < 2) {
        switch (this.SIOCNT_MODE) {
            case 0:
            case 1:
                if (this.SIOTransferStarted && !this.SIOShiftClockExternal) {
                    return ((((this.SIOCNT_MODE == 1) ? 31 : 7) - this.serialBitsShifted) * this.SIOShiftClockDivider) + (this.SIOShiftClockDivider - this.shiftClocks);
                }
                else {
                    return -1;
                }
            case 2:
                if (this.SIOTransferStarted && this.SIOMULT_PLAYER_NUMBER == 0) {
                    return this.SIOShiftClockDivider - this.shiftClocks;
                }
                else {
                    return -1;
                }
            case 3:
                if (this.SIOCNT_UART_SEND_ENABLE && !this.SIOCNT_UART_CTS) {
                    return (Math.max(((this.SIOCNT_UART_FIFO_ENABLE) ? (this.SIOCNT_UART_FIFO * 8) : 8) - 1, 0) * this.SIOShiftClockDivider) + (this.SIOShiftClockDivider - this.shiftClocks);
                }
                else {
                    return -1;
                }
        }
    }
    else {
        return -1;
    }
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceSound(IOCore) {
    //Build references:
    this.IOCore = IOCore;
    this.settings = this.IOCore.settings;
    this.coreExposed = this.IOCore.coreExposed;
    this.initializePAPU();
}
GameBoyAdvanceSound.prototype.initializePAPU = function () {
    //Did the emulator core initialize us for output yet?
    this.preprocessInitialization(false);
    //Initialize start:
    this.audioTicks = 0;
    this.initializeAudioStartState();
}
GameBoyAdvanceSound.prototype.initializeOutput = function (enabled, audioResamplerFirstPassFactor) {
    this.preprocessInitialization(enabled);
    this.audioIndex = 0;
    this.downsampleInputLeft = 0;
    this.downsampleInputRight = 0;
    this.audioResamplerFirstPassFactor = audioResamplerFirstPassFactor | 0;
}
GameBoyAdvanceSound.prototype.initializeAudioStartState = function () {
    //NOTE: NR 60-63 never get reset in audio halting:
    this.nr60 = 0;
    this.nr61 = 0;
    this.nr62 = (this.IOCore.BIOSFound && !this.settings.SKIPBoot) ? 0 : 0xFF;
    this.nr63 = (this.IOCore.BIOSFound && !this.settings.SKIPBoot) ? 0 : 0x2;
    this.soundMasterEnabled = (!this.IOCore.BIOSFound || this.settings.SKIPBoot);
    this.mixerSoundBIAS = (this.IOCore.BIOSFound && !this.settings.SKIPBoot) ? 0 : 0x200;
    this.channel1 = new GameBoyAdvanceChannel1Synth(this);
    this.channel2 = new GameBoyAdvanceChannel2Synth(this);
    this.channel3 = new GameBoyAdvanceChannel3Synth(this);
    this.channel4 = new GameBoyAdvanceChannel4Synth(this);
    this.CGBMixerOutputCacheLeft = 0;
    this.CGBMixerOutputCacheLeftFolded = 0;
    this.CGBMixerOutputCacheRight = 0;
    this.CGBMixerOutputCacheRightFolded = 0;
    this.AGBDirectSoundATimer = 0;
    this.AGBDirectSoundBTimer = 0;
    this.AGBDirectSoundA = 0;
    this.AGBDirectSoundAFolded = 0;
    this.AGBDirectSoundB = 0;
    this.AGBDirectSoundBFolded = 0;
    this.AGBDirectSoundAShifter = 0;
    this.AGBDirectSoundBShifter = 0;
    this.AGBDirectSoundALeftCanPlay = false;
    this.AGBDirectSoundBLeftCanPlay = false;
    this.AGBDirectSoundARightCanPlay = false;
    this.AGBDirectSoundBRightCanPlay = false;
    this.CGBOutputRatio = 2;
    this.FIFOABuffer = new GameBoyAdvanceFIFO();
    this.FIFOBBuffer = new GameBoyAdvanceFIFO();
    this.AGBDirectSoundAFIFOClear();
    this.AGBDirectSoundBFIFOClear();
    this.audioDisabled();       //Clear legacy PAPU registers:
}
GameBoyAdvanceSound.prototype.audioDisabled = function () {
    this.channel1.disabled();
    this.channel2.disabled();
    this.channel3.disabled();
    this.channel4.disabled();
    //Clear NR50:
    this.nr50 = 0;
    this.VinLeftChannelMasterVolume = 1;
    this.VinRightChannelMasterVolume = 1;
    //Clear NR51:
    this.nr51 = 0;
    this.rightChannel1 = false;
    this.rightChannel2 = false;
    this.rightChannel3 = false;
    this.rightChannel4 = false;
    this.leftChannel1 = false;
    this.leftChannel2 = false;
    this.leftChannel3 = false;
    this.leftChannel4 = false;
    //Clear NR52:
    this.nr52 = 0;
    this.soundMasterEnabled = false;
    this.mixerOutputCacheLeft = this.mixerSoundBIAS | 0;
    this.mixerOutputCacheRight = this.mixerSoundBIAS | 0;
    this.audioClocksUntilNextEventCounter = 0;
    this.audioClocksUntilNextEvent = 0;
    this.sequencePosition = 0;
    this.sequencerClocks = 0x8000;
    this.PWMWidth = 0x200;
    this.PWMWidthOld = 0x200;
    this.PWMWidthShadow = 0x200;
    this.PWMBitDepthMask = 0x3FE;
    this.PWMBitDepthMaskShadow = 0x3FE;
    this.channel1.outputLevelCache();
    this.channel2.outputLevelCache();
    this.channel3.updateCache();
    this.channel4.updateCache();
}
GameBoyAdvanceSound.prototype.audioEnabled = function () {
    //Set NR52:
    this.nr52 = 0x80;
    this.soundMasterEnabled = true;
}
GameBoyAdvanceSound.prototype.addClocks = function (clocks) {
    clocks = clocks | 0;
    this.audioTicks = ((this.audioTicks | 0) + (clocks | 0)) | 0;
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceSound.prototype.generateAudioReal = function (numSamples) {
        numSamples = numSamples | 0;
        var multiplier = 0;
        if (this.soundMasterEnabled && !this.IOCore.isStopped()) {
            for (var clockUpTo = 0; (numSamples | 0) > 0;) {
                clockUpTo = Math.min(this.PWMWidth | 0, numSamples | 0) | 0;
                this.PWMWidth = ((this.PWMWidth | 0) - (clockUpTo | 0)) | 0;
                numSamples = ((numSamples | 0) - (clockUpTo | 0)) | 0;
                while ((clockUpTo | 0) > 0) {
                    multiplier = Math.min(clockUpTo | 0, ((this.audioResamplerFirstPassFactor | 0) - (this.audioIndex | 0)) | 0) | 0;
                    clockUpTo = ((clockUpTo | 0) - (multiplier | 0)) | 0;
                    this.audioIndex = ((this.audioIndex | 0) + (multiplier | 0)) | 0;
                    this.downsampleInputLeft = ((this.downsampleInputLeft | 0) + Math.imul(this.mixerOutputCacheLeft | 0, multiplier | 0)) | 0;
                    this.downsampleInputRight = ((this.downsampleInputRight | 0) + Math.imul(this.mixerOutputCacheRight | 0, multiplier | 0)) | 0;
                    if ((this.audioIndex | 0) == (this.audioResamplerFirstPassFactor | 0)) {
                        this.audioIndex = 0;
                        this.coreExposed.outputAudio(this.downsampleInputLeft | 0, this.downsampleInputRight | 0);
                        this.downsampleInputLeft = 0;
                        this.downsampleInputRight = 0;
                    }
                }
                if ((this.PWMWidth | 0) == 0) {
                    this.computeNextPWMInterval();
                    this.PWMWidthOld = this.PWMWidthShadow | 0;
                    this.PWMWidth = this.PWMWidthShadow | 0;
                }
            }
        }
        else {
            //SILENT OUTPUT:
            while ((numSamples | 0) > 0) {
                multiplier = Math.min(numSamples | 0, ((this.audioResamplerFirstPassFactor | 0) - (this.audioIndex | 0)) | 0) | 0;
                numSamples = ((numSamples | 0) - (multiplier | 0)) | 0;
                this.audioIndex = ((this.audioIndex | 0) + (multiplier | 0)) | 0;
                if ((this.audioIndex | 0) == (this.audioResamplerFirstPassFactor | 0)) {
                    this.audioIndex = 0;
                    this.coreExposed.outputAudio(this.downsampleInputLeft | 0, this.downsampleInputRight | 0);
                    this.downsampleInputLeft = 0;
                    this.downsampleInputRight = 0;
                }
            }
        }
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceSound.prototype.generateAudioReal = function (numSamples) {
        var multiplier = 0;
        if (this.soundMasterEnabled && !this.IOCore.isStopped()) {
            for (var clockUpTo = 0; numSamples > 0;) {
                clockUpTo = Math.min(this.PWMWidth, numSamples);
                this.PWMWidth = this.PWMWidth - clockUpTo;
                numSamples -= clockUpTo;
                while (clockUpTo > 0) {
                    multiplier = Math.min(clockUpTo, this.audioResamplerFirstPassFactor - this.audioIndex);
                    clockUpTo -= multiplier;
                    this.audioIndex += multiplier;
                    this.downsampleInputLeft += this.mixerOutputCacheLeft * multiplier;
                    this.downsampleInputRight += this.mixerOutputCacheRight * multiplier;
                    if (this.audioIndex == this.audioResamplerFirstPassFactor) {
                        this.audioIndex = 0;
                        this.coreExposed.outputAudio(this.downsampleInputLeft, this.downsampleInputRight);
                        this.downsampleInputLeft = 0;
                        this.downsampleInputRight = 0;
                    }
                }
                if (this.PWMWidth == 0) {
                    this.computeNextPWMInterval();
                    this.PWMWidthOld = this.PWMWidthShadow;
                    this.PWMWidth = this.PWMWidthShadow;
                }
            }
        }
        else {
            //SILENT OUTPUT:
            while (numSamples > 0) {
                multiplier = Math.min(numSamples, this.audioResamplerFirstPassFactor - this.audioIndex);
                numSamples -= multiplier;
                this.audioIndex += multiplier;
                if (this.audioIndex == this.audioResamplerFirstPassFactor) {
                    this.audioIndex = 0;
                    this.coreExposed.outputAudio(this.downsampleInputLeft, this.downsampleInputRight);
                    this.downsampleInputLeft = 0;
                    this.downsampleInputRight = 0;
                }
            }
        }
    }
}
//Generate audio, but don't actually output it (Used for when sound is disabled by user/browser):
GameBoyAdvanceSound.prototype.generateAudioFake = function (numSamples) {
    numSamples = numSamples | 0;
    if (this.soundMasterEnabled && !this.IOCore.isStopped()) {
        for (var clockUpTo = 0; (numSamples | 0) > 0;) {
            clockUpTo = Math.min(this.PWMWidth | 0, numSamples | 0) | 0;
            this.PWMWidth = ((this.PWMWidth | 0) - (clockUpTo | 0)) | 0;
            numSamples = ((numSamples | 0) - (clockUpTo | 0)) | 0;
            if ((this.PWMWidth | 0) == 0) {
                this.computeNextPWMInterval();
                this.PWMWidthOld = this.PWMWidthShadow | 0;
                this.PWMWidth = this.PWMWidthShadow | 0;
            }
        }
    }
}
GameBoyAdvanceSound.prototype.preprocessInitialization = function (audioInitialized) {
    if (audioInitialized) {
        this.generateAudio = this.generateAudioReal;
        this.audioInitialized = true;
    }
    else {
        this.generateAudio = this.generateAudioFake;
        this.audioInitialized = false;
    }
}
GameBoyAdvanceSound.prototype.audioJIT = function () {
    //Audio Sample Generation Timing:
    this.generateAudio(this.audioTicks | 0);
    this.audioTicks = 0;
}
GameBoyAdvanceSound.prototype.computeNextPWMInterval = function () {
    //Clock down the PSG system:
    for (var numSamples = this.PWMWidthOld | 0, clockUpTo = 0; (numSamples | 0) > 0; numSamples = ((numSamples | 0) - 1) | 0) {
        clockUpTo = Math.min(this.audioClocksUntilNextEventCounter | 0, this.sequencerClocks | 0, numSamples | 0) | 0;
        this.audioClocksUntilNextEventCounter = ((this.audioClocksUntilNextEventCounter | 0) - (clockUpTo | 0)) | 0;
        this.sequencerClocks = ((this.sequencerClocks | 0) - (clockUpTo | 0)) | 0;
        numSamples = ((numSamples | 0) - (clockUpTo | 0)) | 0;
        if ((this.sequencerClocks | 0) == 0) {
            this.audioComputeSequencer();
            this.sequencerClocks = 0x8000;
        }
        if ((this.audioClocksUntilNextEventCounter | 0) == 0) {
            this.computeAudioChannels();
        }
    }
    //Copy the new bit-depth mask for the next counter interval:
    this.PWMBitDepthMask = this.PWMBitDepthMaskShadow | 0;
    //Compute next sample for the PWM output:
    this.channel1.outputLevelCache();
    this.channel2.outputLevelCache();
    this.channel3.updateCache();
    this.channel4.updateCache();
    this.CGBMixerOutputLevelCache();
    this.mixerOutputLevelCache();
}
GameBoyAdvanceSound.prototype.audioComputeSequencer = function () {
    switch (this.sequencePosition++) {
        case 0:
            this.clockAudioLength();
            break;
        case 2:
            this.clockAudioLength();
            this.channel1.clockAudioSweep();
            break;
        case 4:
            this.clockAudioLength();
            break;
        case 6:
            this.clockAudioLength();
            this.channel1.clockAudioSweep();
            break;
        case 7:
            this.clockAudioEnvelope();
            this.sequencePosition = 0;
    }
}
GameBoyAdvanceSound.prototype.clockAudioLength = function () {
    //Channel 1:
    this.channel1.clockAudioLength();
    //Channel 2:
    this.channel2.clockAudioLength();
    //Channel 3:
    this.channel3.clockAudioLength();
    //Channel 4:
    this.channel4.clockAudioLength();
}
GameBoyAdvanceSound.prototype.clockAudioEnvelope = function () {
    //Channel 1:
    this.channel1.clockAudioEnvelope();
    //Channel 2:
    this.channel2.clockAudioEnvelope();
    //Channel 4:
    this.channel4.clockAudioEnvelope();
}
GameBoyAdvanceSound.prototype.computeAudioChannels = function () {
    //Clock down the four audio channels to the next closest audio event:
    this.channel1.FrequencyCounter = ((this.channel1.FrequencyCounter | 0) - (this.audioClocksUntilNextEvent | 0)) | 0;
    this.channel2.FrequencyCounter = ((this.channel2.FrequencyCounter | 0) - (this.audioClocksUntilNextEvent | 0)) | 0;
    this.channel3.counter = ((this.channel3.counter | 0) - (this.audioClocksUntilNextEvent | 0)) | 0;
    this.channel4.counter = ((this.channel4.counter | 0) - (this.audioClocksUntilNextEvent | 0)) | 0;
    //Channel 1 counter:
    this.channel1.computeAudioChannel();
    //Channel 2 counter:
    this.channel2.computeAudioChannel();
    //Channel 3 counter:
    this.channel3.computeAudioChannel();
    //Channel 4 counter:
    this.channel4.computeAudioChannel();
    //Find the number of clocks to next closest counter event:
    this.audioClocksUntilNextEventCounter = this.audioClocksUntilNextEvent = Math.min(this.channel1.FrequencyCounter | 0, this.channel2.FrequencyCounter | 0, this.channel3.counter | 0, this.channel4.counter | 0) | 0;
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceSound.prototype.CGBMixerOutputLevelCache = function () {
        this.CGBMixerOutputCacheLeft = Math.imul(((this.channel1.currentSampleLeftTrimary | 0) + (this.channel2.currentSampleLeftTrimary | 0) + (this.channel3.currentSampleLeftSecondary | 0) + (this.channel4.currentSampleLeftSecondary | 0)) | 0, this.VinLeftChannelMasterVolume | 0) | 0;
        this.CGBMixerOutputCacheRight = Math.imul(((this.channel1.currentSampleRightTrimary | 0) + (this.channel2.currentSampleRightTrimary | 0) + (this.channel3.currentSampleRightSecondary | 0) + (this.channel4.currentSampleRightSecondary | 0)) | 0, this.VinRightChannelMasterVolume | 0) | 0;
        this.CGBFolder();
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceSound.prototype.CGBMixerOutputLevelCache = function () {
        this.CGBMixerOutputCacheLeft = (this.channel1.currentSampleLeftTrimary + this.channel2.currentSampleLeftTrimary + this.channel3.currentSampleLeftSecondary + this.channel4.currentSampleLeftSecondary) * this.VinLeftChannelMasterVolume;
        this.CGBMixerOutputCacheRight = (this.channel1.currentSampleRightTrimary + this.channel2.currentSampleRightTrimary + this.channel3.currentSampleRightSecondary + this.channel4.currentSampleRightSecondary) * this.VinRightChannelMasterVolume;
        this.CGBFolder();
    }
}
GameBoyAdvanceSound.prototype.writeWAVE = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.channel3.writeWAVE(address | 0, data | 0);
}
GameBoyAdvanceSound.prototype.readWAVE = function (address) {
    return this.channel3.readWAVE(address | 0) | 0;
}
GameBoyAdvanceSound.prototype.writeFIFOA = function (data) {
    data = data | 0;
    this.FIFOABuffer.push(data | 0);
    this.checkFIFOAPendingSignal();
}
GameBoyAdvanceSound.prototype.writeFIFOB = function (data) {
    data = data | 0;
    this.FIFOBBuffer.push(data | 0);
    this.checkFIFOBPendingSignal();
}
GameBoyAdvanceSound.prototype.checkFIFOAPendingSignal = function () {
    if (this.FIFOABuffer.requestingDMA()) {
        this.IOCore.dma.soundFIFOARequest();
    }
}
GameBoyAdvanceSound.prototype.checkFIFOBPendingSignal = function () {
    if (this.FIFOBBuffer.requestingDMA()) {
        this.IOCore.dma.soundFIFOBRequest();
    }
}
GameBoyAdvanceSound.prototype.AGBDirectSoundAFIFOClear = function () {
    this.FIFOABuffer.count = 0;
    this.AGBDirectSoundATimerIncrement();
}
GameBoyAdvanceSound.prototype.AGBDirectSoundBFIFOClear = function () {
    this.FIFOBBuffer.count = 0;
    this.AGBDirectSoundBTimerIncrement();
}
GameBoyAdvanceSound.prototype.AGBDirectSoundTimer0ClockTick = function () {
    this.audioJIT();
    if ((this.AGBDirectSoundATimer | 0) == 0) {
        this.AGBDirectSoundATimerIncrement();
    }
    if ((this.AGBDirectSoundBTimer | 0) == 0) {
        this.AGBDirectSoundBTimerIncrement();
    }
}
GameBoyAdvanceSound.prototype.AGBDirectSoundTimer1ClockTick = function () {
    this.audioJIT();
    if ((this.AGBDirectSoundATimer | 0) == 1) {
        this.AGBDirectSoundATimerIncrement();
    }
    if ((this.AGBDirectSoundBTimer | 0) == 1) {
        this.AGBDirectSoundBTimerIncrement();
    }
}
GameBoyAdvanceSound.prototype.nextFIFOAEventTime = function () {
    var nextEventTime = 0;
    if (!this.FIFOABuffer.requestingDMA()) {
        var samplesUntilDMA = this.FIFOABuffer.samplesUntilDMATrigger() | 0;
        if ((this.AGBDirectSoundATimer | 0) == 0) {
            nextEventTime = this.IOCore.timer.nextTimer0Overflow(samplesUntilDMA | 0);
        }
        else {
            nextEventTime = this.IOCore.timer.nextTimer1Overflow(samplesUntilDMA | 0);
        }
    }
    return Math.max(Math.min(nextEventTime, 0x7FFFFFFF), -1) | 0;
}
GameBoyAdvanceSound.prototype.nextFIFOBEventTime = function () {
    var nextEventTime = 0;
    if (!this.FIFOBBuffer.requestingDMA()) {
        var samplesUntilDMA = this.FIFOBBuffer.samplesUntilDMATrigger() | 0;
        if ((this.AGBDirectSoundBTimer | 0) == 0) {
            nextEventTime = this.IOCore.timer.nextTimer0Overflow(samplesUntilDMA | 0);
        }
        else {
            nextEventTime = this.IOCore.timer.nextTimer1Overflow(samplesUntilDMA | 0);
        }
    }
    return Math.max(Math.min(nextEventTime, 0x7FFFFFFF), -1) | 0;
}
GameBoyAdvanceSound.prototype.AGBDirectSoundATimerIncrement = function () {
    this.AGBDirectSoundA = this.FIFOABuffer.shift() | 0;
    this.checkFIFOAPendingSignal();
    this.AGBFIFOAFolder();
}
GameBoyAdvanceSound.prototype.AGBDirectSoundBTimerIncrement = function () {
    this.AGBDirectSoundB = this.FIFOBBuffer.shift() | 0;
    this.checkFIFOBPendingSignal();
    this.AGBFIFOBFolder();
}
GameBoyAdvanceSound.prototype.AGBFIFOAFolder = function () {
    this.AGBDirectSoundAFolded = this.AGBDirectSoundA >> (this.AGBDirectSoundAShifter | 0);
}
GameBoyAdvanceSound.prototype.AGBFIFOBFolder = function () {
    this.AGBDirectSoundBFolded = this.AGBDirectSoundB >> (this.AGBDirectSoundBShifter | 0);
}
GameBoyAdvanceSound.prototype.CGBFolder = function () {
    this.CGBMixerOutputCacheLeftFolded = (this.CGBMixerOutputCacheLeft << (this.CGBOutputRatio | 0)) >> 1;
    this.CGBMixerOutputCacheRightFolded = (this.CGBMixerOutputCacheRight << (this.CGBOutputRatio | 0)) >> 1;
}
GameBoyAdvanceSound.prototype.mixerOutputLevelCache = function () {
    this.mixerOutputCacheLeft = Math.min(Math.max((((this.AGBDirectSoundALeftCanPlay) ? (this.AGBDirectSoundAFolded | 0) : 0) +
    ((this.AGBDirectSoundBLeftCanPlay) ? (this.AGBDirectSoundBFolded | 0) : 0) +
    (this.CGBMixerOutputCacheLeftFolded | 0) + (this.mixerSoundBIAS | 0)) | 0, 0) | 0, 0x3FF) & this.PWMBitDepthMask;
    this.mixerOutputCacheRight = Math.min(Math.max((((this.AGBDirectSoundARightCanPlay) ? (this.AGBDirectSoundAFolded | 0) : 0) +
    ((this.AGBDirectSoundBRightCanPlay) ? (this.AGBDirectSoundBFolded | 0) : 0) +
    (this.CGBMixerOutputCacheRightFolded | 0) + (this.mixerSoundBIAS | 0)) | 0, 0) | 0, 0x3FF) & this.PWMBitDepthMask;
}
GameBoyAdvanceSound.prototype.setNR52 = function (data) {
    data = data | 0;
    this.nr52 = data | this.nr52;
}
GameBoyAdvanceSound.prototype.unsetNR52 = function (data) {
    data = data | 0;
    this.nr52 = data & this.nr52;
}
GameBoyAdvanceSound.prototype.readSOUND1CNT_L = function () {
    //NR10:
    return this.channel1.readSOUND1CNT_L() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND1CNT_L = function (data) {
    //NR10:
    data = data | 0;
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel1.writeSOUND1CNT_L(data | 0);
    }
}
GameBoyAdvanceSound.prototype.readSOUND1CNT_H0 = function () {
    //NR11:
    return this.channel1.readSOUND1CNT_H0() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND1CNT_H0 = function (data) {
    //NR11:
    data = data | 0;
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel1.writeSOUND1CNT_H0(data | 0);
    }
}
GameBoyAdvanceSound.prototype.readSOUND1CNT_H1 = function () {
    //NR12:
    return this.channel1.readSOUND1CNT_H1() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND1CNT_H1 = function (data) {
    //NR12:
    data = data | 0;
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel1.writeSOUND1CNT_H1(data | 0);
    }
}
GameBoyAdvanceSound.prototype.writeSOUND1CNT_X0 = function (data) {
    //NR13:
    data = data | 0;
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel1.writeSOUND1CNT_X0(data | 0);
    }
}
GameBoyAdvanceSound.prototype.readSOUND1CNT_X = function () {
    //NR14:
    return this.channel1.readSOUND1CNT_X() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND1CNT_X1 = function (data) {
    //NR14:
    data = data | 0;
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel1.writeSOUND1CNT_X1(data | 0);
    }
}
GameBoyAdvanceSound.prototype.readSOUND2CNT_L0 = function () {
    //NR21:
    return this.channel2.readSOUND2CNT_L0() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND2CNT_L0 = function (data) {
    data = data | 0;
    //NR21:
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel2.writeSOUND2CNT_L0(data | 0);
    }
}
GameBoyAdvanceSound.prototype.readSOUND2CNT_L1 = function () {
    //NR22:
    return this.channel2.readSOUND2CNT_L1() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND2CNT_L1 = function (data) {
    data = data | 0;
    //NR22:
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel2.writeSOUND2CNT_L1(data | 0);
    }
}
GameBoyAdvanceSound.prototype.writeSOUND2CNT_H0 = function (data) {
    data = data | 0;
    //NR23:
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel2.writeSOUND2CNT_H0(data | 0);
    }
}
GameBoyAdvanceSound.prototype.readSOUND2CNT_H = function () {
    //NR24:
    return this.channel2.readSOUND2CNT_H() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND2CNT_H1 = function (data) {
    data = data | 0;
    //NR24:
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel2.writeSOUND2CNT_H1(data | 0);
    }
}
GameBoyAdvanceSound.prototype.readSOUND3CNT_L = function () {
    //NR30:
    return this.channel3.readSOUND3CNT_L() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND3CNT_L = function (data) {
    //NR30:
    data = data | 0;
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel3.writeSOUND3CNT_L(data | 0);
    }
}
GameBoyAdvanceSound.prototype.writeSOUND3CNT_H0 = function (data) {
    //NR31:
    data = data | 0;
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel3.writeSOUND3CNT_H0(data | 0);
    }
}
GameBoyAdvanceSound.prototype.readSOUND3CNT_H = function () {
    //NR32:
    return this.channel3.readSOUND3CNT_H() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND3CNT_H1 = function (data) {
    //NR32:
    data = data | 0;
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel3.writeSOUND3CNT_H1(data | 0);
    }
}
GameBoyAdvanceSound.prototype.writeSOUND3CNT_X0 = function (data) {
    //NR33:
    data = data | 0;
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel3.writeSOUND3CNT_X0(data | 0);
    }
}
GameBoyAdvanceSound.prototype.readSOUND3CNT_X = function () {
    //NR34:
    return this.channel3.readSOUND3CNT_X() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND3CNT_X1 = function (data) {
    //NR34:
    data = data | 0;
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel3.writeSOUND3CNT_X1(data | 0);
    }
}
GameBoyAdvanceSound.prototype.writeSOUND4CNT_L0 = function (data) {
    //NR41:
    data = data | 0;
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel4.writeSOUND4CNT_L0(data | 0);
    }
}
GameBoyAdvanceSound.prototype.writeSOUND4CNT_L1 = function (data) {
    //NR42:
    data = data | 0;
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel4.writeSOUND4CNT_L1(data | 0);
    }
}
GameBoyAdvanceSound.prototype.readSOUND4CNT_L = function () {
    //NR42:
    return this.channel4.readSOUND4CNT_L() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND4CNT_H0 = function (data) {
    //NR43:
    data = data | 0;
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel4.writeSOUND4CNT_H0(data | 0);
    }
}
GameBoyAdvanceSound.prototype.readSOUND4CNT_H0 = function () {
    //NR43:
    return this.channel4.readSOUND4CNT_H0() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND4CNT_H1 = function (data) {
    //NR44:
    data = data | 0;
    if (this.soundMasterEnabled) {
        this.audioJIT();
        this.channel4.writeSOUND4CNT_H1(data | 0);
    }
}
GameBoyAdvanceSound.prototype.readSOUND4CNT_H1 = function () {
    //NR44:
    return this.channel4.readSOUND4CNT_H1() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUNDCNT_L0 = function (data) {
    //NR50:
    data = data | 0;
    if (this.soundMasterEnabled && (this.nr50 | 0) != (data | 0)) {
        this.audioJIT();
        this.nr50 = data | 0;
        this.VinLeftChannelMasterVolume = (((data >> 4) & 0x07) + 1) | 0;
        this.VinRightChannelMasterVolume = ((data & 0x07) + 1) | 0;
    }
}
GameBoyAdvanceSound.prototype.readSOUNDCNT_L0 = function () {
    //NR50:
    return 0x88 | this.nr50;
}
GameBoyAdvanceSound.prototype.writeSOUNDCNT_L1 = function (data) {
    //NR51:
    data = data | 0;
    if (this.soundMasterEnabled && (this.nr51 | 0) != (data | 0)) {
        this.audioJIT();
        this.nr51 = data | 0;
        this.rightChannel1 = ((data & 0x01) == 0x01);
        this.rightChannel2 = ((data & 0x02) == 0x02);
        this.rightChannel3 = ((data & 0x04) == 0x04);
        this.rightChannel4 = ((data & 0x08) == 0x08);
        this.leftChannel1 = ((data & 0x10) == 0x10);
        this.leftChannel2 = ((data & 0x20) == 0x20);
        this.leftChannel3 = ((data & 0x40) == 0x40);
        this.leftChannel4 = (data > 0x7F);
    }
}
GameBoyAdvanceSound.prototype.readSOUNDCNT_L1 = function () {
    //NR51:
    return this.nr51 | 0;
}
GameBoyAdvanceSound.prototype.writeSOUNDCNT_H0 = function (data) {
    //NR60:
    data = data | 0;
    this.audioJIT();
    this.CGBOutputRatio = data & 0x3;
    this.AGBDirectSoundAShifter = (data & 0x04) >> 2;
    this.AGBDirectSoundBShifter = (data & 0x08) >> 3;
    this.nr60 = data | 0;
}
GameBoyAdvanceSound.prototype.readSOUNDCNT_H0 = function () {
    //NR60:
    return this.nr60 | 0;
}
GameBoyAdvanceSound.prototype.writeSOUNDCNT_H1 = function (data) {
    //NR61:
    data = data | 0;
    this.audioJIT();
    this.AGBDirectSoundARightCanPlay = ((data & 0x1) == 0x1);
    this.AGBDirectSoundALeftCanPlay = ((data & 0x2) == 0x2);
    this.AGBDirectSoundATimer = (data & 0x4) >> 2;
    if ((data & 0x08) == 0x08) {
        this.AGBDirectSoundAFIFOClear();
    }
    this.AGBDirectSoundBRightCanPlay = ((data & 0x10) == 0x10);
    this.AGBDirectSoundBLeftCanPlay = ((data & 0x20) == 0x20);
    this.AGBDirectSoundBTimer = (data & 0x40) >> 6;
    if ((data & 0x80) == 0x80) {
        this.AGBDirectSoundBFIFOClear();
    }
    this.nr61 = data | 0;
}
GameBoyAdvanceSound.prototype.readSOUNDCNT_H1 = function () {
    //NR61:
    return this.nr61 | 0;
}
GameBoyAdvanceSound.prototype.writeSOUNDCNT_X = function (data) {
    //NR52:
    data = data | 0;
    if (!this.soundMasterEnabled && (data | 0) > 0x7F) {
        this.audioJIT();
        this.audioEnabled();
    }
    else if (this.soundMasterEnabled && (data | 0) < 0x80) {
        this.audioJIT();
        this.audioDisabled();
    }
}
GameBoyAdvanceSound.prototype.readSOUNDCNT_X = function () {
    //NR52:
    return this.nr52 | 0;
}
GameBoyAdvanceSound.prototype.writeSOUNDBIAS0 = function (data) {
    //NR62:
    data = data | 0;
    this.audioJIT();
    this.mixerSoundBIAS = this.mixerSoundBIAS & 0x300;
    this.mixerSoundBIAS = this.mixerSoundBIAS | data;
    this.nr62 = data | 0;
}
GameBoyAdvanceSound.prototype.readSOUNDBIAS0 = function () {
    //NR62:
    return this.nr62 | 0;
}
GameBoyAdvanceSound.prototype.writeSOUNDBIAS1 = function (data) {
    //NR63:
    data = data | 0;
    this.audioJIT();
    this.mixerSoundBIAS = this.mixerSoundBIAS & 0xFF;
    this.mixerSoundBIAS = this.mixerSoundBIAS | ((data & 0x3) << 8);
    this.PWMWidthShadow = 0x200 >> ((data & 0xC0) >> 6);
    this.PWMBitDepthMaskShadow = ((this.PWMWidthShadow | 0) - 1) << (1 + ((data & 0xC0) >> 6));
    this.nr63 = data | 0;
}
GameBoyAdvanceSound.prototype.readSOUNDBIAS1 = function () {
    //NR63:
    return this.nr63 | 0;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceTimer(IOCore) {
    //Build references:
    this.IOCore = IOCore;
    this.initialize();
}
GameBoyAdvanceTimer.prototype.prescalarLookup = [
    0,
    0x6,
    0x8,
    0xA
];
GameBoyAdvanceTimer.prototype.initialize = function () {
    this.initializeTimers();
}
GameBoyAdvanceTimer.prototype.initializeTimers = function () {
    this.timer0Counter = 0;
    this.timer0Reload = 0;
    this.timer0Control = 0;
    this.timer0Enabled = false;
    this.timer0IRQ = false;
    this.timer0Precounter = 0;
    this.timer0Prescalar = 1;
    this.timer0PrescalarShifted = 0;
    this.timer1Counter = 0;
    this.timer1Reload = 0;
    this.timer1Control = 0;
    this.timer1Enabled = false;
    this.timer1IRQ = false;
    this.timer1Precounter = 0;
    this.timer1Prescalar = 1;
    this.timer1PrescalarShifted = 0;
    this.timer1CountUp = false;
    this.timer2Counter = 0;
    this.timer2Reload = 0;
    this.timer2Control = 0;
    this.timer2Enabled = false;
    this.timer2IRQ = false;
    this.timer2Precounter = 0;
    this.timer2Prescalar = 1;
    this.timer2PrescalarShifted = 0;
    this.timer2CountUp = false;
    this.timer3Counter = 0;
    this.timer3Reload = 0;
    this.timer3Control = 0;
    this.timer3Enabled = false;
    this.timer3IRQ = false;
    this.timer3Precounter = 0;
    this.timer3Prescalar = 1;
    this.timer3PrescalarShifted = 0;
    this.timer3CountUp = false;
    this.timer1UseMainClocks = false;
    this.timer1UseChainedClocks = false;
    this.timer2UseMainClocks = false;
    this.timer2UseChainedClocks = false;
    this.timer3UseMainClocks = false;
    this.timer3UseChainedClocks = false;
}
GameBoyAdvanceTimer.prototype.addClocks = function (clocks) {
    clocks = clocks | 0;
    //See if timer channels 0 and 1 are enabled:
    this.clockSoundTimers(clocks | 0);
    //See if timer channel 2 is enabled:
    this.clockTimer2(clocks | 0);
    //See if timer channel 3 is enabled:
    this.clockTimer3(clocks | 0);
}
GameBoyAdvanceTimer.prototype.clockSoundTimers = function (clocks) {
    clocks = clocks | 0;
    for (var audioClocks = clocks | 0, predictedClocks = 0, overflowClocks = 0; (audioClocks | 0) > 0; audioClocks = ((audioClocks | 0) - (predictedClocks | 0)) | 0) {
        overflowClocks = this.nextAudioTimerOverflow() | 0;
        predictedClocks = Math.min(audioClocks | 0, overflowClocks | 0) | 0;
        //See if timer channel 0 is enabled:
        this.clockTimer0(predictedClocks | 0);
        //See if timer channel 1 is enabled:
        this.clockTimer1(predictedClocks | 0);
        //Clock audio system up to latest timer:
        this.IOCore.sound.addClocks(predictedClocks | 0);
        //Only jit if overflow was seen:
        if ((overflowClocks | 0) == (predictedClocks | 0)) {
            this.IOCore.sound.audioJIT();
        }
    }
}
GameBoyAdvanceTimer.prototype.clockTimer0 = function (clocks) {
    clocks = clocks | 0;
    if (this.timer0Enabled) {
        this.timer0Precounter = ((this.timer0Precounter | 0) + (clocks | 0)) | 0;
        while ((this.timer0Precounter | 0) >= (this.timer0Prescalar | 0)) {
            var iterations = Math.min(this.timer0Precounter >> (this.timer0PrescalarShifted | 0), (0x10000 - (this.timer0Counter | 0)) | 0) | 0;
            this.timer0Precounter = ((this.timer0Precounter | 0) - ((iterations | 0) << (this.timer0PrescalarShifted | 0))) | 0;
            this.timer0Counter = ((this.timer0Counter | 0) + (iterations | 0)) | 0;
            if ((this.timer0Counter | 0) > 0xFFFF) {
                this.timer0Counter = this.timer0Reload | 0;
                this.timer0ExternalTriggerCheck();
                this.timer1ClockUpTickCheck();
            }
        }
    }
}
GameBoyAdvanceTimer.prototype.clockTimer1 = function (clocks) {
    clocks = clocks | 0;
    if (this.timer1UseMainClocks) {
        this.timer1Precounter = ((this.timer1Precounter | 0) + (clocks | 0)) | 0;
        while ((this.timer1Precounter | 0) >= (this.timer1Prescalar | 0)) {
            var iterations = Math.min(this.timer1Precounter >> (this.timer1PrescalarShifted | 0), (0x10000 - (this.timer1Counter | 0)) | 0) | 0;
            this.timer1Precounter = ((this.timer1Precounter | 0) - ((iterations | 0) << (this.timer1PrescalarShifted | 0))) | 0;
            this.timer1Counter = ((this.timer1Counter | 0) + (iterations | 0)) | 0;
            if ((this.timer1Counter | 0) > 0xFFFF) {
                this.timer1Counter = this.timer1Reload | 0;
                this.timer1ExternalTriggerCheck();
                this.timer2ClockUpTickCheck();
            }
        }
    }
}
GameBoyAdvanceTimer.prototype.clockTimer2 = function (clocks) {
    clocks = clocks | 0;
    if (this.timer2UseMainClocks) {
        this.timer2Precounter = ((this.timer2Precounter | 0) + (clocks | 0)) | 0;
        while ((this.timer2Precounter | 0) >= (this.timer2Prescalar | 0)) {
            var iterations = Math.min(this.timer2Precounter >> (this.timer2PrescalarShifted | 0), (0x10000 - (this.timer2Counter | 0)) | 0) | 0;
            this.timer2Precounter = ((this.timer2Precounter | 0) - ((iterations | 0) << (this.timer2PrescalarShifted | 0))) | 0;
            this.timer2Counter = ((this.timer2Counter | 0) + (iterations | 0)) | 0;
            if ((this.timer2Counter | 0) > 0xFFFF) {
                this.timer2Counter = this.timer2Reload | 0;
                this.timer2ExternalTriggerCheck();
                this.timer3ClockUpTickCheck();
            }
        }
    }
}
GameBoyAdvanceTimer.prototype.clockTimer3 = function (clocks) {
    clocks = clocks | 0;
    if (this.timer3UseMainClocks) {
        this.timer3Precounter = ((this.timer3Precounter | 0) + (clocks | 0)) | 0;
        while ((this.timer3Precounter | 0) >= (this.timer3Prescalar | 0)) {
            var iterations = Math.min(this.timer3Precounter >> (this.timer3PrescalarShifted | 0), (0x10000 - (this.timer3Counter | 0)) | 0) | 0;
            this.timer3Precounter = ((this.timer3Precounter | 0) - ((iterations | 0) << (this.timer3PrescalarShifted | 0))) | 0;
            this.timer3Counter = ((this.timer3Counter | 0) + (iterations | 0)) | 0;
            if ((this.timer3Counter | 0) > 0xFFFF) {
                this.timer3Counter = this.timer3Reload | 0;
                this.timer3ExternalTriggerCheck();
            }
        }
    }
}
GameBoyAdvanceTimer.prototype.timer1ClockUpTickCheck = function () {
    if (this.timer1UseChainedClocks) {
        this.timer1Counter = ((this.timer1Counter | 0) + 1) | 0;
        if ((this.timer1Counter | 0) > 0xFFFF) {
            this.timer1Counter = this.timer1Reload | 0;
            this.timer1ExternalTriggerCheck();
            this.timer2ClockUpTickCheck();
        }
    }
}
GameBoyAdvanceTimer.prototype.timer2ClockUpTickCheck = function () {
    if (this.timer2UseChainedClocks) {
        this.timer2Counter = ((this.timer2Counter | 0) + 1) | 0;
        if ((this.timer2Counter | 0) > 0xFFFF) {
            this.timer2Counter = this.timer2Reload | 0;
            this.timer2ExternalTriggerCheck();
            this.timer3ClockUpTickCheck();
        }
    }
}
GameBoyAdvanceTimer.prototype.timer3ClockUpTickCheck = function () {
    if (this.timer3UseChainedClocks) {
        this.timer3Counter = ((this.timer3Counter | 0) + 1) | 0;
        if ((this.timer3Counter | 0) > 0xFFFF) {
            this.timer3Counter = this.timer3Reload | 0;
            this.timer3ExternalTriggerCheck();
        }
    }
}
GameBoyAdvanceTimer.prototype.timer0ExternalTriggerCheck = function () {
    if (this.timer0IRQ) {
        this.IOCore.irq.requestIRQ(0x08);
    }
    this.IOCore.sound.AGBDirectSoundTimer0ClockTick();
}
GameBoyAdvanceTimer.prototype.timer1ExternalTriggerCheck = function () {
    if (this.timer1IRQ) {
        this.IOCore.irq.requestIRQ(0x10);
    }
    this.IOCore.sound.AGBDirectSoundTimer1ClockTick();
}
GameBoyAdvanceTimer.prototype.timer2ExternalTriggerCheck = function () {
    if (this.timer2IRQ) {
        this.IOCore.irq.requestIRQ(0x20);
    }
}
GameBoyAdvanceTimer.prototype.timer3ExternalTriggerCheck = function () {
    if (this.timer3IRQ) {
        this.IOCore.irq.requestIRQ(0x40);
    }
}
GameBoyAdvanceTimer.prototype.writeTM0CNT_L0 = function (data) {
    data = data | 0;
    this.IOCore.sound.audioJIT();
    this.timer0Reload = this.timer0Reload & 0xFF00;
    this.timer0Reload = this.timer0Reload | data;
}
GameBoyAdvanceTimer.prototype.writeTM0CNT_L1 = function (data) {
    data = data | 0;
    this.IOCore.sound.audioJIT();
    this.timer0Reload = this.timer0Reload & 0xFF;
    this.timer0Reload = this.timer0Reload | (data << 8);
}
GameBoyAdvanceTimer.prototype.writeTM0CNT_H = function (data) {
    data = data | 0;
    this.IOCore.sound.audioJIT();
    this.timer0Control = data | 0;
    if ((data | 0) > 0x7F) {
        if (!this.timer0Enabled) {
            this.timer0Counter = this.timer0Reload | 0;
            this.timer0Enabled = true;
            this.timer0Precounter = 0;
        }
    }
    else {
        this.timer0Enabled = false;
    }
    this.timer0IRQ = ((data & 0x40) == 0x40);
    this.timer0PrescalarShifted = this.prescalarLookup[data & 0x03] | 0;
    this.timer0Prescalar = 1 << (this.timer0PrescalarShifted | 0);
}
GameBoyAdvanceTimer.prototype.readTM0CNT_L0 = function () {
    return this.timer0Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM0CNT_L1 = function () {
    return (this.timer0Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.readTM0CNT_H = function () {
    return  this.timer0Control | 0;
}
GameBoyAdvanceTimer.prototype.writeTM1CNT_L0 = function (data) {
    data = data | 0;
    this.IOCore.sound.audioJIT();
    this.timer1Reload = this.timer1Reload & 0xFF00;
    this.timer1Reload = this.timer1Reload | data;
}
GameBoyAdvanceTimer.prototype.writeTM1CNT_L1 = function (data) {
    data = data | 0;
    this.IOCore.sound.audioJIT();
    this.timer1Reload = this.timer1Reload & 0xFF;
    this.timer1Reload = this.timer1Reload | (data << 8);
}
GameBoyAdvanceTimer.prototype.writeTM1CNT_H = function (data) {
    data = data | 0;
    this.IOCore.sound.audioJIT();
    this.timer1Control = data | 0;
    if ((data | 0) > 0x7F) {
        if (!this.timer1Enabled) {
            this.timer1Counter = this.timer1Reload | 0;
            this.timer1Enabled = true;
            this.timer1Precounter = 0;
        }
    }
    else {
        this.timer1Enabled = false;
    }
    this.timer1IRQ = ((data & 0x40) == 0x40);
    this.timer1CountUp = ((data & 0x4) == 0x4);
    this.timer1PrescalarShifted = this.prescalarLookup[data & 0x03] | 0;
    this.timer1Prescalar = 1 << (this.timer1PrescalarShifted | 0);
    this.preprocessTimer1();
}
GameBoyAdvanceTimer.prototype.readTM1CNT_L0 = function () {
    return this.timer1Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM1CNT_L1 = function () {
    return (this.timer1Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.readTM1CNT_H = function () {
    return this.timer1Control | 0;
}
GameBoyAdvanceTimer.prototype.writeTM2CNT_L0 = function (data) {
    data = data | 0;
    this.timer2Reload = this.timer2Reload & 0xFF00;
    this.timer2Reload = this.timer2Reload | data;
}
GameBoyAdvanceTimer.prototype.writeTM2CNT_L1 = function (data) {
    data = data | 0;
    this.timer2Reload = this.timer2Reload & 0xFF;
    this.timer2Reload = this.timer2Reload | (data << 8);
}
GameBoyAdvanceTimer.prototype.writeTM2CNT_H = function (data) {
    data = data | 0;
    this.timer2Control = data | 0;
    if ((data | 0) > 0x7F) {
        if (!this.timer2Enabled) {
            this.timer2Counter = this.timer2Reload | 0;
            this.timer2Enabled = true;
            this.timer2Precounter = 0;
        }
    }
    else {
        this.timer2Enabled = false;
    }
    this.timer2IRQ = ((data & 0x40) == 0x40);
    this.timer2CountUp = ((data & 0x4) == 0x4);
    this.timer2PrescalarShifted = this.prescalarLookup[data & 0x03] | 0;
    this.timer2Prescalar = 1 << (this.timer2PrescalarShifted | 0);
    this.preprocessTimer2();
}
GameBoyAdvanceTimer.prototype.readTM2CNT_L0 = function () {
    return this.timer2Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM2CNT_L1 = function () {
    return (this.timer2Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.readTM2CNT_H = function () {
    return this.timer2Control | 0;
}
GameBoyAdvanceTimer.prototype.writeTM3CNT_L0 = function (data) {
    data = data | 0;
    this.timer3Reload = this.timer3Reload & 0xFF00;
    this.timer3Reload = this.timer3Reload | data;
}
GameBoyAdvanceTimer.prototype.writeTM3CNT_L1 = function (data) {
    data = data | 0;
    this.timer3Reload = this.timer3Reload & 0xFF;
    this.timer3Reload = this.timer3Reload | (data << 8);
}
GameBoyAdvanceTimer.prototype.writeTM3CNT_H = function (data) {
    data = data | 0;
    this.timer3Control = data | 0;
    if ((data | 0) > 0x7F) {
        if (!this.timer3Enabled) {
            this.timer3Counter = this.timer3Reload | 0;
            this.timer3Precounter = 0;
            this.timer3Enabled = true;
        }
    }
    else {
        this.timer3Enabled = false;
    }
    this.timer3IRQ = ((data & 0x40) == 0x40);
    this.timer3CountUp = ((data & 0x4) == 0x4);
    this.timer3PrescalarShifted = this.prescalarLookup[data & 0x03] | 0;
    this.timer3Prescalar = 1 << (this.timer3PrescalarShifted | 0);
    this.preprocessTimer3();
}
GameBoyAdvanceTimer.prototype.readTM3CNT_L0 = function () {
    return this.timer3Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM3CNT_L1 = function () {
    return (this.timer3Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.readTM3CNT_H = function () {
    return this.timer3Control | 0;
}
GameBoyAdvanceTimer.prototype.preprocessTimer1 = function () {
    this.timer1UseMainClocks = (this.timer1Enabled && !this.timer1CountUp);
    this.timer1UseChainedClocks = (this.timer1Enabled && this.timer1CountUp);
}
GameBoyAdvanceTimer.prototype.preprocessTimer2 = function () {
    this.timer2UseMainClocks = (this.timer2Enabled && !this.timer2CountUp);
    this.timer2UseChainedClocks = (this.timer2Enabled && this.timer2CountUp);
}
GameBoyAdvanceTimer.prototype.preprocessTimer3 = function () {
    this.timer3UseMainClocks = (this.timer3Enabled && !this.timer3CountUp);
    this.timer3UseChainedClocks = (this.timer3Enabled && this.timer3CountUp);
}
GameBoyAdvanceTimer.prototype.nextTimer0Overflow = function (numOverflows) {
    --numOverflows;
    if (this.timer0Enabled) {
        return (((0x10000 - this.timer0Counter) * this.timer0Prescalar) - this.timer0Precounter) + (((0x10000 - this.timer0Reload) * this.timer0Prescalar) * numOverflows);
    }
    return -1;
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceTimer.prototype.nextTimer0OverflowSingle = function () {
        var eventTime = -1;
        if (this.timer0Enabled) {
            eventTime = (Math.imul((0x10000 - (this.timer0Counter | 0)), this.timer0Prescalar | 0) - (this.timer0Precounter | 0)) | 0;
        }
        return eventTime | 0;
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceTimer.prototype.nextTimer0OverflowSingle = function () {
        if (this.timer0Enabled) {
            return ((0x10000 - this.timer0Counter) * this.timer0Prescalar) - this.timer0Precounter;
        }
        return -1;
    }
}
GameBoyAdvanceTimer.prototype.nextTimer1Overflow = function (numOverflows) {
    --numOverflows;
    if (this.timer1Enabled) {
        if (this.timer1CountUp) {
            return this.nextTimer0Overflow(0x10000 - this.timer1Counter + (numOverflows * (0x10000 - this.timer1Reload)));
        }
        else {
            return (((0x10000 - this.timer1Counter) * this.timer1Prescalar) - this.timer1Precounter) + (((0x10000 - this.timer1Reload) * this.timer1Prescalar) * numOverflows);
        }
    }
    return -1;
}
GameBoyAdvanceTimer.prototype.nextTimer1OverflowSingle = function () {
    if (this.timer1Enabled) {
        if (this.timer1CountUp) {
            return this.nextTimer0Overflow(0x10000 - this.timer1Counter);
        }
        else {
            return (((0x10000 - this.timer1Counter) * this.timer1Prescalar) - this.timer1Precounter);
        }
    }
    return -1;
}
GameBoyAdvanceTimer.prototype.nextTimer2Overflow = function (numOverflows) {
    --numOverflows;
    if (this.timer2Enabled) {
        if (this.timer2CountUp) {
            return this.nextTimer1Overflow(0x10000 - this.timer2Counter + (numOverflows * (0x10000 - this.timer2Reload)));
        }
        else {
            return (((0x10000 - this.timer2Counter) * this.timer2Prescalar) - this.timer2Precounter) + (((0x10000 - this.timer2Reload) * this.timer2Prescalar) * numOverflows);
        }
    }
    return -1;
}
GameBoyAdvanceTimer.prototype.nextTimer2OverflowSingle = function () {
    if (this.timer2Enabled) {
        if (this.timer2CountUp) {
            return this.nextTimer1Overflow(0x10000 - this.timer2Counter);
        }
        else {
            return (((0x10000 - this.timer2Counter) * this.timer2Prescalar) - this.timer2Precounter);
        }
    }
    return -1;
}
GameBoyAdvanceTimer.prototype.nextTimer3OverflowSingle = function () {
    if (this.timer3Enabled) {
        if (this.timer3CountUp) {
            return this.nextTimer2Overflow(0x10000 - this.timer3Counter);
        }
        else {
            return (((0x10000 - this.timer3Counter) * this.timer3Prescalar) - this.timer3Precounter);
        }
    }
    return -1;
}
GameBoyAdvanceTimer.prototype.nextAudioTimerOverflow = function () {
    var timer0 = this.nextTimer0OverflowSingle() | 0;
    if ((timer0 | 0) == -1) {
        //Negative numbers are our "no event" code:
        timer0 = 0x7FFFFFFF;
    }
    var timer1 = this.nextTimer1OverflowSingle();
    if (timer1 == -1) {
        //Negative numbers are our "no event" code:
        timer1 = 0x7FFFFFFF;
    }
    //Have to clamp to prevent integer overflow bugs:
    return Math.min(timer0 | 0, timer1, 0x7FFFFFFF) | 0;
}
GameBoyAdvanceTimer.prototype.nextTimer0IRQEventTime = function () {
    //-1 is our "no event" code:
    var clocks = -1;
    if (this.timer0Enabled && this.timer0IRQ) {
        //Timer 0 logic is not wider than 32 bits for single stepping:
        clocks = this.nextTimer0OverflowSingle() | 0;
    }
    return clocks | 0;
}
GameBoyAdvanceTimer.prototype.nextTimer1IRQEventTime = function () {
    //-1 is our "no event" code:
    var clocks = -1;
    if (this.timer1Enabled && this.timer1IRQ) {
        //Have to clamp to prevent integer overflow bugs:
        //In addition, timer 1 logic can be wider than 32 bits:
        clocks = Math.max(Math.min(this.nextTimer1OverflowSingle(), 0x7FFFFFFF), -1) | 0;
    }
    return clocks | 0;
}
GameBoyAdvanceTimer.prototype.nextTimer2IRQEventTime = function () {
    //-1 is our "no event" code:
    var clocks = -1;
    if (this.timer2Enabled && this.timer2IRQ) {
        //Have to clamp to prevent integer overflow bugs:
        //In addition, timer 2 logic can be wider than 32 bits:
        clocks = Math.max(Math.min(this.nextTimer2OverflowSingle(), 0x7FFFFFFF), -1) | 0;
    }
    return clocks | 0;
}
GameBoyAdvanceTimer.prototype.nextTimer3IRQEventTime = function () {
    //-1 is our "no event" code:
    var clocks = -1;
    if (this.timer3Enabled && this.timer3IRQ) {
        //Have to clamp to prevent integer overflow bugs:
        //In addition, timer 3 logic can be wider than 32 bits:
        clocks = Math.max(Math.min(this.nextTimer3OverflowSingle(), 0x7FFFFFFF), -1) | 0;
    }
    return clocks | 0;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceWait(IOCore) {
    this.IOCore = IOCore;
    this.memory = this.IOCore.memory;
    this.initialize();
}
GameBoyAdvanceWait.prototype.GAMEPAKWaitStateTable = [
    5, 4, 3, 9
];
GameBoyAdvanceWait.prototype.initialize = function () {
    this.WRAMConfiguration = 0xD000020;     //WRAM configuration control register current data.
    this.WRAMWaitState = 3;                 //External WRAM wait state.
    this.SRAMWaitState = 5;                 //SRAM wait state.
    this.nonSequential = 0x100;             //Non-sequential access bit-flag.
    this.nonSequentialROM = 0;              //Non-sequential access bit-flag for ROM prebuffer bug emulation.
    this.nonSequentialPrebuffer = 0x100;    //Non-sequential access bit-flag for ROM prebuffer emulation.
    this.romPrebufferContinued = 0x100;     //Non-sequential access bit-flag for ROM prebuffer emulation.
    this.ROMPrebuffer = 0;                  //Tracking of the size of the prebuffer cache.
    this.prebufferClocks = 0;               //Tracking clocks for prebuffer cache.
    this.WAITCNT0 = 0;                      //WAITCNT0 control register data.
    this.WAITCNT1 = 0;                      //WAITCNT1 control register data.
    this.POSTBOOT = 0;                      //POSTBOOT control register data.
    //Create the wait state address translation cache:
    this.waitStateClocks = getUint8Array(0x200);
    this.waitStateClocksFull = getUint8Array(0x200);
    //Wait State 0:
    //Non-Synchronous:
    this.waitStateClocks[0x108] = 5;
    this.waitStateClocks[0x109] = 5;
    //Synchronous:
    this.waitStateClocks[0x8] = 3;
    this.waitStateClocks[0x9] = 3;
    //Non-Synchronous Full:
    this.waitStateClocksFull[0x108] = 8;
    this.waitStateClocksFull[0x109] = 8;
    //Synchronous Full:
    this.waitStateClocksFull[0x8] = 6;
    this.waitStateClocksFull[0x9] = 6;
    //Wait State 1:
    //Non-Synchronous:
    this.waitStateClocks[0x10A] = 5;
    this.waitStateClocks[0x10B] = 5;
    //Synchronous:
    this.waitStateClocks[0xA] = 3;
    this.waitStateClocks[0xB] = 3;
    //Non-Synchronous Full:
    this.waitStateClocksFull[0x10A] = 8;
    this.waitStateClocksFull[0x10B] = 8;
    //Synchronous Full:
    this.waitStateClocksFull[0xA] = 6;
    this.waitStateClocksFull[0xB] = 6;
    //Wait State 2:
    //Non-Synchronous:
    this.waitStateClocks[0x10C] = 5;
    this.waitStateClocks[0x10D] = 5;
    //Synchronous:
    this.waitStateClocks[0xC] = 3;
    this.waitStateClocks[0xD] = 3;
    //Non-Synchronous Full:
    this.waitStateClocksFull[0x10C] = 8;
    this.waitStateClocksFull[0x10D] = 8;
    //Synchronous Full:
    this.waitStateClocksFull[0xC] = 6;
    this.waitStateClocksFull[0xD] = 6;
    //Initialize out some dynamic references:
    this.getROMRead16 = this.getROMRead16NoPrefetch;
    this.getROMRead32 = this.getROMRead32NoPrefetch;
    this.CPUInternalCyclePrefetch = this.CPUInternalCycleNoPrefetch;
    this.CPUInternalSingleCyclePrefetch = this.CPUInternalSingleCycleNoPrefetch;
}
GameBoyAdvanceWait.prototype.writeWAITCNT0 = function (data) {
    data = data | 0;
    this.SRAMWaitState = this.GAMEPAKWaitStateTable[data & 0x3] | 0;
    this.waitStateClocks[0x108] = this.waitStateClocks[0x109] = this.GAMEPAKWaitStateTable[(data >> 2) & 0x3] | 0;
    this.waitStateClocks[0x8] = this.waitStateClocks[0x9] =  ((data & 0x10) == 0x10) ? 0x2 : 0x3;
    this.waitStateClocksFull[0x8] = this.waitStateClocksFull[0x9] = ((((this.waitStateClocks[0x8] | 0) - 1) << 1) + 1) | 0;
    this.waitStateClocks[0x10A] = this.waitStateClocks[0x10B] = this.GAMEPAKWaitStateTable[(data >> 5) & 0x3] | 0;
    this.waitStateClocks[0xA] = this.waitStateClocks[0xB] =  (data > 0x7F) ? 0x2 : 0x5;
    this.waitStateClocksFull[0xA] = this.waitStateClocksFull[0xB] = ((((this.waitStateClocks[0xA] | 0) - 1) << 1) + 1) | 0;
    this.waitStateClocksFull[0x108] = this.waitStateClocksFull[0x109] = ((this.waitStateClocks[0x108] | 0) + (this.waitStateClocks[0x8] | 0) - 1) | 0;
    this.waitStateClocksFull[0x10A] = this.waitStateClocksFull[0x10B] = ((this.waitStateClocks[0x10A] | 0) + (this.waitStateClocks[0xA] | 0) - 1) | 0;
    this.WAITCNT0 = data | 0;
}
GameBoyAdvanceWait.prototype.readWAITCNT0 = function () {
    return this.WAITCNT0 | 0;
}
GameBoyAdvanceWait.prototype.writeWAITCNT1 = function (data) {
    data = data | 0;
    this.waitStateClocks[0x10C] = this.waitStateClocks[0x10D] = this.GAMEPAKWaitStateTable[data & 0x3] | 0;
    this.waitStateClocks[0xC] = this.waitStateClocks[0xD] =  ((data & 0x4) == 0x4) ? 0x2 : 0x9;
    this.waitStateClocksFull[0xC] = this.waitStateClocksFull[0xD] = ((((this.waitStateClocks[0xC] | 0) - 1) << 1) + 1) | 0;
    this.waitStateClocksFull[0x10C] = this.waitStateClocksFull[0x10D] = ((this.waitStateClocks[0x10C] | 0) + (this.waitStateClocks[0xC] | 0) - 1) | 0;
    if ((data & 0x40) == 0) {
        this.ROMPrebuffer = 0;
        this.prebufferClocks = 0;
        this.getROMRead16 = this.getROMRead16NoPrefetch;
        this.getROMRead32 = this.getROMRead32NoPrefetch;
        this.CPUInternalCyclePrefetch = this.CPUInternalCycleNoPrefetch;
        this.CPUInternalSingleCyclePrefetch = this.CPUInternalSingleCycleNoPrefetch;
    }
    else {
        this.getROMRead16 = this.getROMRead16Prefetch;
        this.getROMRead32 = this.getROMRead32Prefetch;
        this.CPUInternalCyclePrefetch = this.prefetchActiveCheck;
        this.CPUInternalSingleCyclePrefetch = this.singleClock;
        this.nonSequentialROM = 0;
        this.nonSequentialPrebuffer = 0x100;
        this.romPrebufferContinued = 0x100;
    }
    this.WAITCNT1 = data & 0x5F;
}
GameBoyAdvanceWait.prototype.readWAITCNT1 = function () {
    return this.WAITCNT1 | 0;
}
GameBoyAdvanceWait.prototype.writePOSTBOOT = function (data) {
    this.POSTBOOT = data | 0;
}
GameBoyAdvanceWait.prototype.readPOSTBOOT = function () {
    return this.POSTBOOT | 0;
}
GameBoyAdvanceWait.prototype.writeHALTCNT = function (data) {
    data = data | 0;
    //HALT/STOP mode entrance:
    if ((data & 0x80) == 0) {
        //Halt:
        this.IOCore.flagHalt();
    }
    else {
        //Stop:
        this.IOCore.flagStop();
    }
}
GameBoyAdvanceWait.prototype.writeConfigureWRAM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    switch (address & 0x3) {
        case 0:
            this.memory.remapWRAM(data & 0x21);
            this.WRAMConfiguration = (this.WRAMConfiguration & 0xFFFFFF00) | data;
            break;
        case 1:
            this.WRAMConfiguration = (this.WRAMConfiguration & 0xFFFF00FF) | (data << 8);
            break;
        case 2:
            this.WRAMConfiguration = (this.WRAMConfiguration & 0xFF00FFFF) | (data << 16);
            break;
        default:
            this.WRAMWaitState = (0x10 - (data & 0xF)) | 0;
            this.WRAMConfiguration = (this.WRAMConfiguration & 0xFFFFFF) | (data << 24);
    }
}
GameBoyAdvanceWait.prototype.writeConfigureWRAM16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((address & 0x2) == 0) {
        this.WRAMConfiguration = (this.WRAMConfiguration & 0xFFFF0000) | (data & 0xFFFF);
        this.memory.remapWRAM(data & 0x21);
    }
    else {
        this.WRAMConfiguration = (data << 16) | (this.WRAMConfiguration & 0xFFFF);
        this.WRAMWaitState = (0x10 - ((data >> 8) & 0xF)) | 0;
    }
}
GameBoyAdvanceWait.prototype.writeConfigureWRAM32 = function (data) {
    data = data | 0;
    this.WRAMConfiguration = data | 0;
    this.WRAMWaitState = (0x10 - ((data >> 24) & 0xF)) | 0;
    this.memory.remapWRAM(data & 0x21);
}
GameBoyAdvanceWait.prototype.readConfigureWRAM8 = function (address) {
    address = address | 0;
    var data = 0;
    switch (address & 0x3) {
        case 0:
            data = this.WRAMConfiguration & 0x2F;
            break;
        case 3:
            data = this.WRAMConfiguration >>> 24;
    }
    return data | 0;
}
GameBoyAdvanceWait.prototype.readConfigureWRAM16 = function (address) {
    address = address | 0;
    var data = 0;
    if ((address & 0x2) == 0) {
        data = this.WRAMConfiguration & 0x2F;
    }
    else {
        data = (this.WRAMConfiguration >> 16) & 0xFF00;
    }
    return data | 0;
}
GameBoyAdvanceWait.prototype.readConfigureWRAM32 = function () {
    return this.WRAMConfiguration & 0xFF00002F;
}
GameBoyAdvanceWait.prototype.CPUInternalCycleNoPrefetch = function (clocks) {
    clocks = clocks | 0;
    //Clock for idle CPU time:
    this.IOCore.updateCore(clocks | 0);
    //Prebuffer bug:
    this.checkPrebufferBug();
}
GameBoyAdvanceWait.prototype.CPUInternalSingleCycleNoPrefetch = function () {
    //Clock for idle CPU time:
    this.IOCore.updateCoreSingle();
    //Not enough time for prebuffer buffering, so skip it.
    //Prebuffer bug:
    this.checkPrebufferBug();
}
GameBoyAdvanceWait.prototype.checkPrebufferBug = function () {
    //Issue a non-sequential cycle for the next read if we did an I-cycle:
    var address = this.IOCore.cpu.registers[15] | 0;
    if ((address | 0) >= 0x8000000 && (address | 0) < 0xE000000) {
        this.nonSequentialROM = 0x100;
    }
}
GameBoyAdvanceWait.prototype.check128kAlignmentBug = function (address) {
    address = address | 0;
    if ((address & 0x1FFFF) == 0) {
        this.NonSequentialBroadcast();
    }
}
GameBoyAdvanceWait.prototype.prefetchROMInRAM = function (address) {
    address = address | 0;
    while ((this.prebufferClocks | 0) >= (this.waitStateClocks[address | this.nonSequentialPrebuffer] | 0)) {
        if ((this.ROMPrebuffer | 0) == 8) {
            this.prebufferClocks = 0;
            break;
        }
        else {
            this.prebufferClocks = ((this.prebufferClocks | 0) - (this.waitStateClocks[address | this.nonSequentialPrebuffer] | 0)) | 0;
            this.ROMPrebuffer = ((this.ROMPrebuffer | 0) + 1) | 0;
            this.romPrebufferContinued = 0;
            this.nonSequentialPrebuffer = 0;
            this.nonSequential = 0;
        }
    }
}
GameBoyAdvanceWait.prototype.prefetchActiveCheck = function (clocks) {
    clocks = clocks | 0;
    this.IOCore.updateCore(clocks | 0);
    var address = this.IOCore.cpu.registers[15] | 0;
    if ((address | 0) >= 0x8000000 && (address | 0) < 0xE000000 && (this.prebufferClocks | 0) < 0xFF) {
        this.prebufferClocks = ((this.prebufferClocks | 0) + (clocks | 0)) | 0;
    }
    else {
        this.ROMPrebuffer = 0;
        this.prebufferClocks = 0;
    }
}
GameBoyAdvanceWait.prototype.singleClock = function () {
    this.IOCore.updateCoreSingle();
    var address = this.IOCore.cpu.registers[15] | 0;
    if ((address | 0) >= 0x8000000 && (address | 0) < 0xE000000 && (this.prebufferClocks | 0) < 0xFF) {
        this.prebufferClocks = ((this.prebufferClocks | 0) + 1) | 0;
    }
    else {
        this.ROMPrebuffer = 0;
        this.prebufferClocks = 0;
    }
}
GameBoyAdvanceWait.prototype.prefetchActiveCheck2 = function () {
    this.IOCore.updateCoreTwice();
    var address = this.IOCore.cpu.registers[15] | 0;
    if ((address | 0) >= 0x8000000 && (address | 0) < 0xE000000 && (this.prebufferClocks | 0) < 0xFF) {
        this.prebufferClocks = ((this.prebufferClocks | 0) + 2) | 0;
    }
    else {
        this.ROMPrebuffer = 0;
        this.prebufferClocks = 0;
    }
}
GameBoyAdvanceWait.prototype.doZeroWait16 = function () {
    //Check for ROM prefetching:
    //We were already in ROM, so if prefetch do so as sequential:
    //Only case for non-sequential ROM prefetch is invalid anyways:
    this.ROMPrebuffer = ((this.ROMPrebuffer | 0) - 1) | 0;
    //Clock for fetch time:
    this.IOCore.updateCoreSingle();
    if ((this.prebufferClocks | 0) < 0xFF) {
        this.prebufferClocks = ((this.prebufferClocks | 0) + 1) | 0;
    }
}
GameBoyAdvanceWait.prototype.doZeroWait32 = function () {
    //Check for ROM prefetching:
    //We were already in ROM, so if prefetch do so as sequential:
    //Only case for non-sequential ROM prefetch is invalid anyways:
    this.ROMPrebuffer = ((this.ROMPrebuffer | 0) - 2) | 0;
    //Clock for fetch time:
    this.IOCore.updateCoreSingle();
    if ((this.prebufferClocks | 0) < 0xFF) {
        this.prebufferClocks = ((this.prebufferClocks | 0) + 1) | 0;
    }
}
GameBoyAdvanceWait.prototype.getROMRead16Prefetch = function (address) {
    //Caching enabled:
    address = address | 0;
    this.prefetchROMInRAM(address | 0);
    if ((this.ROMPrebuffer | 0) > 0) {
        //Cache hit:
        this.doZeroWait16();
    }
    else {
        //Cache is empty:
        this.IOCore.updateCore(((this.waitStateClocks[address | this.nonSequentialPrebuffer] | 0) - (this.prebufferClocks | 0)) | 0);
        this.romPrebufferContinued = 0;
        this.prebufferClocks = 0;
        this.nonSequential = 0;
        this.nonSequentialPrebuffer = 0;
    }
}
GameBoyAdvanceWait.prototype.getROMRead16NoPrefetch = function (address) {
    //Caching disabled:
    address = address | 0;
    this.IOCore.updateCore(this.waitStateClocks[address | this.nonSequential | this.nonSequentialROM] | 0);
    this.prebufferClocks = 0;
    this.nonSequentialROM = 0;
    this.nonSequential = 0;
}
GameBoyAdvanceWait.prototype.getROMRead32Prefetch = function (address) {
    //Caching enabled:
    address = address | 0;
    this.prefetchROMInRAM(address | 0);
    switch (this.ROMPrebuffer | 0) {
        case 0:
            //Cache miss:
            this.IOCore.updateCore(((this.waitStateClocksFull[address | this.nonSequentialPrebuffer] | 0) - (this.prebufferClocks | 0)) | 0);
            this.romPrebufferContinued = 0;
            this.prebufferClocks = 0;
            this.nonSequential = 0;
            this.nonSequentialPrebuffer = 0;
            break;
        case 1:
            //Partial miss if only 16 bits out of 32 bits stored:
            this.IOCore.updateCore(((this.waitStateClocks[address & 0xFF] | 0) - (this.prebufferClocks | 0)) | 0);
            this.prebufferClocks = 0;
            this.ROMPrebuffer = 0;
            break;
        default:
            //Cache hit:
            this.doZeroWait32();
    }
}
GameBoyAdvanceWait.prototype.getROMRead32NoPrefetch = function (address) {
    //Caching disabled:
    address = address | 0;
    this.IOCore.updateCore(this.waitStateClocksFull[address | this.nonSequential | this.nonSequentialROM] | 0);
    this.prebufferClocks = 0;
    this.nonSequentialROM = 0;
    this.nonSequential = 0;
}
GameBoyAdvanceWait.prototype.NonSequentialBroadcast = function () {
    this.nonSequential = 0x100;
    this.nonSequentialPrebuffer = 0x100 & this.romPrebufferContinued;
}
GameBoyAdvanceWait.prototype.NonSequentialBroadcastClear = function () {
    this.ROMPrebuffer = 0;
    this.prebufferClocks = 0;
    this.nonSequential = 0x100;
    this.nonSequentialPrebuffer = 0x100;
    this.romPrebufferContinued = 0x100;
}
GameBoyAdvanceWait.prototype.WRAMAccess = function () {
    this.prefetchActiveCheck(this.WRAMWaitState | 0);
}
GameBoyAdvanceWait.prototype.WRAMAccess16CPU = function () {
    this.IOCore.updateCore(this.WRAMWaitState | 0);
}
GameBoyAdvanceWait.prototype.WRAMAccess32 = function () {
    this.prefetchActiveCheck(this.WRAMWaitState << 1);
}
GameBoyAdvanceWait.prototype.WRAMAccess32CPU = function () {
    this.IOCore.updateCore(this.WRAMWaitState << 1);
}
GameBoyAdvanceWait.prototype.ROMAccess = function (address) {
    address = address | 0;
    this.check128kAlignmentBug(address | 0);
    this.IOCore.updateCore(this.waitStateClocks[(address >> 24) | this.nonSequential] | 0);
    this.nonSequential = 0;
    this.romPrebufferContinued = 0x100;
    this.nonSequentialPrebuffer = 0x100;
}
GameBoyAdvanceWait.prototype.ROMAccess16CPU = function (address) {
    address = address | 0;
    this.check128kAlignmentBug(address | 0);
    this.getROMRead16(address >> 24);
}
GameBoyAdvanceWait.prototype.ROMAccess32 = function (address) {
    address = address | 0;
    this.check128kAlignmentBug(address | 0);
    this.IOCore.updateCore(this.waitStateClocksFull[(address >> 24) | this.nonSequential] | 0);
    this.nonSequential = 0;
    this.romPrebufferContinued = 0x100;
    this.nonSequentialPrebuffer = 0x100;
}
GameBoyAdvanceWait.prototype.ROMAccess32CPU = function (address) {
    address = address | 0;
    this.check128kAlignmentBug(address | 0);
    this.getROMRead32(address >> 24);
}
GameBoyAdvanceWait.prototype.SRAMAccess = function () {
    this.prefetchActiveCheck(this.SRAMWaitState | 0);
}
GameBoyAdvanceWait.prototype.SRAMAccessCPU = function () {
    this.IOCore.updateCore(this.SRAMWaitState | 0);
}
GameBoyAdvanceWait.prototype.VRAMAccess = function () {
    if (!this.IOCore.gfx.isRendering) {
        this.singleClock();
    }
    else {
        this.prefetchActiveCheck2();
    }
}
GameBoyAdvanceWait.prototype.VRAMAccess16CPU = function () {
    if (!this.IOCore.gfx.isRendering) {
        this.IOCore.updateCoreSingle();
    }
    else {
        this.IOCore.updateCoreTwice();
    }
}
GameBoyAdvanceWait.prototype.VRAMAccess32 = function () {
    if (!this.IOCore.gfx.isRendering) {
        this.prefetchActiveCheck2();
    }
    else {
        this.prefetchActiveCheck(4);
    }
}
GameBoyAdvanceWait.prototype.VRAMAccess32CPU = function () {
    if (!this.IOCore.gfx.isRendering) {
        this.IOCore.updateCoreTwice();
    }
    else {
        this.IOCore.updateCore(4);
    }
}
GameBoyAdvanceWait.prototype.OAMAccess = function () {
    if (!this.IOCore.gfx.isOAMRendering) {
        this.singleClock();
    }
    else {
        this.prefetchActiveCheck2();
    }
}
GameBoyAdvanceWait.prototype.OAMAccessCPU = function () {
    if (!this.IOCore.gfx.isOAMRendering) {
        this.IOCore.updateCoreSingle();
    }
    else {
        this.IOCore.updateCoreTwice();
    }
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceCPU(IOCore) {
    this.IOCore = IOCore;
    this.memory = this.IOCore.memory;
    this.settings = this.IOCore.settings;
    this.wait = this.IOCore.wait;
    this.mul64ResultHigh = 0;    //Scratch MUL64.
    this.mul64ResultLow = 0;    //Scratch MUL64.
    this.initialize();
}
GameBoyAdvanceCPU.prototype.initialize = function () {
    this.initializeRegisters();
    this.ARM = new ARMInstructionSet(this);
    this.THUMB = new THUMBInstructionSet(this);
    this.swi = new GameBoyAdvanceSWI(this);
}
GameBoyAdvanceCPU.prototype.initializeRegisters = function () {
    /*
        R0-R7 Are known as the low registers.
        R8-R12 Are the high registers.
        R13 is the stack pointer.
        R14 is the link register.
        R15 is the program counter.
        CPSR is the program status register.
        SPSR is the saved program status register.
    */
    //Normal R0-R15 Registers:
    this.registers = getInt32Array(16);
    //Used to copy back the R8-R14 state for normal operations:
    this.registersUSR = getInt32Array(7);
    //Fast IRQ mode registers (R8-R14):
    this.registersFIQ = getInt32Array(7);
    //Supervisor mode registers (R13-R14):
    this.registersSVC = getInt32Array(2);
    //Abort mode registers (R13-R14):
    this.registersABT = getInt32Array(2);
    //IRQ mode registers (R13-R14):
    this.registersIRQ = getInt32Array(2);
    //Undefined mode registers (R13-R14):
    this.registersUND = getInt32Array(2);
    //CPSR Register:
    this.branchFlags = new ARMCPSRAttributeTable();
    this.modeFlags = 0xD3;
    //Banked SPSR Registers:
    this.SPSR = getUint16Array(5);
    this.SPSR[0] = 0xD3; //FIQ
    this.SPSR[1] = 0xD3; //IRQ
    this.SPSR[2] = 0xD3; //Supervisor
    this.SPSR[3] = 0xD3; //Abort
    this.SPSR[4] = 0xD3; //Undefined
    this.triggeredIRQ = false;        //Pending IRQ found.
    //Pre-initialize stack pointers if no BIOS loaded:
    if (!this.IOCore.BIOSFound || this.IOCore.settings.SKIPBoot) {
        this.HLEReset();
    }
    //Start in fully bubbled pipeline mode:
    this.IOCore.flagBubble();
}
GameBoyAdvanceCPU.prototype.HLEReset = function () {
    this.registersSVC[0] = 0x3007FE0;
    this.registersIRQ[0] = 0x3007FA0;
    this.registers[13] = 0x3007F00;
    this.registers[15] = 0x8000000;
    this.modeFlags = this.modeFlags | 0x1f;
}
GameBoyAdvanceCPU.prototype.branch = function (branchTo) {
    branchTo = branchTo | 0;
    if ((branchTo | 0) > 0x3FFF || this.IOCore.BIOSFound) {
        //Branch to new address:
        this.registers[15] = branchTo | 0;
        //Mark pipeline as invalid:
        this.IOCore.flagBubble();
        //Next PC fetch has to update the address bus:
        this.wait.NonSequentialBroadcastClear();
    }
    else {
        //We're branching into BIOS, handle specially:
        if ((branchTo | 0) == 0x130) {
            //IRQ mode exit handling:
            //ROM IRQ handling returns back from its own subroutine back to BIOS at this address.
            this.HLEIRQExit();
        }
        else {
            //Reset to start of ROM if no BIOS ROM found:
            this.HLEReset();
        }
    }
}
GameBoyAdvanceCPU.prototype.triggerIRQ = function (didFire) {
    this.triggeredIRQ = didFire;
    this.assertIRQ();
}
GameBoyAdvanceCPU.prototype.assertIRQ = function () {
    if (this.triggeredIRQ && (this.modeFlags & 0x80) == 0) {
        this.IOCore.flagIRQ();
    }
}
GameBoyAdvanceCPU.prototype.getCurrentFetchValue = function () {
    if ((this.modeFlags & 0x20) != 0) {
        return this.THUMB.getCurrentFetchValue() | 0;
    }
    else {
        return this.ARM.getCurrentFetchValue() | 0;
    }
}
GameBoyAdvanceCPU.prototype.enterARM = function () {
    this.modeFlags = this.modeFlags & 0xdf;
    this.THUMBBitModify(false);
}
GameBoyAdvanceCPU.prototype.enterTHUMB = function () {
    this.modeFlags = this.modeFlags | 0x20;
    this.THUMBBitModify(true);
}
GameBoyAdvanceCPU.prototype.getLR = function () {
    //Get the previous instruction address:
    if ((this.modeFlags & 0x20) != 0) {
        return this.THUMB.getLR() | 0;
    }
    else {
        return this.ARM.getLR() | 0;
    }
}
GameBoyAdvanceCPU.prototype.THUMBBitModify = function (isThumb) {
    if (isThumb) {
        this.IOCore.flagTHUMB();
    }
    else {
        this.IOCore.deflagTHUMB();
    }
}
GameBoyAdvanceCPU.prototype.IRQinARM = function () {
    //Mode bits are set to IRQ:
    this.switchMode(0x12);
    //Save link register:
    this.registers[14] = this.ARM.getIRQLR() | 0;
    //Disable IRQ:
    this.modeFlags = this.modeFlags | 0x80;
    if (this.IOCore.BIOSFound) {
        //IRQ exception vector:
        this.branch(0x18);
    }
    else {
        //HLE the IRQ entrance:
        this.HLEIRQEnter();
    }
    //Deflag IRQ from state:
    this.IOCore.deflagIRQ();
}
GameBoyAdvanceCPU.prototype.IRQinTHUMB = function () {
    //Mode bits are set to IRQ:
    this.switchMode(0x12);
    //Save link register:
    this.registers[14] = this.THUMB.getIRQLR() | 0;
    //Disable IRQ:
    this.modeFlags = this.modeFlags | 0x80;
    //Exception always enter ARM mode:
    this.enterARM();
    if (this.IOCore.BIOSFound) {
        //IRQ exception vector:
        this.branch(0x18);
    }
    else {
        //HLE the IRQ entrance:
        this.HLEIRQEnter();
    }
    //Deflag IRQ from state:
    this.IOCore.deflagIRQ();
}
GameBoyAdvanceCPU.prototype.HLEIRQEnter = function () {
    //Get the base address:
    var currentAddress = this.registers[0xD] | 0;
    //Updating the address bus away from PC fetch:
    this.wait.NonSequentialBroadcast();
    //Push register(s) into memory:
    for (var rListPosition = 0xF; (rListPosition | 0) > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((0x500F & (1 << (rListPosition | 0))) != 0) {
                //Push a register into memory:
                currentAddress = ((currentAddress | 0) - 4) | 0;
                this.memory.memoryWrite32(currentAddress | 0, this.registers[rListPosition | 0] | 0);
            }
    }
    //Store the updated base address back into register:
    this.registers[0xD] = currentAddress | 0;
    //Updating the address bus back to PC fetch:
    this.wait.NonSequentialBroadcast();
    this.registers[0] = 0x4000000;
    //Save link register:
    this.registers[14] = 0x130;
    //Skip BIOS ROM processing:
    this.branch(this.read32(0x3FFFFFC) & -0x4);
}
GameBoyAdvanceCPU.prototype.HLEIRQExit = function () {
    //Get the base address:
    var currentAddress = this.registers[0xD] | 0;
    //Updating the address bus away from PC fetch:
    this.wait.NonSequentialBroadcast();
    //Load register(s) from memory:
    for (var rListPosition = 0; (rListPosition | 0) < 0x10;  rListPosition = ((rListPosition | 0) + 1) | 0) {
        if ((0x500F & (1 << (rListPosition | 0))) != 0) {
            //Load a register from memory:
            this.registers[rListPosition & 0xF] = this.memory.memoryRead32(currentAddress | 0) | 0;
            currentAddress = ((currentAddress | 0) + 4) | 0;
        }
    }
    //Store the updated base address back into register:
    this.registers[0xD] = currentAddress | 0;
    //Updating the address bus back to PC fetch:
    this.wait.NonSequentialBroadcast();
    //Return from an exception mode:
    var data = this.branchFlags.setSUBFlags(this.registers[0xE] | 0, 4) | 0;
    //Restore SPSR to CPSR:
    data = data & (-4 >> (this.SPSRtoCPSR() >> 5));
    //We performed a branch:
    this.branch(data | 0);
}
GameBoyAdvanceCPU.prototype.SWI = function () {
    if (this.IOCore.BIOSFound) {
        //Mode bits are set to SWI:
        this.switchMode(0x13);
        //Save link register:
        this.registers[14] = this.getLR() | 0;
        //Disable IRQ:
        this.modeFlags = this.modeFlags | 0x80;
        //Exception always enter ARM mode:
        this.enterARM();
        //SWI exception vector:
        this.branch(0x8);
    }
    else {
        if ((this.modeFlags & 0x20) != 0) {
            this.THUMB.incrementProgramCounter();
            //HLE the SWI command:
            this.swi.execute(this.THUMB.getSWICode() | 0);
        }
        else {
            this.ARM.incrementProgramCounter();
            //HLE the SWI command:
            this.swi.execute(this.ARM.getSWICode() | 0);
        }
    }
}
GameBoyAdvanceCPU.prototype.UNDEFINED = function () {
    //Only process undefined instruction if BIOS loaded:
    if (this.IOCore.BIOSFound) {
        //Mode bits are set to SWI:
        this.switchMode(0x1B);
        //Save link register:
        this.registers[14] = this.getLR() | 0;
        //Disable IRQ:
        this.modeFlags = this.modeFlags | 0x80;
        //Exception always enter ARM mode:
        this.enterARM();
        //Undefined exception vector:
        this.branch(0x4);
    }
    else {
        //Pretend we didn't execute the bad instruction then:
        if ((this.modeFlags & 0x20) != 0) {
            this.THUMB.incrementProgramCounter();
        }
        else {
            this.ARM.incrementProgramCounter();
        }
    }
}
GameBoyAdvanceCPU.prototype.SPSRtoCPSR = function () {
    //Used for leaving an exception and returning to the previous state:
    var bank = 1;
    switch (this.modeFlags & 0x1f) {
        case 0x12:    //IRQ
            break;
        case 0x13:    //Supervisor
            bank = 2;
            break;
        case 0x11:    //FIQ
            bank = 0;
            break;
        case 0x17:    //Abort
            bank = 3;
            break;
        case 0x1B:    //Undefined
            bank = 4;
            break;
        default:      //User & system lacks SPSR
            return this.modeFlags & 0x20;
    }
    var spsr = this.SPSR[bank | 0] | 0;
    this.branchFlags.setNZCV(spsr << 20);
    this.switchRegisterBank(spsr & 0x1F);
    this.modeFlags = spsr & 0xFF;
    this.assertIRQ();
    this.THUMBBitModify((spsr & 0x20) != 0);
    return spsr & 0x20;
}
GameBoyAdvanceCPU.prototype.switchMode = function (newMode) {
    newMode = newMode | 0;
    this.CPSRtoSPSR(newMode | 0);
    this.switchRegisterBank(newMode | 0);
    this.modeFlags = (this.modeFlags & 0xe0) | (newMode | 0);
}
GameBoyAdvanceCPU.prototype.CPSRtoSPSR = function (newMode) {
    //Used for entering an exception and saving the previous state:
    var spsr = this.modeFlags & 0xFF;
    spsr = spsr | (this.branchFlags.getNZCV() >> 20);
    switch (newMode | 0) {
        case 0x12:    //IRQ
            this.SPSR[1] = spsr | 0;
            break;
        case 0x13:    //Supervisor
            this.SPSR[2] = spsr | 0;
            break;
        case 0x11:    //FIQ
            this.SPSR[0] = spsr | 0;
            break;
        case 0x17:    //Abort
            this.SPSR[3] = spsr | 0;
            break;
        case 0x1B:    //Undefined
            this.SPSR[4] = spsr | 0;
    }
}
GameBoyAdvanceCPU.prototype.switchRegisterBank = function (newMode) {
    newMode = newMode | 0;
    switch (this.modeFlags & 0x1F) {
        case 0x10:
        case 0x1F:
            this.registersUSR[0] = this.registers[8] | 0;
            this.registersUSR[1] = this.registers[9] | 0;
            this.registersUSR[2] = this.registers[10] | 0;
            this.registersUSR[3] = this.registers[11] | 0;
            this.registersUSR[4] = this.registers[12] | 0;
            this.registersUSR[5] = this.registers[13] | 0;
            this.registersUSR[6] = this.registers[14] | 0;
            break;
        case 0x11:
            this.registersFIQ[0] = this.registers[8] | 0;
            this.registersFIQ[1] = this.registers[9] | 0;
            this.registersFIQ[2] = this.registers[10] | 0;
            this.registersFIQ[3] = this.registers[11] | 0;
            this.registersFIQ[4] = this.registers[12] | 0;
            this.registersFIQ[5] = this.registers[13] | 0;
            this.registersFIQ[6] = this.registers[14] | 0;
            break;
        case 0x12:
            this.registersUSR[0] = this.registers[8] | 0;
            this.registersUSR[1] = this.registers[9] | 0;
            this.registersUSR[2] = this.registers[10] | 0;
            this.registersUSR[3] = this.registers[11] | 0;
            this.registersUSR[4] = this.registers[12] | 0;
            this.registersIRQ[0] = this.registers[13] | 0;
            this.registersIRQ[1] = this.registers[14] | 0;
            break;
        case 0x13:
            this.registersUSR[0] = this.registers[8] | 0;
            this.registersUSR[1] = this.registers[9] | 0;
            this.registersUSR[2] = this.registers[10] | 0;
            this.registersUSR[3] = this.registers[11] | 0;
            this.registersUSR[4] = this.registers[12] | 0;
            this.registersSVC[0] = this.registers[13] | 0;
            this.registersSVC[1] = this.registers[14] | 0;
            break;
        case 0x17:
            this.registersUSR[0] = this.registers[8] | 0;
            this.registersUSR[1] = this.registers[9] | 0;
            this.registersUSR[2] = this.registers[10] | 0;
            this.registersUSR[3] = this.registers[11] | 0;
            this.registersUSR[4] = this.registers[12] | 0;
            this.registersABT[0] = this.registers[13] | 0;
            this.registersABT[1] = this.registers[14] | 0;
            break;
        case 0x1B:
            this.registersUSR[0] = this.registers[8] | 0;
            this.registersUSR[1] = this.registers[9] | 0;
            this.registersUSR[2] = this.registers[10] | 0;
            this.registersUSR[3] = this.registers[11] | 0;
            this.registersUSR[4] = this.registers[12] | 0;
            this.registersUND[0] = this.registers[13] | 0;
            this.registersUND[1] = this.registers[14] | 0;
    }
    switch (newMode | 0) {
        case 0x10:
        case 0x1F:
            this.registers[8] = this.registersUSR[0] | 0;
            this.registers[9] = this.registersUSR[1] | 0;
            this.registers[10] = this.registersUSR[2] | 0;
            this.registers[11] = this.registersUSR[3] | 0;
            this.registers[12] = this.registersUSR[4] | 0;
            this.registers[13] = this.registersUSR[5] | 0;
            this.registers[14] = this.registersUSR[6] | 0;
            break;
        case 0x11:
            this.registers[8] = this.registersFIQ[0] | 0;
            this.registers[9] = this.registersFIQ[1] | 0;
            this.registers[10] = this.registersFIQ[2] | 0;
            this.registers[11] = this.registersFIQ[3] | 0;
            this.registers[12] = this.registersFIQ[4] | 0;
            this.registers[13] = this.registersFIQ[5] | 0;
            this.registers[14] = this.registersFIQ[6] | 0;
            break;
        case 0x12:
            this.registers[8] = this.registersUSR[0] | 0;
            this.registers[9] = this.registersUSR[1] | 0;
            this.registers[10] = this.registersUSR[2] | 0;
            this.registers[11] = this.registersUSR[3] | 0;
            this.registers[12] = this.registersUSR[4] | 0;
            this.registers[13] = this.registersIRQ[0] | 0;
            this.registers[14] = this.registersIRQ[1] | 0;
            break;
        case 0x13:
            this.registers[8] = this.registersUSR[0] | 0;
            this.registers[9] = this.registersUSR[1] | 0;
            this.registers[10] = this.registersUSR[2] | 0;
            this.registers[11] = this.registersUSR[3] | 0;
            this.registers[12] = this.registersUSR[4] | 0;
            this.registers[13] = this.registersSVC[0] | 0;
            this.registers[14] = this.registersSVC[1] | 0;
            break;
        case 0x17:
            this.registers[8] = this.registersUSR[0] | 0;
            this.registers[9] = this.registersUSR[1] | 0;
            this.registers[10] = this.registersUSR[2] | 0;
            this.registers[11] = this.registersUSR[3] | 0;
            this.registers[12] = this.registersUSR[4] | 0;
            this.registers[13] = this.registersABT[0] | 0;
            this.registers[14] = this.registersABT[1] | 0;
            break;
        case 0x1B:
            this.registers[8] = this.registersUSR[0] | 0;
            this.registers[9] = this.registersUSR[1] | 0;
            this.registers[10] = this.registersUSR[2] | 0;
            this.registers[11] = this.registersUSR[3] | 0;
            this.registers[12] = this.registersUSR[4] | 0;
            this.registers[13] = this.registersUND[0] | 0;
            this.registers[14] = this.registersUND[1] | 0;
    }
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceCPU.prototype.calculateMUL32 = Math.imul;
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceCPU.prototype.calculateMUL32 = function (rs, rd) {
        rs = rs | 0;
        rd = rd | 0;
        /*
         We have to split up the 32 bit multiplication,
         as JavaScript does multiplication on the FPU
         as double floats, which drops the low bits
         rather than the high bits.
         */
        var lowMul = (rs & 0xFFFF) * rd;
        var highMul = (rs >> 16) * rd;
        //Cut off bits above bit 31 and return with proper sign:
        return ((highMul << 16) + lowMul) | 0;
    }
}
GameBoyAdvanceCPU.prototype.performMUL32 = function (rs, rd) {
    rs = rs | 0;
    rd = rd | 0;
    //Predict the internal cycle time:
    if ((rd >>> 8) == 0 || (rd >>> 8) == 0xFFFFFF) {
        this.IOCore.wait.CPUInternalSingleCyclePrefetch();
    }
    else if ((rd >>> 16) == 0 || (rd >>> 16) == 0xFFFF) {
        this.IOCore.wait.CPUInternalCyclePrefetch(2);
    }
    else if ((rd >>> 24) == 0 || (rd >>> 24) == 0xFF) {
        this.IOCore.wait.CPUInternalCyclePrefetch(3);
    }
    else {
        this.IOCore.wait.CPUInternalCyclePrefetch(4);
    }
    return this.calculateMUL32(rs | 0, rd | 0) | 0;
}
GameBoyAdvanceCPU.prototype.performMUL32MLA = function (rs, rd) {
    rs = rs | 0;
    rd = rd | 0;
    //Predict the internal cycle time:
    if ((rd >>> 8) == 0 || (rd >>> 8) == 0xFFFFFF) {
        this.IOCore.wait.CPUInternalCyclePrefetch(2);
    }
    else if ((rd >>> 16) == 0 || (rd >>> 16) == 0xFFFF) {
        this.IOCore.wait.CPUInternalCyclePrefetch(3);
    }
    else if ((rd >>> 24) == 0 || (rd >>> 24) == 0xFF) {
        this.IOCore.wait.CPUInternalCyclePrefetch(4);
    }
    else {
        this.IOCore.wait.CPUInternalCyclePrefetch(5);
    }
    return this.calculateMUL32(rs | 0, rd | 0) | 0;
}
GameBoyAdvanceCPU.prototype.performMUL64 = function (rs, rd) {
    rs = rs | 0;
    rd = rd | 0;
    //Predict the internal cycle time:
    if ((rd >>> 8) == 0 || (rd >>> 8) == 0xFFFFFF) {
        this.IOCore.wait.CPUInternalCyclePrefetch(2);
    }
    else if ((rd >>> 16) == 0 || (rd >>> 16) == 0xFFFF) {
        this.IOCore.wait.CPUInternalCyclePrefetch(3);
    }
    else if ((rd >>> 24) == 0 || (rd >>> 24) == 0xFF) {
        this.IOCore.wait.CPUInternalCyclePrefetch(4);
    }
    else {
        this.IOCore.wait.CPUInternalCyclePrefetch(5);
    }
    //Solve for the high word (Do FPU double divide to bring down high word into the low word):
    this.mul64ResultHigh = Math.floor((rs * rd) / 0x100000000) | 0;
    this.mul64ResultLow = this.calculateMUL32(rs | 0, rd | 0) | 0;
}
GameBoyAdvanceCPU.prototype.performMLA64 = function (rs, rd, mlaHigh, mlaLow) {
    rs = rs | 0;
    rd = rd | 0;
    mlaHigh = mlaHigh | 0;
    mlaLow = mlaLow | 0;
    //Predict the internal cycle time:
    if ((rd >>> 8) == 0 || (rd >>> 8) == 0xFFFFFF) {
        this.IOCore.wait.CPUInternalCyclePrefetch(3);
    }
    else if ((rd >>> 16) == 0 || (rd >>> 16) == 0xFFFF) {
        this.IOCore.wait.CPUInternalCyclePrefetch(4);
    }
    else if ((rd >>> 24) == 0 || (rd >>> 24) == 0xFF) {
        this.IOCore.wait.CPUInternalCyclePrefetch(5);
    }
    else {
        this.IOCore.wait.CPUInternalCyclePrefetch(6);
    }
    //Solve for the high word (Do FPU double divide to bring down high word into the low word):
    var mulTop = Math.floor((rs * rd) / 0x100000000) | 0;
    var dirty = (this.calculateMUL32(rs | 0, rd | 0) >>> 0) + (mlaLow >>> 0);
    this.mul64ResultHigh = ((mulTop | 0) + (mlaHigh | 0) + Math.floor(dirty / 0x100000000)) | 0;
    this.mul64ResultLow = dirty | 0;
}
GameBoyAdvanceCPU.prototype.performUMUL64 = function (rs, rd) {
    rs = rs | 0;
    rd = rd | 0;
    //Predict the internal cycle time:
    if ((rd >>> 8) == 0) {
        this.IOCore.wait.CPUInternalCyclePrefetch(2);
    }
    else if ((rd >>> 16) == 0) {
        this.IOCore.wait.CPUInternalCyclePrefetch(3);
    }
    else if ((rd >>> 24) == 0) {
        this.IOCore.wait.CPUInternalCyclePrefetch(4);
    }
    else {
        this.IOCore.wait.CPUInternalCyclePrefetch(5);
    }
    //Solve for the high word (Do FPU double divide to bring down high word into the low word):
    this.mul64ResultHigh = (((rs >>> 0) * (rd >>> 0)) / 0x100000000) | 0;
    this.mul64ResultLow = this.calculateMUL32(rs | 0, rd | 0) | 0;
}
GameBoyAdvanceCPU.prototype.performUMLA64 = function (rs, rd, mlaHigh, mlaLow) {
    rs = rs | 0;
    rd = rd | 0;
    mlaHigh = mlaHigh | 0;
    mlaLow = mlaLow | 0;
    //Predict the internal cycle time:
    if ((rd >>> 8) == 0) {
        this.IOCore.wait.CPUInternalCyclePrefetch(3);
    }
    else if ((rd >>> 16) == 0) {
        this.IOCore.wait.CPUInternalCyclePrefetch(4);
    }
    else if ((rd >>> 24) == 0) {
        this.IOCore.wait.CPUInternalCyclePrefetch(5);
    }
    else {
        this.IOCore.wait.CPUInternalCyclePrefetch(6);
    }
    //Solve for the high word (Do FPU double divide to bring down high word into the low word):
    var mulTop = Math.floor(((rs >>> 0) * (rd >>> 0)) / 0x100000000) | 0;
    var dirty = (this.calculateMUL32(rs | 0, rd | 0) >>> 0) + (mlaLow >>> 0);
    this.mul64ResultHigh = ((mulTop | 0) + (mlaHigh | 0) + Math.floor(dirty / 0x100000000)) | 0;
    this.mul64ResultLow = dirty | 0;
}
GameBoyAdvanceCPU.prototype.write32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    //Updating the address bus away from PC fetch:
    this.IOCore.wait.NonSequentialBroadcast();
    this.memory.memoryWrite32(address | 0, data | 0);
    //Updating the address bus back to PC fetch:
    this.IOCore.wait.NonSequentialBroadcast();
}
GameBoyAdvanceCPU.prototype.write16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    //Updating the address bus away from PC fetch:
    this.IOCore.wait.NonSequentialBroadcast();
    this.memory.memoryWrite16(address | 0, data | 0);
    //Updating the address bus back to PC fetch:
    this.IOCore.wait.NonSequentialBroadcast();
}
GameBoyAdvanceCPU.prototype.write8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    //Updating the address bus away from PC fetch:
    this.IOCore.wait.NonSequentialBroadcast();
    this.memory.memoryWrite8(address | 0, data | 0);
    //Updating the address bus back to PC fetch:
    this.IOCore.wait.NonSequentialBroadcast();
}
GameBoyAdvanceCPU.prototype.read32 = function (address) {
    address = address | 0;
    //Updating the address bus away from PC fetch:
    this.IOCore.wait.NonSequentialBroadcast();
    var data = this.memory.memoryRead32(address | 0) | 0;
    //Unaligned access gets data rotated right:
    if ((address & 0x3) != 0) {
        //Rotate word right:
        data = (data << ((4 - (address & 0x3)) << 3)) | (data >>> ((address & 0x3) << 3));
    }
    //Updating the address bus back to PC fetch:
    this.IOCore.wait.NonSequentialBroadcast();
    return data | 0;
}
GameBoyAdvanceCPU.prototype.read16 = function (address) {
    address = address | 0;
    //Updating the address bus away from PC fetch:
    this.IOCore.wait.NonSequentialBroadcast();
    var data = this.memory.memoryRead16(address | 0) | 0;
    //Updating the address bus back to PC fetch:
    this.IOCore.wait.NonSequentialBroadcast();
    return data | 0;
}
GameBoyAdvanceCPU.prototype.read8 = function (address) {
    address = address | 0;
    //Updating the address bus away from PC fetch:
    this.IOCore.wait.NonSequentialBroadcast();
    var data = this.memory.memoryRead8(address | 0) | 0;
    //Updating the address bus back to PC fetch:
    this.IOCore.wait.NonSequentialBroadcast();
    return data | 0;
};
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
function GameBoyAdvanceSaves(IOCore) {
    this.cartridge = IOCore.cartridge;
    this.initialize();
}
GameBoyAdvanceSaves.prototype.initialize = function () {
    this.saveType = 0;
    this.gpioType = 0;
    this.GPIOChip = null;
    this.UNDETERMINED = new GameBoyAdvanceSaveDeterminer(this);
    this.SRAMChip = new GameBoyAdvanceSRAMChip();
    this.FLASHChip = new GameBoyAdvanceFLASHChip(this.cartridge.flash_is128, this.cartridge.flash_isAtmel);
    this.EEPROMChip = new GameBoyAdvanceEEPROMChip(this.cartridge.IOCore);
    this.currentChip = this.UNDETERMINED;
    this.referenceSave(this.saveType);
}
GameBoyAdvanceSaves.prototype.referenceSave = function (saveType) {
    saveType = saveType | 0;
    switch (saveType | 0) {
        case 0:
            this.currentChip = this.UNDETERMINED;
            break;
        case 1:
            this.currentChip = this.SRAMChip;
            break;
        case 2:
            this.currentChip = this.FLASHChip;
            break;
        case 3:
            this.currentChip = this.EEPROMChip;
    }
    this.currentChip.initialize();
    this.saveType = saveType | 0;
}
GameBoyAdvanceSaves.prototype.importSave = function (saves, saveType) {
    this.UNDETERMINED.load(saves);
    this.SRAMChip.load(saves);
    this.FLASHChip.load(saves);
    this.EEPROMChip.load(saves);
    this.referenceSave(saveType | 0);
}
GameBoyAdvanceSaves.prototype.exportSave = function () {
    return this.currentChip.saves;
}
GameBoyAdvanceSaves.prototype.exportSaveType = function () {
    return this.saveType | 0;
}
GameBoyAdvanceSaves.prototype.readGPIO8 = function (address) {
    address = address | 0;
    var data = 0;
    if ((this.gpioType | 0) > 0) {
        //GPIO:
        data = this.GPIOChip.read8(address | 0) | 0;
    }
    else {
        //ROM:
        data = this.cartridge.readROMOnly8(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceSaves.prototype.readEEPROM8 = function (address) {
    address = address | 0;
    var data = 0;
    if ((this.saveType | 0) == 3) {
        //EEPROM:
        data = this.EEPROMChip.read8() | 0;
    }
    else {
        //UNKNOWN:
        data = this.UNDETERMINED.readEEPROM8(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceSaves.prototype.readGPIO16 = function (address) {
    address = address | 0;
    var data = 0;
    if ((this.gpioType | 0) > 0) {
        //GPIO:
        data = this.GPIOChip.read16(address | 0) | 0;
    }
    else {
        //ROM:
        data = this.cartridge.readROMOnly16(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceSaves.prototype.readEEPROM16 = function (address) {
    address = address | 0;
    var data = 0;
    if ((this.saveType | 0) == 3) {
        //EEPROM:
        data = this.EEPROMChip.read16() | 0;
    }
    else {
        //UNKNOWN:
        data = this.UNDETERMINED.readEEPROM16(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceSaves.prototype.readGPIO32 = function (address) {
    address = address | 0;
    var data = 0;
    if ((this.gpioType | 0) > 0) {
        //GPIO:
        data = this.GPIOChip.read32(address | 0) | 0;
    }
    else {
        //ROM:
        data = this.cartridge.readROMOnly32(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceSaves.prototype.readEEPROM32 = function (address) {
    address = address | 0;
    var data = 0;
    if ((this.saveType | 0) == 3) {
        //EEPROM:
        data = this.EEPROMChip.read32() | 0;
    }
    else {
        //UNKNOWN:
        data = this.UNDETERMINED.readEEPROM32(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceSaves.prototype.readSRAM = function (address) {
    address = address | 0;
    var data = 0;
    switch (this.saveType | 0) {
        case 0:
            //UNKNOWN:
            data = this.UNDETERMINED.readSRAM(address | 0) | 0;
            break;
        case 1:
            //SRAM:
            data = this.SRAMChip.read(address | 0) | 0;
            break;
        case 2:
            //FLASH:
            data = this.FLASHChip.read(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceSaves.prototype.writeGPIO8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((this.gpioType | 0) > 0) {
        //GPIO:
        this.GPIOChip.write8(address | 0, data | 0);
    }
    else {
        //Unknown:
        this.UNDETERMINED.writeGPIO8(address | 0, data | 0);
    }
}
GameBoyAdvanceSaves.prototype.writeEEPROM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((this.saveType | 0) == 3) {
        //EEPROM:
        this.EEPROMChip.write8(data | 0);
    }
    else {
        //Unknown:
        this.UNDETERMINED.writeEEPROM8(address | 0, data | 0);
    }
}
GameBoyAdvanceSaves.prototype.writeGPIO16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((this.gpioType | 0) > 0) {
        //GPIO:
        this.GPIOChip.write16(address | 0, data | 0);
    }
    else {
        //Unknown:
        this.UNDETERMINED.writeGPIO16(address | 0, data | 0);
    }
}
GameBoyAdvanceSaves.prototype.writeEEPROM16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((this.saveType | 0) == 3) {
        //EEPROM:
        this.EEPROMChip.write16(data | 0);
    }
    else {
        //Unknown:
        this.UNDETERMINED.writeEEPROM16(address | 0, data | 0);
    }
}
GameBoyAdvanceSaves.prototype.writeGPIO32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((this.gpioType | 0) > 0) {
        //GPIO:
        this.GPIOChip.write32(address | 0, data | 0);
    }
    else {
        //Unknown:
        this.UNDETERMINED.writeGPIO32(address | 0, data | 0);
    }
}
GameBoyAdvanceSaves.prototype.writeEEPROM32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((this.saveType | 0) == 3) {
        //EEPROM:
        this.EEPROMChip.write32(data | 0);
    }
    else {
        //Unknown:
        this.UNDETERMINED.writeEEPROM32(address | 0, data | 0);
    }
}
GameBoyAdvanceSaves.prototype.writeSRAM = function (address, data) {
    address = address | 0;
    data = data | 0;
    switch (this.saveType | 0) {
        case 0:
            //Unknown:
            this.UNDETERMINED.writeSRAM(address | 0, data | 0);
            break;
        case 1:
            //SRAM:
            this.SRAMChip.write(address | 0, data | 0);
            break;
        case 2:
            //FLASH:
            this.FLASHChip.write(address | 0, data | 0);
    }
}
GameBoyAdvanceSaves.prototype.writeSRAMIfDefined = function (address, data) {
    address = address | 0;
    data = data | 0;
    switch (this.saveType | 0) {
        case 0:
            //UNKNOWN:
            this.SRAMChip.initialize();
        case 1:
            //SRAM:
            this.SRAMChip.write(address | 0, data | 0);
            break;
        case 2:
            //FLASH:
            this.FLASHChip.write(address | 0, data | 0);
    }
};
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
function GameBoyAdvanceFIFO() {
    this.count = 0;
    this.position = 0;
    this.buffer = getInt8Array(0x20);
}
GameBoyAdvanceFIFO.prototype.push = function (sample) {
    sample = sample | 0;
    var writePosition = ((this.position | 0) + (this.count | 0)) | 0;
    this.buffer[writePosition & 0x1F] = (sample << 24) >> 24;
    if ((this.count | 0) < 0x20) {
        //Should we cap at 0x20 or overflow back to 0 and reset queue?
        this.count = ((this.count | 0) + 1) | 0;
    }
}
GameBoyAdvanceFIFO.prototype.shift = function () {
    var output = 0;
    if ((this.count | 0) > 0) {
        this.count = ((this.count | 0) - 1) | 0;
        output = this.buffer[this.position & 0x1F] << 3;
        this.position = ((this.position | 0) + 1) & 0x1F;
    }
    return output | 0;
}
GameBoyAdvanceFIFO.prototype.requestingDMA = function () {
    return (this.count <= 0x10);
}
GameBoyAdvanceFIFO.prototype.samplesUntilDMATrigger = function () {
    return ((this.count | 0) - 0x10) | 0;
};
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
function GameBoyAdvanceChannel1Synth(sound) {
    this.sound = sound;
    this.currentSampleLeft = 0;
    this.currentSampleLeftSecondary = 0;
    this.currentSampleLeftTrimary = 0;
    this.currentSampleRight = 0;
    this.currentSampleRightSecondary = 0;
    this.currentSampleRightTrimary = 0;
    this.SweepFault = false;
    this.lastTimeSweep = 0;
    this.timeSweep = 0;
    this.frequencySweepDivider = 0;
    this.decreaseSweep = false;
    this.nr11 = 0;
    this.CachedDuty = this.dutyLookup[0];
    this.totalLength = 0x40;
    this.nr12 = 0;
    this.envelopeVolume = 0;
    this.frequency = 0;
    this.FrequencyTracker = 0x8000;
    this.nr14 = 0;
    this.consecutive = true;
    this.ShadowFrequency = 0x8000;
    this.canPlay = false;
    this.Enabled = false;
    this.envelopeSweeps = 0;
    this.envelopeSweepsLast = -1;
    this.FrequencyCounter = 0;
    this.DutyTracker = 0;
    this.Swept = false;
}
GameBoyAdvanceChannel1Synth.prototype.dutyLookup = [
    [false, false, false, false, false, false, false, true],
    [true, false, false, false, false, false, false, true],
    [true, false, false, false, false, true, true, true],
    [false, true, true, true, true, true, true, false]
];
GameBoyAdvanceChannel1Synth.prototype.disabled = function () {
    //Clear NR10:
    this.nr10 = 0;
    this.SweepFault = false;
    this.lastTimeSweep = 0;
    this.timeSweep = 0;
    this.frequencySweepDivider = 0;
    this.decreaseSweep = false;
    //Clear NR11:
    this.nr11 = 0;
    this.CachedDuty = this.dutyLookup[0];
    this.totalLength = 0x40;
    //Clear NR12:
    this.nr12 = 0;
    this.envelopeVolume = 0;
    //Clear NR13:
    this.frequency = 0;
    this.FrequencyTracker = 0x8000;
    //Clear NR14:
    this.nr14 = 0;
    this.consecutive = true;
    this.ShadowFrequency = 0x8000;
    this.canPlay = false;
    this.Enabled = false;
    this.envelopeSweeps = 0;
    this.envelopeSweepsLast = -1;
    this.FrequencyCounter = 0;
    this.DutyTracker = 0;
}
GameBoyAdvanceChannel1Synth.prototype.clockAudioLength = function () {
    if ((this.totalLength | 0) > 1) {
        this.totalLength = ((this.totalLength | 0) - 1) | 0;
    }
    else if ((this.totalLength | 0) == 1) {
        this.totalLength = 0;
        this.enableCheck();
        this.sound.unsetNR52(0xFE);    //Channel #1 On Flag Off
    }
}
GameBoyAdvanceChannel1Synth.prototype.enableCheck = function () {
    this.Enabled = ((this.consecutive || (this.totalLength | 0) > 0) && !this.SweepFault && this.canPlay);
}
GameBoyAdvanceChannel1Synth.prototype.volumeEnableCheck = function () {
    this.canPlay = ((this.nr12 | 0) > 7);
    this.enableCheck();
}
GameBoyAdvanceChannel1Synth.prototype.outputLevelCache = function () {
    this.currentSampleLeft = (this.sound.leftChannel1) ? (this.envelopeVolume | 0) : 0;
    this.currentSampleRight = (this.sound.rightChannel1) ? (this.envelopeVolume | 0) : 0;
    this.outputLevelSecondaryCache();
}
GameBoyAdvanceChannel1Synth.prototype.outputLevelSecondaryCache = function () {
    if (this.Enabled) {
        this.currentSampleLeftSecondary = this.currentSampleLeft | 0;
        this.currentSampleRightSecondary = this.currentSampleRight | 0;
    }
    else {
        this.currentSampleLeftSecondary = 0;
        this.currentSampleRightSecondary = 0;
    }
    this.outputLevelTrimaryCache();
}
GameBoyAdvanceChannel1Synth.prototype.outputLevelTrimaryCache = function () {
    if (this.CachedDuty[this.DutyTracker | 0]) {
        this.currentSampleLeftTrimary = this.currentSampleLeftSecondary | 0;
        this.currentSampleRightTrimary = this.currentSampleRightSecondary | 0;
    }
    else {
        this.currentSampleLeftTrimary = 0;
        this.currentSampleRightTrimary = 0;
    }
}
GameBoyAdvanceChannel1Synth.prototype.clockAudioSweep = function () {
    //Channel 1:
    if (!this.SweepFault && (this.timeSweep | 0) > 0) {
        this.timeSweep = ((this.timeSweep | 0) - 1) | 0
        if ((this.timeSweep | 0) == 0) {
            this.runAudioSweep();
        }
    }
}
GameBoyAdvanceChannel1Synth.prototype.runAudioSweep = function () {
    //Channel 1:
    if ((this.lastTimeSweep | 0) > 0) {
        if ((this.frequencySweepDivider | 0) > 0) {
            this.Swept = true;
            if (this.decreaseSweep) {
                this.ShadowFrequency = ((this.ShadowFrequency | 0) - (this.ShadowFrequency >> (this.frequencySweepDivider | 0))) | 0;
                this.frequency = this.ShadowFrequency & 0x7FF;
                this.FrequencyTracker = (0x800 - (this.frequency | 0)) << 4;
            }
            else {
                this.ShadowFrequency = ((this.ShadowFrequency | 0) + (this.ShadowFrequency >> (this.frequencySweepDivider | 0))) | 0;
                this.frequency = this.ShadowFrequency | 0;
                if ((this.ShadowFrequency | 0) <= 0x7FF) {
                    this.FrequencyTracker = (0x800 - (this.frequency | 0)) << 4;
                    //Run overflow check twice:
                    if ((((this.ShadowFrequency | 0) + (this.ShadowFrequency >> (this.frequencySweepDivider | 0))) | 0) > 0x7FF) {
                        this.SweepFault = true;
                        this.enableCheck();
                        this.sound.unsetNR52(0xFE);    //Channel #1 On Flag Off
                    }
                }
                else {
                    this.frequency &= 0x7FF;
                    this.SweepFault = true;
                    this.enableCheck();
                    this.sound.unsetNR52(0xFE);    //Channel #1 On Flag Off
                }
            }
            this.timeSweep = this.lastTimeSweep | 0;
        }
        else {
            //Channel has sweep disabled and timer becomes a length counter:
            this.SweepFault = true;
            this.enableCheck();
        }
    }
}
GameBoyAdvanceChannel1Synth.prototype.audioSweepPerformDummy = function () {
    //Channel 1:
    if ((this.frequencySweepDivider | 0) > 0) {
        if (!this.decreaseSweep) {
            var channel1ShadowFrequency = ((this.ShadowFrequency | 0) + (this.ShadowFrequency >> (this.frequencySweepDivider | 0))) | 0;
            if ((channel1ShadowFrequency | 0) <= 0x7FF) {
                //Run overflow check twice:
                if ((((channel1ShadowFrequency | 0) + (channel1ShadowFrequency >> (this.frequencySweepDivider | 0))) | 0) > 0x7FF) {
                    this.SweepFault = true;
                    this.enableCheck();
                    this.sound.unsetNR52(0xFE);    //Channel #1 On Flag Off
                }
            }
            else {
                this.SweepFault = true;
                this.enableCheck();
                this.sound.unsetNR52(0xFE);    //Channel #1 On Flag Off
            }
        }
    }
}
GameBoyAdvanceChannel1Synth.prototype.clockAudioEnvelope = function () {
    if ((this.envelopeSweepsLast | 0) > -1) {
        if ((this.envelopeSweeps | 0) > 0) {
            this.envelopeSweeps = ((this.envelopeSweeps | 0) - 1) | 0;
        }
        else {
            if (!this.envelopeType) {
                if ((this.envelopeVolume | 0) > 0) {
                    this.envelopeVolume = ((this.envelopeVolume | 0) - 1) | 0;
                    this.envelopeSweeps = this.envelopeSweepsLast | 0;
                }
                else {
                    this.envelopeSweepsLast = -1;
                }
            }
            else if ((this.envelopeVolume | 0) < 0xF) {
                this.envelopeVolume = ((this.envelopeVolume | 0) + 1) | 0;
                this.envelopeSweeps = this.envelopeSweepsLast | 0;
            }
            else {
                this.envelopeSweepsLast = -1;
            }
        }
    }
}
GameBoyAdvanceChannel1Synth.prototype.computeAudioChannel = function () {
    if ((this.FrequencyCounter | 0) == 0) {
        this.FrequencyCounter = this.FrequencyTracker | 0;
        this.DutyTracker = ((this.DutyTracker | 0) + 1) & 0x7;
    }
}
GameBoyAdvanceChannel1Synth.prototype.readSOUND1CNT_L = function () {
    //NR10:
    return this.nr10 | 0;
}
GameBoyAdvanceChannel1Synth.prototype.writeSOUND1CNT_L = function (data) {
    data = data | 0;
    //NR10:
    if (this.decreaseSweep && (data & 0x08) == 0) {
        if (this.Swept) {
            this.SweepFault = true;
        }
    }
    this.lastTimeSweep = (data & 0x70) >> 4;
    this.frequencySweepDivider = data & 0x07;
    this.decreaseSweep = ((data & 0x08) == 0x08);
    this.nr10 = data | 0;
    this.enableCheck();
}
GameBoyAdvanceChannel1Synth.prototype.readSOUND1CNT_H0 = function () {
    //NR11:
    return this.nr11 | 0;
}
GameBoyAdvanceChannel1Synth.prototype.writeSOUND1CNT_H0 = function (data) {
    data = data | 0;
    //NR11:
    this.CachedDuty = this.dutyLookup[data >> 6];
    this.totalLength = (0x40 - (data & 0x3F)) | 0;
    this.nr11 = data | 0;
    this.enableCheck();
}
GameBoyAdvanceChannel1Synth.prototype.readSOUND1CNT_H1 = function () {
    //NR12:
    return this.nr12 | 0;
}
GameBoyAdvanceChannel1Synth.prototype.writeSOUND1CNT_H1 = function (data) {
    data = data | 0;
    //NR12:
    this.envelopeType = ((data & 0x08) == 0x08);
    this.nr12 = data | 0;
    this.volumeEnableCheck();
}
GameBoyAdvanceChannel1Synth.prototype.writeSOUND1CNT_X0 = function (data) {
    data = data | 0;
    //NR13:
    this.frequency = (this.frequency & 0x700) | data;
    this.FrequencyTracker = (0x800 - (this.frequency | 0)) << 4;
}
GameBoyAdvanceChannel1Synth.prototype.readSOUND1CNT_X = function () {
    //NR14:
    return this.nr14 | 0;
}
GameBoyAdvanceChannel1Synth.prototype.writeSOUND1CNT_X1 = function (data) {
    data = data | 0;
    //NR14:
    this.consecutive = ((data & 0x40) == 0x0);
    this.frequency = ((data & 0x7) << 8) | (this.frequency & 0xFF);
    this.FrequencyTracker = (0x800 - (this.frequency | 0)) << 4;
    if (data > 0x7F) {
        //Reload nr10:
        this.timeSweep = this.lastTimeSweep | 0;
        this.Swept = false;
        //Reload nr12:
        this.envelopeVolume = this.nr12 >> 4;
        this.envelopeSweepsLast = ((this.nr12 & 0x7) - 1) | 0;
        if ((this.totalLength | 0) == 0) {
            this.totalLength = 0x40;
        }
        if ((this.lastTimeSweep | 0) > 0 || (this.frequencySweepDivider | 0) > 0) {
            this.sound.setNR52(0x1);
        }
        else {
            this.sound.unsetNR52(0xFE);
        }
        if ((data & 0x40) == 0x40) {
            this.sound.setNR52(0x1);
        }
        this.ShadowFrequency = this.frequency | 0;
        //Reset frequency overflow check + frequency sweep type check:
        this.SweepFault = false;
        //Supposed to run immediately:
        this.audioSweepPerformDummy();
    }
    this.enableCheck();
    this.nr14 = data | 0;
};
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
function GameBoyAdvanceChannel2Synth(sound) {
    this.sound = sound;
    this.currentSampleLeft = 0;
    this.currentSampleLeftSecondary = 0;
    this.currentSampleLeftTrimary = 0;
    this.currentSampleRight = 0;
    this.currentSampleRightSecondary = 0;
    this.currentSampleRightTrimary = 0;
    this.CachedDuty = this.dutyLookup[0];
    this.totalLength = 0x40;
    this.envelopeVolume = 0;
    this.frequency = 0;
    this.FrequencyTracker = 0x8000;
    this.consecutive = true;
    this.ShadowFrequency = 0x8000;
    this.canPlay = false;
    this.Enabled = false;
    this.envelopeSweeps = 0;
    this.envelopeSweepsLast = -1;
    this.FrequencyCounter = 0;
    this.DutyTracker = 0;
    this.nr21 = 0;
    this.nr22 = 0;
    this.nr23 = 0;
    this.nr24 = 0;
}
GameBoyAdvanceChannel2Synth.prototype.dutyLookup = [
    [false, false, false, false, false, false, false, true],
    [true, false, false, false, false, false, false, true],
    [true, false, false, false, false, true, true, true],
    [false, true, true, true, true, true, true, false]
];
GameBoyAdvanceChannel2Synth.prototype.disabled = function () {
    //Clear NR21:
    this.nr21 = 0;
    this.CachedDuty = this.dutyLookup[0];
    this.totalLength = 0x40;
    //Clear NR22:
    this.nr22 = 0;
    this.envelopeVolume = 0;
    //Clear NR23:
    this.nr23 = 0;
    this.frequency = 0;
    this.FrequencyTracker = 0x8000;
    //Clear NR24:
    this.nr24 = 0;
    this.consecutive = true;
    this.canPlay = false;
    this.Enabled = false;
    this.envelopeSweeps = 0;
    this.envelopeSweepsLast = -1;
    this.FrequencyCounter = 0;
    this.DutyTracker = 0;
}
GameBoyAdvanceChannel2Synth.prototype.clockAudioLength = function () {
    if ((this.totalLength | 0) > 1) {
        this.totalLength = ((this.totalLength | 0) - 1) | 0;
    }
    else if ((this.totalLength | 0) == 1) {
        this.totalLength = 0;
        this.enableCheck();
        this.sound.unsetNR52(0xFD);    //Channel #2 On Flag Off
    }
}
GameBoyAdvanceChannel2Synth.prototype.clockAudioEnvelope = function () {
    if ((this.envelopeSweepsLast | 0) > -1) {
        if ((this.envelopeSweeps | 0) > 0) {
            this.envelopeSweeps = ((this.envelopeSweeps | 0) - 1) | 0;
        }
        else {
            if (!this.envelopeType) {
                if ((this.envelopeVolume | 0) > 0) {
                    this.envelopeVolume = ((this.envelopeVolume | 0) - 1) | 0;
                    this.envelopeSweeps = this.envelopeSweepsLast | 0;
                }
                else {
                    this.envelopeSweepsLast = -1;
                }
            }
            else if ((this.envelopeVolume | 0) < 0xF) {
                this.envelopeVolume = ((this.envelopeVolume | 0) + 1) | 0;
                this.envelopeSweeps = this.envelopeSweepsLast | 0;
            }
            else {
                this.envelopeSweepsLast = -1;
            }
        }
    }
}
GameBoyAdvanceChannel2Synth.prototype.computeAudioChannel = function () {
    if ((this.FrequencyCounter | 0) == 0) {
        this.FrequencyCounter = this.FrequencyTracker | 0;
        this.DutyTracker = ((this.DutyTracker | 0) + 1) & 0x7;
    }
}
GameBoyAdvanceChannel2Synth.prototype.enableCheck = function () {
    this.Enabled = ((this.consecutive || (this.totalLength | 0) > 0) && this.canPlay);
}
GameBoyAdvanceChannel2Synth.prototype.volumeEnableCheck = function () {
    this.canPlay = ((this.nr22 | 0) > 7);
    this.enableCheck();
}
GameBoyAdvanceChannel2Synth.prototype.outputLevelCache = function () {
    this.currentSampleLeft = (this.sound.leftChannel2) ? (this.envelopeVolume | 0) : 0;
    this.currentSampleRight = (this.sound.rightChannel2) ? (this.envelopeVolume | 0) : 0;
    this.outputLevelSecondaryCache();
}
GameBoyAdvanceChannel2Synth.prototype.outputLevelSecondaryCache = function () {
    if (this.Enabled) {
        this.currentSampleLeftSecondary = this.currentSampleLeft | 0;
        this.currentSampleRightSecondary = this.currentSampleRight | 0;
    }
    else {
        this.currentSampleLeftSecondary = 0;
        this.currentSampleRightSecondary = 0;
    }
    this.outputLevelTrimaryCache();
}
GameBoyAdvanceChannel2Synth.prototype.outputLevelTrimaryCache = function () {
    if (this.CachedDuty[this.DutyTracker | 0]) {
        this.currentSampleLeftTrimary = this.currentSampleLeftSecondary | 0;
        this.currentSampleRightTrimary = this.currentSampleRightSecondary | 0;
    }
    else {
        this.currentSampleLeftTrimary = 0;
        this.currentSampleRightTrimary = 0;
    }
}
GameBoyAdvanceChannel2Synth.prototype.readSOUND2CNT_L0 = function () {
    //NR21:
    return this.nr21 | 0;
}
GameBoyAdvanceChannel2Synth.prototype.writeSOUND2CNT_L0 = function (data) {
    data = data | 0;
    //NR21:
    this.CachedDuty = this.dutyLookup[data >> 6];
    this.totalLength = (0x40 - (data & 0x3F)) | 0;
    this.nr21 = data | 0;
    this.enableCheck();
}
GameBoyAdvanceChannel2Synth.prototype.readSOUND2CNT_L1 = function () {
    //NR22:
    return this.nr22 | 0;
}
GameBoyAdvanceChannel2Synth.prototype.writeSOUND2CNT_L1 = function (data) {
    data = data | 0;
    //NR22:
    this.envelopeType = ((data & 0x08) == 0x08);
    this.nr22 = data | 0;
    this.volumeEnableCheck();
}
GameBoyAdvanceChannel2Synth.prototype.writeSOUND2CNT_H0 = function (data) {
    data = data | 0;
    //NR23:
    this.frequency = (this.frequency & 0x700) | data;
    this.FrequencyTracker = (0x800 - (this.frequency | 0)) << 4;
}
GameBoyAdvanceChannel2Synth.prototype.readSOUND2CNT_H = function () {
    //NR24:
    return this.nr24 | 0;
}
GameBoyAdvanceChannel2Synth.prototype.writeSOUND2CNT_H1 = function (data) {
    data = data | 0;
    //NR24:
    if (data > 0x7F) {
        //Reload nr22:
        this.envelopeVolume = this.nr22 >> 4;
        this.envelopeSweepsLast = ((this.nr22 & 0x7) - 1) | 0;
        if ((this.totalLength | 0) == 0) {
            this.totalLength = 0x40;
        }
        if ((data & 0x40) == 0x40) {
            this.sound.setNR52(0x2);    //Channel #1 On Flag Off
        }
    }
    this.consecutive = ((data & 0x40) == 0x0);
    this.frequency = ((data & 0x7) << 8) | (this.frequency & 0xFF);
    this.FrequencyTracker = (0x800 - (this.frequency | 0)) << 4;
    this.nr24 = data | 0;
    this.enableCheck();
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceChannel3Synth(sound) {
    this.sound = sound;
    this.currentSampleLeft = 0;
    this.currentSampleLeftSecondary = 0;
    this.currentSampleRight = 0;
    this.currentSampleRightSecondary = 0;
    this.lastSampleLookup = 0;
    this.canPlay = false;
    this.WAVERAMBankSpecified = 0;
    this.WAVERAMBankAccessed = 0x20;
    this.WaveRAMBankSize = 0x1F;
    this.totalLength = 0x100;
    this.patternType = 4;
    this.frequency = 0;
    this.FrequencyPeriod = 0x4000;
    this.consecutive = true;
    this.Enabled = false;
    this.nr30 = 0;
    this.nr31 = 0;
    this.nr32 = 0;
    this.nr33 = 0;
    this.nr34 = 0;
    this.cachedSample = 0;
    this.PCM = getInt8Array(0x40);
    this.WAVERAM = getUint8Array(0x20);
}
GameBoyAdvanceChannel3Synth.prototype.disabled = function () {
    //Clear NR30:
    this.nr30 = 0;
    this.lastSampleLookup = 0;
    this.canPlay = false;
    this.WAVERAMBankSpecified = 0;
    this.WAVERAMBankAccessed = 0x20;
    this.WaveRAMBankSize = 0x1F;
    //Clear NR31:
    this.totalLength = 0x100;
    //Clear NR32:
    this.nr32 = 0;
    this.patternType = 4;
    //Clear NR33:
    this.nr33 = 0;
    this.frequency = 0;
    this.FrequencyPeriod = 0x4000;
    //Clear NR34:
    this.nr34 = 0;
    this.consecutive = true;
    this.Enabled = false;
    this.counter = 0;
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceChannel3Synth.prototype.updateCache = function () {
        if ((this.patternType | 0) != 3) {
            this.cachedSample = this.PCM[this.lastSampleLookup | 0] >> (this.patternType | 0);
        }
        else {
            this.cachedSample = Math.imul(this.PCM[this.lastSampleLookup | 0] | 0, 3) >> 2;
        }
        this.outputLevelCache();
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceChannel3Synth.prototype.updateCache = function () {
        if ((this.patternType | 0) != 3) {
            this.cachedSample = this.PCM[this.lastSampleLookup | 0] >> (this.patternType | 0);
        }
        else {
            this.cachedSample = (this.PCM[this.lastSampleLookup | 0] * 0.75) | 0;
        }
        this.outputLevelCache();
    }
}
GameBoyAdvanceChannel3Synth.prototype.outputLevelCache = function () {
    this.currentSampleLeft = (this.sound.leftChannel3) ? (this.cachedSample | 0) : 0;
    this.currentSampleRight = (this.sound.rightChannel3) ? (this.cachedSample | 0) : 0;
    this.outputLevelSecondaryCache();
}
GameBoyAdvanceChannel3Synth.prototype.outputLevelSecondaryCache = function () {
    if (this.Enabled) {
        this.currentSampleLeftSecondary = this.currentSampleLeft | 0;
        this.currentSampleRightSecondary = this.currentSampleRight | 0;
    }
    else {
        this.currentSampleLeftSecondary = 0;
        this.currentSampleRightSecondary = 0;
    }
}
GameBoyAdvanceChannel3Synth.prototype.writeWAVE = function (address, data) {
    address = address | 0;
    data = data | 0;
    if (this.canPlay) {
        this.sound.audioJIT();
    }
    address = ((address | 0) + (this.WAVERAMBankAccessed >> 1)) | 0;
    this.WAVERAM[address | 0] = data | 0;
    address <<= 1;
    this.PCM[address | 0] = data >> 4;
    this.PCM[address | 1] = data & 0xF;
}
GameBoyAdvanceChannel3Synth.prototype.readWAVE = function (address) {
    address = ((address | 0) + (this.WAVERAMBankAccessed >> 1)) | 0;
    return this.WAVERAM[address | 0] | 0;
}
GameBoyAdvanceChannel3Synth.prototype.enableCheck = function () {
    this.Enabled = (/*this.canPlay && */(this.consecutive || (this.totalLength | 0) > 0));
}
GameBoyAdvanceChannel3Synth.prototype.clockAudioLength = function () {
    if ((this.totalLength | 0) > 1) {
        this.totalLength = ((this.totalLength | 0) - 1) | 0;
    }
    else if ((this.totalLength | 0) == 1) {
        this.totalLength = 0;
        this.enableCheck();
        this.sound.unsetNR52(0xFB);    //Channel #3 On Flag Off
    }
}
GameBoyAdvanceChannel3Synth.prototype.computeAudioChannel = function () {
    if ((this.counter | 0) == 0) {
        if (this.canPlay) {
            this.lastSampleLookup = (((this.lastSampleLookup | 0) + 1) & this.WaveRAMBankSize) | this.WAVERAMBankSpecified;
        }
        this.counter = this.FrequencyPeriod | 0;
    }
}

GameBoyAdvanceChannel3Synth.prototype.readSOUND3CNT_L = function () {
    //NR30:
    return this.nr30 | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_L = function (data) {
    data = data | 0;
    //NR30:
    if (!this.canPlay && (data | 0) >= 0x80) {
        this.lastSampleLookup = 0;
    }
    this.canPlay = (data > 0x7F);
    this.WaveRAMBankSize = (data & 0x20) | 0x1F;
    this.WAVERAMBankSpecified = ((data & 0x40) >> 1) ^ (data & 0x20);
    this.WAVERAMBankAccessed = ((data & 0x40) >> 1) ^ 0x20;
    if (this.canPlay && (this.nr30 | 0) > 0x7F && !this.consecutive) {
        this.sound.setNR52(0x4);
    }
    this.nr30 = data | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_H0 = function (data) {
    data = data | 0;
    //NR31:
    this.totalLength = (0x100 - (data | 0)) | 0;
    this.enableCheck();
}
GameBoyAdvanceChannel3Synth.prototype.readSOUND3CNT_H = function () {
    //NR32:
    return this.nr32 | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_H1 = function (data) {
    data = data | 0;
    //NR32:
    switch (data >> 5) {
        case 0:
            this.patternType = 4;
            break;
        case 1:
            this.patternType = 0;
            break;
        case 2:
            this.patternType = 1;
            break;
        case 3:
            this.patternType = 2;
            break;
        default:
            this.patternType = 3;
    }
    this.nr32 = data | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_X0 = function (data) {
    data = data | 0;
    //NR33:
    this.frequency = (this.frequency & 0x700) | data;
    this.FrequencyPeriod = (0x800 - (this.frequency | 0)) << 3;
}
GameBoyAdvanceChannel3Synth.prototype.readSOUND3CNT_X = function () {
    //NR34:
    return this.nr34 | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_X1 = function (data) {
    data = data | 0;
    //NR34:
    if ((data | 0) > 0x7F) {
        if ((this.totalLength | 0) == 0) {
            this.totalLength = 0x100;
        }
        this.lastSampleLookup = 0;
        if ((data & 0x40) == 0x40) {
            this.sound.setNR52(0x4);
        }
    }
    this.consecutive = ((data & 0x40) == 0x0);
    this.frequency = ((data & 0x7) << 8) | (this.frequency & 0xFF);
    this.FrequencyPeriod = (0x800 - (this.frequency | 0)) << 3;
    this.enableCheck();
    this.nr34 = data | 0;
};
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
function GameBoyAdvanceChannel4Synth(sound) {
    this.sound = sound;
    this.currentSampleLeft = 0;
    this.currentSampleLeftSecondary = 0;
    this.currentSampleRight = 0;
    this.currentSampleRightSecondary = 0;
    this.totalLength = 0x40;
    this.envelopeVolume = 0;
    this.FrequencyPeriod = 32;
    this.lastSampleLookup = 0;
    this.BitRange =  0x7FFF;
    this.VolumeShifter = 15;
    this.currentVolume = 0;
    this.consecutive = true;
    this.envelopeSweeps = 0;
    this.envelopeSweepsLast = -1;
    this.canPlay = false;
    this.Enabled = false;
    this.counter = 0;
    this.nr42 = 0;
    this.nr43 = 0;
    this.nr44 = 0;
    this.cachedSample = 0;
    this.intializeWhiteNoise();
    this.noiseSampleTable = this.LSFR15Table;
}
GameBoyAdvanceChannel4Synth.prototype.intializeWhiteNoise = function () {
    //Noise Sample Tables:
    var randomFactor = 1;
    //15-bit LSFR Cache Generation:
    this.LSFR15Table = getInt8Array(0x80000);
    var LSFR = 0x7FFF;    //Seed value has all its bits set.
    var LSFRShifted = 0x3FFF;
    for (var index = 0; index < 0x8000; ++index) {
        //Normalize the last LSFR value for usage:
        randomFactor = 1 - (LSFR & 1);    //Docs say it's the inverse.
        //Cache the different volume level results:
        this.LSFR15Table[0x08000 | index] = randomFactor;
        this.LSFR15Table[0x10000 | index] = randomFactor * 0x2;
        this.LSFR15Table[0x18000 | index] = randomFactor * 0x3;
        this.LSFR15Table[0x20000 | index] = randomFactor * 0x4;
        this.LSFR15Table[0x28000 | index] = randomFactor * 0x5;
        this.LSFR15Table[0x30000 | index] = randomFactor * 0x6;
        this.LSFR15Table[0x38000 | index] = randomFactor * 0x7;
        this.LSFR15Table[0x40000 | index] = randomFactor * 0x8;
        this.LSFR15Table[0x48000 | index] = randomFactor * 0x9;
        this.LSFR15Table[0x50000 | index] = randomFactor * 0xA;
        this.LSFR15Table[0x58000 | index] = randomFactor * 0xB;
        this.LSFR15Table[0x60000 | index] = randomFactor * 0xC;
        this.LSFR15Table[0x68000 | index] = randomFactor * 0xD;
        this.LSFR15Table[0x70000 | index] = randomFactor * 0xE;
        this.LSFR15Table[0x78000 | index] = randomFactor * 0xF;
        //Recompute the LSFR algorithm:
        LSFRShifted = LSFR >> 1;
        LSFR = LSFRShifted | (((LSFRShifted ^ LSFR) & 0x1) << 14);
    }
    //7-bit LSFR Cache Generation:
    this.LSFR7Table = getInt8Array(0x800);
    LSFR = 0x7F;    //Seed value has all its bits set.
    for (index = 0; index < 0x80; ++index) {
        //Normalize the last LSFR value for usage:
        randomFactor = 1 - (LSFR & 1);    //Docs say it's the inverse.
        //Cache the different volume level results:
        this.LSFR7Table[0x080 | index] = randomFactor;
        this.LSFR7Table[0x100 | index] = randomFactor * 0x2;
        this.LSFR7Table[0x180 | index] = randomFactor * 0x3;
        this.LSFR7Table[0x200 | index] = randomFactor * 0x4;
        this.LSFR7Table[0x280 | index] = randomFactor * 0x5;
        this.LSFR7Table[0x300 | index] = randomFactor * 0x6;
        this.LSFR7Table[0x380 | index] = randomFactor * 0x7;
        this.LSFR7Table[0x400 | index] = randomFactor * 0x8;
        this.LSFR7Table[0x480 | index] = randomFactor * 0x9;
        this.LSFR7Table[0x500 | index] = randomFactor * 0xA;
        this.LSFR7Table[0x580 | index] = randomFactor * 0xB;
        this.LSFR7Table[0x600 | index] = randomFactor * 0xC;
        this.LSFR7Table[0x680 | index] = randomFactor * 0xD;
        this.LSFR7Table[0x700 | index] = randomFactor * 0xE;
        this.LSFR7Table[0x780 | index] = randomFactor * 0xF;
        //Recompute the LSFR algorithm:
        LSFRShifted = LSFR >> 1;
        LSFR = LSFRShifted | (((LSFRShifted ^ LSFR) & 0x1) << 6);
    }
}
GameBoyAdvanceChannel4Synth.prototype.disabled = function () {
    //Clear NR41:
    this.totalLength = 0x40;
    //Clear NR42:
    this.nr42 = 0;
    this.envelopeVolume = 0;
    //Clear NR43:
    this.nr43 = 0;
    this.FrequencyPeriod = 32;
    this.lastSampleLookup = 0;
    this.BitRange =  0x7FFF;
    this.VolumeShifter = 15;
    this.currentVolume = 0;
    this.noiseSampleTable = this.LSFR15Table;
    //Clear NR44:
    this.nr44 = 0;
    this.consecutive = true;
    this.envelopeSweeps = 0;
    this.envelopeSweepsLast = -1;
    this.canPlay = false;
    this.Enabled = false;
    this.counter = 0;
}
GameBoyAdvanceChannel4Synth.prototype.clockAudioLength = function () {
    if ((this.totalLength | 0) > 1) {
        this.totalLength = ((this.totalLength | 0) - 1) | 0;
    }
    else if ((this.totalLength | 0) == 1) {
        this.totalLength = 0;
        this.enableCheck();
        this.sound.unsetNR52(0xF7);    //Channel #4 On Flag Off
    }
}
GameBoyAdvanceChannel4Synth.prototype.clockAudioEnvelope = function () {
    if ((this.envelopeSweepsLast | 0) > -1) {
        if ((this.envelopeSweeps | 0) > 0) {
            this.envelopeSweeps = ((this.envelopeSweeps | 0) - 1) | 0;
        }
        else {
            if (!this.envelopeType) {
                if ((this.envelopeVolume | 0) > 0) {
                    this.envelopeVolume = ((this.envelopeVolume | 0) - 1) | 0;
                    this.currentVolume = (this.envelopeVolume | 0) << (this.VolumeShifter | 0);
                    this.envelopeSweeps = this.envelopeSweepsLast | 0;
                }
                else {
                    this.envelopeSweepsLast = -1;
                }
            }
            else if ((this.envelopeVolume | 0) < 0xF) {
                this.envelopeVolume = ((this.envelopeVolume | 0) + 1) | 0;
                this.currentVolume = (this.envelopeVolume | 0) << (this.VolumeShifter | 0);
                this.envelopeSweeps = this.envelopeSweepsLast | 0;
            }
            else {
                this.envelopeSweepsLast = -1;
            }
        }
    }
}
GameBoyAdvanceChannel4Synth.prototype.computeAudioChannel = function () {
    if ((this.counter | 0) == 0) {
        this.lastSampleLookup = ((this.lastSampleLookup | 0) + 1) & this.BitRange;
        this.counter = this.FrequencyPeriod | 0;
    }
}
GameBoyAdvanceChannel4Synth.prototype.enableCheck = function () {
    this.Enabled = ((this.consecutive || (this.totalLength | 0) > 0) && this.canPlay);
}
GameBoyAdvanceChannel4Synth.prototype.volumeEnableCheck = function () {
    this.canPlay = ((this.nr42 | 0) > 7);
    this.enableCheck();
}
GameBoyAdvanceChannel4Synth.prototype.outputLevelCache = function () {
    this.currentSampleLeft = (this.sound.leftChannel4) ? (this.cachedSample | 0) : 0;
    this.currentSampleRight = (this.sound.rightChannel4) ? (this.cachedSample | 0) : 0;
    this.outputLevelSecondaryCache();
}
GameBoyAdvanceChannel4Synth.prototype.outputLevelSecondaryCache = function () {
    if (this.Enabled) {
        this.currentSampleLeftSecondary = this.currentSampleLeft | 0;
        this.currentSampleRightSecondary = this.currentSampleRight | 0;
    }
    else {
        this.currentSampleLeftSecondary = 0;
        this.currentSampleRightSecondary = 0;
    }
}
GameBoyAdvanceChannel4Synth.prototype.updateCache = function () {
    this.cachedSample = this.noiseSampleTable[this.currentVolume | this.lastSampleLookup] | 0;
    this.outputLevelCache();
}
GameBoyAdvanceChannel4Synth.prototype.writeSOUND4CNT_L0 = function (data) {
    data = data | 0;
    //NR41:
    this.totalLength = (0x40 - (data & 0x3F)) | 0;
    this.enableCheck();
}
GameBoyAdvanceChannel4Synth.prototype.writeSOUND4CNT_L1 = function (data) {
    data = data | 0;
    //NR42:
    this.envelopeType = ((data & 0x08) == 0x08);
    this.nr42 = data | 0;
    this.volumeEnableCheck();
}
GameBoyAdvanceChannel4Synth.prototype.readSOUND4CNT_L = function () {
    //NR42:
    return this.nr42 | 0;
}
GameBoyAdvanceChannel4Synth.prototype.writeSOUND4CNT_H0 = function (data) {
    data = data | 0;
    //NR43:
    this.FrequencyPeriod = Math.max((data & 0x7) << 4, 8) << (((data >> 4) + 2) | 0);
    var bitWidth = data & 0x8;
    if (((bitWidth | 0) == 0x8 && (this.BitRange | 0) == 0x7FFF) || ((bitWidth | 0) == 0 && (this.BitRange | 0) == 0x7F)) {
        this.lastSampleLookup = 0;
        this.BitRange = ((bitWidth | 0) == 0x8) ? 0x7F : 0x7FFF;
        this.VolumeShifter = ((bitWidth | 0) == 0x8) ? 7 : 15;
        this.currentVolume = this.envelopeVolume << (this.VolumeShifter | 0);
        this.noiseSampleTable = ((bitWidth | 0) == 0x8) ? this.LSFR7Table : this.LSFR15Table;
    }
    this.nr43 = data | 0;
}
GameBoyAdvanceChannel4Synth.prototype.readSOUND4CNT_H0 = function () {
    //NR43:
    return this.nr43 | 0;
}
GameBoyAdvanceChannel4Synth.prototype.writeSOUND4CNT_H1 = function (data) {
    data = data | 0;
    //NR44:
    this.nr44 = data | 0;
    this.consecutive = ((data & 0x40) == 0x0);
    if ((data | 0) > 0x7F) {
        this.envelopeVolume = this.nr42 >> 4;
        this.currentVolume = this.envelopeVolume << (this.VolumeShifter | 0);
        this.envelopeSweepsLast = ((this.nr42 & 0x7) - 1) | 0;
        if ((this.totalLength | 0) == 0) {
            this.totalLength = 0x40;
        }
        if ((data & 0x40) == 0x40) {
            this.sound.setNR52(0x8);
        }
    }
    this.enableCheck();
}
GameBoyAdvanceChannel4Synth.prototype.readSOUND4CNT_H1 = function () {
    //NR44:
    return this.nr44 | 0;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function ARMInstructionSet(CPUCore) {
    this.CPUCore = CPUCore;
    this.initialize();
}
ARMInstructionSet.prototype.initialize = function () {
    this.wait = this.CPUCore.wait;
    this.registers = this.CPUCore.registers;
    this.registersUSR = this.CPUCore.registersUSR;
    this.branchFlags = this.CPUCore.branchFlags;
    this.fetch = 0;
    this.decode = 0;
    this.execute = 0;
    this.memory = this.CPUCore.memory;
}
ARMInstructionSet.prototype.executeIteration = function () {
    //Push the new fetch access:
    this.fetch = this.memory.memoryReadCPU32(this.readPC() | 0) | 0;
    //Execute Conditional Instruction:
    this.executeConditionalCode();
    //Update the pipelining state:
    this.execute = this.decode | 0;
    this.decode = this.fetch | 0;
}
ARMInstructionSet.prototype.executeConditionalCode = function () {
    //LSB of condition code is used to reverse the test logic:
    if (((this.execute << 3) ^ this.branchFlags.checkConditionalCode(this.execute | 0)) >= 0) {
        //Passed the condition code test, so execute:
        this.executeDecoded();
    }
    else {
        //Increment the program counter if we failed the test:
        this.incrementProgramCounter();
    }
}

ARMInstructionSet.prototype.executeBubble = function () {
    //Push the new fetch access:
    this.fetch = this.memory.memoryReadCPU32(this.readPC() | 0) | 0;
    //Update the Program Counter:
    this.incrementProgramCounter();
    //Update the pipelining state:
    this.execute = this.decode | 0;
    this.decode = this.fetch | 0;
}
ARMInstructionSet.prototype.incrementProgramCounter = function () {
    //Increment The Program Counter:
    this.registers[15] = ((this.registers[15] | 0) + 4) | 0;
}
ARMInstructionSet.prototype.getLR = function () {
    return ((this.readPC() | 0) - 4) | 0;
}
ARMInstructionSet.prototype.getIRQLR = function () {
    return this.getLR() | 0;
}
ARMInstructionSet.prototype.getCurrentFetchValue = function () {
    return this.fetch | 0;
}
ARMInstructionSet.prototype.getSWICode = function () {
    return (this.execute >> 16) & 0xFF;
}
ARMInstructionSet.prototype.writeRegister = function (address, data) {
    //Unguarded non-pc register write:
    address = address | 0;
    data = data | 0;
    this.registers[address & 0xF] = data | 0;
}
ARMInstructionSet.prototype.writeUserRegister = function (address, data) {
    //Unguarded non-pc user mode register write:
    address = address | 0;
    data = data | 0;
    this.registersUSR[address & 0x7] = data | 0;
}
ARMInstructionSet.prototype.guardRegisterWrite = function (address, data) {
    //Guarded register write:
    address = address | 0;
    data = data | 0;
    if ((address | 0) < 0xF) {
        //Non-PC Write:
        this.writeRegister(address | 0, data | 0);
    }
    else {
        //We performed a branch:
        this.CPUCore.branch(data & -4);
    }
}
ARMInstructionSet.prototype.multiplyGuard12OffsetRegisterWrite = function (data) {
    //Writes to R15 ignored in the multiply instruction!
    data = data | 0;
    var address = (this.execute >> 0xC) & 0xF;
    if ((address | 0) != 0xF) {
        this.writeRegister(address | 0, data | 0);
    }
}
ARMInstructionSet.prototype.multiplyGuard16OffsetRegisterWrite = function (data) {
    //Writes to R15 ignored in the multiply instruction!
    data = data | 0;
    var address = (this.execute >> 0x10) & 0xF;
    this.incrementProgramCounter();
    if ((address | 0) != 0xF) {
        this.writeRegister(address | 0, data | 0);
    }
}
ARMInstructionSet.prototype.performMUL32 = function () {
    var result = 0;
    if (((this.execute >> 16) & 0xF) != (this.execute & 0xF)) {
        /*
         http://www.chiark.greenend.org.uk/~theom/riscos/docs/ultimate/a252armc.txt
         
         Due to the way that Booth's algorithm has been implemented, certain
         combinations of operand registers should be avoided. (The assembler will
         issue a warning if these restrictions are overlooked.)
         The destination register (Rd) should not be the same as the Rm operand
         register, as Rd is used to hold intermediate values and Rm is used
         repeatedly during the multiply. A MUL will give a zero result if Rm=Rd, and
         a MLA will give a meaningless result.
         */
        result = this.CPUCore.performMUL32(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0) | 0;
    }
    return result | 0;
}
ARMInstructionSet.prototype.performMUL32MLA = function () {
    var result = 0;
    if (((this.execute >> 16) & 0xF) != (this.execute & 0xF)) {
        /*
         http://www.chiark.greenend.org.uk/~theom/riscos/docs/ultimate/a252armc.txt
         
         Due to the way that Booth's algorithm has been implemented, certain
         combinations of operand registers should be avoided. (The assembler will
         issue a warning if these restrictions are overlooked.)
         The destination register (Rd) should not be the same as the Rm operand
         register, as Rd is used to hold intermediate values and Rm is used
         repeatedly during the multiply. A MUL will give a zero result if Rm=Rd, and
         a MLA will give a meaningless result.
         */
        result = this.CPUCore.performMUL32MLA(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0) | 0;
    }
    return result | 0;
}
ARMInstructionSet.prototype.guard12OffsetRegisterWrite = function (data) {
    data = data | 0;
    this.incrementProgramCounter();
    this.guard12OffsetRegisterWrite2(data | 0);
}
ARMInstructionSet.prototype.guard12OffsetRegisterWrite2 = function (data) {
    data = data | 0;
    this.guardRegisterWrite((this.execute >> 0xC) & 0xF, data | 0);
}
ARMInstructionSet.prototype.guard16OffsetRegisterWrite = function (data) {
    data = data | 0;
    this.guardRegisterWrite((this.execute >> 0x10) & 0xF, data | 0);
}
ARMInstructionSet.prototype.guardProgramCounterRegisterWriteCPSR = function (data) {
    data = data | 0;
    //Restore SPSR to CPSR:
    data = data & (-4 >> (this.CPUCore.SPSRtoCPSR() >> 5));
    //We performed a branch:
    this.CPUCore.branch(data | 0);
}
ARMInstructionSet.prototype.guardRegisterWriteCPSR = function (address, data) {
    //Guard for possible pc write with cpsr update:
    address = address | 0;
    data = data | 0;
    if ((address | 0) < 0xF) {
        //Non-PC Write:
        this.writeRegister(address | 0, data | 0);
    }
    else {
        //Restore SPSR to CPSR:
        this.guardProgramCounterRegisterWriteCPSR(data | 0);
    }
}
ARMInstructionSet.prototype.guard12OffsetRegisterWriteCPSR = function (data) {
    data = data | 0;
    this.incrementProgramCounter();
    this.guard12OffsetRegisterWriteCPSR2(data | 0);
}
ARMInstructionSet.prototype.guard12OffsetRegisterWriteCPSR2 = function (data) {
    data = data | 0;
    this.guardRegisterWriteCPSR((this.execute >> 0xC) & 0xF, data | 0);
}
ARMInstructionSet.prototype.guard16OffsetRegisterWriteCPSR = function (data) {
    data = data | 0;
    this.guardRegisterWriteCPSR((this.execute >> 0x10) & 0xF, data | 0);
}
ARMInstructionSet.prototype.guardUserRegisterWrite = function (address, data) {
    //Guard only on user access, not PC!:
    address = address | 0;
    data = data | 0;
    switch (this.CPUCore.modeFlags & 0x1f) {
        case 0x10:
        case 0x1F:
            this.writeRegister(address | 0, data | 0);
            break;
        case 0x11:
            if ((address | 0) < 8) {
                this.writeRegister(address | 0, data | 0);
            }
            else {
                //User-Mode Register Write Inside Non-User-Mode:
                this.writeUserRegister(address | 0, data | 0);
            }
            break;
        default:
            if ((address | 0) < 13) {
                this.writeRegister(address | 0, data | 0);
            }
            else {
                //User-Mode Register Write Inside Non-User-Mode:
                this.writeUserRegister(address | 0, data | 0);
            }
    }
}
ARMInstructionSet.prototype.guardRegisterWriteLDM = function (address, data) {
    //Proxy guarded register write for LDM:
    address = address | 0;
    data = data | 0;
    this.guardRegisterWrite(address | 0, data | 0);
}
ARMInstructionSet.prototype.guardUserRegisterWriteLDM = function (address, data) {
    //Proxy guarded user mode register write with PC guard for LDM:
    address = address | 0;
    data = data | 0;
    if ((address | 0) < 0xF) {
        if ((this.execute & 0x8000) == 0x8000) {
            //PC is going to be loaded, don't do user-mode:
            this.guardRegisterWrite(address | 0, data | 0);
        }
        else {
            //PC isn't in the list, do user-mode:
            this.guardUserRegisterWrite(address | 0, data | 0);
        }
    }
    else {
        this.guardProgramCounterRegisterWriteCPSR(data | 0);
    }
}
ARMInstructionSet.prototype.baseRegisterWrite = function (data, userMode) {
    //Update writeback for offset+base modes:
    data = data | 0;
    userMode = userMode | 0;
    var address = (this.execute >> 16) & 0xF;
    if ((address | userMode) == 0xF) {
        this.guardRegisterWrite(address | 0, data | 0);
    }
    else {
        this.guardUserRegisterWrite(address | 0, data | 0);
    }
}
ARMInstructionSet.prototype.readPC = function () {
    //PC register read:
    return this.registers[0xF] | 0;
}
ARMInstructionSet.prototype.readRegister = function (address) {
    //Unguarded register read:
    address = address | 0;
    return this.registers[address & 0xF] | 0;
}
ARMInstructionSet.prototype.readUserRegister = function (address) {
    //Unguarded user mode register read:
    address = address | 0;
    return this.registersUSR[address & 0x7] | 0;
}
ARMInstructionSet.prototype.read0OffsetRegister = function () {
    //Unguarded register read at position 0:
    return this.readRegister(this.execute | 0) | 0;
}
ARMInstructionSet.prototype.read8OffsetRegister = function () {
    //Unguarded register read at position 0x8:
    return this.readRegister(this.execute >> 0x8) | 0;
}
ARMInstructionSet.prototype.read12OffsetRegister = function () {
    //Unguarded register read at position 0xC:
    return this.readRegister(this.execute >> 0xC) | 0;
}
ARMInstructionSet.prototype.read16OffsetRegister = function () {
    //Unguarded register read at position 0x10:
    return this.readRegister(this.execute >> 0x10) | 0;
}
ARMInstructionSet.prototype.guard12OffsetRegisterRead = function () {
    this.incrementProgramCounter();
    return this.readRegister((this.execute >> 12) & 0xF) | 0;
}
ARMInstructionSet.prototype.guardUserRegisterRead = function (address) {
    //Guard only on user access, not PC!:
    address = address | 0;
    switch (this.CPUCore.modeFlags & 0x1f) {
        case 0x10:
        case 0x1F:
            return this.readRegister(address | 0) | 0;
        case 0x11:
            if ((address | 0) < 8) {
                return this.readRegister(address | 0) | 0;
            }
            else {
                //User-Mode Register Read Inside Non-User-Mode:
                return this.readUserRegister(address | 0) | 0;
            }
            break;
        default:
            if ((address | 0) < 13) {
                return this.readRegister(address | 0) | 0;
            }
            else {
                //User-Mode Register Read Inside Non-User-Mode:
                return this.readUserRegister(address | 0) | 0;
            }
    }
}
ARMInstructionSet.prototype.guardUserRegisterReadSTM = function (address) {
    //Proxy guarded user mode read (used by STM*):
    address = address | 0;
    if ((address | 0) < 0xF) {
        return this.guardUserRegisterRead(address | 0) | 0;
    }
    else {
        //Get Special Case PC Read:
        return this.readPC() | 0;
    }
}
ARMInstructionSet.prototype.baseRegisterRead = function (userMode) {
    //Read specially for offset+base modes:
    userMode = userMode | 0;
    var address = (this.execute >> 16) & 0xF;
    if ((address | userMode) == 0xF) {
        return this.readRegister(address | 0) | 0;
    }
    else {
        return this.guardUserRegisterRead(address | 0) | 0;
    }
}
ARMInstructionSet.prototype.BX = function () {
    //Branch & eXchange:
    var address = this.read0OffsetRegister() | 0;
    if ((address & 0x1) == 0) {
        //Stay in ARM mode:
        this.CPUCore.branch(address & -4);
    }
    else {
        //Enter THUMB mode:
        this.CPUCore.enterTHUMB();
        this.CPUCore.branch(address & -2);
    }
}
ARMInstructionSet.prototype.B = function () {
    //Branch:
    this.CPUCore.branch(((this.readPC() | 0) + ((this.execute << 8) >> 6)) | 0);
}
ARMInstructionSet.prototype.BL = function () {
    //Branch with Link:
    this.writeRegister(0xE, this.getLR() | 0);
    this.B();
}
ARMInstructionSet.prototype.AND = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Perform bitwise AND:
    //Update destination register:
    this.guard12OffsetRegisterWrite(operand1 & operand2);
}
ARMInstructionSet.prototype.AND2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Perform bitwise AND:
    //Update destination register:
    this.guard12OffsetRegisterWrite2(operand1 & operand2);
}
ARMInstructionSet.prototype.ANDS = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing2() | 0;
    //Perform bitwise AND:
    var result = operand1 & operand2;
    this.branchFlags.setNZInt(result | 0);
    //Update destination register and guard CPSR for PC:
    this.guard12OffsetRegisterWriteCPSR(result | 0);
}
ARMInstructionSet.prototype.ANDS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing4() | 0;
    //Perform bitwise AND:
    var result = operand1 & operand2;
    this.branchFlags.setNZInt(result | 0);
    //Update destination register and guard CPSR for PC:
    this.guard12OffsetRegisterWriteCPSR2(result | 0);
}
ARMInstructionSet.prototype.EOR = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Perform bitwise EOR:
    //Update destination register:
    this.guard12OffsetRegisterWrite(operand1 ^ operand2);
}
ARMInstructionSet.prototype.EOR2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Perform bitwise EOR:
    //Update destination register:
    this.guard12OffsetRegisterWrite2(operand1 ^ operand2);
}
ARMInstructionSet.prototype.EORS = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing2() | 0;
    //Perform bitwise EOR:
    var result = operand1 ^ operand2;
    this.branchFlags.setNZInt(result | 0);
    //Update destination register and guard CPSR for PC:
    this.guard12OffsetRegisterWriteCPSR(result | 0);
}
ARMInstructionSet.prototype.EORS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing4() | 0;
    //Perform bitwise EOR:
    var result = operand1 ^ operand2;
    this.branchFlags.setNZInt(result | 0);
    //Update destination register and guard CPSR for PC:
    this.guard12OffsetRegisterWriteCPSR2(result | 0);
}
ARMInstructionSet.prototype.SUB = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Perform Subtraction:
    //Update destination register:
    this.guard12OffsetRegisterWrite(((operand1 | 0) - (operand2 | 0)) | 0);
}
ARMInstructionSet.prototype.SUB2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Perform Subtraction:
    //Update destination register:
    this.guard12OffsetRegisterWrite2(((operand1 | 0) - (operand2 | 0)) | 0);
}
ARMInstructionSet.prototype.SUBS = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Update destination register:
    this.guard12OffsetRegisterWriteCPSR(this.branchFlags.setSUBFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.SUBS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Update destination register:
    this.guard12OffsetRegisterWriteCPSR2(this.branchFlags.setSUBFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.RSB = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Perform Subtraction:
    //Update destination register:
    this.guard12OffsetRegisterWrite(((operand2 | 0) - (operand1 | 0)) | 0);
}
ARMInstructionSet.prototype.RSB2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Perform Subtraction:
    //Update destination register:
    this.guard12OffsetRegisterWrite2(((operand2 | 0) - (operand1 | 0)) | 0);
}
ARMInstructionSet.prototype.RSBS = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Update destination register:
    this.guard12OffsetRegisterWriteCPSR(this.branchFlags.setSUBFlags(operand2 | 0, operand1 | 0) | 0);
}
ARMInstructionSet.prototype.RSBS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Update destination register:
    this.guard12OffsetRegisterWriteCPSR2(this.branchFlags.setSUBFlags(operand2 | 0, operand1 | 0) | 0);
}
ARMInstructionSet.prototype.ADD = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Perform Addition:
    //Update destination register:
    this.guard12OffsetRegisterWrite(((operand1 | 0) + (operand2 | 0)) | 0);
}
ARMInstructionSet.prototype.ADD2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Perform Addition:
    //Update destination register:
    this.guard12OffsetRegisterWrite2(((operand1 | 0) + (operand2 | 0)) | 0);
}
ARMInstructionSet.prototype.ADDS = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Update destination register:
    this.guard12OffsetRegisterWriteCPSR(this.branchFlags.setADDFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.ADDS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Update destination register:
    this.guard12OffsetRegisterWriteCPSR2(this.branchFlags.setADDFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.ADC = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Perform Addition w/ Carry:
    //Update destination register:
	operand1 = ((operand1 | 0) + (operand2 | 0)) | 0;
	operand1 = ((operand1 | 0) + (this.branchFlags.getCarry() >>> 31)) | 0;
    this.guard12OffsetRegisterWrite(operand1 | 0);
}
ARMInstructionSet.prototype.ADC2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Perform Addition w/ Carry:
    //Update destination register:
	operand1 = ((operand1 | 0) + (operand2 | 0)) | 0;
	operand1 = ((operand1 | 0) + (this.branchFlags.getCarry() >>> 31)) | 0;
    this.guard12OffsetRegisterWrite2(operand1 | 0);
}
ARMInstructionSet.prototype.ADCS = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Update destination register:
    this.guard12OffsetRegisterWriteCPSR(this.branchFlags.setADCFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.ADCS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Update destination register:
    this.guard12OffsetRegisterWriteCPSR2(this.branchFlags.setADCFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.SBC = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Perform Subtraction w/ Carry:
    //Update destination register:
	operand1 = ((operand1 | 0) - (operand2 | 0)) | 0;
	operand1 = ((operand1 | 0) - (this.branchFlags.getCarryReverse() >>> 31)) | 0;
    this.guard12OffsetRegisterWrite(operand1 | 0);
}
ARMInstructionSet.prototype.SBC2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Perform Subtraction w/ Carry:
    //Update destination register:
	operand1 = ((operand1 | 0) - (operand2 | 0)) | 0;
	operand1 = ((operand1 | 0) - (this.branchFlags.getCarryReverse() >>> 31)) | 0;
    this.guard12OffsetRegisterWrite2(operand1 | 0);
}
ARMInstructionSet.prototype.SBCS = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Update destination register:
    this.guard12OffsetRegisterWriteCPSR(this.branchFlags.setSBCFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.SBCS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Update destination register:
    this.guard12OffsetRegisterWriteCPSR2(this.branchFlags.setSBCFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.RSC = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Perform Reverse Subtraction w/ Carry:
    //Update destination register:
	operand1 = ((operand2 | 0) - (operand1 | 0)) | 0;
	operand1 = ((operand1 | 0) - (this.branchFlags.getCarryReverse() >>> 31)) | 0;
    this.guard12OffsetRegisterWrite(operand1 | 0);
}
ARMInstructionSet.prototype.RSC2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Perform Reverse Subtraction w/ Carry:
    //Update destination register:
	operand1 = ((operand2 | 0) - (operand1 | 0)) | 0;
	operand1 = ((operand1 | 0) - (this.branchFlags.getCarryReverse() >>> 31)) | 0;
    this.guard12OffsetRegisterWrite2(operand1 | 0);
}
ARMInstructionSet.prototype.RSCS = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Update destination register:
    this.guard12OffsetRegisterWriteCPSR(this.branchFlags.setSBCFlags(operand2 | 0, operand1 | 0) | 0);
}
ARMInstructionSet.prototype.RSCS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Update destination register:
    this.guard12OffsetRegisterWriteCPSR2(this.branchFlags.setSBCFlags(operand2 | 0, operand1 | 0) | 0);
}
ARMInstructionSet.prototype.TSTS = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing2() | 0;
    //Perform bitwise AND:
    var result = operand1 & operand2;
    this.branchFlags.setNZInt(result | 0);
    //Increment PC:
    this.incrementProgramCounter();
}
ARMInstructionSet.prototype.TSTS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing4() | 0;
    //Perform bitwise AND:
    var result = operand1 & operand2;
    this.branchFlags.setNZInt(result | 0);
}
ARMInstructionSet.prototype.TEQS = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing2() | 0;
    //Perform bitwise EOR:
    var result = operand1 ^ operand2;
    this.branchFlags.setNZInt(result | 0);
    //Increment PC:
    this.incrementProgramCounter();
}
ARMInstructionSet.prototype.TEQS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing4() | 0;
    //Perform bitwise EOR:
    var result = operand1 ^ operand2;
    this.branchFlags.setNZInt(result | 0);
}
ARMInstructionSet.prototype.CMPS = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    this.branchFlags.setCMPFlags(operand1 | 0, operand2 | 0);
    //Increment PC:
    this.incrementProgramCounter();
}
ARMInstructionSet.prototype.CMPS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    this.branchFlags.setCMPFlags(operand1 | 0, operand2 | 0);
}
ARMInstructionSet.prototype.CMNS = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1();
    this.branchFlags.setCMNFlags(operand1 | 0, operand2 | 0);
    //Increment PC:
    this.incrementProgramCounter();
}
ARMInstructionSet.prototype.CMNS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3();
    this.branchFlags.setCMNFlags(operand1 | 0, operand2 | 0);
}
ARMInstructionSet.prototype.ORR = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing1() | 0;
    //Perform bitwise OR:
    //Update destination register:
    this.guard12OffsetRegisterWrite(operand1 | operand2);
}
ARMInstructionSet.prototype.ORR2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing3() | 0;
    //Perform bitwise OR:
    //Update destination register:
    this.guard12OffsetRegisterWrite2(operand1 | operand2);
}
ARMInstructionSet.prototype.ORRS = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing2() | 0;
    //Perform bitwise OR:
    var result = operand1 | operand2;
    this.branchFlags.setNZInt(result | 0);
    //Update destination register and guard CPSR for PC:
    this.guard12OffsetRegisterWriteCPSR(result | 0);
}
ARMInstructionSet.prototype.ORRS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    var operand2 = this.operand2OP_DataProcessing4() | 0;
    //Perform bitwise OR:
    var result = operand1 | operand2;
    this.branchFlags.setNZInt(result | 0);
    //Update destination register and guard CPSR for PC:
    this.guard12OffsetRegisterWriteCPSR2(result | 0);
}
ARMInstructionSet.prototype.MOV = function () {
    //Perform move:
    //Update destination register:
    this.guard12OffsetRegisterWrite(this.operand2OP_DataProcessing1() | 0);
}
ARMInstructionSet.prototype.MOV2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    //Perform move:
    //Update destination register:
    this.guard12OffsetRegisterWrite2(this.operand2OP_DataProcessing3() | 0);
}
ARMInstructionSet.prototype.MOVS = function () {
    var operand2 = this.operand2OP_DataProcessing2() | 0;
    //Perform move:
    this.branchFlags.setNZInt(operand2 | 0);
    //Update destination register and guard CPSR for PC:
    this.guard12OffsetRegisterWriteCPSR(operand2 | 0);
}
ARMInstructionSet.prototype.MOVS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand2 = this.operand2OP_DataProcessing4() | 0;
    //Perform move:
    this.branchFlags.setNZInt(operand2 | 0);
    //Update destination register and guard CPSR for PC:
    this.guard12OffsetRegisterWriteCPSR2(operand2 | 0);
}
ARMInstructionSet.prototype.BIC = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    //NOT operand 2:
    var operand2 = ~this.operand2OP_DataProcessing1();
    //Perform bitwise AND:
    //Update destination register:
    this.guard12OffsetRegisterWrite(operand1 & operand2);
}
ARMInstructionSet.prototype.BIC2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    //NOT operand 2:
    var operand2 = ~this.operand2OP_DataProcessing3();
    //Perform bitwise AND:
    //Update destination register:
    this.guard12OffsetRegisterWrite2(operand1 & operand2);
}
ARMInstructionSet.prototype.BICS = function () {
    var operand1 = this.read16OffsetRegister() | 0;
    //NOT operand 2:
    var operand2 = ~this.operand2OP_DataProcessing2();
    //Perform bitwise AND:
    var result = operand1 & operand2;
    this.branchFlags.setNZInt(result | 0);
    //Update destination register and guard CPSR for PC:
    this.guard12OffsetRegisterWriteCPSR(result | 0);
}
ARMInstructionSet.prototype.BICS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand1 = this.read16OffsetRegister() | 0;
    //NOT operand 2:
    var operand2 = ~this.operand2OP_DataProcessing4();
    //Perform bitwise AND:
    var result = operand1 & operand2;
    this.branchFlags.setNZInt(result | 0);
    //Update destination register and guard CPSR for PC:
    this.guard12OffsetRegisterWriteCPSR2(result | 0);
}
ARMInstructionSet.prototype.MVN = function () {
    //Perform move negative:
    //Update destination register:
    this.guard12OffsetRegisterWrite(~this.operand2OP_DataProcessing1());
}
ARMInstructionSet.prototype.MVN2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    //Perform move negative:
    //Update destination register:
    this.guard12OffsetRegisterWrite2(~this.operand2OP_DataProcessing3());
}
ARMInstructionSet.prototype.MVNS = function () {
    var operand2 = ~this.operand2OP_DataProcessing2();
    //Perform move negative:
    this.branchFlags.setNZInt(operand2 | 0);
    //Update destination register and guard CPSR for PC:
    this.guard12OffsetRegisterWriteCPSR(operand2 | 0);
}
ARMInstructionSet.prototype.MVNS2 = function () {
    //Increment PC:
    this.incrementProgramCounter();
    var operand2 = ~this.operand2OP_DataProcessing4();
    //Perform move negative:
    this.branchFlags.setNZInt(operand2 | 0);
    //Update destination register and guard CPSR for PC:
    this.guard12OffsetRegisterWriteCPSR2(operand2 | 0);
}
ARMInstructionSet.prototype.MRS = function () {
    //Transfer PSR to Register:
    var psr = 0;
    if ((this.execute & 0x400000) == 0) {
        //CPSR->Register
        psr = this.rc() | 0;
    }
    else {
        //SPSR->Register
        psr = this.rs() | 0;
    }
    this.guard12OffsetRegisterWrite(psr | 0);
}
ARMInstructionSet.prototype.MSR = function () {
    switch (this.execute & 0x2400000) {
        case 0:
            //Reg->CPSR
            this.MSR1();
            break;
        case 0x400000:
            //Reg->SPSR
            this.MSR2();
            break;
        case 0x2000000:
            //Immediate->CPSR
            this.MSR3();
            break;
        default:
            //Immediate->SPSR
            this.MSR4();
    }
    //Increment PC:
    this.incrementProgramCounter();
}
ARMInstructionSet.prototype.MSR1 = function () {
    var newcpsr = this.read0OffsetRegister() | 0;
    this.branchFlags.setNZCV(newcpsr | 0);
    if ((this.execute & 0x10000) == 0x10000 && (this.CPUCore.modeFlags & 0x1f) != 0x10) {
        this.CPUCore.switchRegisterBank(newcpsr & 0x1F);
        this.CPUCore.modeFlags = newcpsr & 0xdf;
        this.CPUCore.assertIRQ();
    }
}
ARMInstructionSet.prototype.MSR2 = function () {
    var operand = this.read0OffsetRegister() | 0;
    var bank = 1;
    switch (this.CPUCore.modeFlags & 0x1f) {
        case 0x12:    //IRQ
            break;
        case 0x13:    //Supervisor
            bank = 2;
            break;
        case 0x11:    //FIQ
            bank = 0;
            break;
        case 0x17:    //Abort
            bank = 3;
            break;
        case 0x1B:    //Undefined
            bank = 4;
            break;
        default:
            return;
    }
    var spsr = (operand >> 20) & 0xF00;
    if ((this.execute & 0x10000) == 0x10000) {
        spsr = spsr | (operand & 0xFF);
    }
    else {
        spsr = spsr | (this.CPUCore.SPSR[bank | 0] & 0xFF);
    }
    this.CPUCore.SPSR[bank | 0] = spsr | 0;
}
ARMInstructionSet.prototype.MSR3 = function () {
    var operand = this.imm() | 0;
    this.branchFlags.setNZCV(operand | 0);
}
ARMInstructionSet.prototype.MSR4 = function () {
    var operand = this.imm() >> 20;
    var bank = 1;
    switch (this.CPUCore.modeFlags & 0x1f) {
        case 0x12:    //IRQ
            break;
        case 0x13:    //Supervisor
            bank = 2;
            break;
        case 0x11:    //FIQ
            bank = 0;
            break;
        case 0x17:    //Abort
            bank = 3;
            break;
        case 0x1B:    //Undefined
            bank = 4;
            break;
        default:
            return;
    }
    var spsr = this.CPUCore.SPSR[bank | 0] & 0xFF;
    this.CPUCore.SPSR[bank | 0] = spsr | (operand & 0xF00);
}
ARMInstructionSet.prototype.MUL = function () {
    //Perform multiplication:
    var result = this.performMUL32() | 0;
    //Update destination register:
    this.multiplyGuard16OffsetRegisterWrite(result | 0);
}
ARMInstructionSet.prototype.MULS = function () {
    //Perform multiplication:
    var result = this.performMUL32() | 0;
    this.branchFlags.setCarryFalse();
    this.branchFlags.setNZInt(result | 0);
    //Update destination register and guard CPSR for PC:
    this.multiplyGuard16OffsetRegisterWrite(result | 0);
}
ARMInstructionSet.prototype.MLA = function () {
    //Perform multiplication:
    var result = this.performMUL32MLA() | 0;
    //Perform addition:
    result = ((result | 0) + (this.read12OffsetRegister() | 0)) | 0;
    //Update destination register:
    this.multiplyGuard16OffsetRegisterWrite(result | 0);
}
ARMInstructionSet.prototype.MLAS = function () {
    //Perform multiplication:
    var result = this.performMUL32MLA() | 0;
    //Perform addition:
    result = ((result | 0) + (this.read12OffsetRegister() | 0)) | 0;
    this.branchFlags.setCarryFalse();
    this.branchFlags.setNZInt(result | 0);
    //Update destination register and guard CPSR for PC:
    this.multiplyGuard16OffsetRegisterWrite(result | 0);
}
ARMInstructionSet.prototype.UMULL = function () {
    //Perform multiplication:
    this.CPUCore.performUMUL64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0);
    //Update destination register:
    this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
    this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.UMULLS = function () {
    //Perform multiplication:
    this.CPUCore.performUMUL64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0);
    this.branchFlags.setCarryFalse();
    this.branchFlags.setNegative(this.CPUCore.mul64ResultHigh | 0);
    this.branchFlags.setZero(this.CPUCore.mul64ResultHigh | this.CPUCore.mul64ResultLow);
    //Update destination register and guard CPSR for PC:
    this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
    this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.UMLAL = function () {
    //Perform multiplication:
    this.CPUCore.performUMLA64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0, this.read16OffsetRegister() | 0, this.read12OffsetRegister() | 0);
    //Update destination register:
    this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
    this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.UMLALS = function () {
    //Perform multiplication:
    this.CPUCore.performUMLA64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0, this.read16OffsetRegister() | 0, this.read12OffsetRegister() | 0);
    this.branchFlags.setCarryFalse();
    this.branchFlags.setNegative(this.CPUCore.mul64ResultHigh | 0);
    this.branchFlags.setZero(this.CPUCore.mul64ResultHigh | this.CPUCore.mul64ResultLow);
    //Update destination register and guard CPSR for PC:
    this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
    this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.SMULL = function () {
    //Perform multiplication:
    this.CPUCore.performMUL64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0);
    //Update destination register:
    this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
    this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.SMULLS = function () {
    //Perform multiplication:
    this.CPUCore.performMUL64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0);
    this.branchFlags.setCarryFalse();
    this.branchFlags.setNegative(this.CPUCore.mul64ResultHigh | 0);
    this.branchFlags.setZero(this.CPUCore.mul64ResultHigh | this.CPUCore.mul64ResultLow);
    //Update destination register and guard CPSR for PC:
    this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
    this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.SMLAL = function () {
    //Perform multiplication:
    this.CPUCore.performMLA64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0, this.read16OffsetRegister() | 0, this.read12OffsetRegister() | 0);
    //Update destination register:
    this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
    this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.SMLALS = function () {
    //Perform multiplication:
    this.CPUCore.performMLA64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0, this.read16OffsetRegister() | 0, this.read12OffsetRegister() | 0);
    this.branchFlags.setCarryFalse();
    this.branchFlags.setNegative(this.CPUCore.mul64ResultHigh | 0);
    this.branchFlags.setZero(this.CPUCore.mul64ResultHigh | this.CPUCore.mul64ResultLow);
    //Update destination register and guard CPSR for PC:
    this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
    this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.STRH = function () {
    //Perform halfword store calculations:
    var address = this.operand2OP_LoadStore1() | 0;
    //Write to memory location:
    this.CPUCore.write16(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRH = function () {
    //Perform halfword load calculations:
    var address = this.operand2OP_LoadStore1() | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite(this.CPUCore.read16(address | 0) | 0);
}
ARMInstructionSet.prototype.LDRSH = function () {
    //Perform signed halfword load calculations:
    var address = this.operand2OP_LoadStore1() | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite((this.CPUCore.read16(address | 0) << 16) >> 16);
}
ARMInstructionSet.prototype.LDRSB = function () {
    //Perform signed byte load calculations:
    var address = this.operand2OP_LoadStore1() | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite((this.CPUCore.read8(address | 0) << 24) >> 24);
}
ARMInstructionSet.prototype.STRH2 = function () {
    //Perform halfword store calculations:
    var address = this.operand2OP_LoadStore2() | 0;
    //Write to memory location:
    this.CPUCore.write16(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRH2 = function () {
    //Perform halfword load calculations:
    var address = this.operand2OP_LoadStore2() | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite(this.CPUCore.read16(address | 0) | 0);
}
ARMInstructionSet.prototype.LDRSH2 = function () {
    //Perform signed halfword load calculations:
    var address = this.operand2OP_LoadStore2() | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite((this.CPUCore.read16(address | 0) << 16) >> 16);
}
ARMInstructionSet.prototype.LDRSB2 = function () {
    //Perform signed byte load calculations:
    var address = this.operand2OP_LoadStore2() | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite((this.CPUCore.read8(address | 0) << 24) >> 24);
}
ARMInstructionSet.prototype.STR = function () {
    //Perform word store calculations:
    var address = this.operand2OP_LoadStore3(0) | 0;
    //Write to memory location:
    this.CPUCore.write32(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDR = function () {
    //Perform word load calculations:
    var address = this.operand2OP_LoadStore3(0) | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite(this.CPUCore.read32(address | 0) | 0);
}
ARMInstructionSet.prototype.STRB = function () {
    //Perform byte store calculations:
    var address = this.operand2OP_LoadStore3(0) | 0;
    //Write to memory location:
    this.CPUCore.write8(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRB = function () {
    //Perform byte store calculations:
    var address = this.operand2OP_LoadStore3(0) | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite(this.CPUCore.read8(address | 0) | 0);
}
ARMInstructionSet.prototype.STR4 = function () {
    //Perform word store calculations:
    var address = this.operand2OP_LoadStore4() | 0;
    //Write to memory location:
    this.CPUCore.write32(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDR4 = function () {
    //Perform word load calculations:
    var address = this.operand2OP_LoadStore4() | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite(this.CPUCore.read32(address | 0) | 0);
}
ARMInstructionSet.prototype.STRB4 = function () {
    //Perform byte store calculations:
    var address = this.operand2OP_LoadStore4() | 0;
    //Write to memory location:
    this.CPUCore.write8(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRB4 = function () {
    //Perform byte store calculations:
    var address = this.operand2OP_LoadStore4() | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite(this.CPUCore.read8(address | 0) | 0);
}
ARMInstructionSet.prototype.STRT = function () {
    //Perform word store calculations (forced user-mode):
    var address = this.operand2OP_LoadStore3(0xF) | 0;
    //Write to memory location:
    this.CPUCore.write32(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRT = function () {
    //Perform word load calculations (forced user-mode):
    var address = this.operand2OP_LoadStore3(0xF) | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite(this.CPUCore.read32(address | 0) | 0);
}
ARMInstructionSet.prototype.STRBT = function () {
    //Perform byte store calculations (forced user-mode):
    var address = this.operand2OP_LoadStore3(0xF) | 0;
    //Write to memory location:
    this.CPUCore.write8(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRBT = function () {
    //Perform byte load calculations (forced user-mode):
    var address = this.operand2OP_LoadStore3(0xF) | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite(this.CPUCore.read8(address | 0) | 0);
}
ARMInstructionSet.prototype.STR2 = function () {
    //Perform word store calculations:
    var address = this.operand2OP_LoadStore5(0) | 0;
    //Write to memory location:
    this.CPUCore.write32(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDR2 = function () {
    //Perform word load calculations:
    var address = this.operand2OP_LoadStore5(0) | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite(this.CPUCore.read32(address | 0) | 0);
}
ARMInstructionSet.prototype.STRB2 = function () {
    //Perform byte store calculations:
    var address = this.operand2OP_LoadStore5(0) | 0;
    //Write to memory location:
    this.CPUCore.write8(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRB2 = function () {
    //Perform byte store calculations:
    var address = this.operand2OP_LoadStore5(0) | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite(this.CPUCore.read8(address | 0) | 0);
}
ARMInstructionSet.prototype.STRT2 = function () {
    //Perform word store calculations (forced user-mode):
    var address = this.operand2OP_LoadStore5(0xF) | 0;
    //Write to memory location:
    this.CPUCore.write32(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRT2 = function () {
    //Perform word load calculations (forced user-mode):
    var address = this.operand2OP_LoadStore5(0xF) | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite(this.CPUCore.read32(address | 0) | 0);
}
ARMInstructionSet.prototype.STRBT2 = function () {
    //Perform byte store calculations (forced user-mode):
    var address = this.operand2OP_LoadStore5(0xF) | 0;
    //Write to memory location:
    this.CPUCore.write8(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRBT2 = function () {
    //Perform byte load calculations (forced user-mode):
    var address = this.operand2OP_LoadStore5(0xF) | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite(this.CPUCore.read8(address | 0) | 0);
}
ARMInstructionSet.prototype.STR3 = function () {
    //Perform word store calculations:
    var address = this.operand2OP_LoadStore6() | 0;
    //Write to memory location:
    this.CPUCore.write32(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDR3 = function () {
    //Perform word load calculations:
    var address = this.operand2OP_LoadStore6() | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite(this.CPUCore.read32(address | 0) | 0);
}
ARMInstructionSet.prototype.STRB3 = function () {
    //Perform byte store calculations:
    var address = this.operand2OP_LoadStore6() | 0;
    //Write to memory location:
    this.CPUCore.write8(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRB3 = function () {
    //Perform byte store calculations:
    var address = this.operand2OP_LoadStore6() | 0;
    //Read from memory location:
    this.guard12OffsetRegisterWrite(this.CPUCore.read8(address | 0) | 0);
}
ARMInstructionSet.prototype.STMIA = function () {
    //Only initialize the STMIA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
                currentAddress = ((currentAddress | 0) + 4) | 0;
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMIAW = function () {
    //Only initialize the STMIA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
                currentAddress = ((currentAddress | 0) + 4) | 0;
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMDA = function () {
    //Only initialize the STMDA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
                currentAddress = ((currentAddress | 0) - 4) | 0;
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMDAW = function () {
    //Only initialize the STMDA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
                currentAddress = ((currentAddress | 0) - 4) | 0;
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMIB = function () {
    //Only initialize the STMIB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0; rListPosition < 0x10;  rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                currentAddress = ((currentAddress | 0) + 4) | 0;
                this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMIBW = function () {
    //Only initialize the STMIB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0; rListPosition < 0x10;  rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                currentAddress = ((currentAddress | 0) + 4) | 0;
                this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMDB = function () {
    //Only initialize the STMDB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                currentAddress = ((currentAddress | 0) - 4) | 0;
                this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMDBW = function () {
    //Only initialize the STMDB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                currentAddress = ((currentAddress | 0) - 4) | 0;
                this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMIAG = function () {
    //Only initialize the STMIA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
                currentAddress = ((currentAddress | 0) + 4) | 0;
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMIAWG = function () {
    //Only initialize the STMIA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
                currentAddress = ((currentAddress | 0) + 4) | 0;
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMDAG = function () {
    //Only initialize the STMDA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
                currentAddress = ((currentAddress | 0) - 4) | 0;
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMDAWG = function () {
    //Only initialize the STMDA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
                currentAddress = ((currentAddress | 0) - 4) | 0;
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMIBG = function () {
    //Only initialize the STMIB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0; rListPosition < 0x10;  rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                currentAddress = ((currentAddress | 0) + 4) | 0;
                this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMIBWG = function () {
    //Only initialize the STMIB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0; rListPosition < 0x10;  rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                currentAddress = ((currentAddress | 0) + 4) | 0;
                this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMDBG = function () {
    //Only initialize the STMDB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                currentAddress = ((currentAddress | 0) - 4) | 0;
                this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.STMDBWG = function () {
    //Only initialize the STMDB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                currentAddress = ((currentAddress | 0) - 4) | 0;
                this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMIA = function () {
    //Only initialize the LDMIA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0; rListPosition < 0x10;  rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
                currentAddress = ((currentAddress | 0) + 4) | 0;
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMIAW = function () {
    //Only initialize the LDMIA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0; rListPosition < 0x10;  rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
                currentAddress = ((currentAddress | 0) + 4) | 0;
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMDA = function () {
    //Only initialize the LDMDA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
                currentAddress = ((currentAddress | 0) - 4) | 0;
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMDAW = function () {
    //Only initialize the LDMDA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
                currentAddress = ((currentAddress | 0) - 4) | 0;
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMIB = function () {
    //Only initialize the LDMIB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0; rListPosition < 0x10;  rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                currentAddress = ((currentAddress | 0) + 4) | 0;
                this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMIBW = function () {
    //Only initialize the LDMIB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0; rListPosition < 0x10;  rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                currentAddress = ((currentAddress | 0) + 4) | 0;
                this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMDB = function () {
    //Only initialize the LDMDB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                currentAddress = ((currentAddress | 0) - 4) | 0;
                this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMDBW = function () {
    //Only initialize the LDMDB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                currentAddress = ((currentAddress | 0) - 4) | 0;
                this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMIAG = function () {
    //Only initialize the LDMIA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0; rListPosition < 0x10;  rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
                currentAddress = ((currentAddress | 0) + 4) | 0;
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMIAWG = function () {
    //Only initialize the LDMIA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0; rListPosition < 0x10;  rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
                currentAddress = ((currentAddress | 0) + 4) | 0;
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMDAG = function () {
    //Only initialize the LDMDA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
                currentAddress = ((currentAddress | 0) - 4) | 0;
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMDAWG = function () {
    //Only initialize the LDMDA sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
                currentAddress = ((currentAddress | 0) - 4) | 0;
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMIBG = function () {
    //Only initialize the LDMIB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0; rListPosition < 0x10;  rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                currentAddress = ((currentAddress | 0) + 4) | 0;
                this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMIBWG = function () {
    //Only initialize the LDMIB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0; rListPosition < 0x10;  rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                currentAddress = ((currentAddress | 0) + 4) | 0;
                this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMDBG = function () {
    //Only initialize the LDMDB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                currentAddress = ((currentAddress | 0) - 4) | 0;
                this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LDMDBWG = function () {
    //Only initialize the LDMDB sequence if the register list is non-empty:
    if ((this.execute & 0xFFFF) > 0) {
        //Get the base address:
        var currentAddress = this.read16OffsetRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load register(s) from memory:
        for (var rListPosition = 0xF; rListPosition > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                currentAddress = ((currentAddress | 0) - 4) | 0;
                this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
            }
        }
        //Store the updated base address back into register:
        this.guard16OffsetRegisterWrite(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
}
ARMInstructionSet.prototype.LoadStoreMultiple = function () {
    this.incrementProgramCounter();
    switch ((this.execute >> 20) & 0x1F) {
        case 0:
            this.STMDA();
            break;
        case 0x1:
            this.LDMDA();
            break;
        case 0x2:
            this.STMDAW();
            break;
        case 0x3:
            this.LDMDAW();
            break;
        case 0x4:
            this.STMDAG();
            break;
        case 0x5:
            this.LDMDAG();
            break;
        case 0x6:
            this.STMDAWG();
            break;
        case 0x7:
            this.LDMDAWG();
            break;
        case 0x8:
            this.STMIA();
            break;
        case 0x9:
            this.LDMIA();
            break;
        case 0xA:
            this.STMIAW();
            break;
        case 0xB:
            this.LDMIAW();
            break;
        case 0xC:
            this.STMIAG();
            break;
        case 0xD:
            this.LDMIAG();
            break;
        case 0xE:
            this.STMIAWG();
            break;
        case 0xF:
            this.LDMIAWG();
            break;
        case 0x10:
            this.STMDB();
            break;
        case 0x11:
            this.LDMDB();
            break;
        case 0x12:
            this.STMDBW();
            break;
        case 0x13:
            this.LDMDBW();
            break;
        case 0x14:
            this.STMDBG();
            break;
        case 0x15:
            this.LDMDBG();
            break;
        case 0x16:
            this.STMDBWG();
            break;
        case 0x17:
            this.LDMDBWG();
            break;
        case 0x18:
            this.STMIB();
            break;
        case 0x19:
            this.LDMIB();
            break;
        case 0x1A:
            this.STMIBW();
            break;
        case 0x1B:
            this.LDMIBW();
            break;
        case 0x1C:
            this.STMIBG();
            break;
        case 0x1D:
            this.LDMIBG();
            break;
        case 0x1E:
            this.STMIBWG();
            break;
        default:
            this.LDMIBWG();
    }
}
ARMInstructionSet.prototype.SWP = function () {
    var base = this.read16OffsetRegister() | 0;
    var data = this.CPUCore.read32(base | 0) | 0;
    //Clock a cycle for the processing delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    this.CPUCore.write32(base | 0, this.read0OffsetRegister() | 0);
    this.guard12OffsetRegisterWrite(data | 0);
}
ARMInstructionSet.prototype.SWPB = function () {
    var base = this.read16OffsetRegister() | 0;
    var data = this.CPUCore.read8(base | 0) | 0;
    //Clock a cycle for the processing delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    this.CPUCore.write8(base | 0, this.read0OffsetRegister() | 0);
    this.guard12OffsetRegisterWrite(data | 0);
}
ARMInstructionSet.prototype.SWI = function () {
    //Software Interrupt:
    this.CPUCore.SWI();
}
ARMInstructionSet.prototype.UNDEFINED = function () {
    //Undefined Exception:
    this.CPUCore.UNDEFINED();
}
ARMInstructionSet.prototype.operand2OP_DataProcessing1 = function () {
    var data = 0;
    switch ((this.execute & 0x2000060) >> 5) {
        case 0:
            data = this.lli() | 0;
            break;
        case 1:
            data = this.lri() | 0;
            break;
        case 2:
            data = this.ari() | 0;
            break;
        case 3:
            data = this.rri() | 0;
            break;
        default:
            data = this.imm() | 0;
    }
    return data | 0;
}
ARMInstructionSet.prototype.operand2OP_DataProcessing2 = function () {
    var data = 0;
    switch ((this.execute & 0x2000060) >> 5) {
        case 0:
            data = this.llis() | 0;
            break;
        case 1:
            data = this.lris() | 0;
            break;
        case 2:
            data = this.aris() | 0;
            break;
        case 3:
            data = this.rris() | 0;
            break;
        default:
            data = this.imms() | 0;
    }
    return data | 0;
}
ARMInstructionSet.prototype.operand2OP_DataProcessing3 = function () {
    var data = 0;
    switch ((this.execute >> 5) & 0x3) {
        case 0:
            data = this.llr() | 0;
            break;
        case 1:
            data = this.lrr() | 0;
            break;
        case 2:
            data = this.arr() | 0;
            break;
        default:
            data = this.rrr() | 0;
    }
    return data | 0;
}
ARMInstructionSet.prototype.operand2OP_DataProcessing4 = function () {
    var data = 0;
    switch ((this.execute >> 5) & 0x3) {
        case 0:
            data = this.llrs() | 0;
            break;
        case 1:
            data = this.lrrs() | 0;
            break;
        case 2:
            data = this.arrs() | 0;
            break;
        default:
            data = this.rrrs() | 0;
    }
    return data | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStoreOffsetGen = function () {
    var data = 0;
    switch ((this.execute >> 5) & 0x3) {
        case 0:
            data = this.lli() | 0;
            break;
        case 1:
            data = this.lri() | 0;
            break;
        case 2:
            data = this.ari() | 0;
            break;
        default:
            data = this.rri() | 0;
    }
    return data | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStoreOperandDetermine = function () {
    var offset = 0;
    if ((this.execute & 0x400000) == 0) {
        offset = this.read0OffsetRegister() | 0;
    }
    else {
        offset = ((this.execute & 0xF00) >> 4) | (this.execute & 0xF);
    }
    return offset | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStorePostT = function (offset, userMode) {
    offset = offset | 0;
    userMode = userMode | 0;
    var base = this.baseRegisterRead(userMode | 0) | 0;
    if ((this.execute & 0x800000) == 0) {
        offset = ((base | 0) - (offset | 0)) | 0;
    }
    else {
        offset = ((base | 0) + (offset | 0)) | 0;
    }
    this.baseRegisterWrite(offset | 0, userMode | 0);
    return base | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStoreNotT = function (offset) {
    offset = offset | 0;
    var base = this.read16OffsetRegister() | 0;
    if ((this.execute & 0x800000) == 0) {
        offset = ((base | 0) - (offset | 0)) | 0;
    }
    else {
        offset = ((base | 0) + (offset | 0)) | 0;
    }
    if ((this.execute & 0x200000) == 0x200000) {
        this.guard16OffsetRegisterWrite(offset | 0);
    }
    return offset | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStore1 = function () {
    return this.operand2OP_LoadStorePostT(this.operand2OP_LoadStoreOperandDetermine() | 0, 0) | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStore2 = function () {
    return this.operand2OP_LoadStoreNotT(this.operand2OP_LoadStoreOperandDetermine() | 0) | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStore3 = function (userMode) {
    userMode = userMode | 0;
    return this.operand2OP_LoadStorePostT(this.execute & 0xFFF, userMode | 0) | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStore4 = function () {
    return this.operand2OP_LoadStoreNotT(this.execute & 0xFFF) | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStore5 = function (userMode) {
    userMode = userMode | 0;
    return this.operand2OP_LoadStorePostT(this.operand2OP_LoadStoreOffsetGen() | 0, userMode | 0) | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStore6 = function () {
    return this.operand2OP_LoadStoreNotT(this.operand2OP_LoadStoreOffsetGen() | 0) | 0;
}
ARMInstructionSet.prototype.lli = function () {
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Shift the register data left:
    var shifter = (this.execute >> 7) & 0x1F;
    return register << (shifter | 0);
}
ARMInstructionSet.prototype.llis = function () {
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Get the shift amount:
    var shifter = (this.execute >> 7) & 0x1F;
    //Check to see if we need to update CPSR:
    if ((shifter | 0) > 0) {
        this.branchFlags.setCarry(register << (((shifter | 0) - 1) | 0));
    }
    //Shift the register data left:
    return register << (shifter | 0);
}
ARMInstructionSet.prototype.llr = function () {
    //Logical Left Shift with Register:
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Shift the register data left:
    var shifter = this.read8OffsetRegister() & 0xFF;
    if ((shifter | 0) < 0x20) {
        register = register << (shifter | 0);
    }
    else {
        register = 0;
    }
    return register | 0;
}
ARMInstructionSet.prototype.llrs = function () {
    //Logical Left Shift with Register and CPSR:
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Get the shift amount:
    var shifter = this.read8OffsetRegister() & 0xFF;
    //Check to see if we need to update CPSR:
    if ((shifter | 0) > 0) {
        if ((shifter | 0) < 0x20) {
            //Shift the register data left:
            this.branchFlags.setCarry(register << (((shifter | 0) - 1) | 0));
            register = register << (shifter | 0);
        }
        else {
            if ((shifter | 0) == 0x20) {
                //Shift bit 0 into carry:
                this.branchFlags.setCarry(register << 31);
            }
            else {
                //Everything Zero'd:
                this.branchFlags.setCarryFalse();
            }
            register = 0;
        }
    }
    //If shift is 0, just return the register without mod:
    return register | 0;
}
ARMInstructionSet.prototype.lri = function () {
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Shift the register data right logically:
    var shifter = (this.execute >> 7) & 0x1F;
    if ((shifter | 0) == 0) {
        //Return 0:
        register = 0;
    }
    else {
        register = (register >>> (shifter | 0)) | 0;
    }
    return register | 0;
}
ARMInstructionSet.prototype.lris = function () {
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Get the shift amount:
    var shifter = (this.execute >> 7) & 0x1F;
    //Check to see if we need to update CPSR:
    if ((shifter | 0) > 0) {
        this.branchFlags.setCarry((register >> (((shifter | 0) - 1) | 0)) << 31);
        //Shift the register data right logically:
        register = (register >>> (shifter | 0)) | 0;
    }
    else {
        this.branchFlags.setCarry(register | 0);
        //Return 0:
        register = 0;
    }
    return register | 0;
}
ARMInstructionSet.prototype.lrr = function () {
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Shift the register data right logically:
    var shifter = this.read8OffsetRegister() & 0xFF;
    if ((shifter | 0) < 0x20) {
        register = (register >>> (shifter | 0)) | 0;
    }
    else {
        register = 0;
    }
    return register | 0;
}
ARMInstructionSet.prototype.lrrs = function () {
    //Logical Right Shift with Register and CPSR:
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Get the shift amount:
    var shifter = this.read8OffsetRegister() & 0xFF;
    //Check to see if we need to update CPSR:
    if ((shifter | 0) > 0) {
        if ((shifter | 0) < 0x20) {
            //Shift the register data right logically:
            this.branchFlags.setCarry((register >> (((shifter | 0) - 1) | 0)) << 31);
            register = (register >>> (shifter | 0)) | 0;
        }
        else {
            if ((shifter | 0) == 0x20) {
                //Shift bit 31 into carry:
                this.branchFlags.setCarry(register | 0);
            }
            else {
                //Everything Zero'd:
                this.branchFlags.setCarryFalse();
            }
            register = 0;
        }
    }
    //If shift is 0, just return the register without mod:
    return register | 0;
}
ARMInstructionSet.prototype.ari = function () {
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Get the shift amount:
    var shifter = (this.execute >> 7) & 0x1F;
    if ((shifter | 0) == 0) {
        //Shift full length if shifter is zero:
        shifter = 0x1F;
    }
    //Shift the register data right:
    return register >> (shifter | 0);
}
ARMInstructionSet.prototype.aris = function () {
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Get the shift amount:
    var shifter = (this.execute >> 7) & 0x1F;
    //Check to see if we need to update CPSR:
    if ((shifter | 0) > 0) {
        this.branchFlags.setCarry((register >> (((shifter | 0) - 1) | 0)) << 31);
    }
    else {
        //Shift full length if shifter is zero:
        shifter = 0x1F;
        this.branchFlags.setCarry(register | 0);
    }
    //Shift the register data right:
    return register >> (shifter | 0);
}
ARMInstructionSet.prototype.arr = function () {
    //Arithmetic Right Shift with Register:
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Shift the register data right:
    return register >> Math.min(this.read8OffsetRegister() & 0xFF, 0x1F);
}
ARMInstructionSet.prototype.arrs = function () {
    //Arithmetic Right Shift with Register and CPSR:
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Get the shift amount:
    var shifter = this.read8OffsetRegister() & 0xFF;
    //Check to see if we need to update CPSR:
    if ((shifter | 0) > 0) {
        if ((shifter | 0) < 0x20) {
            //Shift the register data right arithmetically:
            this.branchFlags.setCarry((register >> (((shifter | 0) - 1) | 0)) << 31);
            register = register >> (shifter | 0);
        }
        else {
            //Set all bits with bit 31:
            this.branchFlags.setCarry(register | 0);
            register = register >> 0x1F;
        }
    }
    //If shift is 0, just return the register without mod:
    return register | 0;
}
ARMInstructionSet.prototype.rri = function () {
    //Rotate Right with Immediate:
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Rotate the register right:
    var shifter = (this.execute >> 7) & 0x1F;
    if ((shifter | 0) > 0) {
        //ROR
        register = (register << (0x20 - (shifter | 0))) | (register >>> (shifter | 0));
    }
    else {
        //RRX
        register = (this.branchFlags.getCarry() & 0x80000000) | (register >>> 0x1);
    }
    return register | 0;
}
ARMInstructionSet.prototype.rris = function () {
    //Rotate Right with Immediate and CPSR:
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Rotate the register right:
    var shifter = (this.execute >> 7) & 0x1F;
    if ((shifter | 0) > 0) {
        //ROR
        this.branchFlags.setCarry((register >> (((shifter | 0) - 1) | 0)) << 31);
        register = (register << (0x20 - (shifter | 0))) | (register >>> (shifter | 0));
    }
    else {
        //RRX
        var rrxValue = (this.branchFlags.getCarry() & 0x80000000) | (register >>> 0x1);
        this.branchFlags.setCarry(register << 31);
        register = rrxValue | 0;
    }
    return register | 0;
}
ARMInstructionSet.prototype.rrr = function () {
    //Rotate Right with Register:
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Rotate the register right:
    var shifter = this.read8OffsetRegister() & 0x1F;
    if ((shifter | 0) > 0) {
        //ROR
        register = (register << (0x20 - (shifter | 0))) | (register >>> (shifter | 0));
    }
    //If shift is 0, just return the register without mod:
    return register | 0;
}
ARMInstructionSet.prototype.rrrs = function () {
    //Rotate Right with Register and CPSR:
    //Get the register data to be shifted:
    var register = this.read0OffsetRegister() | 0;
    //Clock a cycle for the shift delaying the CPU:
    this.wait.CPUInternalSingleCyclePrefetch();
    //Rotate the register right:
    var shifter = this.read8OffsetRegister() & 0xFF;
    if ((shifter | 0) > 0) {
        shifter = shifter & 0x1F;
        if ((shifter | 0) > 0) {
            //ROR
            this.branchFlags.setCarry((register >> (((shifter | 0) - 1) | 0)) << 31);
            register = (register << (0x20 - (shifter | 0))) | (register >>> (shifter | 0));
        }
        else {
            //No shift, but make carry set to bit 31:
            this.branchFlags.setCarry(register | 0);
        }
    }
    //If shift is 0, just return the register without mod:
    return register | 0;
}
ARMInstructionSet.prototype.imm = function () {
    //Get the immediate data to be shifted:
    var immediate = this.execute & 0xFF;
    //Rotate the immediate right:
    var shifter = (this.execute >> 7) & 0x1E;
    if ((shifter | 0) > 0) {
        immediate = (immediate << (0x20 - (shifter | 0))) | (immediate >>> (shifter | 0));
    }
    return immediate | 0;
}
ARMInstructionSet.prototype.imms = function () {
    //Get the immediate data to be shifted:
    var immediate = this.execute & 0xFF;
    //Rotate the immediate right:
    var shifter = (this.execute >> 7) & 0x1E;
    if ((shifter | 0) > 0) {
        immediate = (immediate << (0x20 - (shifter | 0))) | (immediate >>> (shifter | 0));
        this.branchFlags.setCarry(immediate | 0);
    }
    return immediate | 0;
}
ARMInstructionSet.prototype.rc = function () {
    return (this.branchFlags.getNZCV() | this.CPUCore.modeFlags);
}
ARMInstructionSet.prototype.rs = function () {
    var spsr = 0;
    switch (this.CPUCore.modeFlags & 0x1f) {
        case 0x12:    //IRQ
            spsr = this.CPUCore.SPSR[1] | 0;
            break;
        case 0x13:    //Supervisor
            spsr = this.CPUCore.SPSR[2] | 0;
            break;
        case 0x11:    //FIQ
            spsr = this.CPUCore.SPSR[0] | 0;
            break;
        case 0x17:    //Abort
            spsr = this.CPUCore.SPSR[3] | 0;
            break;
        case 0x1B:    //Undefined
            spsr = this.CPUCore.SPSR[4] | 0;
            break;
        default:
            //Instruction hit an invalid SPSR request:
            return this.rc() | 0;
    }
    return ((spsr & 0xF00) << 20) | (spsr & 0xFF);
}
function compileARMInstructionDecodeMap() {
    var pseudoCodes = [
                       "BX",
                       "B",
                       "BL",
                       "AND",
                       "AND2",
                       "ANDS",
                       "ANDS2",
                       "EOR",
                       "EOR2",
                       "EORS",
                       "EORS2",
                       "SUB",
                       "SUB2",
                       "SUBS",
                       "SUBS2",
                       "RSB",
                       "RSB2",
                       "RSBS",
                       "RSBS2",
                       "ADD",
                       "ADD2",
                       "ADDS",
                       "ADDS2",
                       "ADC",
                       "ADC2",
                       "ADCS",
                       "ADCS2",
                       "SBC",
                       "SBC2",
                       "SBCS",
                       "SBCS2",
                       "RSC",
                       "RSC2",
                       "RSCS",
                       "RSCS2",
                       "TSTS",
                       "TSTS2",
                       "TEQS",
                       "TEQS2",
                       "CMPS",
                       "CMPS2",
                       "CMNS",
                       "CMNS2",
                       "ORR",
                       "ORR2",
                       "ORRS",
                       "ORRS2",
                       "MOV",
                       "MOV2",
                       "MOVS",
                       "MOVS2",
                       "BIC",
                       "BIC2",
                       "BICS",
                       "BICS2",
                       "MVN",
                       "MVN2",
                       "MVNS",
                       "MVNS2",
                       "MRS",
                       "MSR",
                       "MUL",
                       "MULS",
                       "MLA",
                       "MLAS",
                       "UMULL",
                       "UMULLS",
                       "UMLAL",
                       "UMLALS",
                       "SMULL",
                       "SMULLS",
                       "SMLAL",
                       "SMLALS",
                       "STRH",
                       "LDRH",
                       "LDRSH",
                       "LDRSB",
                       "STRH2",
                       "LDRH2",
                       "LDRSH2",
                       "LDRSB2",
                       "STR",
                       "LDR",
                       "STRB",
                       "LDRB",
                       "STRT",
                       "LDRT",
                       "STRBT",
                       "LDRBT",
                       "STR2",
                       "LDR2",
                       "STRB2",
                       "LDRB2",
                       "STRT2",
                       "LDRT2",
                       "STRBT2",
                       "LDRBT2",
                       "STR3",
                       "LDR3",
                       "STRB3",
                       "LDRB3",
                       "STR4",
                       "LDR4",
                       "STRB4",
                       "LDRB4",
                       "LoadStoreMultiple",
                       "SWP",
                       "SWPB",
                       "SWI"
                       ];
    function compileARMInstructionDecodeOpcodeMap(codeMap) {
        var opcodeIndice = 0;
        var instructionMap = getUint8Array(4096);
        function generateMap1(instruction) {
            for (var index = 0; index < 0x10; ++index) {
                instructionMap[opcodeIndice++] = codeMap[instruction[index]];
            }
        }
        function generateMap2(instruction) {
            var translatedOpcode = codeMap[instruction];
            for (var index = 0; index < 0x10; ++index) {
                instructionMap[opcodeIndice++] = translatedOpcode;
            }
        }
        function generateMap3(instruction) {
            var translatedOpcode = codeMap[instruction];
            for (var index = 0; index < 0x100; ++index) {
                instructionMap[opcodeIndice++] = translatedOpcode;
            }
        }
        function generateMap4(instruction) {
            var translatedOpcode = codeMap[instruction];
            for (var index = 0; index < 0x200; ++index) {
                instructionMap[opcodeIndice++] = translatedOpcode;
            }
        }
        function generateMap5(instruction) {
            var translatedOpcode = codeMap[instruction];
            for (var index = 0; index < 0x300; ++index) {
                instructionMap[opcodeIndice++] = translatedOpcode;
            }
        }
        function generateStoreLoadInstructionSector1() {
            var instrMap = [
                            "STR2",
                            "LDR2",
                            "STRT2",
                            "LDRT2",
                            "STRB2",
                            "LDRB2",
                            "STRBT2",
                            "LDRBT2"
                            ];
            for (var instrIndex = 0; instrIndex < 0x10; ++instrIndex) {
                for (var dataIndex = 0; dataIndex < 0x10; ++dataIndex) {
                    if ((dataIndex & 0x1) == 0) {
                        instructionMap[opcodeIndice++] = codeMap[instrMap[instrIndex & 0x7]];
                    }
                    else {
                        instructionMap[opcodeIndice++] = codeMap["UNDEFINED"];
                    }
                }
            }
        }
        function generateStoreLoadInstructionSector2() {
            var instrMap = [
                            "STR3",
                            "LDR3",
                            "STRB3",
                            "LDRB3"
                            ];
            for (var instrIndex = 0; instrIndex < 0x10; ++instrIndex) {
                for (var dataIndex = 0; dataIndex < 0x10; ++dataIndex) {
                    if ((dataIndex & 0x1) == 0) {
                        instructionMap[opcodeIndice++] = codeMap[instrMap[((instrIndex >> 1) & 0x2) | (instrIndex & 0x1)]];
                    }
                    else {
                        instructionMap[opcodeIndice++] = codeMap["UNDEFINED"];
                    }
                }
            }
        }
        //0
        generateMap1([
                      "AND",
                      "AND2",
                      "AND",
                      "AND2",
                      "AND",
                      "AND2",
                      "AND",
                      "AND2",
                      "AND",
                      "MUL",
                      "AND",
                      "STRH",
                      "AND",
                      "UNDEFINED",
                      "AND",
                      "UNDEFINED"
                      ]);
        //1
        generateMap1([
                      "ANDS",
                      "ANDS2",
                      "ANDS",
                      "ANDS2",
                      "ANDS",
                      "ANDS2",
                      "ANDS",
                      "ANDS2",
                      "ANDS",
                      "MULS",
                      "ANDS",
                      "LDRH",
                      "ANDS",
                      "LDRSB",
                      "ANDS",
                      "LDRSH"
                      ]);
        //2
        generateMap1([
                      "EOR",
                      "EOR2",
                      "EOR",
                      "EOR2",
                      "EOR",
                      "EOR2",
                      "EOR",
                      "EOR2",
                      "EOR",
                      "MLA",
                      "EOR",
                      "STRH",
                      "EOR",
                      "UNDEFINED",
                      "EOR",
                      "UNDEFINED"
                      ]);
        //3
        generateMap1([
                      "EORS",
                      "EORS2",
                      "EORS",
                      "EORS2",
                      "EORS",
                      "EORS2",
                      "EORS",
                      "EORS2",
                      "EORS",
                      "MLAS",
                      "EORS",
                      "LDRH",
                      "EORS",
                      "LDRSB",
                      "EORS",
                      "LDRSH"
                      ]);
        //4
        generateMap1([
                      "SUB",
                      "SUB2",
                      "SUB",
                      "SUB2",
                      "SUB",
                      "SUB2",
                      "SUB",
                      "SUB2",
                      "SUB",
                      "UNDEFINED",
                      "SUB",
                      "STRH",
                      "SUB",
                      "UNDEFINED",
                      "SUB",
                      "UNDEFINED"
                      ]);
        //5
        generateMap1([
                      "SUBS",
                      "SUBS2",
                      "SUBS",
                      "SUBS2",
                      "SUBS",
                      "SUBS2",
                      "SUBS",
                      "SUBS2",
                      "SUBS",
                      "UNDEFINED",
                      "SUBS",
                      "LDRH",
                      "SUBS",
                      "LDRSB",
                      "SUBS",
                      "LDRSH"
                      ]);
        //6
        generateMap1([
                      "RSB",
                      "RSB2",
                      "RSB",
                      "RSB2",
                      "RSB",
                      "RSB2",
                      "RSB",
                      "RSB2",
                      "RSB",
                      "UNDEFINED",
                      "RSB",
                      "STRH",
                      "RSB",
                      "UNDEFINED",
                      "RSB",
                      "UNDEFINED"
                      ]);
        //7
        generateMap1([
                      "RSBS",
                      "RSBS2",
                      "RSBS",
                      "RSBS2",
                      "RSBS",
                      "RSBS2",
                      "RSBS",
                      "RSBS2",
                      "RSBS",
                      "UNDEFINED",
                      "RSBS",
                      "LDRH",
                      "RSBS",
                      "LDRSB",
                      "RSBS",
                      "LDRSH"
                      ]);
        //8
        generateMap1([
                      "ADD",
                      "ADD2",
                      "ADD",
                      "ADD2",
                      "ADD",
                      "ADD2",
                      "ADD",
                      "ADD2",
                      "ADD",
                      "UMULL",
                      "ADD",
                      "STRH",
                      "ADD",
                      "UNDEFINED",
                      "ADD",
                      "UNDEFINED"
                      ]);
        //9
        generateMap1([
                      "ADDS",
                      "ADDS2",
                      "ADDS",
                      "ADDS2",
                      "ADDS",
                      "ADDS2",
                      "ADDS",
                      "ADDS2",
                      "ADDS",
                      "UMULLS",
                      "ADDS",
                      "LDRH",
                      "ADDS",
                      "LDRSB",
                      "ADDS",
                      "LDRSH"
                      ]);
        //A
        generateMap1([
                      "ADC",
                      "ADC2",
                      "ADC",
                      "ADC2",
                      "ADC",
                      "ADC2",
                      "ADC",
                      "ADC2",
                      "ADC",
                      "UMLAL",
                      "ADC",
                      "STRH",
                      "ADC",
                      "UNDEFINED",
                      "ADC",
                      "UNDEFINED"
                      ]);
        //B
        generateMap1([
                      "ADCS",
                      "ADCS2",
                      "ADCS",
                      "ADCS2",
                      "ADCS",
                      "ADCS2",
                      "ADCS",
                      "ADCS2",
                      "ADCS",
                      "UMLALS",
                      "ADCS",
                      "LDRH",
                      "ADCS",
                      "LDRSB",
                      "ADCS",
                      "LDRSH"
                      ]);
        //C
        generateMap1([
                      "SBC",
                      "SBC2",
                      "SBC",
                      "SBC2",
                      "SBC",
                      "SBC2",
                      "SBC",
                      "SBC2",
                      "SBC",
                      "SMULL",
                      "SBC",
                      "STRH",
                      "SBC",
                      "UNDEFINED",
                      "SBC",
                      "UNDEFINED"
                      ]);
        //D
        generateMap1([
                      "SBCS",
                      "SBCS2",
                      "SBCS",
                      "SBCS2",
                      "SBCS",
                      "SBCS2",
                      "SBCS",
                      "SBCS2",
                      "SBCS",
                      "SMULLS",
                      "SBCS",
                      "LDRH",
                      "SBCS",
                      "LDRSB",
                      "SBCS",
                      "LDRSH"
                      ]);
        //E
        generateMap1([
                      "RSC",
                      "RSC2",
                      "RSC",
                      "RSC2",
                      "RSC",
                      "RSC2",
                      "RSC",
                      "RSC2",
                      "RSC",
                      "SMLAL",
                      "RSC",
                      "STRH",
                      "RSC",
                      "UNDEFINED",
                      "RSC",
                      "UNDEFINED"
                      ]);
        //F
        generateMap1([
                      "RSCS",
                      "RSCS2",
                      "RSCS",
                      "RSCS2",
                      "RSCS",
                      "RSCS2",
                      "RSCS",
                      "RSCS2",
                      "RSCS",
                      "SMLALS",
                      "RSCS",
                      "LDRH",
                      "RSCS",
                      "LDRSB",
                      "RSCS",
                      "LDRSH"
                      ]);
        //10
        generateMap1([
                      "MRS",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "SWP",
                      "UNDEFINED",
                      "STRH2",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED"
                      ]);
        //11
        generateMap1([
                      "TSTS",
                      "TSTS2",
                      "TSTS",
                      "TSTS2",
                      "TSTS",
                      "TSTS2",
                      "TSTS",
                      "TSTS2",
                      "TSTS",
                      "UNDEFINED",
                      "TSTS",
                      "LDRH2",
                      "TSTS",
                      "LDRSB2",
                      "TSTS",
                      "LDRSH2"
                      ]);
        //12
        generateMap1([
                      "MSR",
                      "BX",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "STRH2",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED"
                      ]);
        //13
        generateMap1([
                      "TEQS",
                      "TEQS2",
                      "TEQS",
                      "TEQS2",
                      "TEQS",
                      "TEQS2",
                      "TEQS",
                      "TEQS2",
                      "TEQS",
                      "UNDEFINED",
                      "TEQS",
                      "LDRH2",
                      "TEQS",
                      "LDRSB2",
                      "TEQS",
                      "LDRSH2"
                      ]);
        //14
        generateMap1([
                      "MRS",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "SWPB",
                      "UNDEFINED",
                      "STRH2",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED"
                      ]);
        //15
        generateMap1([
                      "CMPS",
                      "CMPS2",
                      "CMPS",
                      "CMPS2",
                      "CMPS",
                      "CMPS2",
                      "CMPS",
                      "CMPS2",
                      "CMPS",
                      "UNDEFINED",
                      "CMPS",
                      "LDRH2",
                      "CMPS",
                      "LDRSB2",
                      "CMPS",
                      "LDRSH2"
                      ]);
        //16
        generateMap1([
                      "MSR",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "STRH2",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED",
                      "UNDEFINED"
                      ]);
        //17
        generateMap1([
                      "CMNS",
                      "CMNS2",
                      "CMNS",
                      "CMNS2",
                      "CMNS",
                      "CMNS2",
                      "CMNS",
                      "CMNS2",
                      "CMNS",
                      "UNDEFINED",
                      "CMNS",
                      "LDRH2",
                      "CMNS",
                      "LDRSB2",
                      "CMNS",
                      "LDRSH2"
                      ]);
        //18
        generateMap1([
                      "ORR",
                      "ORR2",
                      "ORR",
                      "ORR2",
                      "ORR",
                      "ORR2",
                      "ORR",
                      "ORR2",
                      "ORR",
                      "UNDEFINED",
                      "ORR",
                      "STRH2",
                      "ORR",
                      "UNDEFINED",
                      "ORR",
                      "UNDEFINED"
                      ]);
        //19
        generateMap1([
                      "ORRS",
                      "ORRS2",
                      "ORRS",
                      "ORRS2",
                      "ORRS",
                      "ORRS2",
                      "ORRS",
                      "ORRS2",
                      "ORRS",
                      "UNDEFINED",
                      "ORRS",
                      "LDRH2",
                      "ORRS",
                      "LDRSB2",
                      "ORRS",
                      "LDRSH2"
                      ]);
        //1A
        generateMap1([
                      "MOV",
                      "MOV2",
                      "MOV",
                      "MOV2",
                      "MOV",
                      "MOV2",
                      "MOV",
                      "MOV2",
                      "MOV",
                      "UNDEFINED",
                      "MOV",
                      "STRH2",
                      "MOV",
                      "UNDEFINED",
                      "MOV",
                      "UNDEFINED"
                      ]);
        //1B
        generateMap1([
                      "MOVS",
                      "MOVS2",
                      "MOVS",
                      "MOVS2",
                      "MOVS",
                      "MOVS2",
                      "MOVS",
                      "MOVS2",
                      "MOVS",
                      "UNDEFINED",
                      "MOVS",
                      "LDRH2",
                      "MOVS",
                      "LDRSB2",
                      "MOVS",
                      "LDRSH2"
                      ]);
        //1C
        generateMap1([
                      "BIC",
                      "BIC2",
                      "BIC",
                      "BIC2",
                      "BIC",
                      "BIC2",
                      "BIC",
                      "BIC2",
                      "BIC",
                      "UNDEFINED",
                      "BIC",
                      "STRH2",
                      "BIC",
                      "UNDEFINED",
                      "BIC",
                      "UNDEFINED"
                      ]);
        //1D
        generateMap1([
                      "BICS",
                      "BICS2",
                      "BICS",
                      "BICS2",
                      "BICS",
                      "BICS2",
                      "BICS",
                      "BICS2",
                      "BICS",
                      "UNDEFINED",
                      "BICS",
                      "LDRH2",
                      "BICS",
                      "LDRSB2",
                      "BICS",
                      "LDRSH2"
                      ]);
        //1E
        generateMap1([
                      "MVN",
                      "MVN2",
                      "MVN",
                      "MVN2",
                      "MVN",
                      "MVN2",
                      "MVN",
                      "MVN2",
                      "MVN",
                      "UNDEFINED",
                      "MVN",
                      "STRH2",
                      "MVN",
                      "UNDEFINED",
                      "MVN",
                      "UNDEFINED"
                      ]);
        //1F
        generateMap1([
                      "MVNS",
                      "MVNS2",
                      "MVNS",
                      "MVNS2",
                      "MVNS",
                      "MVNS2",
                      "MVNS",
                      "MVNS2",
                      "MVNS",
                      "UNDEFINED",
                      "MVNS",
                      "LDRH2",
                      "MVNS",
                      "LDRSB2",
                      "MVNS",
                      "LDRSH2"
                      ]);
        //20
        generateMap2("AND");
        //21
        generateMap2("ANDS");
        //22
        generateMap2("EOR");
        //23
        generateMap2("EORS");
        //24
        generateMap2("SUB");
        //25
        generateMap2("SUBS");
        //26
        generateMap2("RSB");
        //27
        generateMap2("RSBS");
        //28
        generateMap2("ADD");
        //29
        generateMap2("ADDS");
        //2A
        generateMap2("ADC");
        //2B
        generateMap2("ADCS");
        //2C
        generateMap2("SBC");
        //2D
        generateMap2("SBCS");
        //2E
        generateMap2("RSC");
        //2F
        generateMap2("RSCS");
        //30
        generateMap2("UNDEFINED");
        //31
        generateMap2("TSTS");
        //32
        generateMap2("MSR");
        //33
        generateMap2("TEQS");
        //34
        generateMap2("UNDEFINED");
        //35
        generateMap2("CMPS");
        //36
        generateMap2("MSR");
        //37
        generateMap2("CMNS");
        //38
        generateMap2("ORR");
        //39
        generateMap2("ORRS");
        //3A
        generateMap2("MOV");
        //3B
        generateMap2("MOVS");
        //3C
        generateMap2("BIC");
        //3D
        generateMap2("BICS");
        //3E
        generateMap2("MVN");
        //3F
        generateMap2("MVNS");
        //40
        generateMap2("STR");
        //41
        generateMap2("LDR");
        //42
        generateMap2("STRT");
        //43
        generateMap2("LDRT");
        //44
        generateMap2("STRB");
        //45
        generateMap2("LDRB");
        //46
        generateMap2("STRBT");
        //47
        generateMap2("LDRBT");
        //48
        generateMap2("STR");
        //49
        generateMap2("LDR");
        //4A
        generateMap2("STRT");
        //4B
        generateMap2("LDRT");
        //4C
        generateMap2("STRB");
        //4D
        generateMap2("LDRB");
        //4E
        generateMap2("STRBT");
        //4F
        generateMap2("LDRBT");
        //50
        generateMap2("STR4");
        //51
        generateMap2("LDR4");
        //52
        generateMap2("STR4");
        //53
        generateMap2("LDR4");
        //54
        generateMap2("STRB4");
        //55
        generateMap2("LDRB4");
        //56
        generateMap2("STRB4");
        //57
        generateMap2("LDRB4");
        //58
        generateMap2("STR4");
        //59
        generateMap2("LDR4");
        //5A
        generateMap2("STR4");
        //5B
        generateMap2("LDR4");
        //5C
        generateMap2("STRB4");
        //5D
        generateMap2("LDRB4");
        //5E
        generateMap2("STRB4");
        //5F
        generateMap2("LDRB4");
        //60-6F
        generateStoreLoadInstructionSector1();
        //70-7F
        generateStoreLoadInstructionSector2();
        //80-9F
        generateMap4("LoadStoreMultiple");
        //A0-AF
        generateMap3("B");
        //B0-BF
        generateMap3("BL");
        //C0-EF
        generateMap5("UNDEFINED");
        //F0-FF
        generateMap3("SWI");
        //Set to prototype:
        ARMInstructionSet.prototype.instructionMap = instructionMap;
    }
    function compileARMInstructionDecodeOpcodeSwitch() {
        var opcodeNameMap = {};
        var code = "switch (this.instructionMap[((this.execute >> 16) & 0xFF0) | ((this.execute >> 4) & 0xF)] & 0xFF) {";
        for (var opcodeNumber = 0; opcodeNumber < pseudoCodes.length; ++opcodeNumber) {
            var opcodeName = pseudoCodes[opcodeNumber];
            opcodeNameMap[opcodeName] = opcodeNumber;
            code += "case " + opcodeNumber + ":{this." + opcodeName + "();break};";
        }
        code += "default:{this.UNDEFINED()}}";
        opcodeNameMap["UNDEFINED"] = opcodeNumber;
        ARMInstructionSet.prototype.executeDecoded = Function(code);
        return opcodeNameMap;
    }
    compileARMInstructionDecodeOpcodeMap(compileARMInstructionDecodeOpcodeSwitch());
}
compileARMInstructionDecodeMap();;
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function THUMBInstructionSet(CPUCore) {
    this.CPUCore = CPUCore;
    this.initialize();
}
THUMBInstructionSet.prototype.initialize = function () {
    this.wait = this.CPUCore.wait;
    this.registers = this.CPUCore.registers;
    this.branchFlags = this.CPUCore.branchFlags;
    this.fetch = 0;
    this.decode = 0;
    this.execute = 0;
    this.memory = this.CPUCore.memory;
}
THUMBInstructionSet.prototype.executeIteration = function () {
    //Push the new fetch access:
    this.fetch = this.memory.memoryReadCPU16(this.readPC() | 0) | 0;
    //Execute Instruction:
    this.executeDecoded();
    //Update the pipelining state:
    this.execute = this.decode | 0;
    this.decode = this.fetch | 0;
}
THUMBInstructionSet.prototype.executeDecoded = function () {
    /*
     Instruction Decode Pattern:
      X = Possible opcode bit; N = Data Bit, definitely not an opcode bit
     OPCODE: XXXXXXXXXXNNNNNN
     
     Since many of those "X"s are redundant and possibly data, we can "process"
     it and use a table to further decide what unique opcode it is, leaving us with
     a dense switch statement. Not "processing" the opcode beforehand would leave us
     with a 10 bit wide switch, which is slow in JS, and using a function in array computed
     goto trick is not optimal in JavaScript.
     */
    switch (this.instructionMap[this.execute >> 6] & 0xFF) {    //Leave the "& 0xFF" there, it's a uint8 type guard.
        case 0:
            this.CMPimm8();
            break;
        case 1:
            this.BEQ();
            break;
        case 2:
            this.MOVH_LH();
            break;
        case 3:
            this.LDRimm5();
            break;
        case 4:
            this.AND();
            break;
        case 5:
            this.LDRBimm5();
            break;
        case 6:
            this.LSLimm();
            break;
        case 7:
            this.LSRimm();
            break;
        case 8:
            this.MOVimm8();
            break;
        case 9:
            this.CMP();
            break;
        case 10:
            this.LDRSP();
            break;
        case 11:
            this.ADDimm3();
            break;
        case 12:
            this.ADDreg();
            break;
        case 13:
            this.STRSP();
            break;
        case 14:
            this.B();
            break;
        case 15:
            this.LDRPC();
            break;
        case 16:
            this.MOVH_HL();
            break;
        case 17:
            this.ADDimm8();
            break;
        case 18:
            this.SUBreg();
            break;
        case 19:
            this.BCC();
            break;
        case 20:
            this.STRimm5();
            break;
        case 21:
            this.ORR();
            break;
        case 22:
            this.LDRHimm5();
            break;
        case 23:
            this.BCS();
            break;
        case 24:
            this.BNE();
            break;
        case 25:
            this.BGE();
            break;
        case 26:
            this.POP();
            break;
        case 27:
            this.ADDH_HL();
            break;
        case 28:
            this.STRHimm5();
            break;
        case 29:
            this.BLE();
            break;
        case 30:
            this.ASRimm();
            break;
        case 31:
            this.MUL();
            break;
        case 32:
            this.BLsetup();
            break;
        case 33:
            this.BLoff();
            break;
        case 34:
            this.BGT();
            break;
        case 35:
            this.STRHreg();
            break;
        case 36:
            this.LDRHreg();
            break;
        case 37:
            this.BX_L();
            break;
        case 38:
            this.BLT();
            break;
        case 39:
            this.ADDSPimm7();
            break;
        case 40:
            this.PUSHlr();
            break;
        case 41:
            this.PUSH();
            break;
        case 42:
            this.SUBimm8();
            break;
        case 43:
            this.ROR();
            break;
        case 44:
            this.LDRSHreg();
            break;
        case 45:
            this.STRBimm5();
            break;
        case 46:
            this.NEG();
            break;
        case 47:
            this.BHI();
            break;
        case 48:
            this.TST();
            break;
        case 49:
            this.BX_H();
            break;
        case 50:
            this.STMIA();
            break;
        case 51:
            this.BLS();
            break;
        case 52:
            this.SWI();
            break;
        case 53:
            this.LDMIA();
            break;
        case 54:
            this.MOVH_HH();
            break;
        case 55:
            this.LSL();
            break;
        case 56:
            this.POPpc();
            break;
        case 57:
            this.LSR();
            break;
        case 58:
            this.CMPH_LH();
            break;
        case 59:
            this.EOR();
            break;
        case 60:
            this.SUBimm3();
            break;
        case 61:
            this.ADDH_LH();
            break;
        case 62:
            this.BPL();
            break;
        case 63:
            this.CMPH_HL();
            break;
        case 64:
            this.ADDPC();
            break;
        case 65:
            this.LDRSBreg();
            break;
        case 66:
            this.BIC();
            break;
        case 67:
            this.ADDSP();
            break;
        case 68:
            this.MVN();
            break;
        case 69:
            this.ASR();
            break;
        case 70:
            this.LDRreg();
            break;
        case 71:
            this.ADC();
            break;
        case 72:
            this.SBC();
            break;
        case 73:
            this.BMI();
            break;
        case 74:
            this.STRreg();
            break;
        case 75:
            this.CMN();
            break;
        case 76:
            this.LDRBreg();
            break;
        case 77:
            this.ADDH_HH();
            break;
        case 78:
            this.CMPH_HH();
            break;
        case 79:
            this.STRBreg();
            break;
        case 80:
            this.BVS();
            break;
        case 81:
            this.BVC();
            break;
        default:
            this.UNDEFINED();
    }
}
THUMBInstructionSet.prototype.executeBubble = function () {
    //Push the new fetch access:
    this.fetch = this.memory.memoryReadCPU16(this.readPC() | 0) | 0;
    //Update the Program Counter:
    this.incrementProgramCounter();
    //Update the pipelining state:
    this.execute = this.decode | 0;
    this.decode = this.fetch | 0;
}
THUMBInstructionSet.prototype.incrementProgramCounter = function () {
    //Increment The Program Counter:
    this.registers[15] = ((this.registers[15] | 0) + 2) | 0;
}
THUMBInstructionSet.prototype.readLowRegister = function (address) {
    //Low register read:
    address = address | 0;
    return this.registers[address & 0x7] | 0;
}
THUMBInstructionSet.prototype.read0OffsetLowRegister = function () {
    //Low register read at 0 bit offset:
    return this.readLowRegister(this.execute | 0) | 0;
}
THUMBInstructionSet.prototype.read3OffsetLowRegister = function () {
    //Low register read at 3 bit offset:
    return this.readLowRegister(this.execute >> 3) | 0;
}
THUMBInstructionSet.prototype.read6OffsetLowRegister = function () {
    //Low register read at 6 bit offset:
    return this.readLowRegister(this.execute >> 6) | 0;
}
THUMBInstructionSet.prototype.read8OffsetLowRegister = function () {
    //Low register read at 8 bit offset:
    return this.readLowRegister(this.execute >> 8) | 0;
}
THUMBInstructionSet.prototype.readHighRegister = function (address) {
    //High register read:
    address = address | 0x8;
    return this.registers[address & 0xF] | 0;
}
THUMBInstructionSet.prototype.writeLowRegister = function (address, data) {
    //Low register write:
    address = address | 0;
    data = data | 0;
    this.registers[address & 0x7] = data | 0;
}
THUMBInstructionSet.prototype.write0OffsetLowRegister = function (data) {
    //Low register write at 0 bit offset:
    data = data | 0;
    this.writeLowRegister(this.execute | 0, data | 0);
}
THUMBInstructionSet.prototype.write8OffsetLowRegister = function (data) {
    //Low register write at 8 bit offset:
    data = data | 0;
    this.writeLowRegister(this.execute >> 8, data | 0);
}
THUMBInstructionSet.prototype.guardHighRegisterWrite = function (data) {
    data = data | 0;
    var address = 0x8 | (this.execute & 0x7);
    if ((address | 0) == 0xF) {
        //We performed a branch:
        this.CPUCore.branch(data & -2);
    }
    else {
        //Regular Data Write:
        this.registers[address & 0xF] = data | 0;
        //Update PC:
        this.incrementProgramCounter();
    }
}
THUMBInstructionSet.prototype.writeSP = function (data) {
    //Update the stack pointer:
    data = data | 0;
    this.registers[0xD] = data | 0;
}
THUMBInstructionSet.prototype.SPDecrementWord = function () {
    //Decrement the stack pointer by one word:
    this.registers[0xD] = ((this.registers[0xD] | 0) - 4) | 0;
}
THUMBInstructionSet.prototype.SPIncrementWord = function () {
    //Increment the stack pointer by one word:
    this.registers[0xD] = ((this.registers[0xD] | 0) + 4) | 0;
}
THUMBInstructionSet.prototype.writeLR = function (data) {
    //Update the link register:
    data = data | 0;
    this.registers[0xE] = data | 0;
}
THUMBInstructionSet.prototype.writePC = function (data) {
    data = data | 0;
    //We performed a branch:
    //Update the program counter to branch address:
    this.CPUCore.branch(data & -2);
}
THUMBInstructionSet.prototype.offsetPC = function () {
    //We performed a branch:
    //Update the program counter to branch address:
    this.CPUCore.branch(((this.readPC() | 0) + ((this.execute << 24) >> 23)) | 0);
}
THUMBInstructionSet.prototype.getLR = function () {
    //Read back the value for the LR register upon Exception:
    return ((this.readPC() | 0) - 2) | 0;
}
THUMBInstructionSet.prototype.getIRQLR = function () {
    //Read back the value for the LR register upon IRQ:
    return this.readPC() | 0;
}
THUMBInstructionSet.prototype.readSP = function () {
    //Read back the current SP:
    return this.registers[0xD] | 0;
}
THUMBInstructionSet.prototype.readLR = function () {
    //Read back the current LR:
    return this.registers[0xE] | 0;
}
THUMBInstructionSet.prototype.readPC = function () {
    //Read back the current PC:
    return this.registers[0xF] | 0;
}
THUMBInstructionSet.prototype.getCurrentFetchValue = function () {
    return this.fetch | (this.fetch << 16);
}
THUMBInstructionSet.prototype.getSWICode = function () {
    return this.execute & 0xFF;
}
THUMBInstructionSet.prototype.LSLimm = function () {
    var source = this.read3OffsetLowRegister() | 0;
    var offset = (this.execute >> 6) & 0x1F;
    if ((offset | 0) > 0) {
        //CPSR Carry is set by the last bit shifted out:
        this.branchFlags.setCarry((source << (((offset | 0) - 1) | 0)) | 0);
        //Perform shift:
        source = source << (offset | 0);
    }
    //Perform CPSR updates for N and Z (But not V):
    this.branchFlags.setNZInt(source | 0);
    //Update destination register:
    this.write0OffsetLowRegister(source | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LSRimm = function () {
    var source = this.read3OffsetLowRegister() | 0;
    var offset = (this.execute >> 6) & 0x1F;
    if ((offset | 0) > 0) {
        //CPSR Carry is set by the last bit shifted out:
        this.branchFlags.setCarry((source >> (((offset | 0) - 1) | 0)) << 31);
        //Perform shift:
        source = (source >>> (offset | 0)) | 0;
    }
    else {
        this.branchFlags.setCarry(source | 0);
        source = 0;
    }
    //Perform CPSR updates for N and Z (But not V):
    this.branchFlags.setNZInt(source | 0);
    //Update destination register:
    this.write0OffsetLowRegister(source | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ASRimm = function () {
    var source = this.read3OffsetLowRegister() | 0;
    var offset = (this.execute >> 6) & 0x1F;
    if ((offset | 0) > 0) {
        //CPSR Carry is set by the last bit shifted out:
        this.branchFlags.setCarry((source >> (((offset | 0) - 1) | 0)) << 31);
        //Perform shift:
        source = source >> (offset | 0);
    }
    else {
        this.branchFlags.setCarry(source | 0);
        source = source >> 0x1F;
    }
    //Perform CPSR updates for N and Z (But not V):
    this.branchFlags.setNZInt(source | 0);
    //Update destination register:
    this.write0OffsetLowRegister(source | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDreg = function () {
    var operand1 = this.read3OffsetLowRegister() | 0;
    var operand2 = this.read6OffsetLowRegister() | 0;
    //Update destination register:
    this.write0OffsetLowRegister(this.branchFlags.setADDFlags(operand1 | 0, operand2 | 0) | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.SUBreg = function () {
    var operand1 = this.read3OffsetLowRegister() | 0;
    var operand2 = this.read6OffsetLowRegister() | 0;
    //Update destination register:
    this.write0OffsetLowRegister(this.branchFlags.setSUBFlags(operand1 | 0, operand2 | 0) | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDimm3 = function () {
    var operand1 = this.read3OffsetLowRegister() | 0;
    var operand2 = (this.execute >> 6) & 0x7;
    //Update destination register:
    this.write0OffsetLowRegister(this.branchFlags.setADDFlags(operand1 | 0, operand2 | 0) | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.SUBimm3 = function () {
    var operand1 = this.read3OffsetLowRegister() | 0;
    var operand2 = (this.execute >> 6) & 0x7;
    //Update destination register:
    this.write0OffsetLowRegister(this.branchFlags.setSUBFlags(operand1 | 0, operand2 | 0) | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.MOVimm8 = function () {
    //Get the 8-bit value to move into the register:
    var result = this.execute & 0xFF;
    this.branchFlags.setNegativeFalse();
    this.branchFlags.setZero(result | 0);
    //Update destination register:
    this.write8OffsetLowRegister(result | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.CMPimm8 = function () {
    //Compare an 8-bit immediate value with a register:
    var operand1 = this.read8OffsetLowRegister() | 0;
    var operand2 = this.execute & 0xFF;
    this.branchFlags.setCMPFlags(operand1 | 0, operand2 | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDimm8 = function () {
    //Add an 8-bit immediate value with a register:
    var operand1 = this.read8OffsetLowRegister() | 0;
    var operand2 = this.execute & 0xFF;
    this.write8OffsetLowRegister(this.branchFlags.setADDFlags(operand1 | 0, operand2 | 0) | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.SUBimm8 = function () {
    //Subtract an 8-bit immediate value from a register:
    var operand1 = this.read8OffsetLowRegister() | 0;
    var operand2 = this.execute & 0xFF;
    this.write8OffsetLowRegister(this.branchFlags.setSUBFlags(operand1 | 0, operand2 | 0) | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.AND = function () {
    var source = this.read3OffsetLowRegister() | 0;
    var destination = this.read0OffsetLowRegister() | 0;
    //Perform bitwise AND:
    var result = source & destination;
    this.branchFlags.setNZInt(result | 0);
    //Update destination register:
    this.write0OffsetLowRegister(result | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.EOR = function () {
    var source = this.read3OffsetLowRegister() | 0;
    var destination = this.read0OffsetLowRegister() | 0;
    //Perform bitwise EOR:
    var result = source ^ destination;
    this.branchFlags.setNZInt(result | 0);
    //Update destination register:
    this.write0OffsetLowRegister(result | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LSL = function () {
    var source = this.read3OffsetLowRegister() & 0xFF;
    var destination = this.read0OffsetLowRegister() | 0;
    //Check to see if we need to update CPSR:
    if ((source | 0) > 0) {
        if ((source | 0) < 0x20) {
            //Shift the register data left:
            this.branchFlags.setCarry(destination << (((source | 0) - 1) | 0));
            destination = destination << (source | 0);
        }
        else if ((source | 0) == 0x20) {
            //Shift bit 0 into carry:
            this.branchFlags.setCarry(destination << 31);
            destination = 0;
        }
        else {
            //Everything Zero'd:
            this.branchFlags.setCarryFalse();
            destination = 0;
        }
    }
    //Perform CPSR updates for N and Z (But not V):
    this.branchFlags.setNZInt(destination | 0);
    //Update destination register:
    this.write0OffsetLowRegister(destination | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LSR = function () {
    var source = this.read3OffsetLowRegister() & 0xFF;
    var destination = this.read0OffsetLowRegister() | 0;
    //Check to see if we need to update CPSR:
    if ((source | 0) > 0) {
        if ((source | 0) < 0x20) {
            //Shift the register data right logically:
            this.branchFlags.setCarry((destination >> (((source | 0) - 1) | 0)) << 31);
            destination = (destination >>> (source | 0)) | 0;
        }
        else if (source == 0x20) {
            //Shift bit 31 into carry:
            this.branchFlags.setCarry(destination | 0);
            destination = 0;
        }
        else {
            //Everything Zero'd:
            this.branchFlags.setCarryFalse();
            destination = 0;
        }
    }
    //Perform CPSR updates for N and Z (But not V):
    this.branchFlags.setNZInt(destination | 0);
    //Update destination register:
    this.write0OffsetLowRegister(destination | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ASR = function () {
    var source = this.read3OffsetLowRegister() & 0xFF;
    var destination = this.read0OffsetLowRegister() | 0;
    //Check to see if we need to update CPSR:
    if ((source | 0) > 0) {
        if ((source | 0) < 0x20) {
            //Shift the register data right arithmetically:
            this.branchFlags.setCarry((destination >> (((source | 0) - 1) | 0)) << 31);
            destination = destination >> (source | 0);
        }
        else {
            //Set all bits with bit 31:
            this.branchFlags.setCarry(destination | 0);
            destination = destination >> 0x1F;
        }
    }
    //Perform CPSR updates for N and Z (But not V):
    this.branchFlags.setNZInt(destination | 0);
    //Update destination register:
    this.write0OffsetLowRegister(destination | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADC = function () {
    var operand1 = this.read0OffsetLowRegister() | 0;
    var operand2 = this.read3OffsetLowRegister() | 0;
    //Update destination register:
    this.write0OffsetLowRegister(this.branchFlags.setADCFlags(operand1 | 0, operand2 | 0) | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.SBC = function () {
    var operand1 = this.read0OffsetLowRegister() | 0;
    var operand2 = this.read3OffsetLowRegister() | 0;
    //Update destination register:
    this.write0OffsetLowRegister(this.branchFlags.setSBCFlags(operand1 | 0, operand2 | 0) | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ROR = function () {
    var source = this.read3OffsetLowRegister() & 0xFF;
    var destination = this.read0OffsetLowRegister() | 0;
    if ((source | 0) > 0) {
        source = source & 0x1F;
        if ((source | 0) > 0) {
            //CPSR Carry is set by the last bit shifted out:
            this.branchFlags.setCarry((destination >> ((source - 1) | 0)) << 31);
            //Perform rotate:
            destination = (destination << ((0x20 - (source | 0)) | 0)) | (destination >>> (source | 0));
        }
        else {
            this.branchFlags.setCarry(destination | 0);
        }
    }
    //Perform CPSR updates for N and Z (But not V):
    this.branchFlags.setNZInt(destination | 0);
    //Update destination register:
    this.write0OffsetLowRegister(destination | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.TST = function () {
    var source = this.read3OffsetLowRegister() | 0;
    var destination = this.read0OffsetLowRegister() | 0;
    //Perform bitwise AND:
    var result = source & destination;
    this.branchFlags.setNZInt(result | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.NEG = function () {
    var source = this.read3OffsetLowRegister() | 0;
    if ((source | 0) != -0x80000000) {
        //Perform Subtraction:
        source = (-(source | 0)) | 0;
        this.branchFlags.setOverflowFalse();
    }
    else {
        //Negation of MIN_INT overflows!
        this.branchFlags.setOverflowTrue();
    }
    this.branchFlags.setNZInt(source | 0);
    //Update destination register:
    this.write0OffsetLowRegister(source | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.CMP = function () {
    //Compare two registers:
    var operand1 = this.read0OffsetLowRegister() | 0;
    var operand2 = this.read3OffsetLowRegister() | 0;
    this.branchFlags.setCMPFlags(operand1 | 0, operand2 | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.CMN = function () {
    //Compare two registers:
    var operand1 = this.read0OffsetLowRegister() | 0;
    var operand2 = this.read3OffsetLowRegister() | 0;
    this.branchFlags.setCMNFlags(operand1 | 0, operand2 | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ORR = function () {
    var source = this.read3OffsetLowRegister() | 0;
    var destination = this.read0OffsetLowRegister() | 0;
    //Perform bitwise OR:
    var result = source | destination;
    this.branchFlags.setNZInt(result | 0);
    //Update destination register:
    this.write0OffsetLowRegister(result | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.MUL = function () {
    var source = this.read3OffsetLowRegister() | 0;
    var destination = this.read0OffsetLowRegister() | 0;
    //Perform MUL32:
    var result = this.CPUCore.performMUL32(source | 0, destination | 0, 0) | 0;
    this.branchFlags.setCarryFalse();
    this.branchFlags.setNZInt(result | 0);
    //Update destination register:
    this.write0OffsetLowRegister(result | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.BIC = function () {
    var source = this.read3OffsetLowRegister() | 0;
    var destination = this.read0OffsetLowRegister() | 0;
    //Perform bitwise AND with a bitwise NOT on source:
    var result = (~source) & destination;
    this.branchFlags.setNZInt(result | 0);
    //Update destination register:
    this.write0OffsetLowRegister(result | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.MVN = function () {
    //Perform bitwise NOT on source:
    var source = ~this.read3OffsetLowRegister();
    this.branchFlags.setNZInt(source | 0);
    //Update destination register:
    this.write0OffsetLowRegister(source | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDH_LH = function () {
    var operand1 = this.read0OffsetLowRegister() | 0;
    var operand2 = this.readHighRegister(this.execute >> 3) | 0;
    //Perform Addition:
    //Update destination register:
    this.write0OffsetLowRegister(((operand1 | 0) + (operand2 | 0)) | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDH_HL = function () {
    var operand1 = this.readHighRegister(this.execute | 0) | 0;
    var operand2 = this.read3OffsetLowRegister() | 0;
    //Perform Addition:
    //Update destination register:
    this.guardHighRegisterWrite(((operand1 | 0) + (operand2 | 0)) | 0);
}
THUMBInstructionSet.prototype.ADDH_HH = function () {
    var operand1 = this.readHighRegister(this.execute | 0) | 0;
    var operand2 = this.readHighRegister(this.execute >> 3) | 0;
    //Perform Addition:
    //Update destination register:
    this.guardHighRegisterWrite(((operand1 | 0) + (operand2 | 0)) | 0);
}
THUMBInstructionSet.prototype.CMPH_LH = function () {
    //Compare two registers:
    var operand1 = this.read0OffsetLowRegister() | 0;
    var operand2 = this.readHighRegister(this.execute >> 3) | 0;
    this.branchFlags.setCMPFlags(operand1 | 0, operand2 | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.CMPH_HL = function () {
    //Compare two registers:
    var operand1 = this.readHighRegister(this.execute | 0) | 0;
    var operand2 = this.read3OffsetLowRegister() | 0;
    this.branchFlags.setCMPFlags(operand1 | 0, operand2 | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.CMPH_HH = function () {
    //Compare two registers:
    var operand1 = this.readHighRegister(this.execute | 0) | 0;
    var operand2 = this.readHighRegister(this.execute >> 3) | 0;
    this.branchFlags.setCMPFlags(operand1 | 0, operand2 | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.MOVH_LH = function () {
    //Move a register to another register:
    this.write0OffsetLowRegister(this.readHighRegister(this.execute >> 3) | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.MOVH_HL = function () {
    //Move a register to another register:
    this.guardHighRegisterWrite(this.read3OffsetLowRegister() | 0);
}
THUMBInstructionSet.prototype.MOVH_HH = function () {
    //Move a register to another register:
    this.guardHighRegisterWrite(this.readHighRegister(this.execute >> 3) | 0);
}
THUMBInstructionSet.prototype.BX_L = function () {
    //Branch & eXchange:
    var address = this.read3OffsetLowRegister() | 0;
    if ((address & 0x1) == 0) {
        //Enter ARM mode:
        this.CPUCore.enterARM();
        this.CPUCore.branch(address & -0x4);
    }
    else {
        //Stay in THUMB mode:
        this.CPUCore.branch(address & -0x2);
    }
}
THUMBInstructionSet.prototype.BX_H = function () {
    //Branch & eXchange:
    var address = this.readHighRegister(this.execute >> 3) | 0;
    if ((address & 0x1) == 0) {
        //Enter ARM mode:
        this.CPUCore.enterARM();
        this.CPUCore.branch(address & -0x4);
    }
    else {
        //Stay in THUMB mode:
        this.CPUCore.branch(address & -0x2);
    }
}
THUMBInstructionSet.prototype.LDRPC = function () {
    //PC-Relative Load
    var data = this.CPUCore.read32(((this.readPC() & -3) + ((this.execute & 0xFF) << 2)) | 0) | 0;
    this.write8OffsetLowRegister(data | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.STRreg = function () {
    //Store Word From Register
    var address = ((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0;
    this.CPUCore.write32(address | 0, this.read0OffsetLowRegister() | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.STRHreg = function () {
    //Store Half-Word From Register
    var address = ((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0;
    this.CPUCore.write16(address | 0, this.read0OffsetLowRegister() | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.STRBreg = function () {
    //Store Byte From Register
    var address = ((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0;
    this.CPUCore.write8(address | 0, this.read0OffsetLowRegister() | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDRSBreg = function () {
    //Load Signed Byte Into Register
    var data = (this.CPUCore.read8(((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0) << 24) >> 24;
    this.write0OffsetLowRegister(data | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDRreg = function () {
    //Load Word Into Register
    var data = this.CPUCore.read32(((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0) | 0;
    this.write0OffsetLowRegister(data | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDRHreg = function () {
    //Load Half-Word Into Register
    var data = this.CPUCore.read16(((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0) | 0;
    this.write0OffsetLowRegister(data | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDRBreg = function () {
    //Load Byte Into Register
    var data = this.CPUCore.read8(((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0) | 0;
    this.write0OffsetLowRegister(data | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDRSHreg = function () {
    //Load Signed Half-Word Into Register
    var data = (this.CPUCore.read16(((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0) << 16) >> 16;
    this.write0OffsetLowRegister(data | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.STRimm5 = function () {
    //Store Word From Register
    var address = (((this.execute >> 4) & 0x7C) + (this.read3OffsetLowRegister() | 0)) | 0;
    this.CPUCore.write32(address | 0, this.read0OffsetLowRegister() | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDRimm5 = function () {
    //Load Word Into Register
    var data = this.CPUCore.read32((((this.execute >> 4) & 0x7C) + (this.read3OffsetLowRegister() | 0)) | 0) | 0;
    this.write0OffsetLowRegister(data | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.STRBimm5 = function () {
    //Store Byte From Register
    var address = (((this.execute >> 6) & 0x1F) + (this.read3OffsetLowRegister() | 0)) | 0;
    this.CPUCore.write8(address | 0, this.read0OffsetLowRegister() | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDRBimm5 = function () {
    //Load Byte Into Register
    var data = this.CPUCore.read8((((this.execute >> 6) & 0x1F) + (this.read3OffsetLowRegister() | 0)) | 0) | 0;
    this.write0OffsetLowRegister(data | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.STRHimm5 = function () {
    //Store Half-Word From Register
    var address = (((this.execute >> 5) & 0x3E) + (this.read3OffsetLowRegister() | 0)) | 0;
    this.CPUCore.write16(address | 0, this.read0OffsetLowRegister() | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDRHimm5 = function () {
    //Load Half-Word Into Register
    var data = this.CPUCore.read16((((this.execute >> 5) & 0x3E) + (this.read3OffsetLowRegister() | 0)) | 0) | 0;
    this.write0OffsetLowRegister(data | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.STRSP = function () {
    //Store Word From Register
    var address = (((this.execute & 0xFF) << 2) + (this.readSP() | 0)) | 0;
    this.CPUCore.write32(address | 0, this.read8OffsetLowRegister() | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDRSP = function () {
    //Load Word Into Register
    var data = this.CPUCore.read32((((this.execute & 0xFF) << 2) + (this.readSP() | 0)) | 0) | 0;
    this.write8OffsetLowRegister(data | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDPC = function () {
    //Add PC With Offset Into Register
    var data = ((this.readPC() & -3) + ((this.execute & 0xFF) << 2)) | 0;
    this.write8OffsetLowRegister(data | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDSP = function () {
    //Add SP With Offset Into Register
    var data = (((this.execute & 0xFF) << 2) + (this.readSP() | 0)) | 0;
    this.write8OffsetLowRegister(data | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDSPimm7 = function () {
    //Add Signed Offset Into SP
    if ((this.execute & 0x80) != 0) {
        this.writeSP(((this.readSP() | 0) - ((this.execute & 0x7F) << 2)) | 0);
    }
    else {
        this.writeSP(((this.readSP() | 0) + ((this.execute & 0x7F) << 2)) | 0);
    }
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.PUSH = function () {
    //Only initialize the PUSH sequence if the register list is non-empty:
    if ((this.execute & 0xFF) > 0) {
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) onto the stack:
        for (var rListPosition = 7; (rListPosition | 0) > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push register onto the stack:
                this.SPDecrementWord();
                this.memory.memoryWrite32(this.readSP() | 0, this.readLowRegister(rListPosition | 0) | 0);
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.PUSHlr = function () {
    //Updating the address bus away from PC fetch:
    this.wait.NonSequentialBroadcast();
    //Push link register onto the stack:
    this.SPDecrementWord();
    this.memory.memoryWrite32(this.readSP() | 0, this.readLR() | 0);
    //Push register(s) onto the stack:
    for (var rListPosition = 7; (rListPosition | 0) > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
        if ((this.execute & (1 << rListPosition)) != 0) {
            //Push register onto the stack:
            this.SPDecrementWord();
            this.memory.memoryWrite32(this.readSP() | 0, this.readLowRegister(rListPosition | 0) | 0);
        }
    }
    //Updating the address bus back to PC fetch:
    this.wait.NonSequentialBroadcast();
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.POP = function () {
    //Only initialize the POP sequence if the register list is non-empty:
    if ((this.execute & 0xFF) > 0) {
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //POP stack into register(s):
        for (var rListPosition = 0; (rListPosition | 0) < 8; rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //POP stack into a register:
                this.writeLowRegister(rListPosition | 0, this.memory.memoryRead32(this.readSP() | 0) | 0);
                this.SPIncrementWord();
            }
        }
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.POPpc = function () {
    //Updating the address bus away from PC fetch:
    this.wait.NonSequentialBroadcast();
    //POP stack into register(s):
    for (var rListPosition = 0; (rListPosition | 0) < 8; rListPosition = ((rListPosition | 0) + 1) | 0) {
        if ((this.execute & (1 << rListPosition)) != 0) {
            //POP stack into a register:
            this.writeLowRegister(rListPosition | 0, this.memory.memoryRead32(this.readSP() | 0) | 0);
            this.SPIncrementWord();
        }
    }
    //POP stack into the program counter (r15):
    this.writePC(this.memory.memoryRead32(this.readSP() | 0) | 0);
    this.SPIncrementWord();
    //Updating the address bus back to PC fetch:
    this.wait.NonSequentialBroadcast();
}
THUMBInstructionSet.prototype.STMIA = function () {
    //Only initialize the STMIA sequence if the register list is non-empty:
    if ((this.execute & 0xFF) > 0) {
        //Get the base address:
        var currentAddress = this.read8OffsetLowRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Push register(s) into memory:
        for (var rListPosition = 0; (rListPosition | 0) < 8; rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Push a register into memory:
                this.memory.memoryWrite32(currentAddress | 0, this.readLowRegister(rListPosition | 0) | 0);
                currentAddress = ((currentAddress | 0) + 4) | 0;
            }
        }
        //Store the updated base address back into register:
        this.write8OffsetLowRegister(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDMIA = function () {
    //Only initialize the LDMIA sequence if the register list is non-empty:
    if ((this.execute & 0xFF) > 0) {
        //Get the base address:
        var currentAddress = this.read8OffsetLowRegister() | 0;
        //Updating the address bus away from PC fetch:
        this.wait.NonSequentialBroadcast();
        //Load  register(s) from memory:
        for (var rListPosition = 0; (rListPosition | 0) < 8; rListPosition = ((rListPosition | 0) + 1) | 0) {
            if ((this.execute & (1 << rListPosition)) != 0) {
                //Load a register from memory:
                this.writeLowRegister(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
                currentAddress = ((currentAddress | 0) + 4) | 0;
            }
        }
        //Store the updated base address back into register:
        this.write8OffsetLowRegister(currentAddress | 0);
        //Updating the address bus back to PC fetch:
        this.wait.NonSequentialBroadcast();
    }
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.BEQ = function () {
    //Branch if EQual:
    if ((this.branchFlags.getZero() | 0) == 0) {
        this.offsetPC();
    }
    else {
        //Update PC:
        this.incrementProgramCounter();
    }
}
THUMBInstructionSet.prototype.BNE = function () {
    //Branch if Not Equal:
    if ((this.branchFlags.getZero() | 0) != 0) {
        this.offsetPC();
    }
    else {
        //Update PC:
        this.incrementProgramCounter();
    }
}
THUMBInstructionSet.prototype.BCS = function () {
    //Branch if Carry Set:
    if ((this.branchFlags.getCarry() | 0) < 0) {
        this.offsetPC();
    }
    else {
        //Update PC:
        this.incrementProgramCounter();
    }
}
THUMBInstructionSet.prototype.BCC = function () {
    //Branch if Carry Clear:
    if ((this.branchFlags.getCarry() | 0) >= 0) {
        this.offsetPC();
    }
    else {
        //Update PC:
        this.incrementProgramCounter();
    }
}
THUMBInstructionSet.prototype.BMI = function () {
    //Branch if Negative Set:
    if ((this.branchFlags.getNegative() | 0) < 0) {
        this.offsetPC();
    }
    else {
        //Update PC:
        this.incrementProgramCounter();
    }
}
THUMBInstructionSet.prototype.BPL = function () {
    //Branch if Negative Clear:
    if ((this.branchFlags.getNegative() | 0) >= 0) {
        this.offsetPC();
    }
    else {
        //Update PC:
        this.incrementProgramCounter();
    }
}
THUMBInstructionSet.prototype.BVS = function () {
    //Branch if Overflow Set:
    if ((this.branchFlags.getOverflow() | 0) < 0) {
        this.offsetPC();
    }
    else {
        //Update PC:
        this.incrementProgramCounter();
    }
}
THUMBInstructionSet.prototype.BVC = function () {
    //Branch if Overflow Clear:
    if ((this.branchFlags.getOverflow() | 0) >= 0) {
        this.offsetPC();
    }
    else {
        //Update PC:
        this.incrementProgramCounter();
    }
}
THUMBInstructionSet.prototype.BHI = function () {
    //Branch if Carry & Non-Zero:
    if ((this.branchFlags.getCarry() | 0) < 0 && (this.branchFlags.getZero() | 0) != 0) {
        this.offsetPC();
    }
    else {
        //Update PC:
        this.incrementProgramCounter();
    }
}
THUMBInstructionSet.prototype.BLS = function () {
    //Branch if Carry Clear or is Zero Set:
    if ((this.branchFlags.getCarry() | 0) < 0 && (this.branchFlags.getZero() | 0) != 0) {
        //Update PC:
        this.incrementProgramCounter();
    }
    else {
        this.offsetPC();
    }
}
THUMBInstructionSet.prototype.BGE = function () {
    //Branch if Negative equal to Overflow
    if ((this.branchFlags.BGE() | 0) >= 0) {
        this.offsetPC();
    }
    else {
        //Update PC:
        this.incrementProgramCounter();
    }
}
THUMBInstructionSet.prototype.BLT = function () {
    //Branch if Negative NOT equal to Overflow
    if ((this.branchFlags.BGE() | 0) < 0) {
        this.offsetPC();
    }
    else {
        //Update PC:
        this.incrementProgramCounter();
    }
}
THUMBInstructionSet.prototype.BGT = function () {
    //Branch if Zero Clear and Negative equal to Overflow
    if ((this.branchFlags.getZero() | 0) != 0 && (this.branchFlags.BGE() | 0) >= 0) {
        this.offsetPC();
    }
    else {
        //Update PC:
        this.incrementProgramCounter();
    }
}
THUMBInstructionSet.prototype.BLE = function () {
    //Branch if Zero Set or Negative NOT equal to Overflow
    if ((this.branchFlags.getZero() | 0) != 0 && (this.branchFlags.BGE() | 0) >= 0) {
        //Update PC:
        this.incrementProgramCounter();
    }
    else {
        this.offsetPC();
    }
}
THUMBInstructionSet.prototype.SWI = function () {
    //Software Interrupt:
    this.CPUCore.SWI();
}
THUMBInstructionSet.prototype.B = function () {
    //Unconditional Branch:
    //Update the program counter to branch address:
    this.CPUCore.branch(((this.readPC() | 0) + ((this.execute << 21) >> 20)) | 0);
}
THUMBInstructionSet.prototype.BLsetup = function () {
    //Brank with Link (High offset)
    //Update the link register to branch address:
    this.writeLR(((this.readPC() | 0) + ((this.execute << 21) >> 9)) | 0);
    //Update PC:
    this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.BLoff = function () {
    //Brank with Link (Low offset)
    //Update the link register to branch address:
    this.writeLR(((this.readLR() | 0) + ((this.execute & 0x7FF) << 1)) | 0);
    //Copy LR to PC:
    var oldPC = this.readPC() | 0;
    //Flush Pipeline & Block PC Increment:
    this.CPUCore.branch(this.readLR() & -0x2);
    //Set bit 0 of LR high:
    this.writeLR(((oldPC | 0) - 0x2) | 0x1);
}
THUMBInstructionSet.prototype.UNDEFINED = function () {
    //Undefined Exception:
    this.CPUCore.UNDEFINED();
}
function compileTHUMBInstructionDecodeMap() {
    var opcodeIndice = 0;
    var instructionMap = getUint8Array(1024);
    function generateLowMap(instruction) {
        for (var index = 0; index < 0x20; ++index) {
            instructionMap[opcodeIndice++] = instruction;
        }
    }
    function generateLowMap2(instruction) {
        for (var index = 0; index < 0x8; ++index) {
            instructionMap[opcodeIndice++] = instruction;
        }
    }
    function generateLowMap3(instruction) {
        for (var index = 0; index < 0x4; ++index) {
            instructionMap[opcodeIndice++] = instruction;
        }
    }
    function generateLowMap4(instruction1, instruction2, instruction3, instruction4) {
        instructionMap[opcodeIndice++] = instruction1;
        instructionMap[opcodeIndice++] = instruction2;
        instructionMap[opcodeIndice++] = instruction3;
        instructionMap[opcodeIndice++] = instruction4;
    }
    //0-7
    generateLowMap(6);
    //8-F
    generateLowMap(7);
    //10-17
    generateLowMap(30);
    //18-19
    generateLowMap2(12);
    //1A-1B
    generateLowMap2(18);
    //1C-1D
    generateLowMap2(11);
    //1E-1F
    generateLowMap2(60);
    //20-27
    generateLowMap(8);
    //28-2F
    generateLowMap(0);
    //30-37
    generateLowMap(17);
    //38-3F
    generateLowMap(42);
    //40
    generateLowMap4(4, 59, 55, 57);
    //41
    generateLowMap4(69, 71, 72, 43);
    //42
    generateLowMap4(48, 46, 9, 75);
    //43
    generateLowMap4(21, 31, 66, 68);
    //44
    generateLowMap4(82, 61, 27, 77);
    //45
    generateLowMap4(82, 58, 63, 78);
    //46
    generateLowMap4(82, 2, 16, 54);
    //47
    generateLowMap4(37, 49, 82, 82);
    //48-4F
    generateLowMap(15);
    //50-51
    generateLowMap2(74);
    //52-53
    generateLowMap2(35);
    //54-55
    generateLowMap2(79);
    //56-57
    generateLowMap2(65);
    //58-59
    generateLowMap2(70);
    //5A-5B
    generateLowMap2(36);
    //5C-5D
    generateLowMap2(76);
    //5E-5F
    generateLowMap2(44);
    //60-67
    generateLowMap(20);
    //68-6F
    generateLowMap(3);
    //70-77
    generateLowMap(45);
    //78-7F
    generateLowMap(5);
    //80-87
    generateLowMap(28);
    //88-8F
    generateLowMap(22);
    //90-97
    generateLowMap(13);
    //98-9F
    generateLowMap(10);
    //A0-A7
    generateLowMap(64);
    //A8-AF
    generateLowMap(67);
    //B0
    generateLowMap3(39);
    //B1
    generateLowMap3(82);
    //B2
    generateLowMap3(82);
    //B3
    generateLowMap3(82);
    //B4
    generateLowMap3(41);
    //B5
    generateLowMap3(40);
    //B6
    generateLowMap3(82);
    //B7
    generateLowMap3(82);
    //B8
    generateLowMap3(82);
    //B9
    generateLowMap3(82);
    //BA
    generateLowMap3(82);
    //BB
    generateLowMap3(82);
    //BC
    generateLowMap3(26);
    //BD
    generateLowMap3(56);
    //BE
    generateLowMap3(82);
    //BF
    generateLowMap3(82);
    //C0-C7
    generateLowMap(50);
    //C8-CF
    generateLowMap(53);
    //D0
    generateLowMap3(1);
    //D1
    generateLowMap3(24);
    //D2
    generateLowMap3(23);
    //D3
    generateLowMap3(19);
    //D4
    generateLowMap3(73);
    //D5
    generateLowMap3(62);
    //D6
    generateLowMap3(80);
    //D7
    generateLowMap3(81);
    //D8
    generateLowMap3(47);
    //D9
    generateLowMap3(51);
    //DA
    generateLowMap3(25);
    //DB
    generateLowMap3(38);
    //DC
    generateLowMap3(34);
    //DD
    generateLowMap3(29);
    //DE
    generateLowMap3(82);
    //DF
    generateLowMap3(52);
    //E0-E7
    generateLowMap(14);
    //E8-EF
    generateLowMap(82);
    //F0-F7
    generateLowMap(32);
    //F8-FF
    generateLowMap(33);
    //Set to prototype:
    THUMBInstructionSet.prototype.instructionMap = instructionMap;
}
compileTHUMBInstructionDecodeMap();;
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function ARMCPSRAttributeTable() {
    var negative = 0;          //N Bit
    var zero = 1;              //Z Bit
    var overflow = 0;          //V Bit
    var carry = 0;             //C Bit
    function setNegative(toSet) {
        negative = toSet | 0;
    };
    function setNegativeFalse() {
        negative = 0;
    };
    function getNegative() {
        return negative | 0;
    };
    function setZero(toSet) {
        zero = toSet | 0;
    };
    function setZeroTrue() {
        zero = 0;
    };
    function setZeroFalse() {
        zero = 1;
    };
    function getZero() {
        return zero | 0;
    };
    function setOverflowTrue() {
        overflow = -1;
    };
    function setOverflowFalse() {
        overflow = 0;
    };
    function getOverflow() {
        return overflow | 0;
    };
    function setCarry(toSet) {
        carry = toSet | 0;
    };
    function setCarryFalse() {
        carry = 0;
    };
    function getCarry() {
        return carry | 0;
    };
    function getCarryReverse() {
        return ~carry;
    };
    function checkConditionalCode(execute) {
        execute = execute | 0;
        /*
         Instruction Decode Pattern:
         C = Conditional Code Bit;
         X = Possible opcode bit;
         N = Data Bit, definitely not an opcode bit
         OPCODE: CCCCXXXXXXXXXXXXNNNNNNNNXXXXNNNN
         
         For this function, we decode the top 3 bits for the conditional code test:
         */
        switch (execute >>> 29) {
            case 0x4:
                if (zero == 0) {
                    execute = -1;
                    break;
                }
            case 0x1:
                execute = ~carry;
                break;
            case 0x2:
                execute = ~negative;
                break;
            case 0x3:
                execute = ~overflow;
                break;
            case 0x6:
                if (zero == 0) {
                    execute = -1;
                    break;
                }
            case 0x5:
                execute = negative ^ overflow;
                break;
            case 0x0:
                if (zero != 0) {
                    execute = -1;
                    break;
                }
            default:
                execute = 0;
        }
        return execute | 0;
    };
    function setNZInt(toSet) {
        toSet = toSet | 0;
        negative = toSet | 0;
        zero = toSet | 0;
    };
    function setNZCV(toSet) {
        toSet = toSet | 0;
        negative = toSet | 0;
        zero = (~toSet) & 0x40000000;
        carry = toSet << 2;
        overflow = toSet << 3;
    };
    function getNZCV() {
        var toSet = negative & 0x80000000;
        if (zero == 0) {
            toSet = toSet | 0x40000000;
        }
        toSet = toSet | ((carry >>> 31) << 29);
        toSet = toSet | ((overflow >>> 31) << 28);
        return toSet | 0;
    };
    function setADDFlags(operand1, operand2) {
        //Update flags for an addition operation:
        operand1 = operand1 | 0;
        operand2 = operand2 | 0;
        negative = ((operand1 | 0) + (operand2 | 0)) | 0;
        zero = negative | 0;
        carry = ((negative >>> 0) < (operand1 >>> 0)) ? -1 : 0;
        overflow = (~(operand1 ^ operand2)) & (operand1 ^ negative);
        return negative | 0;
    };
    function setADCFlags(operand1, operand2) {
        //Update flags for an addition operation:
        operand1 = operand1 | 0;
        operand2 = operand2 | 0;
        //We let this get outside of int32 on purpose:
        var unsignedResult = (operand1 >>> 0) + (operand2 >>> 0) + (carry >>> 31);
        carry = (unsignedResult > 0xFFFFFFFF) ? -1 : 0;
        zero = unsignedResult | 0;
        negative = zero | 0;
        overflow = (~(operand1 ^ operand2)) & (operand1 ^ zero);
        return zero | 0;
    };
    function setSUBFlags(operand1, operand2) {
        //Update flags for a subtraction operation:
        operand1 = operand1 | 0;
        operand2 = operand2 | 0;
        zero = (operand1 - operand2) | 0;
        negative = zero | 0;
        overflow = (operand1 ^ operand2) & (operand1 ^ zero);
        carry = ((operand1 >>> 0) >= (operand2 >>> 0)) ? -1 : 0;
        return zero | 0;
    };
    function setSBCFlags(operand1, operand2) {
        //Update flags for a subtraction operation:
        operand1 = operand1 | 0;
        operand2 = operand2 | 0;
        //We let this get outside of int32 on purpose:
        var unsignedResult = (operand1 >>> 0) - (operand2 >>> 0) - ((~carry) >>> 31);
        carry = (unsignedResult >= 0) ? -1 : 0;
        zero = unsignedResult | 0;
        negative = zero | 0;
        overflow = (operand1 ^ operand2) & (operand1 ^ zero);
        return zero | 0;
    };
    function setCMPFlags(operand1, operand2) {
        //Update flags for a subtraction operation:
        operand1 = operand1 | 0;
        operand2 = operand2 | 0;
        zero = (operand1 - operand2) | 0;
        negative = zero | 0;
        overflow = (operand1 ^ operand2) & (operand1 ^ zero);
        carry = ((operand1 >>> 0) >= (operand2 >>> 0)) ? -1 : 0;
    };
    function setCMNFlags(operand1, operand2) {
        //Update flags for an addition operation:
        operand1 = operand1 | 0;
        operand2 = operand2 | 0;
        negative = ((operand1 | 0) + (operand2 | 0)) | 0;
        zero = negative | 0;
        carry = ((negative >>> 0) < (operand1 >>> 0)) ? -1 : 0;
        overflow = (~(operand1 ^ operand2)) & (operand1 ^ negative);
    };
    function BGE() {
        //Branch if Negative equal to Overflow
        return negative ^ overflow;
    };
    return {
        "setNegative":setNegative,
        "setNegativeFalse":setNegativeFalse,
        "getNegative":getNegative,
        "setZero":setZero,
        "setZeroTrue":setZeroTrue,
        "setZeroFalse":setZeroFalse,
        "getZero":getZero,
        "setOverflowTrue":setOverflowTrue,
        "setOverflowFalse":setOverflowFalse,
        "getOverflow":getOverflow,
        "setCarry":setCarry,
        "setCarryFalse":setCarryFalse,
        "getCarry":getCarry,
        "getCarryReverse":getCarryReverse,
        "checkConditionalCode":checkConditionalCode,
        "setNZInt":setNZInt,
        "setNZCV":setNZCV,
        "getNZCV":getNZCV,
        "setADDFlags":setADDFlags,
        "setADCFlags":setADCFlags,
        "setSUBFlags":setSUBFlags,
        "setSBCFlags":setSBCFlags,
        "setCMPFlags":setCMPFlags,
        "setCMNFlags":setCMNFlags,
        "BGE":BGE
    };
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceSWI(CPUCore) {
    this.CPUCore = CPUCore;
    this.IOCore = this.CPUCore.IOCore;
}
GameBoyAdvanceSWI.prototype.execute = function (command) {
    switch (command) {
        //Soft Reset:
        case 0:
            this.SoftReset();
            break;
        //Register Ram Reset:
        case 0x01:
            this.RegisterRAMReset();
            break;
        //Halt:
        case 0x02:
            this.Halt();
            break;
        //Stop:
        case 0x03:
            this.Stop();
            break;
        //Interrupt Wait:
        case 0x04:
            this.IntrWait();
            break;
        //VBlank Interrupt Wait:
        case 0x05:
            this.VBlankIntrWait();
            break;
        //Division:
        case 0x06:
            this.Div();
            break;
        //Division (Reversed Parameters):
        case 0x07:
            this.DivArm();
            break;
        //Square Root:
        case 0x08:
            this.Sqrt();
            break;
        //Arc Tangent:
        case 0x09:
            this.ArcTan();
            break;
        //Arc Tangent Corrected:
        case 0x0A:
            this.ArcTan2();
            break;
        //CPU Set (Memory Copy + Fill):
        case 0x0B:
            this.CpuSet();
            break;
        //CPU Fast Set (Memory Copy + Fill):
        case 0x0C:
            this.CpuFastSet();
            break;
        //Calculate BIOS Checksum:
        case 0x0D:
            this.GetBiosChecksum();
            break;
        //Calculate BG Rotation/Scaling Parameters:
        case 0x0E:
            this.BgAffineSet();
            break;
        //Calculate OBJ Rotation/Scaling Parameters:
        case 0x0F:
            this.ObjAffineSet();
            break;
        //Bit Unpack Tile Data:
        case 0x10:
            this.BitUnPack();
            break;
        //Uncompress LZ77 Compressed Data (WRAM):
        case 0x11:
            this.LZ77UnCompWram();
            break;
        //Uncompress LZ77 Compressed Data (VRAM):
        case 0x12:
            this.LZ77UnCompVram();
            break;
        //Uncompress Huffman Compressed Data:
        case 0x13:
            this.HuffUnComp();
            break;
        //Uncompress Run-Length Compressed Data (WRAM):
        case 0x14:
            this.RLUnCompWram();
            break;
        //Uncompress Run-Length Compressed Data (VRAM):
        case 0x15:
            this.RLUnCompVram();
            break;
        //Filter Out Difference In Data (8-bit/WRAM):
        case 0x16:
            this.Diff8bitUnFilterWram();
            break;
        //Filter Out Difference In Data (8-bit/VRAM):
        case 0x17:
            this.Diff8bitUnFilterVram();
            break;
        //Filter Out Difference In Data (16-bit):
        case 0x18:
            this.Diff16bitUnFilter();
            break;
        //Update Sound Bias:
        case 0x19:
            this.SoundBias();
            break;
        //Sound Driver Initialization:
        case 0x1A:
            this.SoundDriverInit();
            break;
        //Set Sound Driver Mode:
        case 0x1B:
            this.SoundDriverMode();
            break;
        //Call Sound Driver Main:
        case 0x1C:
            this.SoundDriverMain();
            break;
        //Call Sound Driver VSync Iteration Handler:
        case 0x1D:
            this.SoundDriverVSync();
            break;
        //Clear Direct Sound And Stop Audio:
        case 0x1E:
            this.SoundChannelClear();
            break;
        //Convert MIDI To Frequency:
        case 0x1F:
            this.MidiKey2Freq();
            break;
        //Unknown Sound Driver Functions:
        case 0x20:
        case 0x21:
        case 0x22:
        case 0x23:
        case 0x24:
            this.SoundDriverUnknown();
            break;
        //Multi-Boot:
        case 0x25:
            this.MultiBoot();
            break;
        //Hard Reset:
        case 0x26:
            this.HardReset();
            break;
        //Custom Halt:
        case 0x27:
            this.CustomHalt();
            break;
        //Call Sound Driver VSync Stop Handler:
        case 0x28:
            this.SoundDriverVSyncOff();
            break;
        //Call Sound Driver VSync Start Handler:
        case 0x29:
            this.SoundDriverVSyncOn();
            break;
        //Obtain 36 Sound Driver Pointers:
        case 0x2A:
            this.SoundGetJumpList();
            break;
        //Undefined:
        default:
            //Don't do anything if we get here, although a real device errors.
    }
}
GameBoyAdvanceSWI.prototype.SoftReset = function () {
    
}
GameBoyAdvanceSWI.prototype.RegisterRAMReset = function () {
    var control = this.CPUCore.registers[0];
    if ((control & 0x1) == 0x1) {
        //Clear 256K on-board WRAM
        for (var address = 0x2000000; address < 0x2040000; address += 4) {
            this.IOCore.memory.memoryWrite32(address | 0, 0);
        }
    }
    if ((control & 0x2) == 0x2) {
        //Clear 32K in-chip WRAM
        for (var address = 0x3000000; address < 0x3008000; address += 4) {
            this.IOCore.memory.memoryWrite32(address | 0, 0);
        }
    }
    if ((control & 0x4) == 0x4) {
        //Clear Palette
        for (var address = 0x5000000; address < 0x5000400; address += 4) {
            this.IOCore.memory.memoryWrite32(address | 0, 0);
        }
    }
    if ((control & 0x8) == 0x8) {
        //Clear VRAM
        for (var address = 0x6000000; address < 0x6018000; address += 4) {
            this.IOCore.memory.memoryWrite32(address | 0, 0);
        }
    }
    if ((control & 0x10) == 0x10) {
        //Clear OAM
        for (var address = 0x7000000; address < 0x7000400; address += 4) {
            this.IOCore.memory.memoryWrite32(address | 0, 0);
        }
    }
    if ((control & 0x20) == 0x20) {
        //Reset SIO registers
        for (var address = 0x4000120; address < 0x4000130; address += 4) {
            this.IOCore.memory.memoryWrite32(address | 0, 0);
        }
    }
    if ((control & 0x40) == 0x40) {
        //Reset Sound registers
        for (var address = 0x4000060; address < 0x40000A8; address += 4) {
            this.IOCore.memory.memoryWrite32(address | 0, 0);
        }
    }
    if ((control & 0x80) == 0x80) {
        //Reset all other registers
        for (var address = 0x4000000; address < 0x4000060; address += 4) {
            this.IOCore.memory.memoryWrite32(address | 0, 0);
        }
        for (var address = 0x4000100; address < 0x4000120; address += 4) {
            this.IOCore.memory.memoryWrite32(address | 0, 0);
        }
        for (var address = 0x4000130; address < 0x4000300; address += 4) {
            this.IOCore.memory.memoryWrite32(address | 0, 0);
        }
    }
}
GameBoyAdvanceSWI.prototype.Halt = function () {
    this.IOCore.flagHalt();
}
GameBoyAdvanceSWI.prototype.Stop = function () {
    this.IOCore.flagStop();
}
GameBoyAdvanceSWI.prototype.IntrWait = function () {
    this.IOCore.irq.IME = true;
    if ((this.CPUCore.registers[0] & 0x1) == 0x1) {
        this.IOCore.irq.interruptsRequested = 0;
    }
    this.IOCore.irq.interruptsEnabled = this.CPUCore.registers[1] & 0x3FFF;
    this.Halt();
}
GameBoyAdvanceSWI.prototype.VBlankIntrWait = function () {
    this.IOCore.irq.IME = true;
    this.IOCore.irq.interruptsRequested = 0;
    this.IOCore.irq.interruptsEnabled = 0x1;
    this.Halt();
}
GameBoyAdvanceSWI.prototype.Div = function () {
    var numerator = this.CPUCore.registers[0] | 0;
    var denominator = this.CPUCore.registers[1] | 0;
    if ((denominator | 0) == 0) {
        throw(new Error("Division by 0 called."));
    }
    var result = ((numerator | 0) / (denominator | 0)) | 0;
    this.CPUCore.registers[0] = result | 0;
    this.CPUCore.registers[1] = ((numerator | 0) % (denominator | 0)) | 0;
    this.CPUCore.registers[3] = Math.abs(result | 0) | 0;
}
GameBoyAdvanceSWI.prototype.DivArm = function () {
    var numerator = this.CPUCore.registers[1] | 0;
    var denominator = this.CPUCore.registers[0] | 0;
    if ((denominator | 0) == 0) {
        throw(new Error("Division by 0 called."));
    }
    var result = ((numerator | 0) / (denominator | 0)) | 0;
    this.CPUCore.registers[0] = result | 0;
    this.CPUCore.registers[1] = ((numerator | 0) % (denominator | 0)) | 0;
    this.CPUCore.registers[3] = Math.abs(result | 0) | 0;
}
GameBoyAdvanceSWI.prototype.Sqrt = function () {
    this.CPUCore.registers[0] = Math.sqrt(this.CPUCore.registers[0] | 0) | 0;
}
GameBoyAdvanceSWI.prototype.ArcTan = function () {
    this.CPUCore.registers[0] = Math.max(Math.min(Math.atan(((this.CPUCore.registers[0] << 16) >> 16) / 0x4000) * (0x2000 * Math.PI), 0x4000), -0x4000) | 0;
}
GameBoyAdvanceSWI.prototype.ArcTan2 = function () {
    var x = this.CPUCore.registers[0];
    var y = this.CPUCore.registers[1];
    var result = 0;
    if (y == 0) {
        result = (x >> 16) & 0x8000;
    }
    else {
        if (x == 0) {
            result = ((y >> 16) & 0x8000) + 0x4000;
        }
        else {
            if ((Math.abs(x) > Math.abs(y)) || (Math.abs(x) == Math.abs(y) && (x >= 0 || y >= 0))) {
                this.CPUCore.registers[1] = x;
                this.CPUCore.registers[0] = y << 14;
                this.Div();
                this.ArcTan();
                if (x < 0) {
                    result = 0x8000 + this.CPUCore.registers[0];
                }
                else {
                    result = (((y >> 16) & 0x8000) << 1) + this.CPUCore.registers[0];
                }
            }
            else {
                this.CPUCore.registers[0] = x << 14;
                this.Div();
                this.ArcTan();
                result = (0x4000 + ((y >> 16) & 0x8000)) - this.CPUCore.registers[0];
            }
        }
    }
    this.CPUCore.registers[0] = result | 0;
}
GameBoyAdvanceSWI.prototype.CpuSet = function () {
    var source = this.CPUCore.registers[0];
    var destination = this.CPUCore.registers[1];
    var control = this.CPUCore.registers[2];
    var count = control & 0x1FFFFF;
    var isFixed = ((control & 0x1000000) != 0);
    var is32 = ((control & 0x4000000) != 0);
    if (is32) {
        while (count-- > 0) {
            if (source >= 0x4000 && destination >= 0x4000) {
                this.IOCore.memory.memoryWrite32(destination | 0, this.IOCore.memory.memoryRead32(source | 0) | 0);
            }
            if (!isFixed) {
                source += 0x4;
            }
            destination += 0x4;
        }
    }
    else {
        while (count-- > 0) {
            if (source >= 0x4000 && destination >= 0x4000) {
                this.IOCore.memory.memoryWrite16(destination | 0, this.IOCore.memory.memoryRead16(source | 0) | 0);
            }
            if (!isFixed) {
                source += 0x2;
            }
            destination += 0x2;
        }
    }
}
GameBoyAdvanceSWI.prototype.CpuFastSet = function () {
    var source = this.CPUCore.registers[0];
    var destination = this.CPUCore.registers[1];
    var control = this.CPUCore.registers[2];
    var count = control & 0x1FFFFF;
    var isFixed = ((control & 0x1000000) != 0);
    var currentRead = 0;
    while (count-- > 0) {
        if (source >= 0x4000) {
            currentRead = this.IOCore.memory.memoryRead32(source | 0) | 0;
            for (var i = 0; i < 0x8; ++i) {
                if (destination >= 0x4000) {
                    this.IOCore.memory.memoryWrite32(destination | 0, currentRead | 0);
                }
                destination += 0x4;
            }
        }
        if (!isFixed) {
            source += 0x4;
        }
    }
}
GameBoyAdvanceSWI.prototype.GetBiosChecksum = function () {
    this.CPUCore.registers[0] = 0xBAAE187F;
}
GameBoyAdvanceSWI.prototype.BgAffineSet = function () {
    var source = this.CPUCore.registers[0];
    var destination = this.CPUCore.registers[1];
    var numberCalculations = this.CPUCore.registers[2];
    while (numberCalculations-- > 0) {
        var cx = this.IOCore.memory.memoryRead32(source | 0);
        source += 0x4;
        var cy = this.IOCore.memory.memoryRead32(source | 0);
        source += 0x4;
        var dispx = (this.IOCore.memory.memoryRead16(source | 0) << 16) >> 16;
        source += 0x2;
        var dispy = (this.IOCore.memory.memoryRead16(source | 0) << 16) >> 16;
        source += 0x2;
        var rx = (this.IOCore.memory.memoryRead16(source | 0) << 16) >> 16;
        source += 0x2;
        var ry = (this.IOCore.memory.memoryRead16(source | 0) << 16) >> 16;
        source += 0x2;
        var theta = (this.IOCore.memory.memoryRead16(source | 0) >> 8) / 0x80 * Math.PI;
        source += 0x4;
        var cosAngle = Math.cos(theta);
        var sineAngle = Math.sin(theta);
        var dx = rx * cosAngle;
        var dmx = rx * sineAngle;
        var dy = ry * sineAngle;
        var dmy = ry * cosAngle;
        this.IOCore.memory.memoryWrite16(destination | 0, dx | 0);
        destination += 2;
        this.IOCore.memory.memoryWrite16(destination | 0, (-dmx) | 0);
        destination += 2;
        this.IOCore.memory.memoryWrite16(destination | 0, dy | 0);
        destination += 2;
        this.IOCore.memory.memoryWrite16(destination | 0, dmy | 0);
        destination += 2;
        this.IOCore.memory.memoryWrite32(destination | 0, (cx - dx * dispx + dmx * dispy) | 0);
        destination += 4;
        this.IOCore.memory.memoryWrite32(destination | 0, (cy - dy * dispx + dmy * dispy) | 0);
        destination += 4;
    }
}
GameBoyAdvanceSWI.prototype.ObjAffineSet = function () {
    var source = this.CPUCore.registers[0];
    var destination = this.CPUCore.registers[1];
    var numberCalculations = this.CPUCore.registers[2];
    var offset = this.CPUCore.registers[3];
    while (numberCalculations-- > 0) {
        var rx = (this.IOCore.memory.memoryRead16(source | 0) << 16) >> 16;
        source += 0x2;
        var ry = (this.IOCore.memory.memoryRead16(source | 0) << 16) >> 16;
        source += 0x2;
        var theta = (this.IOCore.memory.memoryRead16(source | 0) >> 8) / 0x80 * Math.PI;
        source += 0x4;
        var cosAngle = Math.cos(theta);
        var sineAngle = Math.sin(theta);
        var dx = rx * cosAngle;
        var dmx = rx * sineAngle;
        var dy = ry * sineAngle;
        var dmy = ry * cosAngle;
        this.IOCore.memory.memoryWrite16(destination | 0, dx | 0);
        destination += offset;
        this.IOCore.memory.memoryWrite16(destination | 0, (-dmx) | 0);
        destination += offset;
        this.IOCore.memory.memoryWrite16(destination | 0, dy | 0);
        destination += offset;
        this.IOCore.memory.memoryWrite16(destination | 0, dmy | 0);
        destination += offset;
    }
}
GameBoyAdvanceSWI.prototype.BitUnPack = function () {
    var source = this.CPUCore.registers[0];
    var destination = this.CPUCore.registers[1];
    var unpackSource = this.CPUCore.registers[2];
    var length = this.IOCore.memory.memoryRead16(unpackSource | 0);
    unpackSource += 0x2;
    var widthSource = this.IOCore.memory.memoryRead16(unpackSource | 0);
    unpackSource += 0x1;
    var widthDestination = this.IOCore.memory.memoryRead8(unpackSource | 0);
    unpackSource += 0x1;
    var offset = this.IOCore.memory.memoryRead32(unpackSource | 0);
    var dataOffset = offset & 0x7FFFFFFF;
    var zeroData = (offset < 0);
    var bitDiff = widthDestination - widthSource;
    if (bitDiff >= 0) {
        var resultWidth = 0;
        while (length > 0) {
            var result = 0;
            var readByte = this.IOCore.memory.memoryRead8((source++) | 0);
            for (var index = 0, widthIndex = 0; index < 8; index += widthSource, widthIndex += widthDestination) {
                var temp = (readByte >> index) & ((widthSource << 1) - 1);
                if (temp > 0 || zeroData) {
                    temp += dataOffset;
                }
                temp <<= widthIndex;
                result |= temp;
            }
            resultWidth += widthIndex;
            if (resultWidth == 32) {
                resultWidth = 0;
                this.IOCore.memory.memoryWrite32(destination | 0, result | 0);
                destination += 4;
                length -= 4;
            }
        }
        if (resultWidth > 0) {
            this.IOCore.memory.memoryWrite32(destination | 0, result | 0);
        }
    }
}
GameBoyAdvanceSWI.prototype.LZ77UnCompWram = function () {
    var source = this.CPUCore.registers[0];
    var destination = this.CPUCore.registers[1];
    
}
GameBoyAdvanceSWI.prototype.LZ77UnCompVram = function () {
    var source = this.CPUCore.registers[0];
    var destination = this.CPUCore.registers[1];
    
}
GameBoyAdvanceSWI.prototype.HuffUnComp = function () {
    
}
GameBoyAdvanceSWI.prototype.RLUnCompWram = function () {
    
}
GameBoyAdvanceSWI.prototype.RLUnCompVram = function () {
    
}
GameBoyAdvanceSWI.prototype.Diff8bitUnFilterWram = function () {
    var source = this.CPUCore.registers[0] & -4;
    var destination = this.CPUCore.registers[1] | 0;
    var descriptor = this.IOCore.memory.memoryRead32(source | 0) | 0;
    var output = this.IOCore.memory.memoryRead8(destination | 0) | 0;
    var wordSize = descriptor & 0x3;
    for (var size = descriptor >>> 8; (size | 0) > 0; size = ((size | 0) - (wordSize | 0)) | 0) {
        source = ((source | 0) + (wordSize | 0)) | 0;
        var data = this.IOCore.memory.memoryRead8(source | 0) | 0;
        output = ((data & 0xFF) + (output & 0xFF)) & 0xFF;
        destination = ((destination | 0) + (wordSize | 0)) | 0;
        this.IOCore.memory.memoryWrite8(destination | 0, output | 0);
    }
}
GameBoyAdvanceSWI.prototype.Diff8bitUnFilterVram = function () {
    var source = this.CPUCore.registers[0] & -4;
    var destination = this.CPUCore.registers[1] | 0;
    var descriptor = this.IOCore.memory.memoryRead32(source | 0) | 0;
    var output = this.IOCore.memory.memoryRead8(destination | 0) | 0;
    var wordSize = descriptor & 0x3;
    for (var size = descriptor >>> 8; (size | 0) > 0; size = ((size | 0) - (wordSize | 0)) | 0) {
        source = ((source | 0) + (wordSize | 0)) | 0;
        var data = this.IOCore.memory.memoryRead8(source | 0) | 0;
        output = ((data & 0xFF) + (output & 0xFF)) & 0xFF;
        destination = ((destination | 0) + (wordSize | 0)) | 0;
        var output2 = output | 0;
        output = ((data & 0xFF) + (output & 0xFF)) & 0xFF;
        destination = ((destination | 0) + (wordSize | 0)) | 0;
        output2 = output2 | (output << 8);
        this.IOCore.memory.memoryWrite16(destination | 0, output2 | 0);
    }
}
GameBoyAdvanceSWI.prototype.Diff16bitUnFilter = function () {
    var source = this.CPUCore.registers[0] & -4;
    var destination = this.CPUCore.registers[1] | 0;
    var descriptor = this.IOCore.memory.memoryRead32(source | 0) | 0;
    var output = this.IOCore.memory.memoryRead16(destination | 0) | 0;
    var wordSize = descriptor & 0x3;
    for (var size = descriptor >>> 8; (size | 0) > 0; size = ((size | 0) - (wordSize | 0)) | 0) {
        source = ((source | 0) + (wordSize | 0)) | 0;
        var data = this.IOCore.memory.memoryRead16(source | 0) | 0;
        output = ((data & 0xFFFF) + (output & 0xFFFF)) & 0xFFFF;
        destination = ((destination | 0) + (wordSize | 0)) | 0;
        this.IOCore.memory.memoryWrite16(destination | 0, output | 0);
    }
}
GameBoyAdvanceSWI.prototype.SoundBias = function () {
    if (this.CPUCore.registers[0] == 0) {
        this.IOCore.memory.memoryWrite16(0x4000088, 0);
    }
    else {
        this.IOCore.memory.memoryWrite16(0x4000088, 0x200);
    }
}
GameBoyAdvanceSWI.prototype.SoundDriverInit = function () {
    
}
GameBoyAdvanceSWI.prototype.SoundDriverMode = function () {
    
}
GameBoyAdvanceSWI.prototype.SoundDriverMain = function () {
    
}
GameBoyAdvanceSWI.prototype.SoundDriverVSync = function () {
    
}
GameBoyAdvanceSWI.prototype.SoundChannelClear = function () {
    
}
GameBoyAdvanceSWI.prototype.MidiKey2Freq = function () {
    var frequency = this.CPUCore.memoryRead32((this.CPUCore.registers[0] + 4) | 0);
    var temp = (180 - this.CPUCore.registers[1]) - (this.CPUCore.registers[2] / 0x100);
    temp = Math.pow(2, temp / 12);
    this.CPUCore.registers[0] = (frequency / temp) | 0;
}
GameBoyAdvanceSWI.prototype.SoundDriverUnknown = function () {
    
}
GameBoyAdvanceSWI.prototype.MultiBoot = function () {
    
}
GameBoyAdvanceSWI.prototype.HardReset = function () {
    
}
GameBoyAdvanceSWI.prototype.CustomHalt = function () {
    this.IOCore.wait.writeHALTCNT(this.CPUCore.registers[2]);
}
GameBoyAdvanceSWI.prototype.SoundDriverVSyncOff = function () {
    
}
GameBoyAdvanceSWI.prototype.SoundDriverVSyncOn = function () {
    
}
GameBoyAdvanceSWI.prototype.SoundGetJumpList = function () {
    
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceBGTEXTRenderer(gfx, BGLayer) {
    this.gfx = gfx;
    this.VRAM = this.gfx.VRAM;
    this.VRAM16 = this.gfx.VRAM16;
    this.VRAM32 = this.gfx.VRAM32;
    this.palette16 = this.gfx.palette16;
    this.palette256 = this.gfx.palette256;
    this.BGLayer = BGLayer | 0;
    this.initialize();
}
GameBoyAdvanceBGTEXTRenderer.prototype.initialize = function () {
    this.scratchBuffer = getInt32Array(247);
    this.tileFetched = getInt32Array(8);
    this.BGXCoord = 0;
    this.BGYCoord = 0;
    this.palettePreprocess();
    this.screenSizePreprocess();
    this.priorityPreprocess();
    this.screenBaseBlockPreprocess();
    this.characterBaseBlockPreprocess();
}
GameBoyAdvanceBGTEXTRenderer.prototype.renderScanLine = function (line) {
    line = line | 0;
    if (this.gfx.BGMosaic[this.BGLayer & 3]) {
        //Correct line number for mosaic:
        line = ((line | 0) - (this.gfx.mosaicRenderer.getMosaicYOffset(line | 0) | 0)) | 0;
    }
    var yTileOffset = ((line | 0) + (this.BGYCoord | 0)) & 0x7;
    var yTileStart = ((line | 0) + (this.BGYCoord | 0)) >> 3;
    var xTileStart = this.BGXCoord >> 3;
    //Fetch tile attributes:
    var chrData = this.fetchTile(yTileStart | 0, xTileStart | 0) | 0;
    xTileStart = ((xTileStart | 0) + 1) | 0;
    //Get 8 pixels of data:
    this.processVRAM(chrData | 0, yTileOffset | 0);
    //Copy the buffered tile to line:
    this.fetchVRAMStart();
    //Render the rest of the tiles fast:
    this.renderWholeTiles(xTileStart | 0, yTileStart | 0, yTileOffset | 0);
    if (this.gfx.BGMosaic[this.BGLayer & 3]) {
        //Pixelize the line horizontally:
        this.gfx.mosaicRenderer.renderMosaicHorizontal(this.scratchBuffer);
    }
    return this.scratchBuffer;
}
GameBoyAdvanceBGTEXTRenderer.prototype.renderWholeTiles = function (xTileStart, yTileStart, yTileOffset) {
    xTileStart = xTileStart | 0;
    yTileStart = yTileStart | 0;
    yTileOffset = yTileOffset | 0;
    //Process full 8 pixels at a time:
    for (var position = (8 - (this.BGXCoord & 0x7)) | 0; (position | 0) < 240; position = ((position | 0) + 8) | 0) {
        //Fetch tile attributes:
        //Get 8 pixels of data:
        this.processVRAM(this.fetchTile(yTileStart | 0, xTileStart | 0) | 0, yTileOffset | 0);
        //Copy the buffered tile to line:
        this.scratchBuffer[position | 0] = this.tileFetched[0] | 0;
        this.scratchBuffer[((position | 0) + 1) | 0] = this.tileFetched[1] | 0;
        this.scratchBuffer[((position | 0) + 2) | 0] = this.tileFetched[2] | 0;
        this.scratchBuffer[((position | 0) + 3) | 0] = this.tileFetched[3] | 0;
        this.scratchBuffer[((position | 0) + 4) | 0] = this.tileFetched[4] | 0;
        this.scratchBuffer[((position | 0) + 5) | 0] = this.tileFetched[5] | 0;
        this.scratchBuffer[((position | 0) + 6) | 0] = this.tileFetched[6] | 0;
        this.scratchBuffer[((position | 0) + 7) | 0] = this.tileFetched[7] | 0;
        //Increment a tile counter:
        xTileStart = ((xTileStart | 0) + 1) | 0;
    }
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceBGTEXTRenderer.prototype.fetchTile = function (yTileStart, xTileStart) {
        yTileStart = yTileStart | 0;
        xTileStart = xTileStart | 0;
        //Find the tile code to locate the tile block:
        var address = ((this.computeTileNumber(yTileStart | 0, xTileStart | 0) | 0) + (this.BGScreenBaseBlock | 0)) | 0;
        return this.VRAM16[address & 0x7FFF] | 0;
    }
}
else {
    GameBoyAdvanceBGTEXTRenderer.prototype.fetchTile = function (yTileStart, xTileStart) {
        //Find the tile code to locate the tile block:
        var address = ((this.computeTileNumber(yTileStart, xTileStart) + this.BGScreenBaseBlock) << 1) & 0xFFFF;
        return (this.VRAM[address | 1] << 8) | this.VRAM[address];
    }
}
GameBoyAdvanceBGTEXTRenderer.prototype.computeTileNumber = function (yTile, xTile) {
    //Return the true tile number:
    yTile = yTile | 0;
    xTile = xTile | 0;
    var tileNumber = xTile & 0x1F;
    switch (this.tileMode | 0) {
        //1x1
        case 0:
            tileNumber = tileNumber | ((yTile & 0x1F) << 5);
            break;
        //2x1
        case 1:
            tileNumber = tileNumber | (((xTile & 0x20) | (yTile & 0x1F)) << 5);
            break;
        //1x2
        case 2:
            tileNumber = tileNumber | ((yTile & 0x3F) << 5);
            break;
        //2x2
        default:
            tileNumber = tileNumber | (((xTile & 0x20) | (yTile & 0x1F)) << 5) | ((yTile & 0x20) << 6);
    }
    return tileNumber | 0;
}
GameBoyAdvanceBGTEXTRenderer.prototype.process4BitVRAM = function (chrData, yOffset) {
    //16 color tile mode:
    chrData = chrData | 0;
    yOffset = yOffset | 0;
    //Parse flip attributes, grab palette, and then output pixel:
    var address = (chrData & 0x3FF) << 3;
    address = ((address | 0) + (this.BGCharacterBaseBlock | 0)) | 0;
    if ((chrData & 0x800) == 0) {
        //No vertical flip:
        address = ((address | 0) + (yOffset | 0)) | 0;

    }
    else {
        //Vertical flip:
        address = ((address | 0) + 7) | 0;
        address = ((address | 0) - (yOffset | 0)) | 0;
    }
    //Copy out our pixels:
    this.render4BitVRAM(chrData >> 8, address | 0);
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceBGTEXTRenderer.prototype.render4BitVRAM = function (chrData, address) {
        chrData = chrData | 0;
        address = address | 0;
        //Unrolled data tile line fetch:
        if ((address | 0) < 0x4000) {
            //Tile address valid:
            var paletteOffset = chrData & 0xF0;
            var data = this.VRAM32[address | 0] | 0;
            if ((chrData & 0x4) == 0) {
                //Normal Horizontal:
                this.tileFetched[0] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
                this.tileFetched[1] = this.palette16[paletteOffset | ((data >> 4) & 0xF)] | this.priorityFlag;
                this.tileFetched[2] = this.palette16[paletteOffset | ((data >> 8) & 0xF)] | this.priorityFlag;
                this.tileFetched[3] = this.palette16[paletteOffset | ((data >> 12) & 0xF)] | this.priorityFlag;
                this.tileFetched[4] = this.palette16[paletteOffset | ((data >> 16) & 0xF)] | this.priorityFlag;
                this.tileFetched[5] = this.palette16[paletteOffset | ((data >> 20) & 0xF)] | this.priorityFlag;
                this.tileFetched[6] = this.palette16[paletteOffset | ((data >> 24) & 0xF)] | this.priorityFlag;
                this.tileFetched[7] = this.palette16[paletteOffset | (data >>> 28)] | this.priorityFlag;
            }
            else {
                //Flipped Horizontally:
                this.tileFetched[0] = this.palette16[paletteOffset | (data >>> 28)] | this.priorityFlag;
                this.tileFetched[1] = this.palette16[paletteOffset | ((data >> 24) & 0xF)] | this.priorityFlag;
                this.tileFetched[2] = this.palette16[paletteOffset | ((data >> 20) & 0xF)] | this.priorityFlag;
                this.tileFetched[3] = this.palette16[paletteOffset | ((data >> 16) & 0xF)] | this.priorityFlag;
                this.tileFetched[4] = this.palette16[paletteOffset | ((data >> 12) & 0xF)] | this.priorityFlag;
                this.tileFetched[5] = this.palette16[paletteOffset | ((data >> 8) & 0xF)] | this.priorityFlag;
                this.tileFetched[6] = this.palette16[paletteOffset | ((data >> 4) & 0xF)] | this.priorityFlag;
                this.tileFetched[7] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
            }
        }
        else {
            //Tile address invalid:
            this.addressInvalidRender();
        }
    }
}
else {
    GameBoyAdvanceBGTEXTRenderer.prototype.render4BitVRAM = function (chrData, address) {
        address <<= 2;
        //Unrolled data tile line fetch:
        if (address < 0x10000) {
            //Tile address valid:
            var paletteOffset = chrData & 0xF0;
            var data = this.VRAM[address];
            if ((chrData & 0x4) == 0) {
                //Normal Horizontal:
                this.tileFetched[0] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
                this.tileFetched[1] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
                data = this.VRAM[address | 1];
                this.tileFetched[2] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
                this.tileFetched[3] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
                data = this.VRAM[address | 2];
                this.tileFetched[4] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
                this.tileFetched[5] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
                data = this.VRAM[address | 3];
                this.tileFetched[6] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
                this.tileFetched[7] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
            }
            else {
                //Flipped Horizontally:
                this.tileFetched[7] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
                this.tileFetched[6] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
                data = this.VRAM[address | 1];
                this.tileFetched[5] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
                this.tileFetched[4] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
                data = this.VRAM[address | 2];
                this.tileFetched[3] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
                this.tileFetched[2] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
                data = this.VRAM[address | 3];
                this.tileFetched[1] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
                this.tileFetched[0] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
            }
        }
        else {
            //Tile address invalid:
            this.addressInvalidRender();
        }
    }
}
/*
 If there was 64 bit typed array support,
 then process8BitVRAM, render8BitVRAMNormal,
 and render8BitVRAMFlipped could be optimized further.
 Namely make one fetch for tile data instead of two,
 and cancel a y-offset shift.
 */
GameBoyAdvanceBGTEXTRenderer.prototype.process8BitVRAM = function (chrData, yOffset) {
    //16 color tile mode:
    chrData = chrData | 0;
    yOffset = yOffset | 0;
    //Parse flip attributes, grab palette, and then output pixel:
    var address = (chrData & 0x3FF) << 4;
    address = ((address | 0) + (this.BGCharacterBaseBlock | 0)) | 0;
    //Copy out our pixels:
    switch (chrData & 0xC00) {
        //No Flip:
        case 0:
            address = ((address | 0) + (yOffset << 1)) | 0;
            this.render8BitVRAMNormal(address | 0);
            break;
        //Horizontal Flip:
        case 0x400:
            address = ((address | 0) + (yOffset << 1)) | 0;
            this.render8BitVRAMFlipped(address | 0);
            break;
        //Vertical Flip:
        case 0x800:
            address = ((address | 0) + 14) | 0;
            address = ((address | 0) - (yOffset << 1)) | 0;
            this.render8BitVRAMNormal(address | 0);
            break;
        //Horizontal & Vertical Flip:
        default:
            address = ((address | 0) + 14) | 0;
            address = ((address | 0) - (yOffset << 1)) | 0;
            this.render8BitVRAMFlipped(address | 0);
    }
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceBGTEXTRenderer.prototype.render8BitVRAMNormal = function (address) {
        address = address | 0;
        if ((address | 0) < 0x4000) {
            //Tile address valid:
            //Normal Horizontal:
            var data = this.VRAM32[address | 0] | 0;
            this.tileFetched[0] = this.palette256[data & 0xFF] | this.priorityFlag;
            this.tileFetched[1] = this.palette256[(data >> 8) & 0xFF] | this.priorityFlag;
            this.tileFetched[2] = this.palette256[(data >> 16) & 0xFF] | this.priorityFlag;
            this.tileFetched[3] = this.palette256[data >>> 24] | this.priorityFlag;
            data = this.VRAM32[address | 1] | 0;
            this.tileFetched[4] = this.palette256[data & 0xFF] | this.priorityFlag;
            this.tileFetched[5] = this.palette256[(data >> 8) & 0xFF] | this.priorityFlag;
            this.tileFetched[6] = this.palette256[(data >> 16) & 0xFF] | this.priorityFlag;
            this.tileFetched[7] = this.palette256[data >>> 24] | this.priorityFlag;
        }
        else {
            //Tile address invalid:
            this.addressInvalidRender();
        }
    }
    GameBoyAdvanceBGTEXTRenderer.prototype.render8BitVRAMFlipped = function (address) {
        address = address | 0;
        if ((address | 0) < 0x4000) {
            //Tile address valid:
            //Flipped Horizontally:
            var data = this.VRAM32[address | 0] | 0;
            this.tileFetched[4] = this.palette256[data >>> 24] | this.priorityFlag;
            this.tileFetched[5] = this.palette256[(data >> 16) & 0xFF] | this.priorityFlag;
            this.tileFetched[6] = this.palette256[(data >> 8) & 0xFF] | this.priorityFlag;
            this.tileFetched[7] = this.palette256[data & 0xFF] | this.priorityFlag;
            data = this.VRAM32[address | 1] | 0;
            this.tileFetched[0] = this.palette256[data >>> 24] | this.priorityFlag;
            this.tileFetched[1] = this.palette256[(data >> 16) & 0xFF] | this.priorityFlag;
            this.tileFetched[2] = this.palette256[(data >> 8) & 0xFF] | this.priorityFlag;
            this.tileFetched[3] = this.palette256[data & 0xFF] | this.priorityFlag;
        }
        else {
            //Tile address invalid:
            this.addressInvalidRender();
        }
    }
}
else {
    GameBoyAdvanceBGTEXTRenderer.prototype.render8BitVRAMNormal = function (address) {
        address <<= 2;
        if (address < 0x10000) {
            //Tile address valid:
            //Normal Horizontal:
            this.tileFetched[0] = this.palette256[this.VRAM[address]] | this.priorityFlag;
            this.tileFetched[1] = this.palette256[this.VRAM[address | 1]] | this.priorityFlag;
            this.tileFetched[2] = this.palette256[this.VRAM[address | 2]] | this.priorityFlag;
            this.tileFetched[3] = this.palette256[this.VRAM[address | 3]] | this.priorityFlag;
            this.tileFetched[4] = this.palette256[this.VRAM[address | 4]] | this.priorityFlag;
            this.tileFetched[5] = this.palette256[this.VRAM[address | 5]] | this.priorityFlag;
            this.tileFetched[6] = this.palette256[this.VRAM[address | 6]] | this.priorityFlag;
            this.tileFetched[7] = this.palette256[this.VRAM[address | 7]] | this.priorityFlag;
        }
        else {
            //Tile address invalid:
            this.addressInvalidRender();
        }
    }
    GameBoyAdvanceBGTEXTRenderer.prototype.render8BitVRAMFlipped = function (address) {
        address <<= 2;
        if (address < 0x10000) {
            //Tile address valid:
            //Flipped Horizontally:
            this.tileFetched[7] = this.palette256[this.VRAM[address]] | this.priorityFlag;
            this.tileFetched[6] = this.palette256[this.VRAM[address | 1]] | this.priorityFlag;
            this.tileFetched[5] = this.palette256[this.VRAM[address | 2]] | this.priorityFlag;
            this.tileFetched[4] = this.palette256[this.VRAM[address | 3]] | this.priorityFlag;
            this.tileFetched[3] = this.palette256[this.VRAM[address | 4]] | this.priorityFlag;
            this.tileFetched[2] = this.palette256[this.VRAM[address | 5]] | this.priorityFlag;
            this.tileFetched[1] = this.palette256[this.VRAM[address | 6]] | this.priorityFlag;
            this.tileFetched[0] = this.palette256[this.VRAM[address | 7]] | this.priorityFlag;
        }
        else {
            //Tile address invalid:
            this.addressInvalidRender();
        }
    }
}
GameBoyAdvanceBGTEXTRenderer.prototype.addressInvalidRender = function () {
    //In GBA mode on NDS, we display transparency on invalid tiles:
    var data = this.gfx.transparency | this.priorityFlag;
    this.tileFetched[0] = data | 0;
    this.tileFetched[1] = data | 0;
    this.tileFetched[2] = data | 0;
    this.tileFetched[3] = data | 0;
    this.tileFetched[4] = data | 0;
    this.tileFetched[5] = data | 0;
    this.tileFetched[6] = data | 0;
    this.tileFetched[7] = data | 0;
}
GameBoyAdvanceBGTEXTRenderer.prototype.fetchVRAMStart = function () {
    //Handle the the first tile of the scan-line specially:
    var pixelPipelinePosition = this.BGXCoord & 0x7;
    switch (pixelPipelinePosition | 0) {
        case 0:
            this.scratchBuffer[0] = this.tileFetched[0] | 0;
        case 1:
            this.scratchBuffer[(1 - (pixelPipelinePosition | 0)) | 0] = this.tileFetched[1] | 0;
        case 2:
            this.scratchBuffer[(2 - (pixelPipelinePosition | 0)) | 0] = this.tileFetched[2] | 0;
        case 3:
            this.scratchBuffer[(3 - (pixelPipelinePosition | 0)) | 0] = this.tileFetched[3] | 0;
        case 4:
            this.scratchBuffer[(4 - (pixelPipelinePosition | 0)) | 0] = this.tileFetched[4] | 0;
        case 5:
            this.scratchBuffer[(5 - (pixelPipelinePosition | 0)) | 0] = this.tileFetched[5] | 0;
        case 6:
            this.scratchBuffer[(6 - (pixelPipelinePosition | 0)) | 0] = this.tileFetched[6] | 0;
        default:
            this.scratchBuffer[(7 - (pixelPipelinePosition | 0)) | 0] = this.tileFetched[7] | 0;
    }
}
GameBoyAdvanceBGTEXTRenderer.prototype.palettePreprocess = function () {
    //Make references:
    if (this.gfx.BGPalette256[this.BGLayer & 3]) {
        this.processVRAM = this.process8BitVRAM;
    }
    else {
        this.processVRAM = this.process4BitVRAM;
    }
}
GameBoyAdvanceBGTEXTRenderer.prototype.screenSizePreprocess = function () {
    this.tileMode = this.gfx.BGScreenSize[this.BGLayer & 0x3] | 0;
}
GameBoyAdvanceBGTEXTRenderer.prototype.priorityPreprocess = function () {
    this.priorityFlag = (this.gfx.BGPriority[this.BGLayer & 3] << 23) | (1 << (this.BGLayer | 0x10));
}
GameBoyAdvanceBGTEXTRenderer.prototype.screenBaseBlockPreprocess = function () {
    this.BGScreenBaseBlock = this.gfx.BGScreenBaseBlock[this.BGLayer & 3] << 10;
}
GameBoyAdvanceBGTEXTRenderer.prototype.characterBaseBlockPreprocess = function () {
    this.BGCharacterBaseBlock = this.gfx.BGCharacterBaseBlock[this.BGLayer & 3] << 12;
}
GameBoyAdvanceBGTEXTRenderer.prototype.writeBGHOFS0 = function (data) {
    data = data | 0;
    this.BGXCoord = (this.BGXCoord & 0x100) | data;
}
GameBoyAdvanceBGTEXTRenderer.prototype.writeBGHOFS1 = function (data) {
    data = data | 0;
    this.BGXCoord = ((data & 0x01) << 8) | (this.BGXCoord & 0xFF);
}
GameBoyAdvanceBGTEXTRenderer.prototype.writeBGVOFS0 = function (data) {
    data = data | 0;
    this.BGYCoord = (this.BGYCoord & 0x100) | data;
}
GameBoyAdvanceBGTEXTRenderer.prototype.writeBGVOFS1 = function (data) {
    data = data | 0;
    this.BGYCoord = ((data & 0x01) << 8) | (this.BGYCoord & 0xFF);
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceBG2FrameBufferRenderer(gfx) {
    this.gfx = gfx;
    this.palette = this.gfx.palette256;
    this.VRAM = this.gfx.VRAM;
    this.VRAM16 = this.gfx.VRAM16;
    this.fetchPixel = this.fetchMode3Pixel;
    this.bgAffineRenderer = this.gfx.bgAffineRenderer[0];
    this.frameSelect = 0;
}
GameBoyAdvanceBG2FrameBufferRenderer.prototype.selectMode = function (mode) {
    mode = mode | 0;
    switch (mode | 0) {
        case 3:
            this.fetchPixel = this.fetchMode3Pixel;
            break;
        case 4:
            this.fetchPixel = this.fetchMode4Pixel;
            break;
        case 5:
            this.fetchPixel = this.fetchMode5Pixel;
    }
}
GameBoyAdvanceBG2FrameBufferRenderer.prototype.renderScanLine = function (line) {
    line = line | 0;
    return this.bgAffineRenderer.renderScanLine(line | 0, this);
}
if (__LITTLE_ENDIAN__) {
    if (typeof Math.imul == "function") {
        //Math.imul found, insert the optimized path in:
        GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode3Pixel = function (x, y) {
            x = x | 0;
            y = y | 0;
            //Output pixel:
            if ((x | 0) > -1 && (y | 0) > -1 && (x | 0) < 240 && (y | 0) < 160) {
                var address = (Math.imul(y | 0, 240) + (x | 0)) | 0;
                return this.VRAM16[address & 0xFFFF] & 0x7FFF;
            }
            //Out of range, output transparency:
            return 0x3800000;
        }
        GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode5Pixel = function (x, y) {
            x = x | 0;
            y = y | 0;
            //Output pixel:
            if ((x | 0) > -1 && (y | 0) > -1 && (x | 0) < 160 && (y | 0) < 128) {
                var address = ((this.frameSelect | 0) + Math.imul(y | 0, 160) + (x | 0)) | 0;
                return this.VRAM16[address & 0xFFFF] & 0x7FFF;
            }
            //Out of range, output transparency:
            return 0x3800000;
        }
    }
    else {
        //Math.imul not found, use the compatibility method:
        GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode3Pixel = function (x, y) {
            x = x | 0;
            y = y | 0;
            //Output pixel:
            if ((x | 0) > -1 && (y | 0) > -1 && (x | 0) < 240 && (y | 0) < 160) {
                var address = (((y * 240) | 0) + (x | 0)) | 0;
                return this.VRAM16[address & 0xFFFF] & 0x7FFF;
            }
            //Out of range, output transparency:
            return 0x3800000;
        }
        GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode5Pixel = function (x, y) {
            x = x | 0;
            y = y | 0;
            //Output pixel:
            if ((x | 0) > -1 && (y | 0) > -1 && (x | 0) < 160 && (y | 0) < 128) {
                var address = ((this.frameSelect | 0) + ((y * 160) | 0) + (x | 0)) | 0;
                return this.VRAM16[address & 0xFFFF] & 0x7FFF;
            }
            //Out of range, output transparency:
            return 0x3800000;
        }
    }
}
else {
    if (typeof Math.imul == "function") {
        //Math.imul found, insert the optimized path in:
        GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode3Pixel = function (x, y) {
            x = x | 0;
            y = y | 0;
            //Output pixel:
            if ((x | 0) > -1 && (y | 0) > -1 && (x | 0) < 240 && (y | 0) < 160) {
                var address = (Math.imul(y | 0, 240) + (x | 0)) << 1;
                return ((this.VRAM[address | 1] << 8) | this.VRAM[address | 0]) & 0x7FFF;
            }
            //Out of range, output transparency:
            return 0x3800000;
        }
        GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode5Pixel = function (x, y) {
            x = x | 0;
            y = y | 0;
            //Output pixel:
            if ((x | 0) > -1 && (y | 0) > -1 && (x | 0) < 160 && (y | 0) < 128) {
                var address = ((this.frameSelect | 0) + ((Math.imul(y | 0, 160) + (x | 0)) << 1)) | 0;
                return ((this.VRAM[address | 1] << 8) | this.VRAM[address | 0]) & 0x7FFF;
            }
            //Out of range, output transparency:
            return 0x3800000;
        }
    }
    else {
        //Math.imul not found, use the compatibility method:
        GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode3Pixel = function (x, y) {
            //Output pixel:
            if (x > -1 && y > -1 && x < 240 && y < 160) {
                var address = ((y * 240) + x) << 1;
                return ((this.VRAM[address | 1] << 8) | this.VRAM[address]) & 0x7FFF;
            }
            //Out of range, output transparency:
            return 0x3800000;
        }
        GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode5Pixel = function (x, y) {
            //Output pixel:
            if (x > -1 && y > -1 && x < 160 && y < 128) {
                var address = this.frameSelect + (((y * 160) + x) << 1);
                return ((this.VRAM[address | 1] << 8) | this.VRAM[address]) & 0x7FFF;
            }
            //Out of range, output transparency:
            return 0x3800000;
        }
    }
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode4Pixel = function (x, y) {
        x = x | 0;
        y = y | 0;
        //Output pixel:
        if ((x | 0) > -1 && (y | 0) > -1 && (x | 0) < 240 && (y | 0) < 160) {
            var address = ((this.frameSelect | 0) + (Math.imul(y | 0, 240) | 0) + (x | 0)) | 0;
            return this.palette[this.VRAM[address | 0] & 0xFF] | 0;
        }
        //Out of range, output transparency:
        return 0x3800000;
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode4Pixel = function (x, y) {
        //Output pixel:
        if (x > -1 && y > -1 && x < 240 && y < 160) {
            return this.palette[this.VRAM[this.frameSelect + (y * 240) + x]];
        }
        //Out of range, output transparency:
        return 0x3800000;
    }
}
GameBoyAdvanceBG2FrameBufferRenderer.prototype.writeFrameSelect = function (frameSelect) {
    frameSelect = frameSelect >> 31;
    this.frameSelect = frameSelect & 0xA000;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceBGMatrixRenderer(gfx, BGLayer) {
    this.gfx = gfx;
    this.BGLayer = BGLayer | 0;
    this.VRAM = this.gfx.VRAM;
    this.palette = this.gfx.palette256;
    this.bgAffineRenderer = this.gfx.bgAffineRenderer[BGLayer & 0x1];
    this.screenSizePreprocess();
    this.screenBaseBlockPreprocess();
    this.characterBaseBlockPreprocess();
    this.displayOverflowProcess(false);
}
GameBoyAdvanceBGMatrixRenderer.prototype.renderScanLine = function (line) {
    line = line | 0;
    return this.bgAffineRenderer.renderScanLine(line | 0, this);
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceBGMatrixRenderer.prototype.fetchTile = function (x, y) {
        //Compute address for tile VRAM to address:
        x = x | 0;
        y = y | 0;
        var tileNumber = ((x | 0) + Math.imul(y | 0, this.mapSize | 0)) | 0;
        return this.VRAM[((tileNumber | 0) + (this.BGScreenBaseBlock | 0)) & 0xFFFF] | 0;
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceBGMatrixRenderer.prototype.fetchTile = function (x, y) {
        //Compute address for tile VRAM to address:
        var tileNumber = x + (y * this.mapSize);
        return this.VRAM[(tileNumber + this.BGScreenBaseBlock) & 0xFFFF];
    }
}
GameBoyAdvanceBGMatrixRenderer.prototype.computeScreenAddress = function (x, y) {
    //Compute address for character VRAM to address:
    x = x | 0;
    y = y | 0;
    var address = this.fetchTile(x >> 3, y >> 3) << 6;
    address = ((address | 0) + (this.BGCharacterBaseBlock | 0)) | 0;
    address = ((address | 0) + ((y & 0x7) << 3)) | 0;
    address = ((address | 0) + (x & 0x7)) | 0;
    return address | 0;
}
GameBoyAdvanceBGMatrixRenderer.prototype.fetchPixelOverflow = function (x, y) {
    //Fetch the pixel:
    x = x | 0;
    y = y | 0;
    //Output pixel:
    var address = this.computeScreenAddress(x & this.mapSizeComparer, y & this.mapSizeComparer) | 0;
    return this.palette[this.VRAM[address & 0xFFFF] & 0xFF] | 0;
}
GameBoyAdvanceBGMatrixRenderer.prototype.fetchPixelNoOverflow = function (x, y) {
    //Fetch the pixel:
    x = x | 0;
    y = y | 0;
    //Output pixel:
    if ((x | 0) != (x & this.mapSizeComparer) || (y | 0) != (y & this.mapSizeComparer)) {
        //Overflow Handling:
        //Out of bounds with no overflow allowed:
        return 0x3800000;
    }
    var address = this.computeScreenAddress(x | 0, y | 0) | 0;
    return this.palette[this.VRAM[address & 0xFFFF] & 0xFF] | 0;
}
GameBoyAdvanceBGMatrixRenderer.prototype.screenBaseBlockPreprocess = function () {
    this.BGScreenBaseBlock = this.gfx.BGScreenBaseBlock[this.BGLayer & 3] << 11;
}
GameBoyAdvanceBGMatrixRenderer.prototype.characterBaseBlockPreprocess = function () {
    this.BGCharacterBaseBlock = this.gfx.BGCharacterBaseBlock[this.BGLayer & 3] << 14;
}
GameBoyAdvanceBGMatrixRenderer.prototype.screenSizePreprocess = function () {
    this.mapSize = 0x10 << (this.gfx.BGScreenSize[this.BGLayer & 3] | 0);
    this.mapSizeComparer = ((this.mapSize << 3) - 1) | 0;
}
GameBoyAdvanceBGMatrixRenderer.prototype.displayOverflowPreprocess = function () {
    var doOverflow = this.gfx.BGDisplayOverflow[this.BGLayer & 1];
    if (doOverflow != this.BGDisplayOverflow) {
        this.displayOverflowProcess(doOverflow);
    }
}
GameBoyAdvanceBGMatrixRenderer.prototype.displayOverflowProcess = function (doOverflow) {
    this.BGDisplayOverflow = doOverflow;
    this.fetchPixel = (doOverflow) ? this.fetchPixelOverflow : this.fetchPixelNoOverflow;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceAffineBGRenderer(gfx, BGLayer) {
    this.gfx = gfx;
    this.BGLayer = BGLayer;
    this.initialize();
}
GameBoyAdvanceAffineBGRenderer.prototype.initialize = function () {
    this.scratchBuffer = getInt32Array(240);
    this.BGdx = 0x100;
    this.BGdmx = 0;
    this.BGdy = 0;
    this.BGdmy = 0x100;
    this.actualBGdx = 0x100;
    this.actualBGdmx = 0;
    this.actualBGdy = 0;
    this.actualBGdmy = 0x100;
    this.BGReferenceX = 0;
    this.BGReferenceY = 0;
    this.actualBGReferenceX = 0;
    this.actualBGReferenceY = 0;
    this.pb = 0;
    this.pd = 0;
    this.priorityPreprocess();
    this.offsetReferenceCounters();
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceAffineBGRenderer.prototype.renderScanLine = function (line, BGObject) {
        line = line | 0;
        var x = this.pb | 0;
        var y = this.pd | 0;
        if (this.gfx.BGMosaic[this.BGLayer & 3]) {
            //Correct line number for mosaic:
            var mosaicY = this.gfx.mosaicRenderer.getMosaicYOffset(line | 0) | 0;
            x = ((x | 0) - Math.imul(this.actualBGdmx | 0, mosaicY | 0)) | 0;
            y = ((y | 0) - Math.imul(this.actualBGdmy | 0, mosaicY | 0)) | 0;
        }
        for (var position = 0; (position | 0) < 240; position = ((position | 0) + 1) | 0, x = ((x | 0) + (this.actualBGdx | 0)) | 0, y = ((y | 0) + (this.actualBGdy | 0)) | 0) {
            //Fetch pixel:
            this.scratchBuffer[position | 0] = this.priorityFlag | BGObject.fetchPixel(x >> 8, y >> 8);
        }
        if (this.gfx.BGMosaic[this.BGLayer & 3]) {
            //Pixelize the line horizontally:
            this.gfx.mosaicRenderer.renderMosaicHorizontal(this.scratchBuffer);
        }
        return this.scratchBuffer;
    }
    GameBoyAdvanceAffineBGRenderer.prototype.offsetReferenceCounters = function () {
        var end = this.gfx.lastUnrenderedLine | 0;
        this.pb = Math.imul(((this.pb | 0) + (this.actualBGdmx | 0)) | 0, end | 0) | 0;
        this.pd = Math.imul(((this.pd | 0) + (this.actualBGdmy | 0)) | 0, end | 0) | 0;
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceAffineBGRenderer.prototype.renderScanLine = function (line, BGObject) {
        var x = this.pb;
        var y = this.pd;
        if (this.gfx.BGMosaic[this.BGLayer & 3]) {
            //Correct line number for mosaic:
            var mosaicY = this.gfx.mosaicRenderer.getMosaicYOffset(line | 0);
            x -= this.actualBGdmx * mosaicY;
            y -= this.actualBGdmy * mosaicY;
        }
        for (var position = 0; position < 240; ++position, x += this.actualBGdx, y += this.actualBGdy) {
            //Fetch pixel:
            this.scratchBuffer[position] = this.priorityFlag | BGObject.fetchPixel(x >> 8, y >> 8);
        }
        if (this.gfx.BGMosaic[this.BGLayer & 3]) {
            //Pixelize the line horizontally:
            this.gfx.mosaicRenderer.renderMosaicHorizontal(this.scratchBuffer);
        }
        return this.scratchBuffer;
    }
    GameBoyAdvanceAffineBGRenderer.prototype.offsetReferenceCounters = function () {
        var end = this.gfx.lastUnrenderedLine | 0;
        this.pb = (((this.pb | 0) + (this.actualBGdmx | 0)) * (end | 0)) | 0;
        this.pd = (((this.pd | 0) + (this.actualBGdmy | 0)) * (end | 0)) | 0;
    }
}
GameBoyAdvanceAffineBGRenderer.prototype.incrementReferenceCounters = function () {
    this.pb = ((this.pb | 0) + (this.actualBGdmx | 0)) | 0;
    this.pd = ((this.pd | 0) + (this.actualBGdmy | 0)) | 0;
}
GameBoyAdvanceAffineBGRenderer.prototype.resetReferenceCounters = function () {
    this.pb = this.actualBGReferenceX | 0;
    this.pd = this.actualBGReferenceY | 0;
}
GameBoyAdvanceAffineBGRenderer.prototype.priorityPreprocess = function () {
    this.priorityFlag = (this.gfx.BGPriority[this.BGLayer] << 23) | (1 << (this.BGLayer + 0x10));
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPA0 = function (data) {
    data = data | 0;
    this.BGdx = (this.BGdx & 0xFF00) | data;
    this.actualBGdx = (this.BGdx << 16) >> 16;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPA1 = function (data) {
    data = data | 0;
    this.BGdx = (data << 8) | (this.BGdx & 0xFF);
    this.actualBGdx = (this.BGdx << 16) >> 16;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPB0 = function (data) {
    data = data | 0;
    this.BGdmx = (this.BGdmx & 0xFF00) | data;
    this.actualBGdmx = (this.BGdmx << 16) >> 16;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPB1 = function (data) {
    data = data | 0;
    this.BGdmx = (data << 8) | (this.BGdmx & 0xFF);
    this.actualBGdmx = (this.BGdmx << 16) >> 16;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPC0 = function (data) {
    data = data | 0;
    this.BGdy = (this.BGdy & 0xFF00) | data;
    this.actualBGdy = (this.BGdy << 16) >> 16;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPC1 = function (data) {
    data = data | 0;
    this.BGdy = (data << 8) | (this.BGdy & 0xFF);
    this.actualBGdy = (this.BGdy << 16) >> 16;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPD0 = function (data) {
    data = data | 0;
    this.BGdmy = (this.BGdmy & 0xFF00) | data;
    this.actualBGdmy = (this.BGdmy << 16) >> 16;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPD1 = function (data) {
    data = data | 0;
    this.BGdmy = (data << 8) | (this.BGdmy & 0xFF);
    this.actualBGdmy = (this.BGdmy << 16) >> 16;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGX_L0 = function (data) {
    data = data | 0;
    this.BGReferenceX = (this.BGReferenceX & 0xFFFFF00) | data;
    this.actualBGReferenceX = (this.BGReferenceX << 4) >> 4;
    //Writing to the x reference doesn't reset the counters during draw!
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGX_L1 = function (data) {
    data = data | 0;
    this.BGReferenceX = (data << 8) | (this.BGReferenceX & 0xFFF00FF);
    this.actualBGReferenceX = (this.BGReferenceX << 4) >> 4;
    //Writing to the x reference doesn't reset the counters during draw!
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGX_H0 = function (data) {
    data = data | 0;
    this.BGReferenceX = (data << 16) | (this.BGReferenceX & 0xF00FFFF);
    this.actualBGReferenceX = (this.BGReferenceX << 4) >> 4;
    //Writing to the x reference doesn't reset the counters during draw!
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGX_H1 = function (data) {
    data = data | 0;
    this.BGReferenceX = ((data & 0xF) << 24) | (this.BGReferenceX & 0xFFFFFF);
    this.actualBGReferenceX = (this.BGReferenceX << 4) >> 4;
    //Writing to the x reference doesn't reset the counters during draw!
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGY_L0 = function (data) {
    data = data | 0;
    this.BGReferenceY = (this.BGReferenceY & 0xFFFFF00) | data;
    this.actualBGReferenceY = (this.BGReferenceY << 4) >> 4;
    this.resetReferenceCounters();
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGY_L1 = function (data) {
    data = data | 0;
    this.BGReferenceY = (data << 8) | (this.BGReferenceY & 0xFFF00FF);
    this.actualBGReferenceY = (this.BGReferenceY << 4) >> 4;
    this.resetReferenceCounters();
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGY_H0 = function (data) {
    data = data | 0;
    this.BGReferenceY = (data << 16) | (this.BGReferenceY & 0xF00FFFF);
    this.actualBGReferenceY = (this.BGReferenceY << 4) >> 4;
    this.resetReferenceCounters();
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGY_H1 = function (data) {
    data = data | 0;
    this.BGReferenceY = ((data & 0xF) << 24) | (this.BGReferenceY & 0xFFFFFF);
    this.actualBGReferenceY = (this.BGReferenceY << 4) >> 4;
    this.resetReferenceCounters();
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceColorEffectsRenderer() {
    this.alphaBlendAmountTarget1 = 0;
    this.alphaBlendAmountTarget2 = 0;
    this.effectsTarget1 = 0;
    this.colorEffectsType = 0;
    this.effectsTarget2 = 0;
    this.brightnessEffectAmount = 0;
    this.alphaBlendOptimizationChecks();
}
GameBoyAdvanceColorEffectsRenderer.prototype.processOAMSemiTransparent = function (lowerPixel, topPixel) {
    lowerPixel = lowerPixel | 0;
    topPixel = topPixel | 0;
    if (((lowerPixel | 0) & (this.effectsTarget2 | 0)) != 0) {
        return this.alphaBlend(topPixel | 0, lowerPixel | 0) | 0;
    }
    else if (((topPixel | 0) & (this.effectsTarget1 | 0)) != 0) {
        switch (this.colorEffectsType | 0) {
            case 2:
                return this.brightnessIncrease(topPixel | 0) | 0;
            case 3:
                return this.brightnessDecrease(topPixel | 0) | 0;
        }
    }
    return topPixel | 0;
}
GameBoyAdvanceColorEffectsRenderer.prototype.process = function (lowerPixel, topPixel) {
    lowerPixel = lowerPixel | 0;
    topPixel = topPixel | 0;
    if (((topPixel | 0) & (this.effectsTarget1 | 0)) != 0) {
        switch (this.colorEffectsType | 0) {
            case 1:
                if (((lowerPixel | 0) & (this.effectsTarget2 | 0)) != 0 && (topPixel | 0) != (lowerPixel | 0)) {
                    return this.alphaBlend(topPixel | 0, lowerPixel | 0) | 0;
                }
                break;
            case 2:
                return this.brightnessIncrease(topPixel | 0) | 0;
            case 3:
                return this.brightnessDecrease(topPixel | 0) | 0;
        }
    }
    return topPixel | 0;
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendNormal = function (topPixel, lowerPixel) {
        topPixel = topPixel | 0;
        lowerPixel = lowerPixel | 0;
        var b1 = (topPixel >> 10) & 0x1F;
        var g1 = (topPixel >> 5) & 0x1F;
        var r1 = topPixel & 0x1F;
        var b2 = (lowerPixel >> 10) & 0x1F;
        var g2 = (lowerPixel >> 5) & 0x1F;
        var r2 = lowerPixel & 0x1F;
        b1 = Math.imul(b1 | 0, this.alphaBlendAmountTarget1 | 0) | 0;
        g1 = Math.imul(g1 | 0, this.alphaBlendAmountTarget1 | 0) | 0;
        r1 = Math.imul(r1 | 0, this.alphaBlendAmountTarget1 | 0) | 0;
        b2 = Math.imul(b2 | 0, this.alphaBlendAmountTarget2 | 0) | 0;
        g2 = Math.imul(g2 | 0, this.alphaBlendAmountTarget2 | 0) | 0;
        r2 = Math.imul(r2 | 0, this.alphaBlendAmountTarget2 | 0) | 0;
        //Keep this not inlined in the return, firefox 22 grinds on it:
        var b = Math.min(((b1 | 0) + (b2 | 0)) >> 4, 0x1F) | 0;
        var g = Math.min(((g1 | 0) + (g2 | 0)) >> 4, 0x1F) | 0;
        var r = Math.min(((r1 | 0) + (r2 | 0)) >> 4, 0x1F) | 0;
        return (b << 10) | (g << 5) | r;
    }
    GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendTop = function (topPixel, lowerPixel) {
        topPixel = topPixel | 0;
        lowerPixel = lowerPixel | 0;
        var b = (topPixel >> 10) & 0x1F;
        var g = (topPixel >> 5) & 0x1F;
        var r = topPixel & 0x1F;
        b = Math.imul(b | 0, this.alphaBlendAmountTarget1 | 0) | 0;
        g = Math.imul(g | 0, this.alphaBlendAmountTarget1 | 0) | 0;
        r = Math.imul(r | 0, this.alphaBlendAmountTarget1 | 0) | 0;
        return ((b >> 4) << 10) | ((g >> 4) << 5) | (r >> 4);
    }
    GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendLow = function (topPixel, lowerPixel) {
        topPixel = topPixel | 0;
        lowerPixel = lowerPixel | 0;
        var b = (lowerPixel >> 10) & 0x1F;
        var g = (lowerPixel >> 5) & 0x1F;
        var r = lowerPixel & 0x1F;
        b = Math.imul(b | 0, this.alphaBlendAmountTarget2 | 0) | 0;
        g = Math.imul(g | 0, this.alphaBlendAmountTarget2 | 0) | 0;
        r = Math.imul(r | 0, this.alphaBlendAmountTarget2 | 0) | 0;
        return ((b >> 4) << 10) | ((g >> 4) << 5) | (r >> 4);
    }
    GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendAddLow = function (topPixel, lowerPixel) {
        topPixel = topPixel | 0;
        lowerPixel = lowerPixel | 0;
        var b1 = (topPixel >> 10) & 0x1F;
        var g1 = (topPixel >> 5) & 0x1F;
        var r1 = topPixel & 0x1F;
        var b2 = (lowerPixel >> 10) & 0x1F;
        var g2 = (lowerPixel >> 5) & 0x1F;
        var r2 = lowerPixel & 0x1F;
        b1 = Math.imul(b1 | 0, this.alphaBlendAmountTarget1 | 0) | 0;
        g1 = Math.imul(g1 | 0, this.alphaBlendAmountTarget1 | 0) | 0;
        r1 = Math.imul(r1 | 0, this.alphaBlendAmountTarget1 | 0) | 0;
        //Keep this not inlined in the return, firefox 22 grinds on it:
        var b = Math.min(((b1 | 0) + (b2 << 4)) >> 4, 0x1F) | 0;
        var g = Math.min(((g1 | 0) + (g2 << 4)) >> 4, 0x1F) | 0;
        var r = Math.min(((r1 | 0) + (r2 << 4)) >> 4, 0x1F) | 0;
        return (b << 10) | (g << 5) | r;
    }
    GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendAddTop = function (topPixel, lowerPixel) {
        topPixel = topPixel | 0;
        lowerPixel = lowerPixel | 0;
        var b1 = (topPixel >> 10) & 0x1F;
        var g1 = (topPixel >> 5) & 0x1F;
        var r1 = topPixel & 0x1F;
        var b2 = (lowerPixel >> 10) & 0x1F;
        var g2 = (lowerPixel >> 5) & 0x1F;
        var r2 = lowerPixel & 0x1F;
        b2 = Math.imul(b2 | 0, this.alphaBlendAmountTarget2 | 0) | 0;
        g2 = Math.imul(g2 | 0, this.alphaBlendAmountTarget2 | 0) | 0;
        r2 = Math.imul(r2 | 0, this.alphaBlendAmountTarget2 | 0) | 0;
        //Keep this not inlined in the return, firefox 22 grinds on it:
        var b = Math.min(((b1 << 4) + (b2 | 0)) >> 4, 0x1F) | 0;
        var g = Math.min(((g1 << 4) + (g2 | 0)) >> 4, 0x1F) | 0;
        var r = Math.min(((r1 << 4) + (r2 | 0)) >> 4, 0x1F) | 0;
        return (b << 10) | (g << 5) | r;
    }
    GameBoyAdvanceColorEffectsRenderer.prototype.brightnessIncrease = function (topPixel) {
        topPixel = topPixel | 0;
        var b1 = (topPixel >> 10) & 0x1F;
        var g1 = (topPixel >> 5) & 0x1F;
        var r1 = topPixel & 0x1F;
        b1 = ((b1 | 0) + (Math.imul((0x1F - (b1 | 0)) | 0, this.brightnessEffectAmount | 0) >> 4)) | 0;
        g1 = ((g1 | 0) + (Math.imul((0x1F - (g1 | 0)) | 0, this.brightnessEffectAmount | 0) >> 4)) | 0;
        r1 = ((r1 | 0) + (Math.imul((0x1F - (r1 | 0)) | 0, this.brightnessEffectAmount | 0) >> 4)) | 0;
        return (b1 << 10) | (g1 << 5) | r1;
    }
    GameBoyAdvanceColorEffectsRenderer.prototype.brightnessDecrease = function (topPixel) {
        topPixel = topPixel | 0;
        var b1 = (topPixel >> 10) & 0x1F;
        var g1 = (topPixel >> 5) & 0x1F;
        var r1 = topPixel & 0x1F;
        var decreaseMultiplier = (0x10 - (this.brightnessEffectAmount | 0)) | 0;
        b1 = Math.imul(b1 | 0, decreaseMultiplier | 0) >> 4;
        g1 = Math.imul(g1 | 0, decreaseMultiplier | 0) >> 4;
        r1 = Math.imul(r1 | 0, decreaseMultiplier | 0) >> 4;
        return (b1 << 10) | (g1 << 5) | r1;
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendNormal = function (topPixel, lowerPixel) {
        topPixel = topPixel | 0;
        lowerPixel = lowerPixel | 0;
        var b1 = (topPixel >> 10) & 0x1F;
        var g1 = (topPixel >> 5) & 0x1F;
        var r1 = (topPixel & 0x1F);
        var b2 = (lowerPixel >> 10) & 0x1F;
        var g2 = (lowerPixel >> 5) & 0x1F;
        var r2 = lowerPixel & 0x1F;
        b1 = b1 * this.alphaBlendAmountTarget1;
        g1 = g1 * this.alphaBlendAmountTarget1;
        r1 = r1 * this.alphaBlendAmountTarget1;
        b2 = b2 * this.alphaBlendAmountTarget2;
        g2 = g2 * this.alphaBlendAmountTarget2;
        r2 = r2 * this.alphaBlendAmountTarget2;
        return (Math.min((b1 + b2) >> 4, 0x1F) << 10) | (Math.min((g1 + g2) >> 4, 0x1F) << 5) | Math.min((r1 + r2) >> 4, 0x1F);
    }
    GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendTop = function (topPixel, lowerPixel) {
        topPixel = topPixel | 0;
        lowerPixel = lowerPixel | 0;
        var b = (topPixel >> 10) & 0x1F;
        var g = (topPixel >> 5) & 0x1F;
        var r = (topPixel & 0x1F);
        b = b * this.alphaBlendAmountTarget1;
        g = g * this.alphaBlendAmountTarget1;
        r = r * this.alphaBlendAmountTarget1;
        return ((b >> 4) << 10) | ((g >> 4) << 5) | (r >> 4);
    }
    GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendLow = function (topPixel, lowerPixel) {
        topPixel = topPixel | 0;
        lowerPixel = lowerPixel | 0;
        var b = (lowerPixel >> 10) & 0x1F;
        var g = (lowerPixel >> 5) & 0x1F;
        var r = (lowerPixel & 0x1F);
        b = b * this.alphaBlendAmountTarget2;
        g = g * this.alphaBlendAmountTarget2;
        r = r * this.alphaBlendAmountTarget2;
        return ((b >> 4) << 10) | ((g >> 4) << 5) | (r >> 4);
    }
    GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendAddLow = function (topPixel, lowerPixel) {
        topPixel = topPixel | 0;
        lowerPixel = lowerPixel | 0;
        var b1 = (topPixel >> 10) & 0x1F;
        var g1 = (topPixel >> 5) & 0x1F;
        var r1 = (topPixel & 0x1F);
        var b2 = (lowerPixel >> 10) & 0x1F;
        var g2 = (lowerPixel >> 5) & 0x1F;
        var r2 = lowerPixel & 0x1F;
        b1 = b1 * this.alphaBlendAmountTarget1;
        g1 = g1 * this.alphaBlendAmountTarget1;
        r1 = r1 * this.alphaBlendAmountTarget1;
        b2 = b2 << 4;
        g2 = g2 << 4;
        r2 = r2 << 4;
        return (Math.min((b1 + b2) >> 4, 0x1F) << 10) | (Math.min((g1 + g2) >> 4, 0x1F) << 5) | Math.min((r1 + r2) >> 4, 0x1F);
    }
    GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendAddTop = function (topPixel, lowerPixel) {
        topPixel = topPixel | 0;
        lowerPixel = lowerPixel | 0;
        var b1 = (topPixel >> 10) & 0x1F;
        var g1 = (topPixel >> 5) & 0x1F;
        var r1 = (topPixel & 0x1F);
        var b2 = (lowerPixel >> 10) & 0x1F;
        var g2 = (lowerPixel >> 5) & 0x1F;
        var r2 = lowerPixel & 0x1F;
        b1 = b1 << 4;
        g1 = g1 << 4;
        r1 = r1 << 4;
        b2 = b2 * this.alphaBlendAmountTarget2;
        g2 = g2 * this.alphaBlendAmountTarget2;
        r2 = r2 * this.alphaBlendAmountTarget2;
        return (Math.min((b1 + b2) >> 4, 0x1F) << 10) | (Math.min((g1 + g2) >> 4, 0x1F) << 5) | Math.min((r1 + r2) >> 4, 0x1F);
    }
    GameBoyAdvanceColorEffectsRenderer.prototype.brightnessIncrease = function (topPixel) {
        topPixel = topPixel | 0;
        var b1 = (topPixel >> 10) & 0x1F;
        var g1 = (topPixel >> 5) & 0x1F;
        var r1 = topPixel & 0x1F;
        b1 += ((0x1F - b1) * this.brightnessEffectAmount) >> 4;
        g1 += ((0x1F - g1) * this.brightnessEffectAmount) >> 4;
        r1 += ((0x1F - r1) * this.brightnessEffectAmount) >> 4;
        return (b1 << 10) | (g1 << 5) | r1;
    }
    GameBoyAdvanceColorEffectsRenderer.prototype.brightnessDecrease = function (topPixel) {
        topPixel = topPixel | 0;
        var b1 = (topPixel >> 10) & 0x1F;
        var g1 = (topPixel >> 5) & 0x1F;
        var r1 = topPixel & 0x1F;
        var decreaseMultiplier = 0x10 - this.brightnessEffectAmount;
        b1 = (b1 * decreaseMultiplier) >> 4;
        g1 = (g1 * decreaseMultiplier) >> 4;
        r1 = (r1 * decreaseMultiplier) >> 4;
        return (b1 << 10) | (g1 << 5) | r1;
    }
}
GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendTopPass = function (topPixel, lowerPixel) {
    return topPixel | 0;
}
GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendBottomPass = function (topPixel, lowerPixel) {
    return lowerPixel | 0;
}
GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendZero = function (topPixel, lowerPixel) {
    return 0;
}
GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendAddBoth = function (topPixel, lowerPixel) {
    topPixel = topPixel | 0;
    lowerPixel = lowerPixel | 0;
    var b1 = (topPixel >> 10) & 0x1F;
    var g1 = (topPixel >> 5) & 0x1F;
    var r1 = topPixel & 0x1F;
    var b2 = (lowerPixel >> 10) & 0x1F;
    var g2 = (lowerPixel >> 5) & 0x1F;
    var r2 = lowerPixel & 0x1F;
    //Keep this not inlined in the return, firefox 22 grinds on it:
    var b = Math.min(((b1 << 4) + (b2 << 4)) >> 4, 0x1F) | 0;
    var g = Math.min(((g1 << 4) + (g2 << 4)) >> 4, 0x1F) | 0;
    var r = Math.min(((r1 << 4) + (r2 << 4)) >> 4, 0x1F) | 0;
    return (b << 10) | (g << 5) | r;
}
GameBoyAdvanceColorEffectsRenderer.prototype.writeBLDCNT0 = function (data) {
    //Select target 1 and color effects mode:
    this.effectsTarget1 = (data & 0x3F) << 16;
    this.colorEffectsType = data >> 6;
}
GameBoyAdvanceColorEffectsRenderer.prototype.readBLDCNT0 = function (data) {
    return (this.colorEffectsType << 6) | (this.effectsTarget1 >> 16);
}
GameBoyAdvanceColorEffectsRenderer.prototype.writeBLDCNT1 = function (data) {
    //Select target 2:
    this.effectsTarget2 = (data & 0x3F) << 16;
}
GameBoyAdvanceColorEffectsRenderer.prototype.readBLDCNT1 = function (data) {
    return this.effectsTarget2 >> 16;
}
GameBoyAdvanceColorEffectsRenderer.prototype.readBLDALPHA0 = function () {
    return this.alphaBlendAmountTarget1Scratch | 0;
}
GameBoyAdvanceColorEffectsRenderer.prototype.readBLDALPHA1 = function () {
    return this.alphaBlendAmountTarget2Scratch | 0;
}
GameBoyAdvanceColorEffectsRenderer.prototype.writeBLDALPHA0 = function (data) {
    this.alphaBlendAmountTarget1Scratch = data & 0x1F;
    this.alphaBlendAmountTarget1 = Math.min(this.alphaBlendAmountTarget1Scratch | 0, 0x10) | 0;
    this.alphaBlendOptimizationChecks();
}
GameBoyAdvanceColorEffectsRenderer.prototype.writeBLDALPHA1 = function (data) {
    this.alphaBlendAmountTarget2Scratch = data & 0x1F;
    this.alphaBlendAmountTarget2 = Math.min(this.alphaBlendAmountTarget2Scratch | 0, 0x10) | 0;
    this.alphaBlendOptimizationChecks();
}
GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendOptimizationChecks = function () {
    //Check for ways to speed up blending:
    if ((this.alphaBlendAmountTarget1 | 0) == 0) {
        if ((this.alphaBlendAmountTarget2 | 0) == 0) {
            this.alphaBlend = this.alphaBlendZero;
        }
        else if ((this.alphaBlendAmountTarget2 | 0) < 0x10) {
            this.alphaBlend = this.alphaBlendLow;
        }
        else {
            this.alphaBlend = this.alphaBlendBottomPass;
        }
    }
    else if ((this.alphaBlendAmountTarget1 | 0) < 0x10) {
        if ((this.alphaBlendAmountTarget2 | 0) == 0) {
            this.alphaBlend = this.alphaBlendTop;
        }
        else if ((this.alphaBlendAmountTarget2 | 0) < 0x10) {
            this.alphaBlend = this.alphaBlendNormal;
        }
        else {
            this.alphaBlend = this.alphaBlendAddLow;
        }
    }
    else {
        if ((this.alphaBlendAmountTarget2 | 0) == 0) {
            this.alphaBlend = this.alphaBlendTopPass;
        }
        else if ((this.alphaBlendAmountTarget2 | 0) < 0x10) {
            this.alphaBlend = this.alphaBlendAddTop;
        }
        else {
            this.alphaBlend = this.alphaBlendAddBoth;
        }
    }
}
GameBoyAdvanceColorEffectsRenderer.prototype.writeBLDY = function (data) {
    this.brightnessEffectAmount = Math.min(data & 0x1F, 0x10) | 0;
};
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
function GameBoyAdvanceMode0Renderer(gfx) {
    this.gfx = gfx;
}
GameBoyAdvanceMode0Renderer.prototype.renderScanLine = function (line) {
    line = line | 0;
    var BG0Buffer = ((this.gfx.display & 0x1) == 0x1) ? this.gfx.bg0Renderer.renderScanLine(line | 0) : null;
    var BG1Buffer = ((this.gfx.display & 0x2) == 0x2) ? this.gfx.bg1Renderer.renderScanLine(line | 0) : null;
    var BG2Buffer = ((this.gfx.display & 0x4) == 0x4) ? this.gfx.bg2TextRenderer.renderScanLine(line | 0) : null;
    var BG3Buffer = ((this.gfx.display & 0x8) == 0x8) ? this.gfx.bg3TextRenderer.renderScanLine(line | 0) : null;
    var OBJBuffer = ((this.gfx.display & 0x10) == 0x10) ? this.gfx.objRenderer.renderScanLine(line | 0) : null;
    this.gfx.compositeLayers(OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer);
    if ((this.gfx.display & 0x80) == 0x80) {
        this.gfx.objWindowRenderer.renderScanLine(line | 0, this.gfx.lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer);
    }
    if ((this.gfx.display & 0x40) == 0x40) {
        this.gfx.window1Renderer.renderScanLine(line | 0, this.gfx.lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer);
    }
    if ((this.gfx.display & 0x20) == 0x20) {
        this.gfx.window0Renderer.renderScanLine(line | 0, this.gfx.lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer);
    }
    this.gfx.copyLineToFrameBuffer(line | 0);
};
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
function GameBoyAdvanceMode1Renderer(gfx) {
    this.gfx = gfx;
}
GameBoyAdvanceMode1Renderer.prototype.renderScanLine = function (line) {
    line = line | 0;
    var BG0Buffer = ((this.gfx.display & 0x1) == 0x1) ? this.gfx.bg0Renderer.renderScanLine(line | 0) : null;
    var BG1Buffer = ((this.gfx.display & 0x2) == 0x2) ? this.gfx.bg1Renderer.renderScanLine(line | 0) : null;
    var BG2Buffer = ((this.gfx.display & 0x4) == 0x4) ? this.gfx.bg2MatrixRenderer.renderScanLine(line | 0) : null;
    var OBJBuffer = ((this.gfx.display & 0x10) == 0x10) ? this.gfx.objRenderer.renderScanLine(line | 0) : null;
    this.gfx.compositeLayers(OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, null);
    if ((this.gfx.display & 0x80) == 0x80) {
        this.gfx.objWindowRenderer.renderScanLine(line | 0, this.gfx.lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, null);
    }
    if ((this.gfx.display & 0x40) == 0x40) {
        this.gfx.window1Renderer.renderScanLine(line | 0, this.gfx.lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, null);
    }
    if ((this.gfx.display & 0x20) == 0x20) {
        this.gfx.window0Renderer.renderScanLine(line | 0, this.gfx.lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, null);
    }
    this.gfx.copyLineToFrameBuffer(line | 0);
}
;
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
function GameBoyAdvanceMode2Renderer(gfx) {
    this.gfx = gfx;
}
GameBoyAdvanceMode2Renderer.prototype.renderScanLine = function (line) {
    line = line | 0;
    var BG2Buffer = ((this.gfx.display & 0x4) == 0x4) ? this.gfx.bg2MatrixRenderer.renderScanLine(line | 0) : null;
    var BG3Buffer = ((this.gfx.display & 0x8) == 0x8) ? this.gfx.bg3MatrixRenderer.renderScanLine(line | 0) : null;
    var OBJBuffer = ((this.gfx.display & 0x10) == 0x10) ? this.gfx.objRenderer.renderScanLine(line | 0) : null;
    this.gfx.compositeLayers(OBJBuffer, null, null, BG2Buffer, BG3Buffer);
    if ((this.gfx.display & 0x80) == 0x80) {
        this.gfx.objWindowRenderer.renderScanLine(line | 0, this.gfx.lineBuffer, OBJBuffer, null, null, BG2Buffer, BG3Buffer);
    }
    if ((this.gfx.display & 0x40) == 0x40) {
        this.gfx.window1Renderer.renderScanLine(line | 0, this.gfx.lineBuffer, OBJBuffer, null, null, BG2Buffer, BG3Buffer);
    }
    if ((this.gfx.display & 0x20) == 0x20) {
        this.gfx.window0Renderer.renderScanLine(line | 0, this.gfx.lineBuffer, OBJBuffer, null, null, BG2Buffer, BG3Buffer);
    }
    this.gfx.copyLineToFrameBuffer(line | 0);
};
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
function GameBoyAdvanceModeFrameBufferRenderer(gfx) {
    this.gfx = gfx;
}
GameBoyAdvanceModeFrameBufferRenderer.prototype.renderScanLine = function (line) {
    line = line | 0;
    var BG2Buffer = ((this.gfx.display & 0x4) == 0x4) ? this.gfx.bg2FrameBufferRenderer.renderScanLine(line | 0) : null;
    var OBJBuffer = ((this.gfx.display & 0x10) == 0x10) ? this.gfx.objRenderer.renderScanLine(line | 0) : null;
    this.gfx.compositeLayers(OBJBuffer, null, null, BG2Buffer, null);
    if ((this.gfx.display & 0x80) == 0x80) {
        this.gfx.objWindowRenderer.renderScanLine(line | 0, this.gfx.lineBuffer, OBJBuffer, null, null, BG2Buffer, null);
    }
    if ((this.gfx.display & 0x40) == 0x40) {
        this.gfx.window1Renderer.renderScanLine(line | 0, this.gfx.lineBuffer, OBJBuffer, null, null, BG2Buffer, null);
    }
    if ((this.gfx.display & 0x20) == 0x20) {
        this.gfx.window0Renderer.renderScanLine(line | 0, this.gfx.lineBuffer, OBJBuffer, null, null, BG2Buffer, null);
    }
    this.gfx.copyLineToFrameBuffer(line | 0);
}
GameBoyAdvanceModeFrameBufferRenderer.prototype.preprocess = function (BGMode) {
    //Set up pixel fetcher ahead of time:
    this.gfx.bg2FrameBufferRenderer.selectMode(BGMode | 0);
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceMosaicRenderer(gfx) {
    this.BGMosaicHSize = 0;
    this.BGMosaicVSize = 0;
    this.OBJMosaicHSize = 0;
    this.OBJMosaicVSize = 0;
}
GameBoyAdvanceMosaicRenderer.prototype.renderMosaicHorizontal = function (layer) {
    var currentPixel = 0;
    var mosaicBlur = ((this.BGMosaicHSize | 0) + 1) | 0;
    if ((mosaicBlur | 0) > 1) {    //Don't perform a useless loop.
        for (var position = 0; (position | 0) < 240; position = ((position | 0) + 1) | 0) {
            if ((((position | 0) % (mosaicBlur | 0)) | 0) == 0) {
                currentPixel = layer[position | 0] | 0;
            }
            else {
                layer[position | 0] = currentPixel | 0;
            }
        }
    }
}
GameBoyAdvanceMosaicRenderer.prototype.renderOBJMosaicHorizontal = function (layer, xOffset, xSize) {
    xOffset = xOffset | 0;
    xSize = xSize | 0;
    var currentPixel = 0x3800000;
    var mosaicBlur = ((this.OBJMosaicHSize | 0) + 1) | 0;
    if ((mosaicBlur | 0) > 1) {    //Don't perform a useless loop.
        for (var position = ((xOffset | 0) % (mosaicBlur | 0)) | 0; (position | 0) < (xSize | 0); position = ((position | 0) + 1) | 0) {
            if ((((position | 0) % (mosaicBlur | 0)) | 0) == 0) {
                currentPixel = layer[position | 0] | 0;
            }
            layer[position | 0] = currentPixel | 0;
        }
    }
}
GameBoyAdvanceMosaicRenderer.prototype.getMosaicYOffset = function (line) {
    line = line | 0;
    return ((line | 0) % (((this.BGMosaicVSize | 0) + 1) | 0)) | 0;
}
GameBoyAdvanceMosaicRenderer.prototype.getOBJMosaicYOffset = function (line) {
    line = line | 0;
    return ((line | 0) % (((this.OBJMosaicVSize | 0) + 1) | 0)) | 0;
}
GameBoyAdvanceMosaicRenderer.prototype.writeMOSAIC0 = function (data) {
    data = data | 0;
    this.BGMosaicHSize = data & 0xF;
    this.BGMosaicVSize = data >> 4;
}
GameBoyAdvanceMosaicRenderer.prototype.writeMOSAIC1 = function (data) {
    data = data | 0;
    this.OBJMosaicHSize = data & 0xF;
    this.OBJMosaicVSize = data >> 4;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceOBJRenderer(gfx) {
    this.gfx = gfx;
    this.paletteOBJ256 = this.gfx.paletteOBJ256;
    this.paletteOBJ16 = this.gfx.paletteOBJ16;
    this.VRAM = this.gfx.VRAM;
    this.initialize();
}
GameBoyAdvanceOBJRenderer.prototype.lookupXSize = [
    //Square:
    8,  16, 32, 64,
    //Vertical Rectangle:
    16, 32, 32, 64,
    //Horizontal Rectangle:
    8,   8, 16, 32
];
GameBoyAdvanceOBJRenderer.prototype.lookupYSize = [
    //Square:
    8,  16, 32, 64,
    //Vertical Rectangle:
    8,   8, 16, 32,
    //Horizontal Rectangle:
    16, 32, 32, 64
];
if (__VIEWS_SUPPORTED__) {
    if (typeof getUint8Array(1).fill == "function") {
        GameBoyAdvanceOBJRenderer.prototype.initialize = function () {
            this.VRAM32 = this.gfx.VRAM32;
            this.OAMRAM = getUint8Array(0x400);
            this.OAMRAM16 = getUint16View(this.OAMRAM);
            this.OAMRAM32 = getInt32View(this.OAMRAM);
            this.scratchBuffer = getInt32Array(240);
            this.scratchWindowBuffer = getInt32Array(240);
            this.scratchOBJBuffer = getInt32Array(128);
            this.targetBuffer = null;
            this.OBJMatrixParameters = getInt32Array(0x80);
            this.initializeOAMTable();
        }
        GameBoyAdvanceOBJRenderer.prototype.clearScratch = function () {
            this.targetBuffer.fill(0x3800000);
        }
    }
    else {
        GameBoyAdvanceOBJRenderer.prototype.initialize = function () {
            this.VRAM32 = this.gfx.VRAM32;
            this.OAMRAM = getUint8Array(0x400);
            this.OAMRAM16 = getUint16View(this.OAMRAM);
            this.OAMRAM32 = getInt32View(this.OAMRAM);
            this.scratchBuffer = getInt32Array(240);
            this.scratchWindowBuffer = getInt32Array(240);
            this.scratchOBJBuffer = getInt32Array(128);
            this.clearingBuffer = getInt32Array(240);
            this.targetBuffer = null;
            this.initializeClearingBuffer();
            this.OBJMatrixParameters = getInt32Array(0x80);
            this.initializeOAMTable();
        }
        GameBoyAdvanceOBJRenderer.prototype.clearScratch = function () {
            this.targetBuffer.set(this.clearingBuffer);
        }
        GameBoyAdvanceOBJRenderer.prototype.initializeClearingBuffer = function () {
            for (var position = 0; position < 240; ++position) {
                this.clearingBuffer[position] = 0x3800000;
            }
        }
    }
}
else {
    GameBoyAdvanceOBJRenderer.prototype.initialize = function () {
        this.OAMRAM = getUint8Array(0x400);
        this.scratchBuffer = getInt32Array(240);
        this.scratchWindowBuffer = getInt32Array(240);
        this.scratchOBJBuffer = getInt32Array(128);
        this.targetBuffer = null;
        this.OBJMatrixParameters = getInt32Array(0x80);
        this.initializeOAMTable();
    }
    GameBoyAdvanceOBJRenderer.prototype.clearScratch = function () {
        for (var position = 0; position < 240; ++position) {
            this.targetBuffer[position] = 0x3800000;
        }
    }
}
GameBoyAdvanceOBJRenderer.prototype.initializeOAMTable = function () {
    this.OAMTable = [];
    for (var spriteNumber = 0; (spriteNumber | 0) < 128; spriteNumber = ((spriteNumber | 0) + 1) | 0) {
        this.OAMTable[spriteNumber | 0] = this.makeOAMAttributeTable();
    }
}
if (typeof TypedObject == "object" && typeof TypedObject.StructType == "object") {
    GameBoyAdvanceOBJRenderer.prototype.makeOAMAttributeTable = function () {
        return new TypedObject.StructType({
                                          ycoord:TypedObject.int32,
                                          matrix2D:TypedObject.int32,
                                          doubleSizeOrDisabled:TypedObject.int32,
                                          mode:TypedObject.int32,
                                          mosaic:TypedObject.int32,
                                          monolithicPalette:TypedObject.int32,
                                          shape:TypedObject.int32,
                                          xcoord:TypedObject.int32,
                                          matrixParameters:TypedObject.int32,
                                          horizontalFlip:TypedObject.int32,
                                          verticalFlip:TypedObject.int32,
                                          size:TypedObject.int32,
                                          tileNumber:TypedObject.int32,
                                          priority:TypedObject.int32,
                                          paletteNumber:TypedObject.int32
                                          });
    }
}
else {
    GameBoyAdvanceOBJRenderer.prototype.makeOAMAttributeTable = function () {
        return {
        ycoord:0,
        matrix2D:0,
        doubleSizeOrDisabled:0,
        mode:0,
        mosaic:0,
        monolithicPalette:0,
        shape:0,
        xcoord:0,
        matrixParameters:0,
        horizontalFlip:0,
        verticalFlip:0,
        size:0,
        tileNumber:0,
        priority:0,
        paletteNumber:0
        };
    }
}
GameBoyAdvanceOBJRenderer.prototype.renderScanLine = function (line) {
    this.targetBuffer = this.scratchBuffer;
    this.performRenderLoop(line | 0, false);
    return this.scratchBuffer;
}
GameBoyAdvanceOBJRenderer.prototype.renderWindowScanLine = function (line) {
    this.targetBuffer = this.scratchWindowBuffer;
    this.performRenderLoop(line | 0, true);
    return this.scratchWindowBuffer;
}
GameBoyAdvanceOBJRenderer.prototype.performRenderLoop = function (line, isOBJWindow) {
    this.clearScratch();
    for (var objNumber = 0; objNumber < 0x80; ++objNumber) {
        this.renderSprite(line | 0, this.OAMTable[objNumber], isOBJWindow);
    }
}
GameBoyAdvanceOBJRenderer.prototype.renderSprite = function (line, sprite, isOBJWindow) {
    line = line | 0;
    if (this.isDrawable(sprite, isOBJWindow)) {
        if ((sprite.mosaic | 0) != 0) {
            //Correct line number for mosaic:
            line = ((line | 0) - (this.gfx.mosaicRenderer.getOBJMosaicYOffset(line | 0) | 0)) | 0;
        }
        //Obtain horizontal size info:
        var xSize = this.lookupXSize[(sprite.shape << 2) | sprite.size] << (sprite.doubleSizeOrDisabled | 0);
        //Obtain vertical size info:
        var ySize = this.lookupYSize[(sprite.shape << 2) | sprite.size] << (sprite.doubleSizeOrDisabled | 0);
        //Obtain some offsets:
        var ycoord = sprite.ycoord | 0;
        var yOffset = ((line | 0) - (ycoord | 0)) | 0;
        //Overflow Correction:
        if ((yOffset | 0) < 0 || (((ycoord | 0) + (ySize | 0)) | 0) > 0x100) {
            /*
             HW re-offsets any "negative" y-coord values to on-screen unsigned.
             Also a bug triggers this on 8-bit ending coordinate overflow from large sprites.
             */
            yOffset = ((yOffset | 0) + 0x100) | 0;
        }
        //Make a sprite line:
        ySize = ((ySize | 0) - 1) | 0;
        if ((yOffset & ySize) == (yOffset | 0)) {
            if ((sprite.matrix2D | 0) != 0) {
                //Scale & Rotation:
                this.renderMatrixSprite(sprite, xSize | 0, ((ySize | 0) + 1) | 0, yOffset | 0);
            }
            else {
                //Regular Scrolling:
                this.renderNormalSprite(sprite, xSize | 0, ySize | 0, yOffset | 0);
            }
            //Mark for semi-transparent:
            if ((sprite.mode | 0) == 1) {
                this.markSemiTransparent(xSize | 0);
            }
            //Copy OBJ scratch buffer to scratch line buffer:
            this.outputSpriteToScratch(sprite, xSize | 0);
        }
    }
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceOBJRenderer.prototype.renderMatrixSprite = function (sprite, xSize, ySize, yOffset) {
        xSize = xSize | 0;
        ySize = ySize | 0;
        yOffset = yOffset | 0;
        var xDiff = (-(xSize >> 1)) | 0;
        var yDiff = ((yOffset | 0) - (ySize >> 1)) | 0;
        var xSizeOriginal = xSize >> (sprite.doubleSizeOrDisabled | 0);
        var xSizeFixed = xSizeOriginal << 8;
        var ySizeOriginal = ySize >> (sprite.doubleSizeOrDisabled | 0);
        var ySizeFixed = ySizeOriginal << 8;
        var dx = this.OBJMatrixParameters[sprite.matrixParameters | 0] | 0;
        var dmx = this.OBJMatrixParameters[sprite.matrixParameters | 1] | 0;
        var dy = this.OBJMatrixParameters[sprite.matrixParameters | 2] | 0;
        var dmy = this.OBJMatrixParameters[sprite.matrixParameters | 3] | 0;
        var pa = Math.imul(dx | 0, xDiff | 0) | 0;
        var pb = Math.imul(dmx | 0, yDiff | 0) | 0;
        var pc = Math.imul(dy | 0, xDiff | 0) | 0;
        var pd = Math.imul(dmy | 0, yDiff | 0) | 0;
        var x = ((pa | 0) + (pb | 0)) | 0;
        x = ((x | 0) + (xSizeFixed >> 1)) | 0;
        var y = ((pc | 0) + (pd | 0)) | 0;
        y = ((y | 0) + (ySizeFixed >> 1)) | 0;
        for (var position = 0; (position | 0) < (xSize | 0); position = (position + 1) | 0, x = ((x | 0) + (dx | 0)) | 0, y = ((y | 0) + (dy | 0)) | 0) {
            if ((x | 0) >= 0 && (y | 0) >= 0 && (x | 0) < (xSizeFixed | 0) && (y | 0) < (ySizeFixed | 0)) {
                //Coordinates in range, fetch pixel:
                this.scratchOBJBuffer[position | 0] = this.fetchMatrixPixel(sprite, x >> 8, y >> 8, xSizeOriginal | 0) | 0;
            }
            else {
                //Coordinates outside of range, transparency defaulted:
                this.scratchOBJBuffer[position | 0] = 0x3800000;
            }
        }
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceOBJRenderer.prototype.renderMatrixSprite = function (sprite, xSize, ySize, yOffset) {
        var xDiff = -(xSize >> 1);
        var yDiff = yOffset - (ySize >> 1);
        var xSizeOriginal = xSize >> sprite.doubleSizeOrDisabled;
        var xSizeFixed = xSizeOriginal << 8;
        var ySizeOriginal = ySize >> sprite.doubleSizeOrDisabled;
        var ySizeFixed = ySizeOriginal << 8;
        var dx = this.OBJMatrixParameters[sprite.matrixParameters];
        var dmx = this.OBJMatrixParameters[sprite.matrixParameters | 1];
        var dy = this.OBJMatrixParameters[sprite.matrixParameters | 2];
        var dmy = this.OBJMatrixParameters[sprite.matrixParameters | 3];
        var pa = dx * xDiff;
        var pb = dmx * yDiff;
        var pc = dy * xDiff;
        var pd = dmy * yDiff;
        var x = pa + pb + (xSizeFixed >> 1);
        var y = pc + pd + (ySizeFixed >> 1);
        for (var position = 0; position < xSize; ++position, x += dx, y += dy) {
            if (x >= 0 && y >= 0 && x < xSizeFixed && y < ySizeFixed) {
                //Coordinates in range, fetch pixel:
                this.scratchOBJBuffer[position] = this.fetchMatrixPixel(sprite, x >> 8, y >> 8, xSizeOriginal);
            }
            else {
                //Coordinates outside of range, transparency defaulted:
                this.scratchOBJBuffer[position] = 0x3800000;
            }
        }
        
    }
}
GameBoyAdvanceOBJRenderer.prototype.fetchMatrixPixel = function (sprite, x, y, xSize) {
    x = x | 0;
    y = y | 0;
    xSize = xSize | 0;
    if ((sprite.monolithicPalette | 0) != 0) {
        //256 Colors / 1 Palette:
        var address = this.tileNumberToAddress256(sprite.tileNumber | 0, xSize | 0, y | 0) | 0;
        address = ((address | 0) + (this.tileRelativeAddressOffset(x | 0, y | 0) | 0)) | 0;
        return this.paletteOBJ256[this.VRAM[address | 0] | 0] | 0;
    }
    else {
        //16 Colors / 16 palettes:
        var address = this.tileNumberToAddress16(sprite.tileNumber | 0, xSize | 0, y | 0) | 0;
        address = ((address | 0) + ((this.tileRelativeAddressOffset(x | 0, y | 0) >> 1) | 0)) | 0;
        if ((x & 0x1) == 0) {
            return this.paletteOBJ16[sprite.paletteNumber | this.VRAM[address | 0] & 0xF] | 0;
        }
        else {
            return this.paletteOBJ16[sprite.paletteNumber | this.VRAM[address | 0] >> 4] | 0;
        }
    }
}
GameBoyAdvanceOBJRenderer.prototype.tileRelativeAddressOffset = function (x, y) {
    x = x | 0;
    y = y | 0;
    return ((((y & 7) + (x & -8)) << 3) + (x & 0x7)) | 0;
}
GameBoyAdvanceOBJRenderer.prototype.renderNormalSprite = function (sprite, xSize, ySize, yOffset) {
    xSize = xSize | 0;
    ySize = ySize | 0;
    yOffset = yOffset | 0;
    if ((sprite.verticalFlip | 0) != 0) {
        //Flip y-coordinate offset:
        yOffset = ((ySize | 0) - (yOffset | 0)) | 0;
    }
    if ((sprite.monolithicPalette | 0) != 0) {
        //256 Colors / 1 Palette:
        var address = this.tileNumberToAddress256(sprite.tileNumber | 0, xSize | 0, yOffset | 0) | 0;
        address = ((address | 0) + ((yOffset & 7) << 3)) | 0;
        this.render256ColorPaletteSprite(address | 0, xSize | 0);
    }
    else {
        //16 Colors / 16 palettes:
        var address = this.tileNumberToAddress16(sprite.tileNumber | 0, xSize | 0, yOffset | 0) | 0;
        address = ((address | 0) + ((yOffset & 7) << 2)) | 0;
        this.render16ColorPaletteSprite(address | 0, xSize | 0, sprite.paletteNumber | 0);
    }
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceOBJRenderer.prototype.render256ColorPaletteSprite = function (address, xSize) {
        address = address >> 2;
        xSize = xSize | 0;
        var data = 0;
        for (var objBufferPos = 0; (objBufferPos | 0) < (xSize | 0); objBufferPos = ((objBufferPos | 0) + 8) | 0) {
            data = this.VRAM32[address | 0] | 0;
            this.scratchOBJBuffer[objBufferPos | 0] = this.paletteOBJ256[data & 0xFF] | 0;
            this.scratchOBJBuffer[objBufferPos | 1] = this.paletteOBJ256[(data >> 8) & 0xFF] | 0;
            this.scratchOBJBuffer[objBufferPos | 2] = this.paletteOBJ256[(data >> 16) & 0xFF] | 0;
            this.scratchOBJBuffer[objBufferPos | 3] = this.paletteOBJ256[data >>> 24] | 0;
            data = this.VRAM32[address | 1] | 0;
            this.scratchOBJBuffer[objBufferPos | 4] = this.paletteOBJ256[data & 0xFF] | 0;
            this.scratchOBJBuffer[objBufferPos | 5] = this.paletteOBJ256[(data >> 8) & 0xFF] | 0;
            this.scratchOBJBuffer[objBufferPos | 6] = this.paletteOBJ256[(data >> 16) & 0xFF] | 0;
            this.scratchOBJBuffer[objBufferPos | 7] = this.paletteOBJ256[data >>> 24] | 0;
            address = ((address | 0) + 0x10) | 0;
        }
    }
    GameBoyAdvanceOBJRenderer.prototype.render16ColorPaletteSprite = function (address, xSize, paletteOffset) {
        address = address >> 2;
        xSize = xSize | 0;
        paletteOffset = paletteOffset | 0;
        var data = 0;
        for (var objBufferPos = 0; (objBufferPos | 0) < (xSize | 0); objBufferPos = ((objBufferPos | 0) + 8) | 0) {
            data = this.VRAM32[address | 0] | 0;
            this.scratchOBJBuffer[objBufferPos | 0] = this.paletteOBJ16[paletteOffset | (data & 0xF)] | 0;
            this.scratchOBJBuffer[objBufferPos | 1] = this.paletteOBJ16[paletteOffset | ((data >> 4) & 0xF)] | 0;
            this.scratchOBJBuffer[objBufferPos | 2] = this.paletteOBJ16[paletteOffset | ((data >> 8) & 0xF)] | 0;
            this.scratchOBJBuffer[objBufferPos | 3] = this.paletteOBJ16[paletteOffset | ((data >> 12) & 0xF)] | 0;
            this.scratchOBJBuffer[objBufferPos | 4] = this.paletteOBJ16[paletteOffset | ((data >> 16) & 0xF)] | 0;
            this.scratchOBJBuffer[objBufferPos | 5] = this.paletteOBJ16[paletteOffset | ((data >> 20) & 0xF)] | 0;
            this.scratchOBJBuffer[objBufferPos | 6] = this.paletteOBJ16[paletteOffset | ((data >> 24) & 0xF)] | 0;
            this.scratchOBJBuffer[objBufferPos | 7] = this.paletteOBJ16[paletteOffset | (data >>> 28)] | 0;
            address = ((address | 0) + 0x8) | 0;
        }
    }
}
else {
    GameBoyAdvanceOBJRenderer.prototype.render256ColorPaletteSprite = function (address, xSize) {
        for (var objBufferPos = 0; objBufferPos < xSize;) {
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address++]];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address++]];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address++]];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address++]];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address++]];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address++]];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address++]];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address]];
            address += 0x39;
        }
    }
    GameBoyAdvanceOBJRenderer.prototype.render16ColorPaletteSprite = function (address, xSize, paletteOffset) {
        var data = 0;
        for (var objBufferPos = 0; objBufferPos < xSize;) {
            data = this.VRAM[address++];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data & 0xF)];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data >> 4)];
            data = this.VRAM[address++];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data & 0xF)];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data >> 4)];
            data = this.VRAM[address++];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data & 0xF)];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data >> 4)];
            data = this.VRAM[address];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data & 0xF)];
            this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data >> 4)];
            address += 0x1D;
        }
    }
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceOBJRenderer.prototype.tileNumberToAddress256 = function (tileNumber, xSize, yOffset) {
        tileNumber = tileNumber | 0;
        xSize = xSize | 0;
        yOffset = yOffset | 0;
        if (!this.gfx.VRAMOneDimensional) {
            //2D Mapping (32 8x8 tiles by 32 8x8 tiles):
            //Hardware ignores the LSB in this case:
            tileNumber = ((tileNumber & -2) + (Math.imul(yOffset >> 3, 0x20) | 0)) | 0;
        }
        else {
            //1D Mapping:
            //256 Color Palette:
            tileNumber = ((tileNumber | 0) + (Math.imul(yOffset >> 3, xSize >> 2) | 0)) | 0;
        }
        //Starting address of currently drawing sprite line:
        return ((tileNumber << 5) + 0x10000) | 0;
    }
    GameBoyAdvanceOBJRenderer.prototype.tileNumberToAddress16 = function (tileNumber, xSize, yOffset) {
        tileNumber = tileNumber | 0;
        xSize = xSize | 0;
        yOffset = yOffset | 0;
        if (!this.gfx.VRAMOneDimensional) {
            //2D Mapping (32 8x8 tiles by 32 8x8 tiles):
            tileNumber = ((tileNumber | 0) + (Math.imul(yOffset >> 3, 0x20) | 0)) | 0;
        }
        else {
            //1D Mapping:
            //16 Color Palette:
            tileNumber = ((tileNumber | 0) + (Math.imul(yOffset >> 3, xSize >> 3) | 0)) | 0;
        }
        //Starting address of currently drawing sprite line:
        return ((tileNumber << 5) + 0x10000) | 0;
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceOBJRenderer.prototype.tileNumberToAddress256 = function (tileNumber, xSize, yOffset) {
        if (!this.gfx.VRAMOneDimensional) {
            //2D Mapping (32 8x8 tiles by 32 8x8 tiles):
            //Hardware ignores the LSB in this case:
            tileNumber &= -2;
            tileNumber += (yOffset >> 3) * 0x20;
        }
        else {
            //1D Mapping:
            tileNumber += (yOffset >> 3) * (xSize >> 2);
        }
        //Starting address of currently drawing sprite line:
        return (tileNumber << 5) + 0x10000;
    }
    GameBoyAdvanceOBJRenderer.prototype.tileNumberToAddress16 = function (tileNumber, xSize, yOffset) {
        if (!this.gfx.VRAMOneDimensional) {
            //2D Mapping (32 8x8 tiles by 32 8x8 tiles):
            tileNumber += (yOffset >> 3) * 0x20;
        }
        else {
            //1D Mapping:
            tileNumber += (yOffset >> 3) * (xSize >> 3);
        }
        //Starting address of currently drawing sprite line:
        return (tileNumber << 5) + 0x10000;
    }
}
GameBoyAdvanceOBJRenderer.prototype.markSemiTransparent = function (xSize) {
    //Mark sprite pixels as semi-transparent:
    while (--xSize > -1) {
        this.scratchOBJBuffer[xSize | 0] |= 0x400000;
    }
}
GameBoyAdvanceOBJRenderer.prototype.outputSpriteToScratch = function (sprite, xSize) {
    xSize = xSize | 0;
    //Simulate x-coord wrap around logic:
    var xcoord = sprite.xcoord | 0;
    if ((xcoord | 0) > ((0x200 - (xSize | 0)) | 0)) {
        xcoord = ((xcoord | 0) - 0x200) | 0;
    }
    //Perform the mosaic transform:
    if ((sprite.mosaic | 0) != 0) {
        this.gfx.mosaicRenderer.renderOBJMosaicHorizontal(this.scratchOBJBuffer, xcoord | 0, xSize | 0);
    }
    //Resolve end point:
    var xcoordEnd = Math.min(((xcoord | 0) + (xSize | 0)) | 0, 240) | 0;
    //Flag for compositor to ID the pixels as OBJ:
    var bitFlags = (sprite.priority << 23) | 0x100000;
    if ((sprite.horizontalFlip | 0) == 0 || (sprite.matrix2D | 0) != 0) {
        //Normal:
        for (var xSource = 0; (xcoord | 0) < (xcoordEnd | 0); xcoord = ((xcoord | 0) + 1) | 0, xSource = ((xSource | 0) + 1) | 0) {
            var pixel = bitFlags | this.scratchOBJBuffer[xSource | 0];
            //Overwrite by priority:
            if ((xcoord | 0) > -1 && (pixel & 0x3800000) < (this.targetBuffer[xcoord | 0] & 0x3800000)) {
                this.targetBuffer[xcoord | 0] = pixel | 0;
            }
        }
    }
    else {
        //Flipped Horizontally:
        for (var xSource = ((xSize | 0) - 1) | 0; (xcoord | 0) < (xcoordEnd | 0); xcoord = ((xcoord | 0) + 1) | 0, xSource = ((xSource | 0) - 1) | 0) {
            var pixel = bitFlags | this.scratchOBJBuffer[xSource | 0];
            //Overwrite by priority:
            if ((xcoord | 0) > -1 && (pixel & 0x3800000) < (this.targetBuffer[xcoord | 0] & 0x3800000)) {
                this.targetBuffer[xcoord | 0] = pixel | 0;
            }
        }
    }
}
GameBoyAdvanceOBJRenderer.prototype.isDrawable = function (sprite, doWindowOBJ) {
    //Make sure we pass some checks that real hardware does:
    if (((sprite.mode | 0) < 2 && !doWindowOBJ) || (doWindowOBJ && (sprite.mode | 0) == 2)) {
        if ((sprite.doubleSizeOrDisabled | 0) == 0 || (sprite.matrix2D | 0) != 0) {
            if ((sprite.shape | 0) < 3) {
                if ((this.gfx.BGMode | 0) < 3 || (sprite.tileNumber | 0) >= 0x200) {
                    return true;
                }
            }
        }
    }
    return false;
}
GameBoyAdvanceOBJRenderer.prototype.readOAM = function (address) {
    return this.OAMRAM[address & 0x3FF] | 0;
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceOBJRenderer.prototype.writeOAM16 = function (address, data) {
        address = address | 0;
        data = data | 0;
        var OAMTable = this.OAMTable[address >> 2];
        switch (address & 0x3) {
                //Attrib 0:
            case 0:
                OAMTable.ycoord = data & 0xFF;
                OAMTable.matrix2D = data & 0x100;
                OAMTable.doubleSizeOrDisabled = (data & 0x200) >> 9;
                OAMTable.mode = (data >> 10) & 0x3;
                OAMTable.mosaic = data & 0x1000;
                OAMTable.monolithicPalette = data & 0x2000;
                OAMTable.shape = data >> 14;
                break;
                //Attrib 1:
            case 1:
                OAMTable.xcoord = data & 0x1FF;
                OAMTable.matrixParameters = (data >> 7) & 0x7C;
                OAMTable.horizontalFlip = data & 0x1000;
                OAMTable.verticalFlip = data & 0x2000;
                OAMTable.size = data >> 14;
                break;
                //Attrib 2:
            case 2:
                OAMTable.tileNumber = data & 0x3FF;
                OAMTable.priority = (data >> 10) & 0x3;
                OAMTable.paletteNumber = (data >> 8) & 0xF0;
                break;
                //Scaling/Rotation Parameter:
            default:
                this.OBJMatrixParameters[address >> 2] = (data << 16) >> 16;
        }
        this.OAMRAM16[address | 0] = data | 0;
    }
    GameBoyAdvanceOBJRenderer.prototype.writeOAM32 = function (address, data) {
        address = address | 0;
        data = data | 0;
        var OAMTable = this.OAMTable[address >> 1];
        if ((address & 0x1) == 0) {
            //Attrib 0:
            OAMTable.ycoord = data & 0xFF;
            OAMTable.matrix2D = data & 0x100;
            OAMTable.doubleSizeOrDisabled = (data & 0x200) >> 9;
            OAMTable.mode = (data >> 10) & 0x3;
            OAMTable.mosaic = data & 0x1000;
            OAMTable.monolithicPalette = data & 0x2000;
            OAMTable.shape = (data >> 14) & 0x3;
            //Attrib 1:
            OAMTable.xcoord = (data >> 16) & 0x1FF;
            OAMTable.matrixParameters = (data >> 23) & 0x7C;
            OAMTable.horizontalFlip = data & 0x10000000;
            OAMTable.verticalFlip = data & 0x20000000;
            OAMTable.size = (data >> 30) & 0x3;
        }
        else {
            //Attrib 2:
            OAMTable.tileNumber = data & 0x3FF;
            OAMTable.priority = (data >> 10) & 0x3;
            OAMTable.paletteNumber = (data >> 8) & 0xF0;
            //Scaling/Rotation Parameter:
            this.OBJMatrixParameters[address >> 1] = data >> 16;
        }
        this.OAMRAM32[address | 0] = data | 0;
    }
    GameBoyAdvanceOBJRenderer.prototype.readOAM16 = function (address) {
        address = address | 0;
        return this.OAMRAM16[(address >> 1) & 0x1FF] | 0;
    }
    GameBoyAdvanceOBJRenderer.prototype.readOAM32 = function (address) {
        address = address | 0;
        return this.OAMRAM32[(address >> 2) & 0xFF] | 0;
    }
}
else {
    GameBoyAdvanceOBJRenderer.prototype.writeOAM16 = function (address, data) {
        address = address | 0;
        data = data | 0;
        var OAMTable = this.OAMTable[address >> 2];
        switch (address & 0x3) {
                //Attrib 0:
            case 0:
                OAMTable.ycoord = data & 0xFF;
                OAMTable.matrix2D = data & 0x100;
                OAMTable.doubleSizeOrDisabled = (data & 0x200) >> 9;
                OAMTable.mode = (data >> 10) & 0x3;
                OAMTable.mosaic = data & 0x1000;
                OAMTable.monolithicPalette = data & 0x2000;
                OAMTable.shape = data >> 14;
                break;
                //Attrib 1:
            case 1:
                OAMTable.xcoord = data & 0x1FF;
                OAMTable.matrixParameters = (data >> 7) & 0x7C;
                OAMTable.horizontalFlip = data & 0x1000;
                OAMTable.verticalFlip = data & 0x2000;
                OAMTable.size = data >> 14;
                break;
                //Attrib 2:
            case 2:
                OAMTable.tileNumber = data & 0x3FF;
                OAMTable.priority = (data >> 10) & 0x3;
                OAMTable.paletteNumber = (data >> 8) & 0xF0;
                break;
                //Scaling/Rotation Parameter:
            default:
                this.OBJMatrixParameters[address >> 2] = (data << 16) >> 16;
        }
        address = address << 1;
        this.OAMRAM[address | 0] = data & 0xFF;
        this.OAMRAM[address | 1] = data >> 8;
    }
    GameBoyAdvanceOBJRenderer.prototype.writeOAM32 = function (address, data) {
        address = address | 0;
        data = data | 0;
        var OAMTable = this.OAMTable[address >> 1];
        if ((address & 0x1) == 0) {
            //Attrib 0:
            OAMTable.ycoord = data & 0xFF;
            OAMTable.matrix2D = data & 0x100;
            OAMTable.doubleSizeOrDisabled = (data & 0x200) >> 9;
            OAMTable.mode = (data >> 10) & 0x3;
            OAMTable.mosaic = data & 0x1000;
            OAMTable.monolithicPalette = data & 0x2000;
            OAMTable.shape = (data >> 14) & 0x3;
            //Attrib 1:
            OAMTable.xcoord = (data >> 16) & 0x1FF;
            OAMTable.matrixParameters = (data >> 23) & 0x7C;
            OAMTable.horizontalFlip = data & 0x10000000;
            OAMTable.verticalFlip = data & 0x20000000;
            OAMTable.size = (data >> 30) & 0x3;
        }
        else {
            //Attrib 2:
            OAMTable.tileNumber = data & 0x3FF;
            OAMTable.priority = (data >> 10) & 0x3;
            OAMTable.paletteNumber = (data >> 8) & 0xF0;
            //Scaling/Rotation Parameter:
            this.OBJMatrixParameters[address >> 1] = data >> 16;
        }
        address = address << 2;
        this.OAMRAM[address | 0] = data & 0xFF;
        this.OAMRAM[address | 1] = (data >> 8) & 0xFF;
        this.OAMRAM[address | 2] = (data >> 16) & 0xFF;
        this.OAMRAM[address | 3] = data >>> 24;
    }
    GameBoyAdvanceOBJRenderer.prototype.readOAM16 = function (address) {
        return this.OAMRAM[address] | (this.OAMRAM[address | 1] << 8);
    }
    GameBoyAdvanceOBJRenderer.prototype.readOAM32 = function (address) {
        return this.OAMRAM[address] | (this.OAMRAM[address | 1] << 8) | (this.OAMRAM[address | 2] << 16)  | (this.OAMRAM[address | 3] << 24);
    }
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceOBJWindowRenderer(gfx) {
    this.gfx = gfx;
    this.WINOBJOutside = 0;
    this.preprocess();
}
GameBoyAdvanceOBJWindowRenderer.prototype.renderNormalScanLine = function (line, lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer) {
    //Arrange our layer stack so we can remove disabled and order for correct edge case priority:
    OBJBuffer = ((this.WINOBJOutside & 0x10) == 0x10) ? OBJBuffer : null;
    BG0Buffer = ((this.WINOBJOutside & 0x1) == 0x1) ? BG0Buffer: null;
    BG1Buffer = ((this.WINOBJOutside & 0x2) == 0x2) ? BG1Buffer: null;
    BG2Buffer = ((this.WINOBJOutside & 0x4) == 0x4) ? BG2Buffer: null;
    BG3Buffer = ((this.WINOBJOutside & 0x8) == 0x8) ? BG3Buffer: null;
    var layerStack = this.gfx.compositor.cleanLayerStack(OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer);
    var stackDepth = layerStack.length | 0;
    var stackIndex = 0;
    var OBJWindowBuffer = this.gfx.objRenderer.renderWindowScanLine(line | 0);
    //Loop through each pixel on the line:
    for (var pixelPosition = 0, currentPixel = 0, workingPixel = 0, lowerPixel = 0; (pixelPosition | 0) < 240; pixelPosition = ((pixelPosition | 0) + 1) | 0) {
        //If non-transparent OBJ (Marked for OBJ WIN) pixel detected:
        if ((OBJWindowBuffer[pixelPosition] | 0) < 0x3800000) {
            //Start with backdrop color:
            lowerPixel = currentPixel = this.gfx.backdrop | 0;
            //Loop through all layers each pixel to resolve priority:
            for (stackIndex = 0; (stackIndex | 0) < (stackDepth | 0); stackIndex = ((stackIndex | 0) + 1) | 0) {
                workingPixel = layerStack[stackIndex | 0][pixelPosition | 0] | 0;
                if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
                    /*
                        If higher priority than last pixel and not transparent.
                        Also clear any plane layer bits other than backplane for
                        transparency.
                        
                        Keep a copy of the previous pixel (backdrop or non-transparent) for the color effects:
                    */
                    lowerPixel = currentPixel | 0;
                    currentPixel = workingPixel | 0;
                }
                else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
                    /*
                     If higher priority than last pixel and not transparent.
                     Also clear any plane layer bits other than backplane for
                     transparency.
                     
                     Keep a copy of the previous pixel (backdrop or non-transparent) for the color effects:
                     */
                    lowerPixel = workingPixel | 0;
                }
            }
            if ((currentPixel & 0x400000) == 0) {
                //Normal Pixel:
                lineBuffer[pixelPosition | 0] = currentPixel | 0;
            }
            else {
                //OAM Pixel Processing:
                //Pass the highest two pixels to be arbitrated in the color effects processing:
                lineBuffer[pixelPosition | 0] = this.gfx.colorEffectsRenderer.processOAMSemiTransparent(lowerPixel | 0, currentPixel | 0) | 0;
            }
        }
    }
}
GameBoyAdvanceOBJWindowRenderer.prototype.renderScanLineWithEffects = function (line, lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer) {
    //Arrange our layer stack so we can remove disabled and order for correct edge case priority:
    if ((this.gfx.display & 0xE0) > 0) {
        //Window registers can further disable background layers if one or more window layers enabled:
        OBJBuffer = ((this.WINOBJOutside & 0x10) == 0x10) ? OBJBuffer : null;
        BG0Buffer = ((this.WINOBJOutside & 0x1) == 0x1) ? BG0Buffer: null;
        BG1Buffer = ((this.WINOBJOutside & 0x2) == 0x2) ? BG1Buffer: null;
        BG2Buffer = ((this.WINOBJOutside & 0x4) == 0x4) ? BG2Buffer: null;
        BG3Buffer = ((this.WINOBJOutside & 0x8) == 0x8) ? BG3Buffer: null;
    }
    var layerStack = this.gfx.compositor.cleanLayerStack(OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer);
    var stackDepth = layerStack.length | 0;
    var stackIndex = 0;
    var OBJWindowBuffer = this.gfx.objRenderer.renderWindowScanLine(line | 0);
    //Loop through each pixel on the line:
    for (var pixelPosition = 0, currentPixel = 0, workingPixel = 0, lowerPixel = 0; (pixelPosition | 0) < 240; pixelPosition = ((pixelPosition | 0) + 1) | 0) {
        //If non-transparent OBJ (Marked for OBJ WIN) pixel detected:
        if ((OBJWindowBuffer[pixelPosition | 0] | 0) < 0x3800000) {
            //Start with backdrop color:
            lowerPixel = currentPixel = this.gfx.backdrop | 0;
            //Loop through all layers each pixel to resolve priority:
            for (stackIndex = 0; (stackIndex | 0) < (stackDepth | 0); stackIndex = ((stackIndex | 0) + 1) | 0) {
                workingPixel = layerStack[stackIndex | 0][pixelPosition | 0] | 0;
                if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
                    /*
                        If higher priority than last pixel and not transparent.
                        Also clear any plane layer bits other than backplane for
                        transparency.
                        
                        Keep a copy of the previous pixel (backdrop or non-transparent) for the color effects:
                    */
                    lowerPixel = currentPixel | 0;
                    currentPixel = workingPixel | 0;
                }
                else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
                    /*
                     If higher priority than last pixel and not transparent.
                     Also clear any plane layer bits other than backplane for
                     transparency.
                     
                     Keep a copy of the previous pixel (backdrop or non-transparent) for the color effects:
                     */
                    lowerPixel = workingPixel | 0;
                }
            }
            if ((currentPixel & 0x400000) == 0) {
                //Normal Pixel:
                //Pass the highest two pixels to be arbitrated in the color effects processing:
                lineBuffer[pixelPosition | 0] = this.gfx.colorEffectsRenderer.process(lowerPixel | 0, currentPixel | 0) | 0;
            }
            else {
                //OAM Pixel Processing:
                //Pass the highest two pixels to be arbitrated in the color effects processing:
                lineBuffer[pixelPosition | 0] = this.gfx.colorEffectsRenderer.processOAMSemiTransparent(lowerPixel | 0, currentPixel | 0) | 0;
            }
        }
    }
}
GameBoyAdvanceOBJWindowRenderer.prototype.writeWINOUT1 = function (data) {
    data = data | 0;
    this.WINOBJOutside = data & 0x3F;
    this.preprocess();
}
GameBoyAdvanceOBJWindowRenderer.prototype.readWINOUT1 = function () {
    return this.WINOBJOutside | 0;
}
GameBoyAdvanceOBJWindowRenderer.prototype.preprocess = function () {
    this.renderScanLine = ((this.WINOBJOutside & 0x20) == 0x20) ? this.renderScanLineWithEffects : this.renderNormalScanLine;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceWindowRenderer(gfx) {
    this.gfx = gfx;
    this.WINXCoordRight = 0;
    this.WINXCoordLeft = 0;
    this.WINYCoordBottom = 0;
    this.WINYCoordTop = 0;
    this.WINBG0 = false;
    this.WINBG1 = false;
    this.WINBG2 = false;
    this.WINBG3 = false;
    this.WINOBJ = false;
    this.WINEffects = false;
    this.compositor = new GameBoyAdvanceCompositor(this.gfx);
    this.preprocess();
}
GameBoyAdvanceWindowRenderer.prototype.renderScanLine = function (line, lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer) {
    line = line | 0;
    //Arrange our layer stack so we can remove disabled and order for correct edge case priority:
    OBJBuffer = (this.WINOBJ) ? OBJBuffer : null;
    BG0Buffer = (this.WINBG0) ? BG0Buffer : null;
    BG1Buffer = (this.WINBG1) ? BG1Buffer : null;
    BG2Buffer = (this.WINBG2) ? BG2Buffer : null;
    BG3Buffer = (this.WINBG3) ? BG3Buffer : null;
    if (this.checkYRange(line | 0)) {
        var right =  this.WINXCoordRight | 0;
        var left = this.WINXCoordLeft | 0;
        if ((left | 0) <= (right | 0)) {
            left = Math.min(left | 0, 240) | 0;
            right = Math.min(right | 0, 240) | 0;
            this.compositor.renderScanLine(left | 0, right | 0, lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer);
        }
        else {
            left = Math.min(left | 0, 240) | 0;
            right = Math.min(right | 0, 240) | 0;
            this.compositor.renderScanLine(0, right | 0, lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer);
            this.compositor.renderScanLine(left | 0, 240, lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer);
        }
    }
}
GameBoyAdvanceWindowRenderer.prototype.checkYRange = function (line) {
    line = line | 0;
    var bottom = this.WINYCoordBottom | 0;
    var top = this.WINYCoordTop | 0;
    if ((top | 0) <= (bottom | 0)) {
        return ((line | 0) >= (top | 0) && (line | 0) < (bottom | 0));
    }
    else {
        return ((line | 0) < (top | 0) || (line | 0) >= (bottom | 0));
    }
}
GameBoyAdvanceWindowRenderer.prototype.preprocess = function () {
    this.compositor.preprocess(this.WINEffects);
}
GameBoyAdvanceWindowRenderer.prototype.writeWINH0 = function (data) {
    this.WINXCoordRight = data | 0;        //Window x-coord goes up to this minus 1.
}
GameBoyAdvanceWindowRenderer.prototype.writeWINH1 = function (data) {
    this.WINXCoordLeft = data | 0;
}
GameBoyAdvanceWindowRenderer.prototype.writeWINV0 = function (data) {
    this.WINYCoordBottom = data | 0;    //Window y-coord goes up to this minus 1.
}
GameBoyAdvanceWindowRenderer.prototype.writeWINV1 = function (data) {
    this.WINYCoordTop = data | 0;
}
GameBoyAdvanceWindowRenderer.prototype.writeWININ = function (data) {
    data = data | 0;
    this.WINBG0 = ((data & 0x01) == 0x01);
    this.WINBG1 = ((data & 0x02) == 0x02);
    this.WINBG2 = ((data & 0x04) == 0x04);
    this.WINBG3 = ((data & 0x08) == 0x08);
    this.WINOBJ = ((data & 0x10) == 0x10);
    this.WINEffects = ((data & 0x20) == 0x20);
    this.preprocess();
}
GameBoyAdvanceWindowRenderer.prototype.readWININ = function () {
    return ((this.WINBG0 ? 0x1 : 0) |
            (this.WINBG1 ? 0x2 : 0) |
            (this.WINBG2 ? 0x4 : 0) |
            (this.WINBG3 ? 0x8 : 0) |
            (this.WINOBJ ? 0x10 : 0) |
            (this.WINEffects ? 0x20 : 0));
};
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
function GameBoyAdvanceCompositor(gfx) {
    this.gfx = gfx;
    this.preprocess(false);
}
GameBoyAdvanceCompositor.prototype.preprocess = function (doEffects) {
    this.renderScanLine = (doEffects) ? this.renderScanLineWithEffects : this.renderNormalScanLine;
}
GameBoyAdvanceCompositor.prototype.cleanLayerStack = function (OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer) {
    //Clear out disabled layers from our stack:
    var layerStack = [];
    if (BG3Buffer) {
        layerStack.push(BG3Buffer);
    }
    if (BG2Buffer) {
        layerStack.push(BG2Buffer);
    }
    if (BG1Buffer) {
        layerStack.push(BG1Buffer);
    }
    if (BG0Buffer) {
        layerStack.push(BG0Buffer);
    }
    if (OBJBuffer) {
        layerStack.push(OBJBuffer);
    }
    return layerStack;
}
GameBoyAdvanceCompositor.prototype.renderNormalScanLine = function (xStart, xEnd, lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer) {
    xStart = xStart | 0;
    xEnd = xEnd | 0;
    var layerStack = this.cleanLayerStack(OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer);
    switch (layerStack.length) {
        case 0:
            this.fillWithBackdrop(xStart | 0, xEnd | 0, lineBuffer);
            break;
        case 1:
            this.composite1Layer(xStart | 0, xEnd | 0, lineBuffer, layerStack[0]);
            break;
        case 2:
            this.composite2Layer(xStart | 0, xEnd | 0, lineBuffer, layerStack[0], layerStack[1]);
            break;
        case 3:
            this.composite3Layer(xStart | 0, xEnd | 0, lineBuffer, layerStack[0], layerStack[1], layerStack[2]);
            break;
        case 4:
            this.composite4Layer(xStart | 0, xEnd | 0, lineBuffer, layerStack[0], layerStack[1], layerStack[2], layerStack[3]);
            break;
        case 5:
            this.composite5Layer(xStart | 0, xEnd | 0, lineBuffer, layerStack[0], layerStack[1], layerStack[2], layerStack[3], layerStack[4]);
    }
}
GameBoyAdvanceCompositor.prototype.renderScanLineWithEffects = function (xStart, xEnd, lineBuffer, OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer) {
    xStart = xStart | 0;
    xEnd = xEnd | 0;
    var layerStack = this.cleanLayerStack(OBJBuffer, BG0Buffer, BG1Buffer, BG2Buffer, BG3Buffer);
    switch (layerStack.length) {
        case 0:
            this.fillWithBackdropSpecial(xStart | 0, xEnd | 0, lineBuffer);
            break;
        case 1:
            this.composite1LayerSpecial(xStart | 0, xEnd | 0, lineBuffer, layerStack[0]);
            break;
        case 2:
            this.composite2LayerSpecial(xStart | 0, xEnd | 0, lineBuffer, layerStack[0], layerStack[1]);
            break;
        case 3:
            this.composite3LayerSpecial(xStart | 0, xEnd | 0, lineBuffer, layerStack[0], layerStack[1], layerStack[2]);
            break;
        case 4:
            this.composite4LayerSpecial(xStart | 0, xEnd | 0, lineBuffer, layerStack[0], layerStack[1], layerStack[2], layerStack[3]);
            break;
        case 5:
            this.composite5LayerSpecial(xStart | 0, xEnd | 0, lineBuffer, layerStack[0], layerStack[1], layerStack[2], layerStack[3], layerStack[4]);
    }
}
GameBoyAdvanceCompositor.prototype.fillWithBackdrop = function (xStart, xEnd, lineBuffer) {
    xStart = xStart | 0;
    xEnd = xEnd | 0;
    while ((xStart | 0) < (xEnd | 0)) {
        lineBuffer[xStart | 0] = this.gfx.backdrop | 0;
        xStart = ((xStart | 0) + 1) | 0;
    }
}
GameBoyAdvanceCompositor.prototype.fillWithBackdropSpecial = function (xStart, xEnd, lineBuffer) {
    xStart = xStart | 0;
    xEnd = xEnd | 0;
    while ((xStart | 0) < (xEnd | 0)) {
        lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.process(0, this.gfx.backdrop | 0) | 0;
        xStart = ((xStart | 0) + 1) | 0;
    }
}
GameBoyAdvanceCompositor.prototype.composite1Layer = function (xStart, xEnd, lineBuffer, layer0) {
    xStart = xStart | 0;
    xEnd = xEnd | 0;
    var currentPixel = 0;
    var lowerPixel = 0;
    var workingPixel = 0;
    while ((xStart | 0) < (xEnd | 0)) {
        lowerPixel = currentPixel = this.gfx.backdrop | 0;
        workingPixel = layer0[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        if ((currentPixel & 0x400000) == 0) {
            //Normal Pixel:
            lineBuffer[xStart | 0] = currentPixel | 0;
        }
        else {
            //OAM Pixel Processing:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.processOAMSemiTransparent(lowerPixel | 0, currentPixel | 0) | 0;
        }
        xStart = ((xStart | 0) + 1) | 0;
    }
}
GameBoyAdvanceCompositor.prototype.composite2Layer = function (xStart, xEnd, lineBuffer, layer0, layer1) {
    xStart = xStart | 0;
    xEnd = xEnd | 0;
    var currentPixel = 0;
    var lowerPixel = 0;
    var workingPixel = 0;
    while ((xStart | 0) < (xEnd | 0)) {
        lowerPixel = currentPixel = this.gfx.backdrop | 0;
        workingPixel = layer0[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer1[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        if ((currentPixel & 0x400000) == 0) {
            //Normal Pixel:
            lineBuffer[xStart | 0] = currentPixel | 0;
        }
        else {
            //OAM Pixel Processing:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.processOAMSemiTransparent(lowerPixel | 0, currentPixel | 0) | 0;
        }
        xStart = ((xStart | 0) + 1) | 0;
    }
}
GameBoyAdvanceCompositor.prototype.composite3Layer = function (xStart, xEnd, lineBuffer, layer0, layer1, layer2) {
    xStart = xStart | 0;
    xEnd = xEnd | 0;
    var currentPixel = 0;
    var lowerPixel = 0;
    var workingPixel = 0;
    while ((xStart | 0) < (xEnd | 0)) {
        lowerPixel = currentPixel = this.gfx.backdrop | 0;
        workingPixel = layer0[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer1[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer2[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        if ((currentPixel & 0x400000) == 0) {
            //Normal Pixel:
            lineBuffer[xStart | 0] = currentPixel | 0;
        }
        else {
            //OAM Pixel Processing:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.processOAMSemiTransparent(lowerPixel | 0, currentPixel | 0) | 0;
        }
        xStart = ((xStart | 0) + 1) | 0;
    }
}
GameBoyAdvanceCompositor.prototype.composite4Layer = function (xStart, xEnd, lineBuffer, layer0, layer1, layer2, layer3) {
    xStart = xStart | 0;
    xEnd = xEnd | 0;
    var currentPixel = 0;
    var lowerPixel = 0;
    var workingPixel = 0;
    while ((xStart | 0) < (xEnd | 0)) {
        lowerPixel = currentPixel = this.gfx.backdrop | 0;
        workingPixel = layer0[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer1[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer2[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer3[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        if ((currentPixel & 0x400000) == 0) {
            //Normal Pixel:
            lineBuffer[xStart | 0] = currentPixel | 0;
        }
        else {
            //OAM Pixel Processing:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.processOAMSemiTransparent(lowerPixel | 0, currentPixel | 0) | 0;
        }
        xStart = ((xStart | 0) + 1) | 0;
    }
}
GameBoyAdvanceCompositor.prototype.composite5Layer = function (xStart, xEnd, lineBuffer, layer0, layer1, layer2, layer3, layer4) {
    xStart = xStart | 0;
    xEnd = xEnd | 0;
    var currentPixel = 0;
    var lowerPixel = 0;
    var workingPixel = 0;
    while ((xStart | 0) < (xEnd | 0)) {
        lowerPixel = currentPixel = this.gfx.backdrop | 0;
        workingPixel = layer0[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer1[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer2[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer3[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer4[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        if ((currentPixel & 0x400000) == 0) {
            //Normal Pixel:
            lineBuffer[xStart | 0] = currentPixel | 0;
        }
        else {
            //OAM Pixel Processing:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.processOAMSemiTransparent(lowerPixel | 0, currentPixel | 0) | 0;
        }
        xStart = ((xStart | 0) + 1) | 0;
    }
}
GameBoyAdvanceCompositor.prototype.composite1LayerSpecial = function (xStart, xEnd, lineBuffer, layer0) {
    xStart = xStart | 0;
    xEnd = xEnd | 0;
    var currentPixel = 0;
    var lowerPixel = 0;
    var workingPixel = 0;
    while ((xStart | 0) < (xEnd | 0)) {
        lowerPixel = currentPixel = this.gfx.backdrop | 0;
        workingPixel = layer0[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        if ((currentPixel & 0x400000) == 0) {
            //Normal Pixel:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.process(lowerPixel | 0, currentPixel | 0) | 0;
        }
        else {
            //OAM Pixel Processing:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.processOAMSemiTransparent(lowerPixel | 0, currentPixel | 0) | 0;
        }
        xStart = ((xStart | 0) + 1) | 0;
    }
}
GameBoyAdvanceCompositor.prototype.composite2LayerSpecial = function (xStart, xEnd, lineBuffer, layer0, layer1) {
    xStart = xStart | 0;
    xEnd = xEnd | 0;
    var currentPixel = 0;
    var lowerPixel = 0;
    var workingPixel = 0;
    while ((xStart | 0) < (xEnd | 0)) {
        lowerPixel = currentPixel = this.gfx.backdrop | 0;
        workingPixel = layer0[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer1[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        if ((currentPixel & 0x400000) == 0) {
            //Normal Pixel:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.process(lowerPixel | 0, currentPixel | 0) | 0;
        }
        else {
            //OAM Pixel Processing:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.processOAMSemiTransparent(lowerPixel | 0, currentPixel | 0) | 0;
        }
        xStart = ((xStart | 0) + 1) | 0;
    }
}
GameBoyAdvanceCompositor.prototype.composite3LayerSpecial = function (xStart, xEnd, lineBuffer, layer0, layer1, layer2) {
    xStart = xStart | 0;
    xEnd = xEnd | 0;
    var currentPixel = 0;
    var lowerPixel = 0;
    var workingPixel = 0;
    while ((xStart | 0) < (xEnd | 0)) {
        lowerPixel = currentPixel = this.gfx.backdrop | 0;
        workingPixel = layer0[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer1[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer2[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        if ((currentPixel & 0x400000) == 0) {
            //Normal Pixel:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.process(lowerPixel | 0, currentPixel | 0) | 0;
        }
        else {
            //OAM Pixel Processing:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.processOAMSemiTransparent(lowerPixel | 0, currentPixel | 0) | 0;
        }
        xStart = ((xStart | 0) + 1) | 0;
    }
}
GameBoyAdvanceCompositor.prototype.composite4LayerSpecial = function (xStart, xEnd, lineBuffer, layer0, layer1, layer2, layer3) {
    xStart = xStart | 0;
    xEnd = xEnd | 0;
    var currentPixel = 0;
    var lowerPixel = 0;
    var workingPixel = 0;
    while ((xStart | 0) < (xEnd | 0)) {
        lowerPixel = currentPixel = this.gfx.backdrop | 0;
        workingPixel = layer0[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer1[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer2[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer3[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        if ((currentPixel & 0x400000) == 0) {
            //Normal Pixel:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.process(lowerPixel | 0, currentPixel | 0) | 0;
        }
        else {
            //OAM Pixel Processing:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.processOAMSemiTransparent(lowerPixel | 0, currentPixel | 0) | 0;
        }
        xStart = ((xStart | 0) + 1) | 0;
    }
}
GameBoyAdvanceCompositor.prototype.composite5LayerSpecial = function (xStart, xEnd, lineBuffer, layer0, layer1, layer2, layer3, layer4) {
    xStart = xStart | 0;
    xEnd = xEnd | 0;
    var currentPixel = 0;
    var lowerPixel = 0;
    var workingPixel = 0;
    while ((xStart | 0) < (xEnd | 0)) {
        lowerPixel = currentPixel = this.gfx.backdrop | 0;
        workingPixel = layer0[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer1[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer2[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer3[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        workingPixel = layer4[xStart | 0] | 0;
        if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {
            lowerPixel = currentPixel | 0;
            currentPixel = workingPixel | 0;
        }
        else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {
            lowerPixel = workingPixel | 0;
        }
        if ((currentPixel & 0x400000) == 0) {
            //Normal Pixel:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.process(lowerPixel | 0, currentPixel | 0) | 0;
        }
        else {
            //OAM Pixel Processing:
            //Pass the highest two pixels to be arbitrated in the color effects processing:
            lineBuffer[xStart | 0] = this.gfx.colorEffectsRenderer.processOAMSemiTransparent(lowerPixel | 0, currentPixel | 0) | 0;
        }
        xStart = ((xStart | 0) + 1) | 0;
    }
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceMemoryDispatchGenerator(memory) {
    this.memory = memory;
}
GameBoyAdvanceMemoryDispatchGenerator.prototype.generateMemoryReadIO8 = function () {
    var readIO = [];
    //4000000h - DISPCNT - LCD Control (Read/Write)
    readIO[0] = function (parentObj) {
        return parentObj.gfx.readDISPCNT0() | 0;
    }
    //4000001h - DISPCNT - LCD Control (Read/Write)
    readIO[0x1] = function (parentObj) {
        return parentObj.gfx.readDISPCNT1() | 0;
    }
    //4000002h - Undocumented - Green Swap (R/W)
    readIO[0x2] = function (parentObj) {
        return parentObj.gfx.readGreenSwap() | 0;
    }
    //4000003h - Undocumented - Green Swap (R/W)
    readIO[0x3] = this.memory.readZero;
    //4000004h - DISPSTAT - General LCD Status (Read/Write)
    readIO[0x4] = function (parentObj) {
        parentObj.IOCore.updateGraphicsClocking();
        return parentObj.gfx.readDISPSTAT0() | 0;
    }
    //4000005h - DISPSTAT - General LCD Status (Read/Write)
    readIO[0x5] = function (parentObj) {
        parentObj.IOCore.updateGraphicsClocking();
        return parentObj.gfx.readDISPSTAT1() | 0;
    }
    //4000006h - VCOUNT - Vertical Counter (Read only)
    readIO[0x6] = function (parentObj) {
        parentObj.IOCore.updateGraphicsClocking();
        return parentObj.gfx.readVCOUNT() | 0;
    }
    //4000007h - VCOUNT - Vertical Counter (Read only)
    readIO[0x7] = this.memory.readZero;
    //4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
    readIO[0x8] = function (parentObj) {
        return parentObj.gfx.readBG0CNT0() | 0;
    }
    //4000009h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
    readIO[0x9] = function (parentObj) {
        return parentObj.gfx.readBG0CNT1() | 0;
    }
    //400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
    readIO[0xA] = function (parentObj) {
        return parentObj.gfx.readBG1CNT0() | 0;
    }
    //400000Bh - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
    readIO[0xB] = function (parentObj) {
        return parentObj.gfx.readBG1CNT1() | 0;
    }
    //400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
    readIO[0xC] = function (parentObj) {
        return parentObj.gfx.readBG2CNT0() | 0;
    }
    //400000Dh - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
    readIO[0xD] = function (parentObj) {
        return parentObj.gfx.readBG2CNT1() | 0;
    }
    //400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
    readIO[0xE] = function (parentObj) {
        return parentObj.gfx.readBG3CNT0() | 0;
    }
    //400000Fh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
    readIO[0xF] = function (parentObj) {
        return parentObj.gfx.readBG3CNT1() | 0;
    }
    //4000010h through 4000047h - WRITE ONLY
    this.fillReadTableUnused8(readIO, 0x10, 0x47);
    //4000048h - WININ - Control of Inside of Window(s) (R/W)
    readIO[0x48] = function (parentObj) {
        return parentObj.gfx.readWININ0() | 0;
    }
    //4000049h - WININ - Control of Inside of Window(s) (R/W)
    readIO[0x49] = function (parentObj) {
        return parentObj.gfx.readWININ1() | 0;
    }
    //400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
    readIO[0x4A] = function (parentObj) {
        return parentObj.gfx.readWINOUT0() | 0;
    }
    //400004AB- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
    readIO[0x4B] = function (parentObj) {
        return parentObj.gfx.readWINOUT1() | 0;
    }
    //400004Ch - MOSAIC - Mosaic Size (W)
    readIO[0x4C] = this.memory.readUnused0;
    //400004Dh - MOSAIC - Mosaic Size (W)
    readIO[0x4D] = this.memory.readUnused1;
    //400004Eh - NOT USED - ZERO
    readIO[0x4E] = this.memory.readUnused2;
    //400004Fh - NOT USED - ZERO
    readIO[0x4F] = this.memory.readUnused3;
    //4000050h - BLDCNT - Color Special Effects Selection (R/W)
    readIO[0x50] = function (parentObj) {
        return parentObj.gfx.readBLDCNT0() | 0;
    }
    //4000051h - BLDCNT - Color Special Effects Selection (R/W)
    readIO[0x51] = function (parentObj) {
        return parentObj.gfx.readBLDCNT1() | 0;
    }
    //4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
    readIO[0x52] = function (parentObj) {
        return parentObj.gfx.readBLDALPHA0() | 0;
    }
    //4000053h - BLDALPHA - Alpha Blending Coefficients (R/W)
    readIO[0x53] = function (parentObj) {
        return parentObj.gfx.readBLDALPHA1() | 0;
    }
    //4000054h through 400005Fh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0x54, 0x5F);
    //4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
    readIO[0x60] = function (parentObj) {
        //NR10:
        return parentObj.sound.readSOUND1CNT_L() | 0;
    }
    //4000061h - NOT USED - ZERO
    readIO[0x61] = this.memory.readZero;
    //4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
    readIO[0x62] = function (parentObj) {
        //NR11:
        return parentObj.sound.readSOUND1CNT_H0() | 0;
    }
    //4000063h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
    readIO[0x63] = function (parentObj) {
        //NR12:
        return parentObj.sound.readSOUND1CNT_H1() | 0;
    }
    //4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
    readIO[0x64] = this.memory.readZero;
    //4000065h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
    readIO[0x65] = function (parentObj) {
        //NR14:
        return parentObj.sound.readSOUND1CNT_X() | 0;
    }
    //4000066h - NOT USED - ZERO
    readIO[0x66] = this.memory.readZero;
    //4000067h - NOT USED - ZERO
    readIO[0x67] = this.memory.readZero;
    //4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
    readIO[0x68] = function (parentObj) {
        //NR21:
        return parentObj.sound.readSOUND2CNT_L0() | 0;
    }
    //4000069h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
    readIO[0x69] = function (parentObj) {
        //NR22:
        return parentObj.sound.readSOUND2CNT_L1() | 0;
    }
    //400006Ah - NOT USED - ZERO
    readIO[0x6A] = this.memory.readZero;
    //400006Bh - NOT USED - ZERO
    readIO[0x6B] = this.memory.readZero;
    //400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
    readIO[0x6C] = this.memory.readZero;
    //400006Dh - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
    readIO[0x6D] = function (parentObj) {
        //NR24:
        return parentObj.sound.readSOUND2CNT_H() | 0;
    }
    //400006Eh - NOT USED - ZERO
    readIO[0x6E] = this.memory.readZero;
    //400006Fh - NOT USED - ZERO
    readIO[0x6F] = this.memory.readZero;
    //4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
    readIO[0x70] = function (parentObj) {
        //NR30:
        return parentObj.sound.readSOUND3CNT_L() | 0;
    }
    //4000071h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
    readIO[0x71] = this.memory.readZero;
    //4000072h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
    readIO[0x72] = this.memory.readZero;
    //4000073h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
    readIO[0x73] = function (parentObj) {
        //NR32:
        return parentObj.sound.readSOUND3CNT_H() | 0;
    }
    //4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
    readIO[0x74] = this.memory.readZero;
    //4000075h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
    readIO[0x75] = function (parentObj) {
        //NR34:
        return parentObj.sound.readSOUND3CNT_X() | 0;
    }
    //4000076h - NOT USED - ZERO
    readIO[0x76] = this.memory.readZero;
    //4000077h - NOT USED - ZERO
    readIO[0x77] = this.memory.readZero;
    //4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
    readIO[0x78] = this.memory.readZero;
    //4000079h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
    readIO[0x79] = function (parentObj) {
        //NR42:
        return parentObj.sound.readSOUND4CNT_L() | 0;
    }
    //400007Ah - NOT USED - ZERO
    readIO[0x7A] = this.memory.readZero;
    //400007Bh - NOT USED - ZERO
    readIO[0x7B] = this.memory.readZero;
    //400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
    readIO[0x7C] = function (parentObj) {
        //NR43:
        return parentObj.sound.readSOUND4CNT_H0() | 0;
    }
    //400007Dh - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
    readIO[0x7D] = function (parentObj) {
        //NR44:
        return parentObj.sound.readSOUND4CNT_H1() | 0;
    }
    //400007Eh - NOT USED - ZERO
    readIO[0x7E] = this.memory.readZero;
    //400007Fh - NOT USED - ZERO
    readIO[0x7F] = this.memory.readZero;
    //4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
    readIO[0x80] = function (parentObj) {
        //NR50:
        return parentObj.sound.readSOUNDCNT_L0() | 0;
    }
    //4000081h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
    readIO[0x81] = function (parentObj) {
        //NR51:
        return parentObj.sound.readSOUNDCNT_L1() | 0;
    }
    //4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
    readIO[0x82] = function (parentObj) {
        return parentObj.sound.readSOUNDCNT_H0() | 0;
    }
    //4000083h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
    readIO[0x83] = function (parentObj) {
        return parentObj.sound.readSOUNDCNT_H1() | 0;
    }
    //4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
    readIO[0x84] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readSOUNDCNT_X() | 0;
    }
    //4000085h - NOT USED - ZERO
    readIO[0x85] = this.memory.readZero;
    //4000086h - NOT USED - ZERO
    readIO[0x86] = this.memory.readZero;
    //4000087h - NOT USED - ZERO
    readIO[0x87] = this.memory.readZero;
    //4000088h - SOUNDBIAS - Sound PWM Control (R/W, see below)
    readIO[0x88] = function (parentObj) {
        return parentObj.sound.readSOUNDBIAS0() | 0;
    }
    //4000089h - SOUNDBIAS - Sound PWM Control (R/W, see below)
    readIO[0x89] = function (parentObj) {
        return parentObj.sound.readSOUNDBIAS1() | 0;
    }
    //400008Ah - NOT USED - ZERO
    readIO[0x8A] = this.memory.readZero;
    //400008Bh - NOT USED - ZERO
    readIO[0x8B] = this.memory.readZero;
    //400008Ch - NOT USED - GLITCHED
    readIO[0x8C] = this.memory.readUnused0;
    //400008Dh - NOT USED - GLITCHED
    readIO[0x8D] = this.memory.readUnused1;
    //400008Eh - NOT USED - GLITCHED
    readIO[0x8E] = this.memory.readUnused2;
    //400008Fh - NOT USED - GLITCHED
    readIO[0x8F] = this.memory.readUnused3;
    //4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x90] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(0) | 0;
    }
    //4000091h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x91] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(1) | 0;
    }
    //4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x92] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(2) | 0;
    }
    //4000093h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x93] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(3) | 0;
    }
    //4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x94] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(4) | 0;
    }
    //4000095h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x95] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(5) | 0;
    }
    //4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x96] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(6) | 0;
    }
    //4000097h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x97] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(7) | 0;
    }
    //4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x98] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(8) | 0;
    }
    //4000099h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x99] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(9) | 0;
    }
    //400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9A] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(10) | 0;
    }
    //400009Bh - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9B] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(11) | 0;
    }
    //400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9C] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(12) | 0;
    }
    //400009Dh - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9D] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(13) | 0;
    }
    //400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9E] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(14) | 0;
    }
    //400009Fh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9F] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(15) | 0;
    }
    //40000A0h through 40000B9h - WRITE ONLY
    this.fillReadTableUnused8(readIO, 0xA0, 0xB9);
    //40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
    readIO[0xBA] = function (parentObj) {
        return parentObj.dma.readDMAControl0(0) | 0;
    }
    //40000BBh - DMA0CNT_H - DMA 0 Control (R/W)
    readIO[0xBB] = function (parentObj) {
        return parentObj.dma.readDMAControl1(0) | 0;
    }
    //40000BCh through 40000C5h - WRITE ONLY
    this.fillReadTableUnused8(readIO, 0xBC, 0xC5);
    //40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
    readIO[0xC6] = function (parentObj) {
        return parentObj.dma.readDMAControl0(1) | 0;
    }
    //40000C7h - DMA1CNT_H - DMA 1 Control (R/W)
    readIO[0xC7] = function (parentObj) {
        return parentObj.dma.readDMAControl1(1) | 0;
    }
    //40000C8h through 40000D1h - WRITE ONLY
    this.fillReadTableUnused8(readIO, 0xC8, 0xD1);
    //40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
    readIO[0xD2] = function (parentObj) {
        return parentObj.dma.readDMAControl0(2) | 0;
    }
    //40000D3h - DMA2CNT_H - DMA 2 Control (R/W)
    readIO[0xD3] = function (parentObj) {
        return parentObj.dma.readDMAControl1(2) | 0;
    }
    //40000D4h through 40000DDh - WRITE ONLY
    this.fillReadTableUnused8(readIO, 0xD4, 0xDD);
    //40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
    readIO[0xDE] = function (parentObj) {
        return parentObj.dma.readDMAControl0(3) | 0;
    }
    //40000DFh - DMA3CNT_H - DMA 3 Control (R/W)
    readIO[0xDF] = function (parentObj) {
        return parentObj.dma.readDMAControl1(3) | 0;
    }
    //40000E0h through 40000FFh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0xE0, 0xFF);
    //4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
    readIO[0x100] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM0CNT_L0() | 0;
    }
    //4000101h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
    readIO[0x101] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM0CNT_L1() | 0;
    }
    //4000102h - TM0CNT_H - Timer 0 Control (R/W)
    readIO[0x102] = function (parentObj) {
        return parentObj.timer.readTM0CNT_H() | 0;
    }
    //4000103h - TM0CNT_H - Timer 0 Control (R/W)
    readIO[0x103] = this.memory.readZero;
    //4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
    readIO[0x104] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM1CNT_L0() | 0;
    }
    //4000105h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
    readIO[0x105] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM1CNT_L1() | 0;
    }
    //4000106h - TM1CNT_H - Timer 1 Control (R/W)
    readIO[0x106] = function (parentObj) {
        return parentObj.timer.readTM1CNT_H() | 0;
    }
    //4000107h - TM1CNT_H - Timer 1 Control (R/W)
    readIO[0x107] = this.memory.readZero;
    //4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
    readIO[0x108] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM2CNT_L0() | 0;
    }
    //4000109h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
    readIO[0x109] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM2CNT_L1() | 0;
    }
    //400010Ah - TM2CNT_H - Timer 2 Control (R/W)
    readIO[0x10A] = function (parentObj) {
        return parentObj.timer.readTM2CNT_H() | 0;
    }
    //400010Bh - TM2CNT_H - Timer 2 Control (R/W)
    readIO[0x10B] = this.memory.readZero;
    //400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
    readIO[0x10C] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM3CNT_L0() | 0;
    }
    //400010Dh - TM3CNT_L - Timer 3 Counter/Reload (R/W)
    readIO[0x10D] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM3CNT_L1() | 0;
    }
    //400010Eh - TM3CNT_H - Timer 3 Control (R/W)
    readIO[0x10E] = function (parentObj) {
        return parentObj.timer.readTM3CNT_H() | 0;
    }
    //400010Fh - TM3CNT_H - Timer 3 Control (R/W)
    readIO[0x10F] = this.memory.readZero;
    //4000110h through 400011Fh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0x110, 0x11F);
    //4000120h - Serial Data A (R/W)
    readIO[0x120] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_A0() | 0;
    }
    //4000121h - Serial Data A (R/W)
    readIO[0x121] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_A1() | 0;
    }
    //4000122h - Serial Data B (R/W)
    readIO[0x122] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_B0() | 0;
    }
    //4000123h - Serial Data B (R/W)
    readIO[0x123] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_B1() | 0;
    }
    //4000124h - Serial Data C (R/W)
    readIO[0x124] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_C0() | 0;
    }
    //4000125h - Serial Data C (R/W)
    readIO[0x125] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_C1() | 0;
    }
    //4000126h - Serial Data D (R/W)
    readIO[0x126] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_D0() | 0;
    }
    //4000127h - Serial Data D (R/W)
    readIO[0x127] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_D1() | 0;
    }
    //4000128h - SIOCNT - SIO Sub Mode Control (R/W)
    readIO[0x128] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIOCNT0() | 0;
    }
    //4000129h - SIOCNT - SIO Sub Mode Control (R/W)
    readIO[0x129] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIOCNT1() | 0;
    }
    //400012Ah - SIOMLT_SEND - Data Send Register (R/W)
    readIO[0x12A] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA8_0() | 0;
    }
    //400012Bh - SIOMLT_SEND - Data Send Register (R/W)
    readIO[0x12B] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA8_1() | 0;
    }
    //400012Ch through 400012Fh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0x12C, 0x12F);
    //4000130h - KEYINPUT - Key Status (R)
    readIO[0x130] = function (parentObj) {
        return parentObj.joypad.readKeyStatus0() | 0;
    }
    //4000131h - KEYINPUT - Key Status (R)
    readIO[0x131] = function (parentObj) {
        return parentObj.joypad.readKeyStatus1() | 0;
    }
    //4000132h - KEYCNT - Key Interrupt Control (R/W)
    readIO[0x132] = function (parentObj) {
        return parentObj.joypad.readKeyControl0() | 0;
    }
    //4000133h - KEYCNT - Key Interrupt Control (R/W)
    readIO[0x133] = function (parentObj) {
        return parentObj.joypad.readKeyControl1() | 0;
    }
    //4000134h - RCNT (R/W) - Mode Selection
    readIO[0x134] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readRCNT0() | 0;
    }
    //4000135h - RCNT (R/W) - Mode Selection
    readIO[0x135] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readRCNT1() | 0;
    }
    //4000136h - NOT USED - ZERO
    readIO[0x136] = this.memory.readZero;
    //4000137h - NOT USED - ZERO
    readIO[0x137] = this.memory.readZero;
    //4000138h through 400013Fh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0x138, 0x13F);
    //4000140h - JOYCNT - JOY BUS Control Register (R/W)
    readIO[0x140] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYCNT() | 0;
    }
    //4000141h - JOYCNT - JOY BUS Control Register (R/W)
    readIO[0x141] = this.memory.readZero;
    //4000142h - NOT USED - ZERO
    readIO[0x142] = this.memory.readZero;
    //4000143h - NOT USED - ZERO
    readIO[0x143] = this.memory.readZero;
    //4000144h through 400014Fh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0x144, 0x14F);
    //4000150h - JoyBus Receive (R/W)
    readIO[0x150] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_RECV0() | 0;
    }
    //4000151h - JoyBus Receive (R/W)
    readIO[0x151] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_RECV1() | 0;
    }
    //4000152h - JoyBus Receive (R/W)
    readIO[0x152] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_RECV2() | 0;
    }
    //4000153h - JoyBus Receive (R/W)
    readIO[0x153] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_RECV3() | 0;
    }
    //4000154h - JoyBus Send (R/W)
    readIO[0x154] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_SEND0() | 0;
    }
    //4000155h - JoyBus Send (R/W)
    readIO[0x155] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_SEND1() | 0;
    }
    //4000156h - JoyBus Send (R/W)
    readIO[0x156] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_SEND2() | 0;
    }
    //4000157h - JoyBus Send (R/W)
    readIO[0x157] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_SEND3() | 0;
    }
    //4000158h - JoyBus Stat (R/W)
    readIO[0x158] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_STAT() | 0;
    }
    //4000159h - JoyBus Stat (R/W)
    readIO[0x159] = this.memory.readZero;
    //400015Ah - NOT USED - ZERO
    readIO[0x15A] = this.memory.readZero;
    //400015Bh - NOT USED - ZERO
    readIO[0x15B] = this.memory.readZero;
    //400015Ch through 40001FFh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0x15C, 0x1FF);
    //4000200h - IE - Interrupt Enable Register (R/W)
    readIO[0x200] = function (parentObj) {
        return parentObj.irq.readIE0() | 0;
    }
    //4000201h - IE - Interrupt Enable Register (R/W)
    readIO[0x201] = function (parentObj) {
        return parentObj.irq.readIE1() | 0;
    }
    //4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
    readIO[0x202] = function (parentObj) {
        parentObj.IOCore.updateCoreSpillRetain();
        return parentObj.irq.readIF0() | 0;
    }
    //4000203h - IF - Interrupt Request Flags / IRQ Acknowledge
    readIO[0x203] = function (parentObj) {
        parentObj.IOCore.updateCoreSpillRetain();
        return parentObj.irq.readIF1() | 0;
    }
    //4000204h - WAITCNT - Waitstate Control (R/W)
    readIO[0x204] = function (parentObj) {
        return parentObj.wait.readWAITCNT0() | 0;
    }
    //4000205h - WAITCNT - Waitstate Control (R/W)
    readIO[0x205] = function (parentObj) {
        return parentObj.wait.readWAITCNT1() | 0;
    }
    //4000206h - NOT USED - ZERO
    readIO[0x206] = this.memory.readZero;
    //4000207h - NOT USED - ZERO
    readIO[0x207] = this.memory.readZero;
    //4000208h - IME - Interrupt Master Enable Register (R/W)
    readIO[0x208] = function (parentObj) {
        return parentObj.irq.readIME() | 0;
    }
    //4000209h - IME - Interrupt Master Enable Register (R/W)
    readIO[0x209] = this.memory.readZero;
    //400020Ah - NOT USED - ZERO
    readIO[0x20A] = this.memory.readZero;
    //400020Bh - NOT USED - ZERO
    readIO[0x20B] = this.memory.readZero;
    //400020Ch through 40002FFh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0x20C, 0x2FF);
    //4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
    readIO[0x300] = function (parentObj) {
        return parentObj.wait.readPOSTBOOT() | 0;
    }
    //4000301h - HALTCNT - BYTE - Undocumented - Low Power Mode Control (W)
    readIO[0x301] = this.memory.readZero;
    //4000302h - NOT USED - ZERO
    readIO[0x302] = this.memory.readZero;
    //4000303h - NOT USED - ZERO
    readIO[0x303] = this.memory.readZero;
    return readIO;
}
GameBoyAdvanceMemoryDispatchGenerator.prototype.generateMemoryReadIO16 = function () {
    var readIO = [];
    //4000000h - DISPCNT - LCD Control (Read/Write)
    readIO[0] = function (parentObj) {
        return parentObj.gfx.readDISPCNT0() | (parentObj.gfx.readDISPCNT1() << 8);
    }
    //4000002h - Undocumented - Green Swap (R/W)
    readIO[0x2 >> 1] = function (parentObj) {
        return parentObj.gfx.readGreenSwap() | 0;
    }
    //4000004h - DISPSTAT - General LCD Status (Read/Write)
    readIO[0x4 >> 1] = function (parentObj) {
        parentObj.IOCore.updateGraphicsClocking();
        return parentObj.gfx.readDISPSTAT0() | (parentObj.gfx.readDISPSTAT1() << 8);
    }
    //4000006h - VCOUNT - Vertical Counter (Read only)
    readIO[0x6 >> 1] = function (parentObj) {
        parentObj.IOCore.updateGraphicsClocking();
        return parentObj.gfx.readVCOUNT() | 0;
    }
    //4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
    readIO[0x8 >> 1] = function (parentObj) {
        return parentObj.gfx.readBG0CNT0() | (parentObj.gfx.readBG0CNT1() << 8);
    }
    //400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
    readIO[0xA >> 1] = function (parentObj) {
        return parentObj.gfx.readBG1CNT0() | (parentObj.gfx.readBG1CNT1() << 8);
    }
    //400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
    readIO[0xC >> 1] = function (parentObj) {
        return parentObj.gfx.readBG2CNT0() | (parentObj.gfx.readBG2CNT1() << 8);
    }
    //400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
    readIO[0xE >> 1] = function (parentObj) {
        return parentObj.gfx.readBG3CNT0() | (parentObj.gfx.readBG3CNT1() << 8);
    }
    //4000010h through 4000047h - WRITE ONLY
    this.fillReadTableUnused16(readIO, 0x10 >> 1, 0x46 >> 1);
    //4000048h - WININ - Control of Inside of Window(s) (R/W)
    readIO[0x48 >> 1] = function (parentObj) {
        return parentObj.gfx.readWININ0() | (parentObj.gfx.readWININ1() << 8);
    }
    //400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
    readIO[0x4A >> 1] = function (parentObj) {
        return parentObj.gfx.readWINOUT0() | (parentObj.gfx.readWINOUT1() << 8);
    }
    //400004Ch - MOSAIC - Mosaic Size (W)
    readIO[0x4C >> 1] = this.memory.readUnused16IO1;
    //400004Eh - NOT USED - ZERO
    readIO[0x4E >> 1] = this.memory.readUnused16IO2;
    //4000050h - BLDCNT - Color Special Effects Selection (R/W)
    readIO[0x50 >> 1] = function (parentObj) {
        return parentObj.gfx.readBLDCNT0() | (parentObj.gfx.readBLDCNT1() << 8);
    }
    //4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
    readIO[0x52 >> 1] = function (parentObj) {
        return parentObj.gfx.readBLDALPHA0() | (parentObj.gfx.readBLDALPHA1() << 8);
    }
    //4000054h through 400005Fh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0x54 >> 1, 0x5E >> 1);
    //4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
    readIO[0x60 >> 1] = function (parentObj) {
        //NR10:
        return parentObj.sound.readSOUND1CNT_L() | 0;
    }
    //4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
    readIO[0x62 >> 1] = function (parentObj) {
        //NR11:
        //NR12:
        return parentObj.sound.readSOUND1CNT_H0() | (parentObj.sound.readSOUND1CNT_H1() << 8);
    }
    //4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
    readIO[0x64 >> 1] = function (parentObj) {
        //NR14:
        return parentObj.sound.readSOUND1CNT_X() << 8;
    }
    //4000066h - NOT USED - ZERO
    readIO[0x66 >> 1] = this.memory.readZero;
    //4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
    readIO[0x68 >> 1] = function (parentObj) {
        //NR21:
        //NR22:
        return parentObj.sound.readSOUND2CNT_L0() | (parentObj.sound.readSOUND2CNT_L1() << 8);
    }
    //400006Ah - NOT USED - ZERO
    readIO[0x6A >> 1] = this.memory.readZero;
    //400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
    readIO[0x6C >> 1] = function (parentObj) {
        //NR24:
        return parentObj.sound.readSOUND2CNT_H() << 8;
    }
    //400006Eh - NOT USED - ZERO
    readIO[0x6E >> 1] = this.memory.readZero;
    //4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
    readIO[0x70 >> 1] = function (parentObj) {
        //NR30:
        return parentObj.sound.readSOUND3CNT_L() | 0;
    }
    //4000073h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
    readIO[0x72 >> 1] = function (parentObj) {
        //NR32:
        return parentObj.sound.readSOUND3CNT_H() << 8;
    }
    //4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
    readIO[0x74 >> 1] = function (parentObj) {
        //NR34:
        return parentObj.sound.readSOUND3CNT_X() << 8;
    }
    //4000076h - NOT USED - ZERO
    readIO[0x76 >> 1] = this.memory.readZero;
    //4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
    readIO[0x78 >> 1] = function (parentObj) {
        //NR42:
        return parentObj.sound.readSOUND4CNT_L() << 8;
    }
    //400007Ah - NOT USED - ZERO
    readIO[0x7A >> 1] = this.memory.readZero;
    //400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
    readIO[0x7C >> 1] = function (parentObj) {
        //NR43:
        //NR44:
        return parentObj.sound.readSOUND4CNT_H0() | (parentObj.sound.readSOUND4CNT_H1() << 8);
    }
    //400007Eh - NOT USED - ZERO
    readIO[0x7E >> 1] = this.memory.readZero;
    //4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
    readIO[0x80 >> 1] = function (parentObj) {
        //NR50:
        //NR51:
        return parentObj.sound.readSOUNDCNT_L0() | (parentObj.sound.readSOUNDCNT_L1() << 8);
    }
    //4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
    readIO[0x82 >> 1] = function (parentObj) {
        return parentObj.sound.readSOUNDCNT_H0() | (parentObj.sound.readSOUNDCNT_H1() << 8);
    }
    //4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
    readIO[0x84 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readSOUNDCNT_X() | 0;
    }
    //4000086h - NOT USED - ZERO
    readIO[0x86 >> 1] = this.memory.readZero;
    //4000088h - SOUNDBIAS - Sound PWM Control (R/W, see below)
    readIO[0x88 >> 1] = function (parentObj) {
        return parentObj.sound.readSOUNDBIAS0() | (parentObj.sound.readSOUNDBIAS1() << 8);
    }
    //400008Ah - NOT USED - ZERO
    readIO[0x8A >> 1] = this.memory.readZero;
    //400008Ch - NOT USED - GLITCHED
    readIO[0x8C >> 1] = this.memory.readUnused16IO1;
    //400008Eh - NOT USED - GLITCHED
    readIO[0x8E >> 1] = this.memory.readUnused16IO2;
    //4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x90 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(0) | (parentObj.sound.readWAVE(1) << 8);
    }
    //4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x92 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(2) | (parentObj.sound.readWAVE(3) << 8);
    }
    //4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x94 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(4) | (parentObj.sound.readWAVE(5) << 8);
    }
    //4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x96 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(6) | (parentObj.sound.readWAVE(7) << 8);
    }
    //4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x98 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(8) | (parentObj.sound.readWAVE(9) << 8);
    }
    //400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9A >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(10) | (parentObj.sound.readWAVE(11) << 8);
    }
    //400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9C >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(12) | (parentObj.sound.readWAVE(13) << 8);
    }
    //400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9E >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(14) | (parentObj.sound.readWAVE(15) << 8);
    }
    //40000A0h through 40000B9h - WRITE ONLY
    this.fillReadTableUnused16(readIO, 0xA0 >> 1, 0xB8 >> 1);
    //40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
    readIO[0xBA >> 1] = function (parentObj) {
        return parentObj.dma.readDMAControl0(0) | (parentObj.dma.readDMAControl1(0) << 8);
    }
    //40000BCh through 40000C5h - WRITE ONLY
    this.fillReadTableUnused16(readIO, 0xBC >> 1, 0xC4 >> 1);
    //40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
    readIO[0xC6 >> 1] = function (parentObj) {
        return parentObj.dma.readDMAControl0(1) | (parentObj.dma.readDMAControl1(1) << 8);
    }
    //40000C8h through 40000D1h - WRITE ONLY
    this.fillReadTableUnused16(readIO, 0xC8 >> 1, 0xD0 >> 1);
    //40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
    readIO[0xD2 >> 1] = function (parentObj) {
        return parentObj.dma.readDMAControl0(2) | (parentObj.dma.readDMAControl1(2) << 8);
    }
    //40000D4h through 40000DDh - WRITE ONLY
    this.fillReadTableUnused16(readIO, 0xD4 >> 1, 0xDC >> 1);
    //40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
    readIO[0xDE >> 1] = function (parentObj) {
        return parentObj.dma.readDMAControl0(3) | (parentObj.dma.readDMAControl1(3) << 8);
    }
    //40000E0h through 40000FFh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0xE0 >> 1, 0xFE >> 1);
    //4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
    readIO[0x100 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM0CNT_L0() | (parentObj.timer.readTM0CNT_L1() << 8);
    }
    //4000102h - TM0CNT_H - Timer 0 Control (R/W)
    readIO[0x102 >> 1] = function (parentObj) {
        return parentObj.timer.readTM0CNT_H() | 0;
    }
    //4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
    readIO[0x104 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM1CNT_L0() | (parentObj.timer.readTM1CNT_L1() << 8);
    }
    //4000106h - TM1CNT_H - Timer 1 Control (R/W)
    readIO[0x106 >> 1] = function (parentObj) {
        return parentObj.timer.readTM1CNT_H() | 0;
    }
    //4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
    readIO[0x108 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM2CNT_L0() | (parentObj.timer.readTM2CNT_L1() << 8);
    }
    //400010Ah - TM2CNT_H - Timer 2 Control (R/W)
    readIO[0x10A >> 1] = function (parentObj) {
        return parentObj.timer.readTM2CNT_H() | 0;
    }
    //400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
    readIO[0x10C >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM3CNT_L0() | (parentObj.timer.readTM3CNT_L1() << 8);
    }
    //400010Eh - TM3CNT_H - Timer 3 Control (R/W)
    readIO[0x10E >> 1] = function (parentObj) {
        return parentObj.timer.readTM3CNT_H() | 0;
    }
    //4000110h through 400011Fh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0x110 >> 1, 0x11E >> 1);
    //4000120h - Serial Data A (R/W)
    readIO[0x120 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_A0() | (parentObj.serial.readSIODATA_A1() << 8);
    }
    //4000122h - Serial Data B (R/W)
    readIO[0x122 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_B0() | (parentObj.serial.readSIODATA_B1() << 8);
    }
    //4000124h - Serial Data C (R/W)
    readIO[0x124 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_C0() | (parentObj.serial.readSIODATA_C1() << 8);
    }
    //4000126h - Serial Data D (R/W)
    readIO[0x126 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_D0() | (parentObj.serial.readSIODATA_D1() << 8);
    }
    //4000128h - SIOCNT - SIO Sub Mode Control (R/W)
    readIO[0x128 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIOCNT0() | (parentObj.serial.readSIOCNT1() << 8);
    }
    //400012Ah - SIOMLT_SEND - Data Send Register (R/W)
    readIO[0x12A >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA8_0() | (parentObj.serial.readSIODATA8_1() << 8);
    }
    //400012Ch through 400012Fh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0x12C >> 1, 0x12E >> 1);
    //4000130h - KEYINPUT - Key Status (R)
    readIO[0x130 >> 1] = function (parentObj) {
        return parentObj.joypad.readKeyStatus0() | (parentObj.joypad.readKeyStatus1() << 8);
    }
    //4000132h - KEYCNT - Key Interrupt Control (R/W)
    readIO[0x132 >> 1] = function (parentObj) {
        return parentObj.joypad.readKeyControl0() | (parentObj.joypad.readKeyControl1() << 8);
    }
    //4000134h - RCNT (R/W) - Mode Selection
    readIO[0x134 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readRCNT0() | (parentObj.serial.readRCNT1() << 8);
    }
    //4000136h - NOT USED - ZERO
    readIO[0x136 >> 1] = this.memory.readZero;
    //4000138h through 400013Fh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0x138 >> 1, 0x13E >> 1);
    //4000140h - JOYCNT - JOY BUS Control Register (R/W)
    readIO[0x140 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYCNT() | 0;
    }
    //4000142h - NOT USED - ZERO
    readIO[0x142 >> 1] = this.memory.readZero;
    //4000144h through 400014Fh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0x144 >> 1, 0x14E >> 1);
    //4000150h - JoyBus Receive (R/W)
    readIO[0x150 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_RECV0() | (parentObj.serial.readJOYBUS_RECV1() << 8);
    }
    //4000152h - JoyBus Receive (R/W)
    readIO[0x152 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_RECV2() | (parentObj.serial.readJOYBUS_RECV3() << 8);
    }
    //4000154h - JoyBus Send (R/W)
    readIO[0x154 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_SEND0() | (parentObj.serial.readJOYBUS_SEND1() << 8);
    }
    //4000156h - JoyBus Send (R/W)
    readIO[0x156 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_SEND2() | (parentObj.serial.readJOYBUS_SEND3() << 8);
    }
    //4000158h - JoyBus Stat (R/W)
    readIO[0x158 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_STAT() | 0;
    }
    //400015Ah - NOT USED - ZERO
    readIO[0x15A >> 1] = this.memory.readZero;
    //400015Ch through 40001FFh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0x15C >> 1, 0x1FE >> 1);
    //4000200h - IE - Interrupt Enable Register (R/W)
    readIO[0x200 >> 1] = function (parentObj) {
        return parentObj.irq.readIE0() | (parentObj.irq.readIE1() << 8);
    }
    //4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
    readIO[0x202 >> 1] = function (parentObj) {
        parentObj.IOCore.updateCoreSpillRetain();
        return parentObj.irq.readIF0() | (parentObj.irq.readIF1() << 8);
    }
    //4000204h - WAITCNT - Waitstate Control (R/W)
    readIO[0x204 >> 1] = function (parentObj) {
        return parentObj.wait.readWAITCNT0() | (parentObj.wait.readWAITCNT1() << 8);
    }
    //4000206h - NOT USED - ZERO
    readIO[0x206 >> 1] = this.memory.readZero;
    //4000208h - IME - Interrupt Master Enable Register (R/W)
    readIO[0x208 >> 1] = function (parentObj) {
        return parentObj.irq.readIME() | 0;
    }
    //400020Ah - NOT USED - ZERO
    readIO[0x20A >> 1] = this.memory.readZero;
    //400020Ch through 40002FFh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0x20C >> 1, 0x2FE >> 1);
    //4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
    readIO[0x300 >> 1] = function (parentObj) {
        return parentObj.wait.readPOSTBOOT() | 0;
    }
    //4000302h - NOT USED - ZERO
    readIO[0x302 >> 1] = this.memory.readZero;
    return readIO;
}
GameBoyAdvanceMemoryDispatchGenerator.prototype.fillReadTableUnused8 = function (readIO, from, to) {
    //Fill in slots of the i/o read table:
    while (from <= to) {
        readIO[from++] = this.memory.readUnused0;
        readIO[from++] = this.memory.readUnused1;
        readIO[from++] = this.memory.readUnused2;
        readIO[from++] = this.memory.readUnused3;
    }
}
GameBoyAdvanceMemoryDispatchGenerator.prototype.fillReadTableUnused16 = function (readIO, from, to) {
    //Fill in slots of the i/o read table:
    while (from <= to) {
        if ((from & 0x1) == 0) {
            readIO[from++] = this.memory.readUnused16IO1;
        }
        else {
            readIO[from++] = this.memory.readUnused16IO2;
        }
    }
}
GameBoyAdvanceMemoryDispatchGenerator.prototype.generateMemoryWriteIO8 = function () {
    var writeIO = [];
    //4000000h - DISPCNT - LCD Control (Read/Write)
    writeIO[0] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeDISPCNT0(data | 0);
    }
    //4000001h - DISPCNT - LCD Control (Read/Write)
    writeIO[0x1] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeDISPCNT1(data | 0);
    }
    //4000002h - Undocumented - Green Swap (R/W)
    writeIO[0x2] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeGreenSwap(data | 0);
    }
    //4000003h - Undocumented - Green Swap (R/W)
    writeIO[0x3] = this.memory.NOP;
    //4000004h - DISPSTAT - General LCD Status (Read/Write)
    writeIO[0x4] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeDISPSTAT0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000005h - DISPSTAT - General LCD Status (Read/Write)
    writeIO[0x5] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeDISPSTAT1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000006h - VCOUNT - Vertical Counter (Read only)
    writeIO[0x6] = this.memory.NOP;
    //4000007h - VCOUNT - Vertical Counter (Read only)
    writeIO[0x7] = this.memory.NOP;
    //4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
    writeIO[0x8] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0CNT0(data | 0);
    }
    //4000009h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
    writeIO[0x9] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0CNT1(data | 0);
    }
    //400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
    writeIO[0xA] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1CNT0(data | 0);
    }
    //400000Bh - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
    writeIO[0xB] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1CNT1(data | 0);
    }
    //400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
    writeIO[0xC] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2CNT0(data | 0);
    }
    //400000Dh - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
    writeIO[0xD] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2CNT1(data | 0);
    }
    //400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
    writeIO[0xE] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3CNT0(data | 0);
    }
    //400000Fh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
    writeIO[0xF] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3CNT1(data | 0);
    }
    //4000010h - BG0HOFS - BG0 X-Offset (W)
    writeIO[0x10] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0HOFS0(data | 0);
    }
    //4000011h - BG0HOFS - BG0 X-Offset (W)
    writeIO[0x11] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0HOFS1(data | 0);
    }
    //4000012h - BG0VOFS - BG0 Y-Offset (W)
    writeIO[0x12] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0VOFS0(data | 0);
    }
    //4000013h - BG0VOFS - BG0 Y-Offset (W)
    writeIO[0x13] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0VOFS1(data | 0);
    }
    //4000014h - BG1HOFS - BG1 X-Offset (W)
    writeIO[0x14] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1HOFS0(data | 0);
    }
    //4000015h - BG1HOFS - BG1 X-Offset (W)
    writeIO[0x15] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1HOFS1(data | 0);
    }
    //4000016h - BG1VOFS - BG1 Y-Offset (W)
    writeIO[0x16] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1VOFS0(data | 0);
    }
    //4000017h - BG1VOFS - BG1 Y-Offset (W)
    writeIO[0x17] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1VOFS1(data | 0);
    }
    //4000018h - BG2HOFS - BG2 X-Offset (W)
    writeIO[0x18] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2HOFS0(data | 0);
    }
    //4000019h - BG2HOFS - BG2 X-Offset (W)
    writeIO[0x19] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2HOFS1(data | 0);
    }
    //400001Ah - BG2VOFS - BG2 Y-Offset (W)
    writeIO[0x1A] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2VOFS0(data | 0);
    }
    //400001Bh - BG2VOFS - BG2 Y-Offset (W)
    writeIO[0x1B] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2VOFS1(data | 0);
    }
    //400001Ch - BG3HOFS - BG3 X-Offset (W)
    writeIO[0x1C] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3HOFS0(data | 0);
    }
    //400001Dh - BG3HOFS - BG3 X-Offset (W)
    writeIO[0x1D] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3HOFS1(data | 0);
    }
    //400001Eh - BG3VOFS - BG3 Y-Offset (W)
    writeIO[0x1E] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3VOFS0(data | 0);
    }
    //400001Fh - BG3VOFS - BG3 Y-Offset (W)
    writeIO[0x1F] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3VOFS1(data | 0);
    }
    //4000020h - BG2PA - BG2 Rotation/Scaling Parameter A (alias dx) (W)
    writeIO[0x20] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PA0(data | 0);
    }
    //4000021h - BG2PA - BG2 Rotation/Scaling Parameter A (alias dx) (W)
    writeIO[0x21] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PA1(data | 0);
    }
    //4000022h - BG2PB - BG2 Rotation/Scaling Parameter B (alias dmx) (W)
    writeIO[0x22] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PB0(data | 0);
    }
    //4000023h - BG2PB - BG2 Rotation/Scaling Parameter B (alias dmx) (W)
    writeIO[0x23] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PB1(data | 0);
    }
    //4000024h - BG2PC - BG2 Rotation/Scaling Parameter C (alias dy) (W)
    writeIO[0x24] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PC0(data | 0);
    }
    //4000025h - BG2PC - BG2 Rotation/Scaling Parameter C (alias dy) (W)
    writeIO[0x25] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PC1(data | 0);
    }
    //4000026h - BG2PD - BG2 Rotation/Scaling Parameter D (alias dmy) (W)
    writeIO[0x26] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PD0(data | 0);
    }
    //4000027h - BG2PD - BG2 Rotation/Scaling Parameter D (alias dmy) (W)
    writeIO[0x27] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PD1(data | 0);
    }
    //4000028h - BG2X_L - BG2 Reference Point X-Coordinate, lower 16 bit (W)
    writeIO[0x28] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2X_L0(data | 0);
    }
    //4000029h - BG2X_L - BG2 Reference Point X-Coordinate, lower 16 bit (W)
    writeIO[0x29] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2X_L1(data | 0);
    }
    //400002Ah - BG2X_H - BG2 Reference Point X-Coordinate, upper 12 bit (W)
    writeIO[0x2A] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2X_H0(data | 0);
    }
    //400002Bh - BG2X_H - BG2 Reference Point X-Coordinate, upper 12 bit (W)
    writeIO[0x2B] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2X_H1(data | 0);
    }
    //400002Ch - BG2Y_L - BG2 Reference Point Y-Coordinate, lower 16 bit (W)
    writeIO[0x2C] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2Y_L0(data | 0);
    }
    //400002Dh - BG2Y_L - BG2 Reference Point Y-Coordinate, lower 16 bit (W)
    writeIO[0x2D] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2Y_L1(data | 0);
    }
    //400002Eh - BG2Y_H - BG2 Reference Point Y-Coordinate, upper 12 bit (W)
    writeIO[0x2E] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2Y_H0(data | 0);
    }
    //400002Fh - BG2Y_H - BG2 Reference Point Y-Coordinate, upper 12 bit (W)
    writeIO[0x2F] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2Y_H1(data | 0);
    }
    //4000030h - BG3PA - BG3 Rotation/Scaling Parameter A (alias dx) (W)
    writeIO[0x30] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PA0(data | 0);
    }
    //4000031h - BG3PA - BG3 Rotation/Scaling Parameter A (alias dx) (W)
    writeIO[0x31] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PA1(data | 0);
    }
    //4000032h - BG3PB - BG3 Rotation/Scaling Parameter B (alias dmx) (W)
    writeIO[0x32] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PB0(data | 0);
    }
    //4000033h - BG3PB - BG3 Rotation/Scaling Parameter B (alias dmx) (W)
    writeIO[0x33] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PB1(data | 0);
    }
    //4000034h - BG3PC - BG3 Rotation/Scaling Parameter C (alias dy) (W)
    writeIO[0x34] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PC0(data | 0);
    }
    //4000035h - BG3PC - BG3 Rotation/Scaling Parameter C (alias dy) (W)
    writeIO[0x35] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PC1(data | 0);
    }
    //4000036h - BG3PD - BG3 Rotation/Scaling Parameter D (alias dmy) (W)
    writeIO[0x36] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PD0(data | 0);
    }
    //4000037h - BG3PD - BG3 Rotation/Scaling Parameter D (alias dmy) (W)
    writeIO[0x37] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PD1(data | 0);
    }
    //4000038h - BG3X_L - BG3 Reference Point X-Coordinate, lower 16 bit (W)
    writeIO[0x38] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3X_L0(data | 0);
    }
    //4000039h - BG3X_L - BG3 Reference Point X-Coordinate, lower 16 bit (W)
    writeIO[0x39] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3X_L1(data | 0);
    }
    //400003Ah - BG3X_H - BG3 Reference Point X-Coordinate, upper 12 bit (W)
    writeIO[0x3A] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3X_H0(data | 0);
    }
    //400003Bh - BG3X_H - BG3 Reference Point X-Coordinate, upper 12 bit (W)
    writeIO[0x3B] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3X_H1(data | 0);
    }
    //400003Ch - BG3Y_L - BG3 Reference Point Y-Coordinate, lower 16 bit (W)
    writeIO[0x3C] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3Y_L0(data | 0);
    }
    //400003Dh - BGY_L - BG3 Reference Point Y-Coordinate, lower 16 bit (W)
    writeIO[0x3D] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3Y_L1(data | 0);
    }
    //400003Eh - BG3Y_H - BG3 Reference Point Y-Coordinate, upper 12 bit (W)
    writeIO[0x3E] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3Y_H0(data | 0);
    }
    //400003Fh - BG3Y_H - BG3 Reference Point Y-Coordinate, upper 12 bit (W)
    writeIO[0x3F] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3Y_H1(data | 0);
    }
    //4000040h - WIN0H - Window 0 Horizontal Dimensions (W)
    writeIO[0x40] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN0H0(data | 0);
    }
    //4000041h - WIN0H - Window 0 Horizontal Dimensions (W)
    writeIO[0x41] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN0H1(data | 0);
    }
    //4000042h - WIN1H - Window 1 Horizontal Dimensions (W)
    writeIO[0x42] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN1H0(data | 0);
    }
    //4000043h - WIN1H - Window 1 Horizontal Dimensions (W)
    writeIO[0x43] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN1H1(data | 0);
    }
    //4000044h - WIN0V - Window 0 Vertical Dimensions (W)
    writeIO[0x44] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN0V0(data | 0);
    }
    //4000045h - WIN0V - Window 0 Vertical Dimensions (W)
    writeIO[0x45] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN0V1(data | 0);
    }
    //4000046h - WIN1V - Window 1 Vertical Dimensions (W)
    writeIO[0x46] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN1V0(data | 0);
    }
    //4000047h - WIN1V - Window 1 Vertical Dimensions (W)
    writeIO[0x47] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN1V1(data | 0);
    }
    //4000048h - WININ - Control of Inside of Window(s) (R/W)
    writeIO[0x48] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWININ0(data | 0);
    }
    //4000049h - WININ - Control of Inside of Window(s) (R/W)
    writeIO[0x49] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWININ1(data | 0);
    }
    //400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
    writeIO[0x4A] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWINOUT0(data | 0);
    }
    //400004AB- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
    writeIO[0x4B] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWINOUT1(data | 0);
    }
    //400004Ch - MOSAIC - Mosaic Size (W)
    writeIO[0x4C] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeMOSAIC0(data | 0);
    }
    //400004Dh - MOSAIC - Mosaic Size (W)
    writeIO[0x4D] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeMOSAIC1(data | 0);
    }
    //400004Eh - NOT USED - ZERO
    writeIO[0x4E] = this.memory.NOP;
    //400004Fh - NOT USED - ZERO
    writeIO[0x4F] = this.memory.NOP;
    //4000050h - BLDCNT - Color Special Effects Selection (R/W)
    writeIO[0x50] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDCNT0(data | 0);
    }
    //4000051h - BLDCNT - Color Special Effects Selection (R/W)
    writeIO[0x51] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDCNT1(data | 0);
    }
    //4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
    writeIO[0x52] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDALPHA0(data | 0);
    }
    //4000053h - BLDALPHA - Alpha Blending Coefficients (R/W)
    writeIO[0x53] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDALPHA1(data | 0);
    }
    //4000054h - BLDY - Brightness (Fade-In/Out) Coefficient (W)
    writeIO[0x54] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDY(data | 0);
    }
    //4000055h through 400005Fh - NOT USED - ZERO/GLITCHED
    this.fillWriteTableNOP(writeIO, 0x55, 0x5F);
    //4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
    writeIO[0x60] = function (parentObj, data) {
        //NR10:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_L(data | 0);
    }
    //4000061h - NOT USED - ZERO
    writeIO[0x61] = this.memory.NOP;
    //4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
    writeIO[0x62] = function (parentObj, data) {
        //NR11:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_H0(data | 0);
    }
    //4000063h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
    writeIO[0x63] = function (parentObj, data) {
        //NR12:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_H1(data | 0);
    }
    //4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
    writeIO[0x64] = function (parentObj, data) {
        //NR13:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_X0(data | 0);
    }
    //4000065h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
    writeIO[0x65] = function (parentObj, data) {
        //NR14:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_X1(data | 0);
    }
    //4000066h - NOT USED - ZERO
    writeIO[0x66] = this.memory.NOP;
    //4000067h - NOT USED - ZERO
    writeIO[0x67] = this.memory.NOP;
    //4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
    writeIO[0x68] = function (parentObj, data) {
        //NR21:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND2CNT_L0(data | 0);
    }
    //4000069h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
    writeIO[0x69] = function (parentObj, data) {
        //NR22:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND2CNT_L1(data | 0);
    }
    //400006Ah - NOT USED - ZERO
    writeIO[0x6A] = this.memory.NOP;
    //400006Bh - NOT USED - ZERO
    writeIO[0x6B] = this.memory.NOP;
    //400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
    writeIO[0x6C] = function (parentObj, data) {
        //NR23:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND2CNT_H0(data | 0);
    }
    //400006Dh - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
    writeIO[0x6D] = function (parentObj, data) {
        //NR24:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND2CNT_H1(data | 0);
    }
    //400006Eh - NOT USED - ZERO
    writeIO[0x6E] = this.memory.NOP;
    //400006Fh - NOT USED - ZERO
    writeIO[0x6F] = this.memory.NOP;
    //4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
    writeIO[0x70] = function (parentObj, data) {
        //NR30:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_L(data | 0);
    }
    //4000071h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
    writeIO[0x71] = this.memory.NOP;
    //4000072h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
    writeIO[0x72] = function (parentObj, data) {
        //NR31:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_H0(data | 0);
    }
    //4000073h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
    writeIO[0x73] = function (parentObj, data) {
        //NR32:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_H1(data | 0);
    }
    //4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
    writeIO[0x74] = function (parentObj, data) {
        //NR33:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_X0(data | 0);
    }
    //4000075h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
    writeIO[0x75] = function (parentObj, data) {
        //NR34:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_X1(data | 0);
    }
    //4000076h - NOT USED - ZERO
    writeIO[0x76] = this.memory.NOP;
    //4000077h - NOT USED - ZERO
    writeIO[0x77] = this.memory.NOP;
    //4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
    writeIO[0x78] = function (parentObj, data) {
        //NR41:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND4CNT_L0(data | 0);
    }
    //4000079h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
    writeIO[0x79] = function (parentObj, data) {
        //NR42:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND4CNT_L1(data | 0);
    }
    //400007Ah - NOT USED - ZERO
    writeIO[0x7A] = this.memory.NOP;
    //400007Bh - NOT USED - ZERO
    writeIO[0x7B] = this.memory.NOP;
    //400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
    writeIO[0x7C] = function (parentObj, data) {
        //NR43:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND4CNT_H0(data | 0);
    }
    //400007Dh - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
    writeIO[0x7D] = function (parentObj, data) {
        //NR44:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND4CNT_H1(data | 0);
    }
    //400007Eh - NOT USED - ZERO
    writeIO[0x7E] = this.memory.NOP;
    //400007Fh - NOT USED - ZERO
    writeIO[0x7F] = this.memory.NOP;
    //4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
    writeIO[0x80] = function (parentObj, data) {
        //NR50:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_L0(data | 0);
    }
    //4000081h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
    writeIO[0x81] = function (parentObj, data) {
        //NR51:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_L1(data | 0);
    }
    //4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
    writeIO[0x82] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_H0(data | 0);
    }
    //4000083h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
    writeIO[0x83] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_H1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
    writeIO[0x84] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_X(data | 0);
    }
    //4000085h - NOT USED - ZERO
    writeIO[0x85] = this.memory.NOP;
    //4000086h - NOT USED - ZERO
    writeIO[0x86] = this.memory.NOP;
    //4000087h - NOT USED - ZERO
    writeIO[0x87] = this.memory.NOP;
    //4000088h - SOUNDBIAS - Sound PWM Control (R/W)
    writeIO[0x88] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDBIAS0(data | 0);
    }
    //4000089h - SOUNDBIAS - Sound PWM Control (R/W)
    writeIO[0x89] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDBIAS1(data | 0);
    }
    //400008Ah through 400008Fh - NOT USED - ZERO/GLITCHED
    this.fillWriteTableNOP(writeIO, 0x8A, 0x8F);
    //4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x90] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0, data | 0);
    }
    //4000091h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x91] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x1, data | 0);
    }
    //4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x92] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x2, data | 0);
    }
    //4000093h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x93] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x3, data | 0);
    }
    //4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x94] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x4, data | 0);
    }
    //4000095h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x95] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x5, data | 0);
    }
    //4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x96] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x6, data | 0);
    }
    //4000097h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x97] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x7, data | 0);
    }
    //4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x98] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x8, data | 0);
    }
    //4000099h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x99] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x9, data | 0);
    }
    //400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9A] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xA, data | 0);
    }
    //400009Bh - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9B] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xB, data | 0);
    }
    //400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9C] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xC, data | 0);
    }
    //400009Dh - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9D] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xD, data | 0);
    }
    //400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9E] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xE, data | 0);
    }
    //400009Fh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9F] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xF, data | 0);
    }
    //40000A0h - FIFO_A_L - FIFO Channel A First Word (W)
    writeIO[0xA0] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOA(data | 0);
    }
    //40000A1h - FIFO_A_L - FIFO Channel A First Word (W)
    writeIO[0xA1] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOA(data | 0);
    }
    //40000A2h - FIFO_A_H - FIFO Channel A Second Word (W)
    writeIO[0xA2] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOA(data | 0);
    }
    //40000A3h - FIFO_A_H - FIFO Channel A Second Word (W)
    writeIO[0xA3] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOA(data | 0);
    }
    //40000A4h - FIFO_B_L - FIFO Channel B First Word (W)
    writeIO[0xA4] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOB(data | 0);
    }
    //40000A5h - FIFO_B_L - FIFO Channel B First Word (W)
    writeIO[0xA5] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOB(data | 0);
    }
    //40000A6h - FIFO_B_H - FIFO Channel B Second Word (W)
    writeIO[0xA6] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOB(data | 0);
    }
    //40000A7h - FIFO_B_H - FIFO Channel B Second Word (W)
    writeIO[0xA7] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOB(data | 0);
    }
    //40000A8h through 40000AFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0xA8, 0xAF);
    //40000B0h - DMA0SAD - DMA 0 Source Address (W) (internal memory)
    writeIO[0xB0] = function (parentObj, data) {
        parentObj.dma.writeDMASource0(0, data | 0);
    }
    //40000B1h - DMA0SAD - DMA 0 Source Address (W) (internal memory)
    writeIO[0xB1] = function (parentObj, data) {
        parentObj.dma.writeDMASource1(0, data | 0);
    }
    //40000B2h - DMA0SAH - DMA 0 Source Address (W) (internal memory)
    writeIO[0xB2] = function (parentObj, data) {
        parentObj.dma.writeDMASource2(0, data | 0);
    }
    //40000B3h - DMA0SAH - DMA 0 Source Address (W) (internal memory)
    writeIO[0xB3] = function (parentObj, data) {
        parentObj.dma.writeDMASource3(0, data & 0x7);    //Mask out the unused bits.
    }
    //40000B4h - DMA0DAD - DMA 0 Destination Address (W) (internal memory)
    writeIO[0xB4] = function (parentObj, data) {
        parentObj.dma.writeDMADestination0(0, data | 0);
    }
    //40000B5h - DMA0DAD - DMA 0 Destination Address (W) (internal memory)
    writeIO[0xB5] = function (parentObj, data) {
        parentObj.dma.writeDMADestination1(0, data | 0);
    }
    //40000B6h - DMA0DAH - DMA 0 Destination Address (W) (internal memory)
    writeIO[0xB6] = function (parentObj, data) {
        parentObj.dma.writeDMADestination2(0, data | 0);
    }
    //40000B7h - DMA0DAH - DMA 0 Destination Address (W) (internal memory)
    writeIO[0xB7] = function (parentObj, data) {
        parentObj.dma.writeDMADestination3(0, data & 0x7);
    }
    //40000B8h - DMA0CNT_L - DMA 0 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xB8] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount0(0, data | 0);
    }
    //40000B9h - DMA0CNT_L - DMA 0 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xB9] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount1(0, data & 0x3F);
    }
    //40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
    writeIO[0xBA] = function (parentObj, data) {
        parentObj.dma.writeDMAControl0(0, data | 0);
    }
    //40000BBh - DMA0CNT_H - DMA 0 Control (R/W)
    writeIO[0xBB] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(0, data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000BCh - DMA1SAD - DMA 1 Source Address (W) (internal memory)
    writeIO[0xBC] = function (parentObj, data) {
        parentObj.dma.writeDMASource0(1, data | 0);
    }
    //40000BDh - DMA1SAD - DMA 1 Source Address (W) (internal memory)
    writeIO[0xBD] = function (parentObj, data) {
        parentObj.dma.writeDMASource1(1, data | 0);
    }
    //40000BEh - DMA1SAH - DMA 1 Source Address (W) (internal memory)
    writeIO[0xBE] = function (parentObj, data) {
        parentObj.dma.writeDMASource2(1, data | 0);
    }
    //40000BFh - DMA1SAH - DMA 1 Source Address (W) (internal memory)
    writeIO[0xBF] = function (parentObj, data) {
        parentObj.dma.writeDMASource3(1, data & 0xF);    //Mask out the unused bits.
    }
    //40000C0h - DMA1DAD - DMA 1 Destination Address (W) (internal memory)
    writeIO[0xC0] = function (parentObj, data) {
        parentObj.dma.writeDMADestination0(1, data | 0);
    }
    //40000C1h - DMA1DAD - DMA 1 Destination Address (W) (internal memory)
    writeIO[0xC1] = function (parentObj, data) {
        parentObj.dma.writeDMADestination1(1, data | 0);
    }
    //40000C2h - DMA1DAH - DMA 1 Destination Address (W) (internal memory)
    writeIO[0xC2] = function (parentObj, data) {
        parentObj.dma.writeDMADestination2(1, data | 0);
    }
    //40000C3h - DMA1DAH - DMA 1 Destination Address (W) (internal memory)
    writeIO[0xC3] = function (parentObj, data) {
        parentObj.dma.writeDMADestination3(1, data & 0x7);
    }
    //40000C4h - DMA1CNT_L - DMA 1 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xC4] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount0(1, data | 0);
    }
    //40000C5h - DMA1CNT_L - DMA 1 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xC5] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount1(1, data & 0x3F);
    }
    //40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
    writeIO[0xC6] = function (parentObj, data) {
        parentObj.dma.writeDMAControl0(1, data | 0);
    }
    //40000C7h - DMA1CNT_H - DMA 1 Control (R/W)
    writeIO[0xC7] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(1, data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000C8h - DMA2SAD - DMA 2 Source Address (W) (internal memory)
    writeIO[0xC8] = function (parentObj, data) {
        parentObj.dma.writeDMASource0(2, data | 0);
    }
    //40000C9h - DMA2SAD - DMA 2 Source Address (W) (internal memory)
    writeIO[0xC9] = function (parentObj, data) {
        parentObj.dma.writeDMASource1(2, data | 0);
    }
    //40000CAh - DMA2SAH - DMA 2 Source Address (W) (internal memory)
    writeIO[0xCA] = function (parentObj, data) {
        parentObj.dma.writeDMASource2(2, data | 0);
    }
    //40000CBh - DMA2SAH - DMA 2 Source Address (W) (internal memory)
    writeIO[0xCB] = function (parentObj, data) {
        parentObj.dma.writeDMASource3(2, data & 0xF);    //Mask out the unused bits.
    }
    //40000CCh - DMA2DAD - DMA 2 Destination Address (W) (internal memory)
    writeIO[0xCC] = function (parentObj, data) {
        parentObj.dma.writeDMADestination0(2, data | 0);
    }
    //40000CDh - DMA2DAD - DMA 2 Destination Address (W) (internal memory)
    writeIO[0xCD] = function (parentObj, data) {
        parentObj.dma.writeDMADestination1(2, data | 0);
    }
    //40000CEh - DMA2DAH - DMA 2 Destination Address (W) (internal memory)
    writeIO[0xCE] = function (parentObj, data) {
        parentObj.dma.writeDMADestination2(2, data | 0);
    }
    //40000CFh - DMA2DAH - DMA 2 Destination Address (W) (internal memory)
    writeIO[0xCF] = function (parentObj, data) {
        parentObj.dma.writeDMADestination3(2, data & 0x7);
    }
    //40000D0h - DMA2CNT_L - DMA 2 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xD0] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount0(2, data | 0);
    }
    //40000D1h - DMA2CNT_L - DMA 2 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xD1] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount1(2, data & 0x3F);
    }
    //40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
    writeIO[0xD2] = function (parentObj, data) {
        parentObj.dma.writeDMAControl0(2, data | 0);
    }
    //40000D3h - DMA2CNT_H - DMA 2 Control (R/W)
    writeIO[0xD3] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(2, data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000D4h - DMA3SAD - DMA 3 Source Address (W) (internal memory)
    writeIO[0xD4] = function (parentObj, data) {
        parentObj.dma.writeDMASource0(3, data | 0);
    }
    //40000D5h - DMA3SAD - DMA 3 Source Address (W) (internal memory)
    writeIO[0xD5] = function (parentObj, data) {
        parentObj.dma.writeDMASource1(3, data | 0);
    }
    //40000D6h - DMA3SAH - DMA 3 Source Address (W) (internal memory)
    writeIO[0xD6] = function (parentObj, data) {
        parentObj.dma.writeDMASource2(3, data | 0);
    }
    //40000D7h - DMA3SAH - DMA 3 Source Address (W) (internal memory)
    writeIO[0xD7] = function (parentObj, data) {
        parentObj.dma.writeDMASource3(3, data & 0xF);    //Mask out the unused bits.
    }
    //40000D8h - DMA3DAD - DMA 3 Destination Address (W) (internal memory)
    writeIO[0xD8] = function (parentObj, data) {
        parentObj.dma.writeDMADestination0(3, data | 0);
    }
    //40000D9h - DMA3DAD - DMA 3 Destination Address (W) (internal memory)
    writeIO[0xD9] = function (parentObj, data) {
        parentObj.dma.writeDMADestination1(3, data | 0);
    }
    //40000DAh - DMA3DAH - DMA 3 Destination Address (W) (internal memory)
    writeIO[0xDA] = function (parentObj, data) {
        parentObj.dma.writeDMADestination2(3, data | 0);
    }
    //40000DBh - DMA3DAH - DMA 3 Destination Address (W) (internal memory)
    writeIO[0xDB] = function (parentObj, data) {
        parentObj.dma.writeDMADestination3(3, data & 0xF);
    }
    //40000DCh - DMA3CNT_L - DMA 3 Word Count (W) (16 bit, 1..10000h)
    writeIO[0xDC] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount0(3, data | 0);
    }
    //40000DDh - DMA3CNT_L - DMA 3 Word Count (W) (16 bit, 1..10000h)
    writeIO[0xDD] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount1(3, data | 0);
    }
    //40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
    writeIO[0xDE] = function (parentObj, data) {
        parentObj.dma.writeDMAControl0(3, data | 0);
    }
    //40000DFh - DMA3CNT_H - DMA 3 Control (R/W)
    writeIO[0xDF] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(3, data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000E0h through 40000FFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0xE0, 0xFF);
    //4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
    writeIO[0x100] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM0CNT_L0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000101h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
    writeIO[0x101] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM0CNT_L1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000102h - TM0CNT_H - Timer 0 Control (R/W)
    writeIO[0x102] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM0CNT_H(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000103h - TM0CNT_H - Timer 0 Control (R/W)
    writeIO[0x103] = this.memory.NOP;
    //4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
    writeIO[0x104] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM1CNT_L0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000105h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
    writeIO[0x105] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM1CNT_L1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000106h - TM1CNT_H - Timer 1 Control (R/W)
    writeIO[0x106] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM1CNT_H(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000107h - TM1CNT_H - Timer 1 Control (R/W)
    writeIO[0x107] = this.memory.NOP;
    //4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
    writeIO[0x108] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM2CNT_L0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000109h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
    writeIO[0x109] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM2CNT_L1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Ah - TM2CNT_H - Timer 2 Control (R/W)
    writeIO[0x10A] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM2CNT_H(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Bh - TM2CNT_H - Timer 2 Control (R/W)
    writeIO[0x10B] = this.memory.NOP;
    //400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
    writeIO[0x10C] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM3CNT_L0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Dh - TM3CNT_L - Timer 3 Counter/Reload (R/W)
    writeIO[0x10D] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM3CNT_L1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Eh - TM3CNT_H - Timer 3 Control (R/W)
    writeIO[0x10E] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM3CNT_H(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Fh - TM3CNT_H - Timer 3 Control (R/W)
    writeIO[0x10F] = this.memory.NOP;
    //4000110h through 400011Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x110, 0x11F);
    //4000120h - Serial Data A (R/W)
    writeIO[0x120] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_A0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000121h - Serial Data A (R/W)
    writeIO[0x121] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_A1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000122h - Serial Data B (R/W)
    writeIO[0x122] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_B0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000123h - Serial Data B (R/W)
    writeIO[0x123] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_B1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000124h - Serial Data C (R/W)
    writeIO[0x124] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_C0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000125h - Serial Data C (R/W)
    writeIO[0x125] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_C1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000126h - Serial Data D (R/W)
    writeIO[0x126] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_D0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000127h - Serial Data D (R/W)
    writeIO[0x127] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_D1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000128h - SIOCNT - SIO Sub Mode Control (R/W)
    writeIO[0x128] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIOCNT0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000129h - SIOCNT - SIO Sub Mode Control (R/W)
    writeIO[0x129] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIOCNT1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400012Ah - SIOMLT_SEND - Data Send Register (R/W)
    writeIO[0x12A] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA8_0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400012Bh - SIOMLT_SEND - Data Send Register (R/W)
    writeIO[0x12B] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA8_1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400012Ch through 400012Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x12C, 0x12F);
    //4000130h - KEYINPUT - Key Status (R)
    writeIO[0x130] = this.memory.NOP;
    //4000131h - KEYINPUT - Key Status (R)
    writeIO[0x131] = this.memory.NOP;
    //4000132h - KEYCNT - Key Interrupt Control (R/W)
    writeIO[0x132] = function (parentObj, data) {
        parentObj.joypad.writeKeyControl0(data | 0);
    }
    //4000133h - KEYCNT - Key Interrupt Control (R/W)
    writeIO[0x133] = function (parentObj, data) {
        parentObj.joypad.writeKeyControl1(data | 0);
    }
    //4000134h - RCNT (R/W) - Mode Selection
    writeIO[0x134] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeRCNT0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000135h - RCNT (R/W) - Mode Selection
    writeIO[0x135] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeRCNT1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000136h through 400013Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x136, 0x13F);
    //4000140h - JOYCNT - JOY BUS Control Register (R/W)
    writeIO[0x140] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYCNT(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000141h - JOYCNT - JOY BUS Control Register (R/W)
    writeIO[0x141] = this.memory.NOP;
    //4000142h through 400014Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x142, 0x14F);
    //4000150h - JoyBus Receive (R/W)
    writeIO[0x150] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_RECV0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000151h - JoyBus Receive (R/W)
    writeIO[0x151] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_RECV1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000152h - JoyBus Receive (R/W)
    writeIO[0x152] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_RECV2(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000153h - JoyBus Receive (R/W)
    writeIO[0x153] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_RECV3(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000154h - JoyBus Send (R/W)
    writeIO[0x154] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_SEND0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000155h - JoyBus Send (R/W)
    writeIO[0x155] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_SEND1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000156h - JoyBus Send (R/W)
    writeIO[0x156] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_SEND2(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000157h - JoyBus Send (R/W)
    writeIO[0x157] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_SEND3(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000158h - JoyBus Stat (R/W)
    writeIO[0x158] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_STAT(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000159h through 40001FFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x159, 0x1FF);
    //4000200h - IE - Interrupt Enable Register (R/W)
    writeIO[0x200] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIE0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000201h - IE - Interrupt Enable Register (R/W)
    writeIO[0x201] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIE1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
    writeIO[0x202] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIF0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000203h - IF - Interrupt Request Flags / IRQ Acknowledge
    writeIO[0x203] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIF1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000204h - WAITCNT - Waitstate Control (R/W)
    writeIO[0x204] = function (parentObj, data) {
        parentObj.wait.writeWAITCNT0(data | 0);
    }
    //4000205h - WAITCNT - Waitstate Control (R/W)
    writeIO[0x205] = function (parentObj, data) {
        parentObj.wait.writeWAITCNT1(data | 0);
    }
    //4000206h - WAITCNT - Waitstate Control (R/W)
    writeIO[0x206] = this.memory.NOP;
    //4000207h - WAITCNT - Waitstate Control (R/W)
    writeIO[0x207] = this.memory.NOP;
    //4000208h - IME - Interrupt Master Enable Register (R/W)
    writeIO[0x208] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIME(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000209h through 40002FFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x209, 0x2FF);
    //4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
    writeIO[0x300] = function (parentObj, data) {
        parentObj.wait.writePOSTBOOT(data | 0);
    }
    //4000301h - HALTCNT - BYTE - Undocumented - Low Power Mode Control (W)
    writeIO[0x301] = function (parentObj, data) {
        parentObj.wait.writeHALTCNT(data | 0);
    }
    return writeIO;
}
GameBoyAdvanceMemoryDispatchGenerator.prototype.generateMemoryWriteIO16 = function () {
    var writeIO = [];
    //4000000h - DISPCNT - LCD Control (Read/Write)
    writeIO[0] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeDISPCNT0(data & 0xFF);
        parentObj.gfx.writeDISPCNT1(data >> 8);
    }
    //4000002h - Undocumented - Green Swap (R/W)
    writeIO[0x2 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeGreenSwap(data & 0xFF);
    }
    //4000004h - DISPSTAT - General LCD Status (Read/Write)
    writeIO[0x4 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeDISPSTAT0(data & 0xFF);
        parentObj.gfx.writeDISPSTAT1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000006h - VCOUNT - Vertical Counter (Read only)
    writeIO[0x6 >> 1] = this.memory.NOP;
    //4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
    writeIO[0x8 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0CNT0(data & 0xFF);
        parentObj.gfx.writeBG0CNT1(data >> 8);
    }
    //400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
    writeIO[0xA >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1CNT0(data & 0xFF);
        parentObj.gfx.writeBG1CNT1(data >> 8);
    }
    //400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
    writeIO[0xC >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2CNT0(data & 0xFF);
        parentObj.gfx.writeBG2CNT1(data >> 8);
    }
    //400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
    writeIO[0xE >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3CNT0(data & 0xFF);
        parentObj.gfx.writeBG3CNT1(data >> 8);
    }
    //4000010h - BG0HOFS - BG0 X-Offset (W)
    writeIO[0x10 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0HOFS0(data & 0xFF);
        parentObj.gfx.writeBG0HOFS1(data >> 8);
    }
    //4000012h - BG0VOFS - BG0 Y-Offset (W)
    writeIO[0x12 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0VOFS0(data & 0xFF);
        parentObj.gfx.writeBG0VOFS1(data >> 8);
    }
    //4000014h - BG1HOFS - BG1 X-Offset (W)
    writeIO[0x14 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1HOFS0(data & 0xFF);
        parentObj.gfx.writeBG1HOFS1(data >> 8);
    }
    //4000016h - BG1VOFS - BG1 Y-Offset (W)
    writeIO[0x16 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1VOFS0(data & 0xFF);
        parentObj.gfx.writeBG1VOFS1(data >> 8);
    }
    //4000018h - BG2HOFS - BG2 X-Offset (W)
    writeIO[0x18 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2HOFS0(data & 0xFF);
        parentObj.gfx.writeBG2HOFS1(data >> 8);
    }
    //400001Ah - BG2VOFS - BG2 Y-Offset (W)
    writeIO[0x1A >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2VOFS0(data & 0xFF);
        parentObj.gfx.writeBG2VOFS1(data >> 8);
    }
    //400001Ch - BG3HOFS - BG3 X-Offset (W)
    writeIO[0x1C >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3HOFS0(data & 0xFF);
        parentObj.gfx.writeBG3HOFS1(data >> 8);
    }
    //400001Eh - BG3VOFS - BG3 Y-Offset (W)
    writeIO[0x1E >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3VOFS0(data & 0xFF);
        parentObj.gfx.writeBG3VOFS1(data >> 8);
    }
    //4000020h - BG2PA - BG2 Rotation/Scaling Parameter A (alias dx) (W)
    writeIO[0x20 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PA0(data & 0xFF);
        parentObj.gfx.writeBG2PA1(data >> 8);
    }
    //4000022h - BG2PB - BG2 Rotation/Scaling Parameter B (alias dmx) (W)
    writeIO[0x22 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PB0(data & 0xFF);
        parentObj.gfx.writeBG2PB1(data >> 8);
    }
    //4000024h - BG2PC - BG2 Rotation/Scaling Parameter C (alias dy) (W)
    writeIO[0x24 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PC0(data & 0xFF);
        parentObj.gfx.writeBG2PC1(data >> 8);
    }
    //4000026h - BG2PD - BG2 Rotation/Scaling Parameter D (alias dmy) (W)
    writeIO[0x26 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PD0(data & 0xFF);
        parentObj.gfx.writeBG2PD1(data >> 8);
    }
    //4000028h - BG2X_L - BG2 Reference Point X-Coordinate, lower 16 bit (W)
    writeIO[0x28 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2X_L0(data & 0xFF);
        parentObj.gfx.writeBG2X_L1(data >> 8);
    }
    //400002Ah - BG2X_H - BG2 Reference Point X-Coordinate, upper 12 bit (W)
    writeIO[0x2A >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2X_H0(data & 0xFF);
        parentObj.gfx.writeBG2X_H1(data >> 8);
    }
    //400002Ch - BG2Y_L - BG2 Reference Point Y-Coordinate, lower 16 bit (W)
    writeIO[0x2C >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2Y_L0(data & 0xFF);
        parentObj.gfx.writeBG2Y_L1(data >> 8);
    }
    //400002Eh - BG2Y_H - BG2 Reference Point Y-Coordinate, upper 12 bit (W)
    writeIO[0x2E >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2Y_H0(data & 0xFF);
        parentObj.gfx.writeBG2Y_H1(data >> 8);
    }
    //4000030h - BG3PA - BG3 Rotation/Scaling Parameter A (alias dx) (W)
    writeIO[0x30 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PA0(data & 0xFF);
        parentObj.gfx.writeBG3PA1(data >> 8);
    }
    //4000032h - BG3PB - BG3 Rotation/Scaling Parameter B (alias dmx) (W)
    writeIO[0x32 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PB0(data & 0xFF);
        parentObj.gfx.writeBG3PB1(data >> 8);
    }
    //4000034h - BG3PC - BG3 Rotation/Scaling Parameter C (alias dy) (W)
    writeIO[0x34 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PC0(data & 0xFF);
        parentObj.gfx.writeBG3PC1(data >> 8);
    }
    //4000036h - BG3PD - BG3 Rotation/Scaling Parameter D (alias dmy) (W)
    writeIO[0x36 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PD0(data & 0xFF);
        parentObj.gfx.writeBG3PD1(data >> 8);
    }
    //4000038h - BG3X_L - BG3 Reference Point X-Coordinate, lower 16 bit (W)
    writeIO[0x38 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3X_L0(data & 0xFF);
        parentObj.gfx.writeBG3X_L1(data >> 8);
    }
    //400003Ah - BG3X_H - BG3 Reference Point X-Coordinate, upper 12 bit (W)
    writeIO[0x3A >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3X_H0(data & 0xFF);
        parentObj.gfx.writeBG3X_H1(data >> 8);
    }
    //400003Ch - BG3Y_L - BG3 Reference Point Y-Coordinate, lower 16 bit (W)
    writeIO[0x3C >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3Y_L0(data & 0xFF);
        parentObj.gfx.writeBG3Y_L1(data >> 8);
    }
    //400003Eh - BG3Y_H - BG3 Reference Point Y-Coordinate, upper 12 bit (W)
    writeIO[0x3E >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3Y_H0(data & 0xFF);
        parentObj.gfx.writeBG3Y_H1(data >> 8);
    }
    //4000040h - WIN0H - Window 0 Horizontal Dimensions (W)
    writeIO[0x40 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN0H0(data & 0xFF);
        parentObj.gfx.writeWIN0H1(data >> 8);
    }
    //4000042h - WIN1H - Window 1 Horizontal Dimensions (W)
    writeIO[0x42 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN1H0(data & 0xFF);
        parentObj.gfx.writeWIN1H1(data >> 8);
    }
    //4000044h - WIN0V - Window 0 Vertical Dimensions (W)
    writeIO[0x44 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN0V0(data & 0xFF);
        parentObj.gfx.writeWIN0V1(data >> 8);
    }
    //4000046h - WIN1V - Window 1 Vertical Dimensions (W)
    writeIO[0x46 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN1V0(data & 0xFF);
        parentObj.gfx.writeWIN1V1(data >> 8);
    }
    //4000048h - WININ - Control of Inside of Window(s) (R/W)
    writeIO[0x48 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWININ0(data & 0xFF);
        parentObj.gfx.writeWININ1(data >> 8);
    }
    //400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
    writeIO[0x4A >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWINOUT0(data & 0xFF);
        parentObj.gfx.writeWINOUT1(data >> 8);
    }
    //400004Ch - MOSAIC - Mosaic Size (W)
    writeIO[0x4C >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeMOSAIC0(data & 0xFF);
        parentObj.gfx.writeMOSAIC1(data >> 8);
    }
    //400004Eh - NOT USED - ZERO
    writeIO[0x4E >> 1] = this.memory.NOP;
    //4000050h - BLDCNT - Color Special Effects Selection (R/W)
    writeIO[0x50 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDCNT0(data & 0xFF);
        parentObj.gfx.writeBLDCNT1(data >> 8);
    }
    //4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
    writeIO[0x52 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDALPHA0(data & 0xFF);
        parentObj.gfx.writeBLDALPHA1(data >> 8);
    }
    //4000054h - BLDY - Brightness (Fade-In/Out) Coefficient (W)
    writeIO[0x54 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDY(data & 0xFF);
    }
    //4000055h through 400005Fh - NOT USED - ZERO/GLITCHED
    this.fillWriteTableNOP(writeIO, 0x56 >> 1, 0x5E >> 1);
    //4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
    writeIO[0x60 >> 1] = function (parentObj, data) {
        //NR10:
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_L(data & 0xFF);
    }
    //4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
    writeIO[0x62 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR11:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_H0(data & 0xFF);
        //NR12:
        parentObj.sound.writeSOUND1CNT_H1(data >> 8);
    }
    //4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
    writeIO[0x64 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR13:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_X0(data & 0xFF);
        //NR14:
        parentObj.sound.writeSOUND1CNT_X1(data >> 8);
    }
    //4000066h - NOT USED - ZERO
    writeIO[0x66 >> 1] = this.memory.NOP;
    //4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
    writeIO[0x68 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR21:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND2CNT_L0(data & 0xFF);
        //NR22:
        parentObj.sound.writeSOUND2CNT_L1(data >> 8);
    }
    //400006Ah - NOT USED - ZERO
    writeIO[0x6A >> 1] = this.memory.NOP;
    //400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
    writeIO[0x6C >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR23:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND2CNT_H0(data & 0xFF);
        //NR24:
        parentObj.sound.writeSOUND2CNT_H1(data >> 8);
    }
    //400006Eh - NOT USED - ZERO
    writeIO[0x6E >> 1] = this.memory.NOP;
    //4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
    writeIO[0x70 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR30:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_L(data & 0xFF);
    }
    //4000072h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
    writeIO[0x72 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR31:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_H0(data & 0xFF);
        //NR32:
        parentObj.sound.writeSOUND3CNT_H1(data >> 8);
    }
    //4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
    writeIO[0x74 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR33:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_X0(data & 0xFF);
        //NR34:
        parentObj.sound.writeSOUND3CNT_X1(data >> 8);
    }
    //4000076h - NOT USED - ZERO
    writeIO[0x76 >> 1] = this.memory.NOP;
    //4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
    writeIO[0x78 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR41:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND4CNT_L0(data & 0xFF);
        //NR42:
        parentObj.sound.writeSOUND4CNT_L1(data >> 8);
    }
    //400007Ah - NOT USED - ZERO
    writeIO[0x7A >> 1] = this.memory.NOP;
    //400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
    writeIO[0x7C >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR43:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND4CNT_H0(data & 0xFF);
        //NR44:
        parentObj.sound.writeSOUND4CNT_H1(data >> 8);
    }
    //400007Eh - NOT USED - ZERO
    writeIO[0x7E >> 1] = this.memory.NOP;
    //4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
    writeIO[0x80 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR50:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_L0(data & 0xFF);
        //NR51:
        parentObj.sound.writeSOUNDCNT_L1(data >> 8);
    }
    //4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
    writeIO[0x82 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_H0(data & 0xFF);
        parentObj.sound.writeSOUNDCNT_H1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
    writeIO[0x84 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_X(data & 0xFF);
    }
    //4000086h - NOT USED - ZERO
    writeIO[0x86 >> 1] = this.memory.NOP;
    //4000088h - SOUNDBIAS - Sound PWM Control (R/W)
    writeIO[0x88 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDBIAS0(data & 0xFF);
        parentObj.sound.writeSOUNDBIAS1(data >> 8);
    }
    //400008Ah through 400008Fh - NOT USED - ZERO/GLITCHED
    this.fillWriteTableNOP(writeIO, 0x8A >> 1, 0x8E >> 1);
    //4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x90 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0, data & 0xFF);
        parentObj.sound.writeWAVE(0x1, data >> 8);
    }
    //4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x92 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x2, data & 0xFF);
        parentObj.sound.writeWAVE(0x3, data >> 8);
    }
    //4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x94 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x4, data & 0xFF);
        parentObj.sound.writeWAVE(0x5, data >> 8);
    }
    //4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x96 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x6, data & 0xFF);
        parentObj.sound.writeWAVE(0x7, data >> 8);
    }
    //4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x98 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x8, data & 0xFF);
        parentObj.sound.writeWAVE(0x9, data >> 8);
    }
    //400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9A >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xA, data & 0xFF);
        parentObj.sound.writeWAVE(0xB, data >> 8);
    }
    //400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9C >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xC, data & 0xFF);
        parentObj.sound.writeWAVE(0xD, data >> 8);
    }
    //400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9E >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xE, data & 0xFF);
        parentObj.sound.writeWAVE(0xF, data >> 8);
    }
    //40000A0h - FIFO_A_L - FIFO Channel A First Word (W)
    writeIO[0xA0 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOA(data & 0xFF);
        parentObj.sound.writeFIFOA(data >> 8);
    }
    //40000A2h - FIFO_A_H - FIFO Channel A Second Word (W)
    writeIO[0xA2 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOA(data & 0xFF);
        parentObj.sound.writeFIFOA(data >> 8);
    }
    //40000A4h - FIFO_B_L - FIFO Channel B First Word (W)
    writeIO[0xA4 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOB(data & 0xFF);
        parentObj.sound.writeFIFOB(data >> 8);
    }
    //40000A6h - FIFO_B_H - FIFO Channel B Second Word (W)
    writeIO[0xA6 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOB(data & 0xFF);
        parentObj.sound.writeFIFOB(data >> 8);
    }
    //40000A8h through 40000AFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0xA8 >> 1, 0xAE >> 1);
    //40000B0h - DMA0SAD - DMA 0 Source Address (W) (internal memory)
    writeIO[0xB0 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource0(0, data & 0xFF);
        parentObj.dma.writeDMASource1(0, data >> 8);
    }
    //40000B2h - DMA0SAH - DMA 0 Source Address (W) (internal memory)
    writeIO[0xB2 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource2(0, data & 0xFF);
        parentObj.dma.writeDMASource3(0, (data >> 8) & 0x7);    //Mask out the unused bits.
    }
    //40000B4h - DMA0DAD - DMA 0 Destination Address (W) (internal memory)
    writeIO[0xB4 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination0(0, data & 0xFF);
        parentObj.dma.writeDMADestination1(0, data >> 8);
    }
    //40000B6h - DMA0DAH - DMA 0 Destination Address (W) (internal memory)
    writeIO[0xB6 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination2(0, data & 0xFF);
        parentObj.dma.writeDMADestination3(0, (data >> 8) & 0x7);
    }
    //40000B8h - DMA0CNT_L - DMA 0 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xB8 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAWordCount0(0, data & 0xFF);
        parentObj.dma.writeDMAWordCount1(0, (data >> 8) & 0x3F);
    }
    //40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
    writeIO[0xBA >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAControl0(0, data & 0xFF);
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(0, data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000BCh - DMA1SAD - DMA 1 Source Address (W) (internal memory)
    writeIO[0xBC >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource0(1, data & 0xFF);
        parentObj.dma.writeDMASource1(1, data >> 8);
    }
    //40000BEh - DMA1SAH - DMA 1 Source Address (W) (internal memory)
    writeIO[0xBE >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource2(1, data & 0xFF);
        parentObj.dma.writeDMASource3(1, (data >> 8) & 0xF);    //Mask out the unused bits.
    }
    //40000C0h - DMA1DAD - DMA 1 Destination Address (W) (internal memory)
    writeIO[0xC0 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination0(1, data & 0xFF);
        parentObj.dma.writeDMADestination1(1, data >> 8);
    }
    //40000C2h - DMA1DAH - DMA 1 Destination Address (W) (internal memory)
    writeIO[0xC2 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination2(1, data & 0xFF);
        parentObj.dma.writeDMADestination3(1, (data >> 8) & 0x7);
    }
    //40000C4h - DMA1CNT_L - DMA 1 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xC4 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAWordCount0(1, data & 0xFF);
        parentObj.dma.writeDMAWordCount1(1, (data >> 8) & 0x3F);
    }
    //40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
    writeIO[0xC6 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAControl0(1, data & 0xFF);
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(1, data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000C8h - DMA2SAD - DMA 2 Source Address (W) (internal memory)
    writeIO[0xC8 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource0(2, data & 0xFF);
        parentObj.dma.writeDMASource1(2, data >> 8);
    }
    //40000CAh - DMA2SAH - DMA 2 Source Address (W) (internal memory)
    writeIO[0xCA >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource2(2, data & 0xFF);
        parentObj.dma.writeDMASource3(2, (data >> 8) & 0xF);    //Mask out the unused bits.
    }
    //40000CCh - DMA2DAD - DMA 2 Destination Address (W) (internal memory)
    writeIO[0xCC >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination0(2, data & 0xFF);
        parentObj.dma.writeDMADestination1(2, data >> 8);
    }
    //40000CEh - DMA2DAH - DMA 2 Destination Address (W) (internal memory)
    writeIO[0xCE >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination2(2, data & 0xFF);
        parentObj.dma.writeDMADestination3(2, (data >> 8) & 0x7);
    }
    //40000D0h - DMA2CNT_L - DMA 2 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xD0 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAWordCount0(2, data & 0xFF);
        parentObj.dma.writeDMAWordCount1(2, (data >> 8) & 0x3F);
    }
    //40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
    writeIO[0xD2 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAControl0(2, data & 0xFF);
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(2, data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000D4h - DMA3SAD - DMA 3 Source Address (W) (internal memory)
    writeIO[0xD4 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource0(3, data & 0xFF);
        parentObj.dma.writeDMASource1(3, data >> 8);
    }
    //40000D6h - DMA3SAH - DMA 3 Source Address (W) (internal memory)
    writeIO[0xD6 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource2(3, data & 0xFF);
        parentObj.dma.writeDMASource3(3, (data >> 8) & 0xF);    //Mask out the unused bits.
    }
    //40000D8h - DMA3DAD - DMA 3 Destination Address (W) (internal memory)
    writeIO[0xD8 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination0(3, data & 0xFF);
        parentObj.dma.writeDMADestination1(3, data >> 8);
    }
    //40000DAh - DMA3DAH - DMA 3 Destination Address (W) (internal memory)
    writeIO[0xDA >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination2(3, data & 0xFF);
        parentObj.dma.writeDMADestination3(3, (data >> 8) & 0xF);
    }
    //40000DCh - DMA3CNT_L - DMA 3 Word Count (W) (16 bit, 1..10000h)
    writeIO[0xDC >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAWordCount0(3, data & 0xFF);
        parentObj.dma.writeDMAWordCount1(3, data >> 8);
    }
    //40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
    writeIO[0xDE >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAControl0(3, data & 0xFF);
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(3, data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000E0h through 40000FFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0xE0 >> 1, 0xFE >> 1);
    //4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
    writeIO[0x100 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM0CNT_L0(data & 0xFF);
        parentObj.timer.writeTM0CNT_L1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000102h - TM0CNT_H - Timer 0 Control (R/W)
    writeIO[0x102 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM0CNT_H(data & 0xFF);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
    writeIO[0x104 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM1CNT_L0(data & 0xFF);
        parentObj.timer.writeTM1CNT_L1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000106h - TM1CNT_H - Timer 1 Control (R/W)
    writeIO[0x106 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM1CNT_H(data & 0xFF);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
    writeIO[0x108 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM2CNT_L0(data & 0xFF);
        parentObj.timer.writeTM2CNT_L1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Ah - TM2CNT_H - Timer 2 Control (R/W)
    writeIO[0x10A >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM2CNT_H(data & 0xFF);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
    writeIO[0x10C >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM3CNT_L0(data & 0xFF);
        parentObj.timer.writeTM3CNT_L1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Eh - TM3CNT_H - Timer 3 Control (R/W)
    writeIO[0x10E >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM3CNT_H(data & 0xFF);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000110h through 400011Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x110 >> 1, 0x11E >> 1);
    //4000120h - Serial Data A (R/W)
    writeIO[0x120 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_A0(data & 0xFF);
        parentObj.serial.writeSIODATA_A1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000122h - Serial Data B (R/W)
    writeIO[0x122 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_B0(data & 0xFF);
        parentObj.serial.writeSIODATA_B1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000124h - Serial Data C (R/W)
    writeIO[0x124 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_C0(data & 0xFF);
        parentObj.serial.writeSIODATA_C1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000126h - Serial Data D (R/W)
    writeIO[0x126 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_D0(data & 0xFF);
        parentObj.serial.writeSIODATA_D1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000128h - SIOCNT - SIO Sub Mode Control (R/W)
    writeIO[0x128 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIOCNT0(data & 0xFF);
        parentObj.serial.writeSIOCNT1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400012Ah - SIOMLT_SEND - Data Send Register (R/W)
    writeIO[0x12A >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA8_0(data & 0xFF);
        parentObj.serial.writeSIODATA8_1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400012Ch through 400012Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x12C >> 1, 0x12E >> 1);
    //4000130h - KEYINPUT - Key Status (R)
    writeIO[0x130 >> 1] = this.memory.NOP;
    //4000132h - KEYCNT - Key Interrupt Control (R/W)
    writeIO[0x132 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.joypad.writeKeyControl0(data & 0xFF);
        parentObj.joypad.writeKeyControl1(data >> 8);
    }
    //4000134h - RCNT (R/W) - Mode Selection
    writeIO[0x134 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeRCNT0(data & 0xFF);
        parentObj.serial.writeRCNT1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000136h through 400013Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x136 >> 1, 0x13E >> 1);
    //4000140h - JOYCNT - JOY BUS Control Register (R/W)
    writeIO[0x140 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYCNT(data & 0xFF);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000142h through 400014Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x142 >> 1, 0x14E >> 1);
    //4000150h - JoyBus Receive (R/W)
    writeIO[0x150 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_RECV0(data & 0xFF);
        parentObj.serial.writeJOYBUS_RECV1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000152h - JoyBus Receive (R/W)
    writeIO[0x152 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_RECV2(data & 0xFF);
        parentObj.serial.writeJOYBUS_RECV3(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000154h - JoyBus Send (R/W)
    writeIO[0x154 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_SEND0(data & 0xFF);
        parentObj.serial.writeJOYBUS_SEND1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000156h - JoyBus Send (R/W)
    writeIO[0x156 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_SEND2(data & 0xFF);
        parentObj.serial.writeJOYBUS_SEND3(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000158h - JoyBus Stat (R/W)
    writeIO[0x158 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_STAT(data & 0xFF);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000159h through 40001FFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x15A >> 1, 0x1FE >> 1);
    //4000200h - IE - Interrupt Enable Register (R/W)
    writeIO[0x200 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIE0(data & 0xFF);
        parentObj.irq.writeIE1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
    writeIO[0x202 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIF0(data & 0xFF);
        parentObj.irq.writeIF1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000204h - WAITCNT - Waitstate Control (R/W)
    writeIO[0x204 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.wait.writeWAITCNT0(data & 0xFF);
        parentObj.wait.writeWAITCNT1(data >> 8);
    }
    //4000206h - WAITCNT - Waitstate Control (R/W)
    writeIO[0x206 >> 1] = this.memory.NOP;
    //4000208h - IME - Interrupt Master Enable Register (R/W)
    writeIO[0x208 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIME(data & 0xFF);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000209h through 40002FFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x20A >> 1, 0x2FE >> 1);
    //4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
    writeIO[0x300 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.wait.writePOSTBOOT(data & 0xFF);
        parentObj.wait.writeHALTCNT(data >> 8);
    }
    return writeIO;
}
GameBoyAdvanceMemoryDispatchGenerator.prototype.fillWriteTableNOP = function (writeIO, from, to) {
    //Fill in slots of the i/o write table:
    while (from <= to) {
        writeIO[from++] = this.memory.NOP;
    }
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceDMA0(dma) {
    this.DMACore = dma;
    this.initialize();
}
GameBoyAdvanceDMA0.prototype.DMA_ENABLE_TYPE = [            //DMA Channel 0 Mapping:
    0x1,
    0x2,
    0x4,
    0
];
GameBoyAdvanceDMA0.prototype.DMA_REQUEST_TYPE = {
    PROHIBITED:     0,
    IMMEDIATE:      0x1,
    V_BLANK:        0x2,
    H_BLANK:        0x4
}
GameBoyAdvanceDMA0.prototype.initialize = function () {
    this.enabled = 0;
    this.pending = 0;
    this.source = 0;
    this.sourceShadow = 0;
    this.destination = 0;
    this.destinationShadow = 0;
    this.wordCount = 0;
    this.wordCountShadow = 0;
    this.irqFlagging = 0;
    this.dmaType = 0;
    this.is32Bit = 0;
    this.repeat = 0;
    this.sourceControl = 0;
    this.destinationControl = 0;
    this.memory = this.DMACore.IOCore.memory;
}
GameBoyAdvanceDMA0.prototype.writeDMASource0 = function (data) {
    data = data | 0;
    this.source = this.source & 0xFFFFFF00;
    this.source = this.source | data;
}
GameBoyAdvanceDMA0.prototype.writeDMASource1 = function (data) {
    data = data | 0;
    this.source = this.source & 0xFFFF00FF;
    this.source = this.source | (data << 8);
}
GameBoyAdvanceDMA0.prototype.writeDMASource2 = function (data) {
    data = data | 0;
    this.source = this.source & 0xFF00FFFF;
    this.source = this.source | (data << 16);
}
GameBoyAdvanceDMA0.prototype.writeDMASource3 = function (data) {
    data = data & 0x7;
    this.source = this.source & 0xFFFFFF;
    this.source = this.source | (data << 24);
}
GameBoyAdvanceDMA0.prototype.writeDMADestination0 = function (data) {
    data = data | 0;
    this.destination = this.destination & 0xFFFFFF00;
    this.destination = this.destination | data;
}
GameBoyAdvanceDMA0.prototype.writeDMADestination1 = function (data) {
    data = data | 0;
    this.destination = this.destination & 0xFFFF00FF;
    this.destination = this.destination | (data << 8);
}
GameBoyAdvanceDMA0.prototype.writeDMADestination2 = function (data) {
    data = data | 0;
    this.destination = this.destination & 0xFF00FFFF;
    this.destination = this.destination | (data << 16);
}
GameBoyAdvanceDMA0.prototype.writeDMADestination3 = function (data) {
    data = data & 0x7;
    this.destination = this.destination & 0xFFFFFF;
    this.destination = this.destination | (data << 24);
}
GameBoyAdvanceDMA0.prototype.writeDMAWordCount0 = function (data) {
    data = data | 0;
    this.wordCount = this.wordCount & 0x3F00;
    this.wordCount = this.wordCount | data;
}
GameBoyAdvanceDMA0.prototype.writeDMAWordCount1 = function (data) {
    data = data & 0x3F;
    this.wordCount = this.wordCount & 0xFF;
    this.wordCount = this.wordCount | (data << 8);
}
GameBoyAdvanceDMA0.prototype.writeDMAControl0 = function (data) {
    data = data | 0;
    this.destinationControl = (data >> 5) & 0x3;
    this.sourceControl = this.sourceControl & 0x2;
    this.sourceControl = this.sourceControl | ((data >> 7) & 0x1);
}
GameBoyAdvanceDMA0.prototype.readDMAControl0 = function () {
    return ((this.sourceControl & 0x1) << 7) | (this.destinationControl << 5);
}
GameBoyAdvanceDMA0.prototype.writeDMAControl1 = function (data) {
    data = data | 0;
    this.sourceControl = (this.sourceControl & 0x1) | ((data & 0x1) << 1);
    this.repeat = data & 0x2;
    this.is32Bit = data & 0x4;
    this.dmaType = (data >> 4) & 0x3;
    this.irqFlagging = data & 0x40;
    if ((data | 0) > 0x7F) {
        if ((this.enabled | 0) == 0) {
            this.enabled = this.DMA_ENABLE_TYPE[this.dmaType | 0] | 0;
            if ((this.enabled | 0) > 0) {
                this.enableDMAChannel();
            }
        }
        /*
         DMA seems to not allow changing its type while it's running.
         Some games rely on this to not have broken audio (kirby's nightmare in dreamland).
         */
    }
    else {
        this.enabled = 0;
        //this.pending = 0;
        this.DMACore.update();
    }
}
GameBoyAdvanceDMA0.prototype.readDMAControl1 = function () {
    return ((((this.enabled | 0) > 0) ? 0x80 : 0) |
            this.irqFlagging |
            (this.dmaType << 4) |
            this.is32Bit |
            this.repeat |
            (this.sourceControl >> 1));
}
GameBoyAdvanceDMA0.prototype.requestDMA = function (DMAType) {
    DMAType = DMAType | 0;
    if ((this.enabled & DMAType) == (DMAType | 0)) {
        this.pending = DMAType | 0;
        this.DMACore.update();
    }
}
GameBoyAdvanceDMA0.prototype.enableDMAChannel = function () {
    if ((this.enabled | 0) == (this.DMA_REQUEST_TYPE.IMMEDIATE | 0)) {
        //Flag immediate DMA transfers for processing now:
        this.pending = this.DMA_REQUEST_TYPE.IMMEDIATE | 0;
    }
    //Shadow copy the word count:
    this.wordCountShadow = this.wordCount | 0;
    //Shadow copy the source address:
    this.sourceShadow = this.source | 0;
    //Shadow copy the destination address:
    this.destinationShadow = this.destination | 0;
    //Run some DMA channel activity checks:
    this.DMACore.update();
}
GameBoyAdvanceDMA0.prototype.handleDMACopy = function () {
    //Get the addesses:
    var source = this.sourceShadow | 0;
    var destination = this.destinationShadow | 0;
    //Transfer Data:
    if ((this.is32Bit | 0) == 4) {
        //32-bit Transfer:
        this.DMACore.fetch = this.memory.memoryRead32(source | 0) | 0;
        this.memory.memoryWrite32(destination | 0, this.DMACore.fetch | 0);
        this.decrementWordCount(source | 0, destination | 0, 4);
    }
    else {
        //16-bit Transfer:
        this.DMACore.fetch = this.memory.memoryRead16(source | 0) | 0;
        this.memory.memoryWrite16(destination | 0, this.DMACore.fetch | 0);
        this.DMACore.fetch |= this.DMACore.fetch << 16;    //Mirror extreme edge case?
        this.decrementWordCount(source | 0, destination | 0, 2);
    }
}
GameBoyAdvanceDMA0.prototype.decrementWordCount = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    //Decrement the word count:
    var wordCountShadow = ((this.wordCountShadow | 0) - 1) & 0x3FFF;
    if ((wordCountShadow | 0) == 0) {
        //DMA transfer ended, handle accordingly:
        wordCountShadow = this.finalizeDMA(source | 0, destination | 0, transferred | 0) | 0;
    }
    else {
        //Update addresses:
        this.incrementDMAAddresses(source | 0, destination | 0, transferred | 0);
    }
    //Save the new word count:
    this.wordCountShadow = wordCountShadow | 0;
}
GameBoyAdvanceDMA0.prototype.finalizeDMA = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    var wordCountShadow = 0;
    //Reset pending requests:
    this.pending = 0;
    //Check Repeat Status:
    if ((this.repeat | 0) == 0 || (this.enabled | 0) == (this.DMA_REQUEST_TYPE.IMMEDIATE | 0)) {
        //Disable the enable bit:
        this.enabled = 0;
    }
    else {
        //Reload word count:
        wordCountShadow = this.wordCount | 0;
    }
    //Run the DMA channel checks:
    this.DMACore.update();
    //Check to see if we should flag for IRQ:
    this.checkIRQTrigger();
    //Update addresses:
    this.finalDMAAddresses(source | 0, destination | 0, transferred | 0);
    return wordCountShadow | 0;
}
GameBoyAdvanceDMA0.prototype.checkIRQTrigger = function () {
    if ((this.irqFlagging | 0) == 0x40) {
        this.DMACore.IOCore.irq.requestIRQ(0x100);
    }
}
GameBoyAdvanceDMA0.prototype.finalDMAAddresses = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    //Update source address:
    switch (this.sourceControl | 0) {
        case 0:    //Increment
        case 3:    //Forbidden (VBA has it increment)
            this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
            break;
        case 1:    //Decrement
            this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
    }
    //Update destination address:
    switch (this.destinationControl | 0) {
        case 0:    //Increment
            this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
            break;
        case 1:    //Decrement
            this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
            break;
        case 3:    //Reload
            this.destinationShadow = this.destination | 0;
    }
}
GameBoyAdvanceDMA0.prototype.incrementDMAAddresses = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    //Update source address:
    switch (this.sourceControl | 0) {
        case 0:    //Increment
        case 3:    //Forbidden (VBA has it increment)
            this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
            break;
        case 1:
            this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
    }
    //Update destination address:
    switch (this.destinationControl | 0) {
        case 0:    //Increment
        case 3:    //Increment
            this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
            break;
        case 1:    //Decrement
            this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
    }
}
GameBoyAdvanceDMA0.prototype.nextEventTime = function () {
    var clocks = -1;
    switch (this.enabled | 0) {
            //V_BLANK
        case 0x2:
            clocks = this.DMACore.IOCore.gfx.nextVBlankEventTime() | 0;
            break;
            //H_BLANK:
        case 0x4:
            clocks = this.DMACore.IOCore.gfx.nextHBlankDMAEventTime() | 0;
    }
    return clocks | 0;
}
GameBoyAdvanceDMA0.prototype.nextIRQEventTime = function () {
    var clocks = -1;
    if ((this.irqFlagging | 0) == 0x40) {
        clocks = this.nextEventTime() | 0;
    }
    return clocks | 0;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceDMA1(dma) {
    this.DMACore = dma;
    this.initialize();
}
GameBoyAdvanceDMA1.prototype.DMA_ENABLE_TYPE = [            //DMA Channel 1 Mapping:
    0x1,
    0x2,
    0x4,
    0x8
];
GameBoyAdvanceDMA1.prototype.DMA_REQUEST_TYPE = {
    IMMEDIATE:      0x1,
    V_BLANK:        0x2,
    H_BLANK:        0x4,
    FIFO_A:         0x8
}
GameBoyAdvanceDMA1.prototype.initialize = function () {
    this.enabled = 0;
    this.pending = 0;
    this.source = 0;
    this.sourceShadow = 0;
    this.destination = 0;
    this.destinationShadow = 0;
    this.wordCount = 0;
    this.wordCountShadow = 0;
    this.irqFlagging = 0;
    this.dmaType = 0;
    this.is32Bit = 0;
    this.repeat = 0;
    this.sourceControl = 0;
    this.destinationControl = 0;
    this.memory = this.DMACore.IOCore.memory;
}
GameBoyAdvanceDMA1.prototype.writeDMASource0 = function (data) {
    data = data | 0;
    this.source = this.source & 0xFFFFFF00;
    this.source = this.source | data;
}
GameBoyAdvanceDMA1.prototype.writeDMASource1 = function (data) {
    data = data | 0;
    this.source = this.source & 0xFFFF00FF;
    this.source = this.source | (data << 8);
}
GameBoyAdvanceDMA1.prototype.writeDMASource2 = function (data) {
    data = data | 0;
    this.source = this.source & 0xFF00FFFF;
    this.source = this.source | (data << 16);
}
GameBoyAdvanceDMA1.prototype.writeDMASource3 = function (data) {
    data = data & 0xF;
    this.source = this.source & 0xFFFFFF;
    this.source = this.source | (data << 24);
}
GameBoyAdvanceDMA1.prototype.writeDMADestination0 = function (data) {
    data = data | 0;
    this.destination = this.destination & 0xFFFFFF00;
    this.destination = this.destination | data;
}
GameBoyAdvanceDMA1.prototype.writeDMADestination1 = function (data) {
    data = data | 0;
    this.destination = this.destination & 0xFFFF00FF;
    this.destination = this.destination | (data << 8);
}
GameBoyAdvanceDMA1.prototype.writeDMADestination2 = function (data) {
    data = data | 0;
    this.destination = this.destination & 0xFF00FFFF;
    this.destination = this.destination | (data << 16);
}
GameBoyAdvanceDMA1.prototype.writeDMADestination3 = function (data) {
    data = data & 0x7;
    this.destination = this.destination & 0xFFFFFF;
    this.destination = this.destination | (data << 24);
}
GameBoyAdvanceDMA1.prototype.writeDMAWordCount0 = function (data) {
    data = data | 0;
    this.wordCount = this.wordCount & 0x3F00;
    this.wordCount = this.wordCount | data;
}
GameBoyAdvanceDMA1.prototype.writeDMAWordCount1 = function (data) {
    data = data & 0x3F;
    this.wordCount = this.wordCount & 0xFF;
    this.wordCount = this.wordCount | (data << 8);
}
GameBoyAdvanceDMA1.prototype.writeDMAControl0 = function (data) {
    data = data | 0;
    this.destinationControl = (data >> 5) & 0x3;
    this.sourceControl = this.sourceControl & 0x2;
    this.sourceControl = this.sourceControl | ((data >> 7) & 0x1);
}
GameBoyAdvanceDMA1.prototype.readDMAControl0 = function () {
    return ((this.sourceControl & 0x1) << 7) | (this.destinationControl << 5);
}
GameBoyAdvanceDMA1.prototype.writeDMAControl1 = function (data) {
    data = data | 0;
    this.sourceControl = (this.sourceControl & 0x1) | ((data & 0x1) << 1);
    this.repeat = data & 0x2;
    this.is32Bit = data & 0x4;
    this.dmaType = (data >> 4) & 0x3;
    this.irqFlagging = data & 0x40;
    if ((data | 0) > 0x7F) {
        if ((this.enabled | 0) == 0) {
            this.enabled = this.DMA_ENABLE_TYPE[this.dmaType | 0] | 0;
            this.enableDMAChannel();
        }
        /*
         DMA seems to not allow changing its type while it's running.
         Some games rely on this to not have broken audio (kirby's nightmare in dreamland).
         */
    }
    else {
        this.enabled = 0;
        //this.pending = 0;
        //Assert the FIFO A DMA request signal:
        //this.DMACore.IOCore.sound.checkFIFOAPendingSignal();
        this.DMACore.update();
    }
}
GameBoyAdvanceDMA1.prototype.readDMAControl1 = function () {
    return ((((this.enabled | 0) > 0) ? 0x80 : 0) |
            this.irqFlagging |
            (this.dmaType << 4) |
            this.is32Bit |
            this.repeat |
            (this.sourceControl >> 1));
}
GameBoyAdvanceDMA1.prototype.requestDMA = function (DMAType) {
    DMAType = DMAType | 0;
    if ((this.enabled & DMAType) > 0) {
        this.pending = DMAType | 0;
        this.DMACore.update();
    }
}
GameBoyAdvanceDMA1.prototype.enableDMAChannel = function () {
    if ((this.enabled | 0) == (this.DMA_REQUEST_TYPE.FIFO_A | 0)) {
        //Assert the FIFO A DMA request signal:
        this.DMACore.IOCore.sound.checkFIFOAPendingSignal();
        //Direct Sound DMA Hardwired To Wordcount Of 4:
        this.wordCountShadow = 0x4;
        //Destination Hardwired to 0x40000A0:
        this.destination = 0x40000A0;
    }
    else {
        if ((this.enabled | 0) == (this.DMA_REQUEST_TYPE.IMMEDIATE | 0)) {
            //Flag immediate DMA transfers for processing now:
            this.pending = this.DMA_REQUEST_TYPE.IMMEDIATE | 0;
        }
        //Shadow copy the word count:
        this.wordCountShadow = this.wordCount | 0;
    }
    //Shadow copy the source address:
    this.sourceShadow = this.source | 0;
    //Shadow copy the destination address:
    this.destinationShadow = this.destination | 0;
    //Run some DMA channel activity checks:
    this.DMACore.update();
}
GameBoyAdvanceDMA1.prototype.handleDMACopy = function () {
    //Get the addesses:
    var source = this.sourceShadow | 0;
    var destination = this.destinationShadow | 0;
    //Transfer Data:
    if ((this.enabled | 0) == (this.DMA_REQUEST_TYPE.FIFO_A | 0) || (this.is32Bit | 0) == 4) {
        //32-bit Transfer:
        this.DMACore.fetch = this.memory.memoryRead32(source | 0) | 0;
        this.memory.memoryWrite32(destination | 0, this.DMACore.fetch | 0);
        this.decrementWordCount(source | 0, destination | 0, 4);
    }
    else {
        //16-bit Transfer:
        this.DMACore.fetch = this.memory.memoryRead16(source | 0) | 0;
        this.memory.memoryWrite16(destination | 0, this.DMACore.fetch | 0);
        this.DMACore.fetch |= this.DMACore.fetch << 16;    //Mirror extreme edge case?
        this.decrementWordCount(source | 0, destination | 0, 2);
    }
}
GameBoyAdvanceDMA1.prototype.decrementWordCount = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    //Decrement the word count:
    var wordCountShadow = ((this.wordCountShadow | 0) - 1) & 0x3FFF;
    if ((wordCountShadow | 0) == 0) {
        //DMA transfer ended, handle accordingly:
        wordCountShadow = this.finalizeDMA(source | 0, destination | 0, transferred | 0) | 0;
    }
    else {
        //Update addresses:
        this.incrementDMAAddresses(source | 0, destination | 0, transferred | 0);
    }
    //Save the new word count:
    this.wordCountShadow = wordCountShadow | 0;
}
GameBoyAdvanceDMA1.prototype.finalizeDMA = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    var wordCountShadow = 0;
    //Reset pending requests:
    this.pending = 0;
    //Check Repeat Status:
    if ((this.repeat | 0) == 0 || (this.enabled | 0) == (this.DMA_REQUEST_TYPE.IMMEDIATE | 0)) {
        //Disable the enable bit:
        this.enabled = 0;
    }
    else {
        //Repeating the dma:
        if ((this.enabled | 0) == (this.DMA_REQUEST_TYPE.FIFO_A | 0)) {
            //Direct Sound DMA Hardwired To Wordcount Of 4:
            wordCountShadow = 0x4;
        }
        else {
            //Reload word count:
            wordCountShadow = this.wordCount | 0;
        }
    }
    //Assert the FIFO A DMA request signal:
    this.DMACore.IOCore.sound.checkFIFOAPendingSignal();
    //Run the DMA channel checks:
    this.DMACore.update();
    //Check to see if we should flag for IRQ:
    this.checkIRQTrigger();
    //Update addresses:
    this.finalDMAAddresses(source | 0, destination | 0, transferred | 0);
    return wordCountShadow | 0;
}
GameBoyAdvanceDMA1.prototype.checkIRQTrigger = function () {
    if ((this.irqFlagging | 0) == 0x40) {
        this.DMACore.IOCore.irq.requestIRQ(0x200);
    }
}
GameBoyAdvanceDMA1.prototype.finalDMAAddresses = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    //Update source address:
    switch (this.sourceControl | 0) {
        case 0:    //Increment
        case 3:    //Forbidden (VBA has it increment)
            this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
            break;
        case 1:    //Decrement
            this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
    }
    //Don't update destination if in FIFO DMA mode:
    if ((this.enabled | 0) != (this.DMA_REQUEST_TYPE.FIFO_A | 0)) {
        //Update destination address:
        switch (this.destinationControl | 0) {
            case 0:    //Increment
                this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
                break;
            case 1:    //Decrement
                this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
                break;
            case 3:    //Reload
                this.destinationShadow = this.destination | 0;
        }
    }
}
GameBoyAdvanceDMA1.prototype.incrementDMAAddresses = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    //Update source address:
    switch (this.sourceControl | 0) {
        case 0:    //Increment
        case 3:    //Forbidden (VBA has it increment)
            this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
            break;
        case 1:
            this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
    }
    //Don't update destination if in FIFO DMA mode:
    if ((this.enabled | 0) != (this.DMA_REQUEST_TYPE.FIFO_A | 0)) {
        //Update destination address:
        switch (this.destinationControl | 0) {
            case 0:    //Increment
            case 3:    //Increment
                this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
                break;
            case 1:    //Decrement
                this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
        }
    }
}
GameBoyAdvanceDMA1.prototype.nextEventTime = function () {
    var clocks = -1;
    switch (this.enabled | 0) {
            //V_BLANK
        case 0x2:
            clocks = this.DMACore.IOCore.gfx.nextVBlankEventTime() | 0;
            break;
            //H_BLANK:
        case 0x4:
            clocks = this.DMACore.IOCore.gfx.nextHBlankDMAEventTime() | 0;
            break;
            //FIFO_A:
        case 0x8:
            clocks = this.DMACore.IOCore.sound.nextFIFOAEventTime() | 0;
    }
    return clocks | 0;
}
GameBoyAdvanceDMA1.prototype.nextIRQEventTime = function () {
    var clocks = -1;
    if ((this.irqFlagging | 0) == 0x40) {
        clocks = this.nextEventTime() | 0;
    }
    return clocks | 0;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceDMA2(dma) {
    this.DMACore = dma;
    this.initialize();
}
GameBoyAdvanceDMA2.prototype.DMA_ENABLE_TYPE = [            //DMA Channel 2 Mapping:
    0x1,
    0x2,
    0x4,
    0x10
];
GameBoyAdvanceDMA2.prototype.DMA_REQUEST_TYPE = {
    IMMEDIATE:      0x1,
    V_BLANK:        0x2,
    H_BLANK:        0x4,
    FIFO_B:         0x10
}
GameBoyAdvanceDMA2.prototype.initialize = function () {
    this.enabled = 0;
    this.pending = 0;
    this.source = 0;
    this.sourceShadow = 0;
    this.destination = 0;
    this.destinationShadow = 0;
    this.wordCount = 0;
    this.wordCountShadow = 0;
    this.irqFlagging = 0;
    this.dmaType = 0;
    this.is32Bit = 0;
    this.repeat = 0;
    this.sourceControl = 0;
    this.destinationControl = 0;
    this.memory = this.DMACore.IOCore.memory;
}
GameBoyAdvanceDMA2.prototype.writeDMASource0 = function (data) {
    data = data | 0;
    this.source = this.source & 0xFFFFFF00;
    this.source = this.source | data;
}
GameBoyAdvanceDMA2.prototype.writeDMASource1 = function (data) {
    data = data | 0;
    this.source = this.source & 0xFFFF00FF;
    this.source = this.source | (data << 8);
}
GameBoyAdvanceDMA2.prototype.writeDMASource2 = function (data) {
    data = data | 0;
    this.source = this.source & 0xFF00FFFF;
    this.source = this.source | (data << 16);
}
GameBoyAdvanceDMA2.prototype.writeDMASource3 = function (data) {
    data = data & 0xF;
    this.source = this.source & 0xFFFFFF;
    this.source = this.source | (data << 24);
}
GameBoyAdvanceDMA2.prototype.writeDMADestination0 = function (data) {
    data = data | 0;
    this.destination = this.destination & 0xFFFFFF00;
    this.destination = this.destination | data;
}
GameBoyAdvanceDMA2.prototype.writeDMADestination1 = function (data) {
    data = data | 0;
    this.destination = this.destination & 0xFFFF00FF;
    this.destination = this.destination | (data << 8);
}
GameBoyAdvanceDMA2.prototype.writeDMADestination2 = function (data) {
    data = data | 0;
    this.destination = this.destination & 0xFF00FFFF;
    this.destination = this.destination | (data << 16);
}
GameBoyAdvanceDMA2.prototype.writeDMADestination3 = function (data) {
    data = data & 0x7;
    this.destination = this.destination & 0xFFFFFF;
    this.destination = this.destination | (data << 24);
}
GameBoyAdvanceDMA2.prototype.writeDMAWordCount0 = function (data) {
    data = data | 0;
    this.wordCount = this.wordCount & 0x3F00;
    this.wordCount = this.wordCount | data;
}
GameBoyAdvanceDMA2.prototype.writeDMAWordCount1 = function (data) {
    data = data & 0x3F;
    this.wordCount = this.wordCount & 0xFF;
    this.wordCount = this.wordCount | (data << 8);
}
GameBoyAdvanceDMA2.prototype.writeDMAControl0 = function (data) {
    data = data | 0;
    this.destinationControl = (data >> 5) & 0x3;
    this.sourceControl = this.sourceControl & 0x2;
    this.sourceControl = this.sourceControl | ((data >> 7) & 0x1);
}
GameBoyAdvanceDMA2.prototype.readDMAControl0 = function () {
    return ((this.sourceControl & 0x1) << 7) | (this.destinationControl << 5);
}
GameBoyAdvanceDMA2.prototype.writeDMAControl1 = function (data) {
    data = data | 0;
    this.sourceControl = (this.sourceControl & 0x1) | ((data & 0x1) << 1);
    this.repeat = data & 0x2;
    this.is32Bit = data & 0x4;
    this.dmaType = (data >> 4) & 0x3;
    this.irqFlagging = data & 0x40;
    if ((data | 0) > 0x7F) {
        if ((this.enabled | 0) == 0) {
            this.enabled = this.DMA_ENABLE_TYPE[this.dmaType | 0] | 0;
            this.enableDMAChannel();
        }
        /*
         DMA seems to not allow changing its type while it's running.
         Some games rely on this to not have broken audio (kirby's nightmare in dreamland).
         */
    }
    else {
        this.enabled = 0;
        //this.pending = 0;
        //Assert the FIFO B DMA request signal:
        //this.DMACore.IOCore.sound.checkFIFOBPendingSignal();
        this.DMACore.update();
    }
}
GameBoyAdvanceDMA2.prototype.readDMAControl1 = function () {
    return ((((this.enabled | 0) > 0) ? 0x80 : 0) |
            this.irqFlagging |
            (this.dmaType << 4) |
            this.is32Bit |
            this.repeat |
            (this.sourceControl >> 1));
}
GameBoyAdvanceDMA2.prototype.requestDMA = function (DMAType) {
    DMAType = DMAType | 0;
    if ((this.enabled & DMAType) > 0) {
        this.pending = DMAType | 0;
        this.DMACore.update();
    }
}
GameBoyAdvanceDMA2.prototype.enableDMAChannel = function () {
    if ((this.enabled | 0) == (this.DMA_REQUEST_TYPE.FIFO_B | 0)) {
        //Assert the FIFO B DMA request signal:
        this.DMACore.IOCore.sound.checkFIFOBPendingSignal();
        //Direct Sound DMA Hardwired To Wordcount Of 4:
        this.wordCountShadow = 0x4;
        //Destination Hardwired to 0x40000A4:
        this.destination = 0x40000A4;
    }
    else {
        if ((this.enabled | 0) == (this.DMA_REQUEST_TYPE.IMMEDIATE | 0)) {
            //Flag immediate DMA transfers for processing now:
            this.pending = this.DMA_REQUEST_TYPE.IMMEDIATE | 0;
        }
        //Shadow copy the word count:
        this.wordCountShadow = this.wordCount | 0;
    }
    //Shadow copy the source address:
    this.sourceShadow = this.source | 0;
    //Shadow copy the destination address:
    this.destinationShadow = this.destination | 0;
    //Run some DMA channel activity checks:
    this.DMACore.update();
}
GameBoyAdvanceDMA2.prototype.handleDMACopy = function () {
    //Get the addesses:
    var source = this.sourceShadow | 0;
    var destination = this.destinationShadow | 0;
    //Transfer Data:
    if ((this.enabled | 0) == (this.DMA_REQUEST_TYPE.FIFO_B | 0) || (this.is32Bit | 0) == 4) {
        //32-bit Transfer:
        this.DMACore.fetch = this.memory.memoryRead32(source | 0) | 0;
        this.memory.memoryWrite32(destination | 0, this.DMACore.fetch | 0);
        this.decrementWordCount(source | 0, destination | 0, 4);
    }
    else {
        //16-bit Transfer:
        this.DMACore.fetch = this.memory.memoryRead16(source | 0) | 0;
        this.memory.memoryWrite16(destination | 0, this.DMACore.fetch | 0);
        this.DMACore.fetch |= this.DMACore.fetch << 16;    //Mirror extreme edge case?
        this.decrementWordCount(source | 0, destination | 0, 2);
    }
}
GameBoyAdvanceDMA2.prototype.decrementWordCount = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    //Decrement the word count:
    var wordCountShadow = ((this.wordCountShadow | 0) - 1) & 0x3FFF;
    if ((wordCountShadow | 0) == 0) {
        //DMA transfer ended, handle accordingly:
        wordCountShadow = this.finalizeDMA(source | 0, destination | 0, transferred | 0) | 0;
    }
    else {
        //Update addresses:
        this.incrementDMAAddresses(source | 0, destination | 0, transferred | 0);
    }
    //Save the new word count:
    this.wordCountShadow = wordCountShadow | 0;
}
GameBoyAdvanceDMA2.prototype.finalizeDMA = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    var wordCountShadow = 0;
    //Reset pending requests:
    this.pending = 0;
    //Check Repeat Status:
    if ((this.repeat | 0) == 0 || (this.enabled | 0) == (this.DMA_REQUEST_TYPE.IMMEDIATE | 0)) {
        //Disable the enable bit:
        this.enabled = 0;
    }
    else {
        //Repeating the dma:
        if ((this.enabled | 0) == (this.DMA_REQUEST_TYPE.FIFO_B | 0)) {
            //Direct Sound DMA Hardwired To Wordcount Of 4:
            wordCountShadow = 0x4;
        }
        else {
            //Reload word count:
            wordCountShadow = this.wordCount | 0;
        }
    }
    //Assert the FIFO B DMA request signal:
    this.DMACore.IOCore.sound.checkFIFOBPendingSignal();
    //Run the DMA channel checks:
    this.DMACore.update();
    //Check to see if we should flag for IRQ:
    this.checkIRQTrigger();
    //Update addresses:
    this.finalDMAAddresses(source | 0, destination | 0, transferred | 0);
    return wordCountShadow | 0;
}
GameBoyAdvanceDMA2.prototype.checkIRQTrigger = function () {
    if ((this.irqFlagging | 0) == 0x40) {
        this.DMACore.IOCore.irq.requestIRQ(0x400);
    }
}
GameBoyAdvanceDMA2.prototype.finalDMAAddresses = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    //Update source address:
    switch (this.sourceControl | 0) {
        case 0:    //Increment
        case 3:    //Forbidden (VBA has it increment)
            this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
            break;
        case 1:    //Decrement
            this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
    }
    //Don't update destination if in FIFO DMA mode:
    if ((this.enabled | 0) != (this.DMA_REQUEST_TYPE.FIFO_B | 0)) {
        //Update destination address:
        switch (this.destinationControl | 0) {
            case 0:    //Increment
                this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
                break;
            case 1:    //Decrement
                this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
                break;
            case 3:    //Reload
                this.destinationShadow = this.destination | 0;
        }
    }
}
GameBoyAdvanceDMA2.prototype.incrementDMAAddresses = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    //Update source address:
    switch (this.sourceControl | 0) {
        case 0:    //Increment
        case 3:    //Forbidden (VBA has it increment)
            this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
            break;
        case 1:
            this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
    }
    //Don't update destination if in FIFO DMA mode:
    if ((this.enabled | 0) != (this.DMA_REQUEST_TYPE.FIFO_B | 0)) {
        //Update destination address:
        switch (this.destinationControl | 0) {
            case 0:    //Increment
            case 3:    //Increment
                this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
                break;
            case 1:    //Decrement
                this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
        }
    }
}
GameBoyAdvanceDMA2.prototype.nextEventTime = function () {
    var clocks = -1;
    switch (this.enabled | 0) {
            //V_BLANK
        case 0x2:
            clocks = this.DMACore.IOCore.gfx.nextVBlankEventTime() | 0;
            break;
            //H_BLANK:
        case 0x4:
            clocks = this.DMACore.IOCore.gfx.nextHBlankDMAEventTime() | 0;
            break;
            //FIFO_B:
        case 0x10:
            clocks = this.DMACore.IOCore.sound.nextFIFOBEventTime() | 0;
    }
    return clocks | 0;
}
GameBoyAdvanceDMA2.prototype.nextIRQEventTime = function () {
    var clocks = -1;
    if ((this.irqFlagging | 0) == 0x40) {
        clocks = this.nextEventTime() | 0;
    }
    return clocks | 0;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceDMA3(dma) {
    this.DMACore = dma;
    this.initialize();
}
GameBoyAdvanceDMA3.prototype.DMA_ENABLE_TYPE = [            //DMA Channel 3 Mapping:
    0x1,
    0x2,
    0x4,
    0x20
];
GameBoyAdvanceDMA3.prototype.DMA_REQUEST_TYPE = {
    IMMEDIATE:      0x1,
    V_BLANK:        0x2,
    H_BLANK:        0x4,
    DISPLAY_SYNC:   0x20
}
GameBoyAdvanceDMA3.prototype.initialize = function () {
    this.enabled = 0;
    this.pending = 0;
    this.source = 0;
    this.sourceShadow = 0;
    this.destination = 0;
    this.destinationShadow = 0;
    this.wordCount = 0;
    this.wordCountShadow = 0;
    this.irqFlagging = 0;
    this.dmaType = 0;
    this.is32Bit = 0;
    this.repeat = 0;
    this.sourceControl = 0;
    this.destinationControl = 0;
    this.gamePakDMA = false;
	this.displaySyncEnable = false;
    this.memory = this.DMACore.IOCore.memory;
}
GameBoyAdvanceDMA3.prototype.writeDMASource0 = function (data) {
    data = data | 0;
    this.source = this.source & 0xFFFFFF00;
    this.source = this.source | data;
}
GameBoyAdvanceDMA3.prototype.writeDMASource1 = function (data) {
    data = data | 0;
    this.source = this.source & 0xFFFF00FF;
    this.source = this.source | (data << 8);
}
GameBoyAdvanceDMA3.prototype.writeDMASource2 = function (data) {
    data = data | 0;
    this.source = this.source & 0xFF00FFFF;
    this.source = this.source | (data << 16);
}
GameBoyAdvanceDMA3.prototype.writeDMASource3 = function (data) {
    data = data & 0xF;
    this.source = this.source & 0xFFFFFF;
    this.source = this.source | (data << 24);
}
GameBoyAdvanceDMA3.prototype.writeDMADestination0 = function (data) {
    data = data | 0;
    this.destination = this.destination & 0xFFFFFF00;
    this.destination = this.destination | data;
}
GameBoyAdvanceDMA3.prototype.writeDMADestination1 = function (data) {
    data = data | 0;
    this.destination = this.destination & 0xFFFF00FF;
    this.destination = this.destination | (data << 8);
}
GameBoyAdvanceDMA3.prototype.writeDMADestination2 = function (data) {
    data = data | 0;
    this.destination = this.destination & 0xFF00FFFF;
    this.destination = this.destination | (data << 16);
}
GameBoyAdvanceDMA3.prototype.writeDMADestination3 = function (data) {
    data = data & 0xF;
    this.destination = this.destination & 0xFFFFFF;
    this.destination = this.destination | (data << 24);
}
GameBoyAdvanceDMA3.prototype.writeDMAWordCount0 = function (data) {
    data = data | 0;
    this.wordCount = this.wordCount & 0xFF00;
    this.wordCount = this.wordCount | data;
}
GameBoyAdvanceDMA3.prototype.writeDMAWordCount1 = function (data) {
    data = data | 0;
    this.wordCount = this.wordCount & 0xFF;
    this.wordCount = this.wordCount | (data << 8);
}
GameBoyAdvanceDMA3.prototype.writeDMAControl0 = function (data) {
    data = data | 0;
    this.destinationControl = (data >> 5) & 0x3;
    this.sourceControl = this.sourceControl & 0x2;
    this.sourceControl = this.sourceControl | ((data >> 7) & 0x1);
}
GameBoyAdvanceDMA3.prototype.readDMAControl0 = function () {
    return ((this.sourceControl & 0x1) << 7) | (this.destinationControl << 5);
}
GameBoyAdvanceDMA3.prototype.writeDMAControl1 = function (data) {
    data = data | 0;
    this.sourceControl = (this.sourceControl & 0x1) | ((data & 0x1) << 1);
    this.repeat = data & 0x2;
    this.is32Bit = data & 0x4;
    this.gamePakDMA = ((data & 0x8) == 0x8);
    this.dmaType = (data >> 4) & 0x3;
    this.irqFlagging = data & 0x40;
    if ((data | 0) > 0x7F) {
        if ((this.enabled | 0) == 0) {
            this.enabled = this.DMA_ENABLE_TYPE[this.dmaType | 0] | 0;
            if ((this.enabled | 0) > 0) {
                this.enableDMAChannel();
            }
        }
        /*
         DMA seems to not allow changing its type while it's running.
         Some games rely on this to not have broken audio (kirby's nightmare in dreamland).
         */
    }
    else {
        this.enabled = 0;
        //this.pending = 0;
        this.DMACore.update();
    }
}
GameBoyAdvanceDMA3.prototype.readDMAControl1 = function () {
    return ((((this.enabled | 0) > 0) ? 0x80 : 0) |
            this.irqFlagging |
            (this.dmaType << 4) |
            this.is32Bit |
            ((this.gamePakDMA) ? 0x8 : 0) |
            this.repeat |
            (this.sourceControl >> 1));
}
GameBoyAdvanceDMA3.prototype.requestDMA = function (DMAType) {
    DMAType = DMAType | 0;
    if ((this.enabled & DMAType) > 0) {
        this.pending = DMAType | 0;
        this.DMACore.update();
    }
}
GameBoyAdvanceDMA3.prototype.requestDisplaySync = function () {
	//Called from LCD controller state machine on line 162:
	if (this.displaySyncEnable) {
		this.displaySyncEnable = false;
		this.enabled = this.DMA_REQUEST_TYPE.DISPLAY_SYNC | 0;
	}
}
GameBoyAdvanceDMA3.prototype.enableDMAChannel = function () {
    if ((this.enabled | 0) == (this.DMA_REQUEST_TYPE.IMMEDIATE | 0)) {
        //Flag immediate DMA transfers for processing now:
        this.pending = this.DMA_REQUEST_TYPE.IMMEDIATE | 0;
    }
	else if ((this.enabled | 0) == (this.DMA_REQUEST_TYPE.DISPLAY_SYNC | 0)) {
        //Trigger display sync DMA shadow enable and auto-check on line 162:
        this.enabled = 0;
		this.displaySyncEnable = true;
		return;
    }
    //Shadow copy the word count:
    this.wordCountShadow = this.wordCount | 0;
    //Shadow copy the source address:
    this.sourceShadow = this.source | 0;
    //Shadow copy the destination address:
    this.destinationShadow = this.destination | 0;
    //Run some DMA channel activity checks:
    this.DMACore.update();
}
GameBoyAdvanceDMA3.prototype.handleDMACopy = function () {
    //Get the addesses:
    var source = this.sourceShadow | 0;
    var destination = this.destinationShadow | 0;
    //Transfer Data:
    if ((this.is32Bit | 0) == 4) {
        //32-bit Transfer:
        this.DMACore.fetch = this.memory.memoryRead32(source | 0) | 0;
        this.memory.memoryWrite32(destination | 0, this.DMACore.fetch | 0);
        this.decrementWordCount(source | 0, destination | 0, 4);
    }
    else {
        //16-bit Transfer:
        this.DMACore.fetch = this.memory.memoryRead16(source | 0) | 0;
        this.memory.memoryWrite16(destination | 0, this.DMACore.fetch | 0);
        this.DMACore.fetch |= this.DMACore.fetch << 16;    //Mirror extreme edge case?
        this.decrementWordCount(source | 0, destination | 0, 2);
    }
}
GameBoyAdvanceDMA3.prototype.decrementWordCount = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    //Decrement the word count:
    var wordCountShadow = ((this.wordCountShadow | 0) - 1) & 0xFFFF;
    if ((wordCountShadow | 0) == 0) {
        //DMA transfer ended, handle accordingly:
        wordCountShadow = this.finalizeDMA(source | 0, destination | 0, transferred | 0) | 0;
    }
    else {
        //Update addresses:
        this.incrementDMAAddresses(source | 0, destination | 0, transferred | 0);
    }
    //Save the new word count:
    this.wordCountShadow = wordCountShadow | 0;
}
GameBoyAdvanceDMA3.prototype.finalizeDMA = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    var wordCountShadow = 0;
    //Reset pending requests:
    this.pending = 0;
    //Check Repeat Status:
    if ((this.repeat | 0) == 0 || (this.enabled | 0) == (this.DMA_REQUEST_TYPE.IMMEDIATE | 0)) {
        //Disable the enable bit:
        this.enabled = 0;
    }
    else {
        //Reload word count:
        wordCountShadow = this.wordCount | 0;
    }
    //Run the DMA channel checks:
    this.DMACore.update();
    //Check to see if we should flag for IRQ:
    this.checkIRQTrigger();
    //Update addresses:
    this.finalDMAAddresses(source | 0, destination | 0, transferred | 0);
    return wordCountShadow | 0;
}
GameBoyAdvanceDMA3.prototype.checkIRQTrigger = function () {
    if ((this.irqFlagging | 0) == 0x40) {
        this.DMACore.IOCore.irq.requestIRQ(0x800);
    }
}
GameBoyAdvanceDMA3.prototype.finalDMAAddresses = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    //Update source address:
    switch (this.sourceControl | 0) {
        case 0:    //Increment
        case 3:    //Forbidden (VBA has it increment)
            this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
            break;
        case 1:    //Decrement
            this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
    }
    //Update destination address:
    switch (this.destinationControl | 0) {
        case 0:    //Increment
            this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
            break;
        case 1:    //Decrement
            this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
            break;
        case 3:    //Reload
            this.destinationShadow = this.destination | 0;
    }
}
GameBoyAdvanceDMA3.prototype.incrementDMAAddresses = function (source, destination, transferred) {
    source = source | 0;
    destination = destination | 0;
    transferred = transferred | 0;
    //Update source address:
    switch (this.sourceControl | 0) {
        case 0:    //Increment
        case 3:    //Forbidden (VBA has it increment)
            this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
            break;
        case 1:
            this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
    }
    //Update destination address:
    switch (this.destinationControl | 0) {
        case 0:    //Increment
        case 3:    //Increment
            this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
            break;
        case 1:    //Decrement
            this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
    }
}
GameBoyAdvanceDMA3.prototype.nextEventTime = function () {
    var clocks = -1;
    switch (this.enabled | 0) {
            //V_BLANK
        case 0x2:
            clocks = this.DMACore.IOCore.gfx.nextVBlankEventTime() | 0;
            break;
            //H_BLANK:
        case 0x4:
            clocks = this.DMACore.IOCore.gfx.nextHBlankDMAEventTime() | 0;
            break;
            //DISPLAY_SYNC:
        case 0x20:
            clocks = this.DMACore.IOCore.gfx.nextDisplaySyncEventTime() | 0;
    }
    return clocks | 0;
}
GameBoyAdvanceDMA3.prototype.nextIRQEventTime = function () {
    var clocks = -1;
    if ((this.irqFlagging | 0) == 0x40) {
        clocks = this.nextEventTime() | 0;
    }
    return clocks | 0;
};
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
function GameBoyAdvanceSaveDeterminer(saveCore) {
    this.saves = null;
    this.saveCore = saveCore;
    this.possible = 0x7;
}
GameBoyAdvanceSaveDeterminer.prototype.flags = {
    SRAM: 1,
    FLASH: 2,
    EEPROM: 4
}
GameBoyAdvanceSaveDeterminer.prototype.initialize = function () {
    
}
GameBoyAdvanceSaveDeterminer.prototype.load = function (save) {
    this.saves = save;
    var length = save.length | 0;
    switch (length | 0) {
        case 0x200:
        case 0x2000:
            this.possible = this.flags.EEPROM | 0;
            break;
        case 0x8000:
            this.possible = this.flags.SRAM | 0;
            break;
        case 0x10000:
        case 0x20000:
            this.possible = this.flags.FLASH | 0;
    }
    this.checkDetermination();
}
GameBoyAdvanceSaveDeterminer.prototype.checkDetermination = function () {
    switch (this.possible) {
        case 0x1:
            this.saveCore.referenceSave(0x1);
            break;
        case 0x2:
            this.saveCore.referenceSave(0x2);
            break;
        case 0x4:
            this.saveCore.referenceSave(0x3);
    }
}
GameBoyAdvanceSaveDeterminer.prototype.readSRAM = function (address) {
    address = address | 0;
    var data = 0;
    //Is not EEPROM:
    this.possible &= ~this.flags.EEPROM;
    if (this.saves != null) {
        if ((this.possible & this.flags.FLASH) == (this.flags.FLASH | 0) || (this.possible & this.flags.SRAM) == (this.flags.SRAM | 0)) {
            //Read is the same between SRAM and FLASH for the most part:
            data = this.saves[(address | 0) % (this.saves.length | 0)] | 0;
        }
    }
    return data | 0;
}
GameBoyAdvanceSaveDeterminer.prototype.writeGPIO8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    //GPIO (TODO):
}
GameBoyAdvanceSaveDeterminer.prototype.writeGPIO16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    //GPIO (TODO):
}
GameBoyAdvanceSaveDeterminer.prototype.writeGPIO32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    //GPIO (TODO):
}
GameBoyAdvanceSaveDeterminer.prototype.writeEEPROM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((this.possible & this.flags.EEPROM) == (this.flags.EEPROM | 0)) {
        //EEPROM:
        this.possible = this.flags.EEPROM | 0;
        this.checkDetermination();
        this.saveCore.writeEEPROM8(address | 0, data | 0);
    }
}
GameBoyAdvanceSaveDeterminer.prototype.writeEEPROM16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((this.possible & this.flags.EEPROM) == (this.flags.EEPROM | 0)) {
        //EEPROM:
        this.possible = this.flags.EEPROM | 0;
        this.checkDetermination();
        this.saveCore.writeEEPROM16(address | 0, data | 0);
    }
}
GameBoyAdvanceSaveDeterminer.prototype.writeEEPROM32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((this.possible & this.flags.EEPROM) == (this.flags.EEPROM | 0)) {
        //EEPROM:
        this.possible = this.flags.EEPROM | 0;
        this.checkDetermination();
        this.saveCore.writeEEPROM32(address | 0, data | 0);
    }
}
GameBoyAdvanceSaveDeterminer.prototype.readEEPROM8 = function (address) {
    address = address | 0;
    var data = 0;
    if ((this.possible & this.flags.EEPROM) == (this.flags.EEPROM | 0)) {
        //EEPROM:
        this.possible = this.flags.EEPROM | 0;
        this.checkDetermination();
        return this.saveCore.readEEPROM8(address | 0) | 0;
    }
}
GameBoyAdvanceSaveDeterminer.prototype.readEEPROM16 = function (address) {
    address = address | 0;
    var data = 0;
    if ((this.possible & this.flags.EEPROM) == (this.flags.EEPROM | 0)) {
        //EEPROM:
        this.possible = this.flags.EEPROM | 0;
        this.checkDetermination();
        return this.saveCore.readEEPROM16(address | 0) | 0;
    }
}
GameBoyAdvanceSaveDeterminer.prototype.readEEPROM32 = function (address) {
    address = address | 0;
    var data = 0;
    if ((this.possible & this.flags.EEPROM) == (this.flags.EEPROM | 0)) {
        //EEPROM:
        this.possible = this.flags.EEPROM | 0;
        this.checkDetermination();
        return this.saveCore.readEEPROM32(address | 0) | 0;
    }
}
GameBoyAdvanceSaveDeterminer.prototype.writeSRAM = function (address, data) {
    address = address | 0;
    data = data | 0;
    //Is not EEPROM:
    this.possible &= ~this.flags.EEPROM;
    if ((this.possible & this.flags.FLASH) == (this.flags.FLASH | 0)) {
        if ((this.possible & this.flags.SRAM) == (this.flags.SRAM | 0)) {
            if ((address | 0) == 0x5555) {
                if ((data | 0) == 0xAA) {
                    //FLASH
                    this.possible = this.flags.FLASH | 0;
                }
                else {
                    //SRAM
                    this.possible = this.flags.SRAM | 0;
                }
            }
        }
        else {
            if ((address | 0) == 0x5555) {
                if ((data | 0) == 0xAA) {
                    //FLASH
                    this.possible = this.flags.FLASH | 0;
                }
                else {
                    //Is not Flash:
                    this.possible &= ~this.flags.FLASH;
                }
            }
        }
    }
    else if ((this.possible & this.flags.SRAM) == (this.flags.SRAM | 0)) {
        //SRAM
        this.possible = this.flags.SRAM | 0;
    }
    this.checkDetermination();
    this.saveCore.writeSRAMIfDefined(address | 0, data | 0);
};
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
function GameBoyAdvanceSRAMChip() {
    this.saves = null;
    this.TILTChip = null;
    this.TILTChipUnlocked = 0;
}
GameBoyAdvanceSRAMChip.prototype.initialize = function () {
    if (this.saves == null || (this.saves.length | 0) != 0x8000) {
        this.saves = getUint8Array(0x8000);
    }
}
GameBoyAdvanceSRAMChip.prototype.load = function (save) {
    if ((save.length | 0) == 0x8000) {
        this.saves = save;
    }
}
GameBoyAdvanceSRAMChip.prototype.read = function (address) {
    address = address | 0;
    var data = 0;
    if ((address | 0) < 0x8000 || (this.TILTChipUnlocked | 0) != 3) {
        data = this.saves[address & 0x7FFF] | 0;
    }
    else {
        switch (address | 0) {
            case 0x8200:
                data = this.TILTChip.readXLow() | 0;
                break;
            case 0x8300:
                data = this.TILTChip.readXHigh() | 0;
                break;
            case 0x8400:
                data = this.TILTChip.readYLow() | 0;
                break;
            case 0x8500:
                data = this.TILTChip.readYHigh() | 0;
                break;
            default:
                data = this.saves[address & 0x7FFF] | 0;
        }
    }
    return data | 0;
}
GameBoyAdvanceSRAMChip.prototype.write = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((address | 0) < 0x8000 || (this.TILTChipUnlocked | 0) >= 4) {
        //Normal SRAM write:
        this.saves[address & 0x7FFF] = data | 0;
    }
    else {
        switch (address | 0) {
            case 0x8000:
                if ((data | 0) == 0x55) {           //Magic Combo.
                    this.TILTChipUnlocked |= 0x1;   //Tilt unlock stage 1.
                }
                else {
                    this.TILTChipUnlocked |= 0x4;   //Definitely not using a tilt sensor.
                }
                break;
            case 0x8100:
                if ((data | 0) == 0xAA) {           //Magic Combo.
                    this.TILTChipUnlocked |= 0x2;   //Tilt unlock stage 2.
                }
                else {
                    this.TILTChipUnlocked |= 0x4;   //Definitely not using a tilt sensor.
                }
                break;
            default:
                //Check for mirroring while not tilt chip:
                if ((this.TILTChipUnlocked | 0) == 0) {
                    this.saves[address & 0x7FFF] = data | 0;
                    this.TILTChipUnlocked |= 0x4;   //Definitely not using a tilt sensor.
                }
        }
    }
};
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
function GameBoyAdvanceFLASHChip(is128, isAteml) {
    this.largestSizePossible = (!!is128) ? 0x20000 : 0x10000;
    this.notATMEL = !isAteml;
    this.saves = null;
    this.BANKOffset = 0;
    this.flashCommandUnlockStage = 0;
    this.flashCommand = 0;
    this.writeBytesLeft = 0;
}
GameBoyAdvanceFLASHChip.prototype.initialize = function () {
    this.allocate();
}
GameBoyAdvanceFLASHChip.prototype.allocate = function () {
    if (this.saves == null || (this.saves.length | 0) < (this.largestSizePossible | 0)) {
        //Allocate the new array:
        var newSave = getUint8Array(this.largestSizePossible | 0);
        //Init to default value:
        for (var index = 0; (index | 0) < (this.largestSizePossible | 0); index = ((index | 0) + 1) | 0) {
            newSave[index | 0] = 0xFF;
        }
        //Copy the old save data out:
        if (this.saves != null) {
            for (var index = 0; (index | 0) < (this.saves.length | 0); index = ((index | 0) + 1) | 0) {
                newSave[index | 0] = this.saves[index | 0] | 0;
            }
        }
        //Assign the new array out:
        this.saves = newSave;
    }
}
GameBoyAdvanceFLASHChip.prototype.load = function (save) {
    if ((save.length | 0) == 0x10000 || (save.length | 0) == 0x20000) {
        this.saves = save;
        if ((save.length | 0) == 0x20000) {
            this.notATMEL = true;
        }
    }
}
GameBoyAdvanceFLASHChip.prototype.read = function (address) {
    address = address | 0;
    var data = 0;
    if ((this.flashCommand | 0) != 2 || (address | 0) > 1) {
        data = this.saves[address | this.BANKOffset] | 0;
    }
    else {
        if ((address | 0) == 0) {
            if (this.notATMEL) {
                data = ((this.largestSizePossible | 0) == 0x20000) ? 0x62 : 0xBF;
            }
            else {
                data = 0x1F;
            }
        }
        else {
            if (this.notATMEL) {
                data = ((this.largestSizePossible | 0) == 0x20000) ? 0x13 : 0xD4;
            }
            else {
                data = 0x3D;
            }
        }
    }
    return data | 0;
}
GameBoyAdvanceFLASHChip.prototype.write = function (address, data) {
    address = address | 0;
    data = data | 0;
    switch (this.writeBytesLeft | 0) {
        case 0:
            this.writeControlBits(address | 0, data | 0);
            break;
        case 0x80:
            var addressToErase = (address & 0xFF80) | this.BANKOffset;
            for (var index = 0; (index | 0) < 0x80; index = ((index | 0) + 1) | 0) {
                this.saves[addressToErase | index] = 0xFF;
            }
        default:
            this.writeByte(address | 0, data | 0);
            
    }
}
GameBoyAdvanceFLASHChip.prototype.writeControlBits = function (address, data) {
    address = address | 0;
    data = data | 0;
    switch (address | 0) {
        case 0:
            this.sectorEraseOrBankSwitch(address | 0, data | 0);
            break;
        case 0x5555:
            this.controlWriteStage2(data | 0);
            break;
        case 0x2AAA:
            this.controlWriteStageIncrement(data | 0);
            break;
        default:
            this.sectorErase(address | 0, data | 0);
    }
}
GameBoyAdvanceFLASHChip.prototype.writeByte = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.saves[address | this.BANKOffset] = data | 0;
    this.writeBytesLeft = ((this.writeBytesLeft | 0) - 1) | 0;
}
GameBoyAdvanceFLASHChip.prototype.selectBank = function (bankNumber) {
    bankNumber = bankNumber | 0;
    this.BANKOffset = (bankNumber & 0x1) << 16;
    this.largestSizePossible = Math.max((0x10000 + (this.BANKOffset | 0)) | 0, this.largestSizePossible | 0) | 0;
    this.notATMEL = true;
    this.allocate();
}
GameBoyAdvanceFLASHChip.prototype.controlWriteStage2 = function (data) {
    data = data | 0;
    if ((data | 0) == 0xAA) {
        //Initial Command:
        this.flashCommandUnlockStage = 1;
    }
    else if ((this.flashCommandUnlockStage | 0) == 2) {
        switch (data | 0) {
            case 0x10:
                //Command Erase Chip:
                if ((this.flashCommand | 0) == 1) {
                    for (var index = 0; (index | 0) < (this.largestSizePossible | 0); index = ((index | 0) + 1) | 0) {
                        this.saves[index | 0] = 0xFF;
                    }
                }
                this.flashCommand = 0;
                break;
            case 0x80:
                //Command Erase:
                this.flashCommand = 1;
                break;
            case 0x90:
                //Command ID:
                this.flashCommand = 2;
                break;
            case 0xA0:
                //Command Write:
                this.writeCommandTrigger();
                break;
            case 0xB0:
                //Command Bank Switch:
                this.flashCommand = 3;
                break;
            default:
                this.flashCommand = 0;
        }
        //Reset the command state:
        this.flashCommandUnlockStage = 0;
    }
    else if ((data | 0) == 0xF0) {
        //Command Clear:
        this.flashCommand = 0;
        this.flashCommandUnlockStage = 0;
        this.notATMEL = true;
    }
}
GameBoyAdvanceFLASHChip.prototype.writeCommandTrigger = function () {
    if ((this.flashCommandUnlockStage | 0) == 2) {
        if (this.notATMEL) {
            this.writeBytesLeft = 1;
        }
        else {
            this.writeBytesLeft = 0x80;
        }
    }
}
GameBoyAdvanceFLASHChip.prototype.sectorErase = function (address, data) {
    address = (address << 12) >> 12;
    data = data | 0;
    if ((this.flashCommand | 0) == 1 && (this.flashCommandUnlockStage | 0) == 2 && ((data | 0) == 0x30)) {
        var addressEnd = ((address | this.BANKOffset) + 0x1000) | 0;
        for (var index = address | this.BANKOffset; (index | 0) < (addressEnd | 0); index = ((index | 0) + 1) | 0) {
            this.saves[index | 0] = 0xFF;
        }
        this.notATMEL = true;
    }
    this.flashCommand = 0;
    this.flashCommandUnlockStage = 0;
}
GameBoyAdvanceFLASHChip.prototype.sectorEraseOrBankSwitch = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((this.flashCommandUnlockStage | 0) == 2) {
        this.sectorErase(address | 0, data | 0);
    }
    else if ((this.flashCommand | 0) == 3 && (this.flashCommandUnlockStage | 0) == 0) {
        this.selectBank(data & 0x1);
    }
    this.flashCommand = 0;
    this.flashCommandUnlockStage = 0;
}
GameBoyAdvanceFLASHChip.prototype.controlWriteStageIncrement = function (data) {
    if ((data | 0) == 0x55 && (this.flashCommandUnlockStage | 0) == 1) {
        this.flashCommandUnlockStage = ((this.flashCommandUnlockStage | 0) + 1) | 0;
    }
    else {
        this.flashCommandUnlockStage = 0;
    }
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GameBoyAdvanceEEPROMChip(IOCore) {
    this.saves = null;
    this.largestSizePossible = 0x200;
    this.mode = 0;
    this.bitsProcessed = 0;
    this.address = 0;
    this.buffer = getUint8Array(8);
    this.IOCore = IOCore;
    //Special note to emulator authors: EEPROM command ending bit "0" can also be a "1"...
}
GameBoyAdvanceEEPROMChip.prototype.initialize = function () {
    this.allocate();
}
GameBoyAdvanceEEPROMChip.prototype.allocate = function () {
    if (this.saves == null || (this.saves.length | 0) < (this.largestSizePossible | 0)) {
        //Allocate the new array:
        var newSave = getUint8Array(this.largestSizePossible | 0);
        //Init to default value:
        for (var index = 0; (index | 0) < (this.largestSizePossible | 0); index = ((index | 0) + 1) | 0) {
            newSave[index | 0] = 0xFF;
        }
        //Copy the old save data out:
        if (this.saves != null) {
            for (var index = 0; (index | 0) < (this.saves.length | 0); index = ((index | 0) + 1) | 0) {
                newSave[index | 0] = this.saves[index | 0] | 0;
            }
        }
        //Assign the new array out:
        this.saves = newSave;
    }
}
GameBoyAdvanceEEPROMChip.prototype.load = function (save) {
    if ((save.length | 0) == 0x200 || (save.length | 0) == 0x2000) {
        this.saves = save;
    }
}
GameBoyAdvanceEEPROMChip.prototype.read8 = function () {
    //Can't do real reading with 8-bit reads:
    return 0x1;
}
GameBoyAdvanceEEPROMChip.prototype.read16 = function () {
    var data = 1;
    switch (this.mode | 0) {
        case 0x7:
            //Return 4 junk 0 bits:
            data = 0;
            if ((this.bitsProcessed | 0) < 3) {
                //Increment our bits counter:
                this.bitsProcessed = ((this.bitsProcessed | 0) + 1) | 0;
            }
            else {
                //Reset our bits counter:
                this.bitsProcessed = 0;
                //Change mode for the actual reads:
                this.mode = 8;
            }
            break;
        case 0x8:
            //Return actual serial style data:
            var address = ((this.bitsProcessed >> 3) + (this.address | 0)) | 0;
            data = (this.saves[address | 0] >> ((0x7 - (this.bitsProcessed & 0x7)) | 0)) & 0x1;
            //Check for end of read:
            if ((this.bitsProcessed | 0) < 0x3F) {
                //Increment our bits counter:
                this.bitsProcessed = ((this.bitsProcessed | 0) + 1) | 0;
            }
            else {
                //Finished read and now idle:
                this.resetMode();
            }
    }
    return data | 0;
}
GameBoyAdvanceEEPROMChip.prototype.read32 = function () {
    //Can't do real reading with 32-bit reads:
    return 0x10001;
}
GameBoyAdvanceEEPROMChip.prototype.write8 = function (data) {
    //Fails on hardware
}
GameBoyAdvanceEEPROMChip.prototype.write16 = function (data) {
    data = data & 0x1;
    if (this.IOCore.inDMA()) {
        //Writes only work in DMA:
        switch (this.mode | 0) {
                //Idle Mode:
            case 0:
                this.mode = data | 0;
                break;
                //Select Mode:
            case 0x1:
                this.selectMode(data | 0);
                break;
                //Address Mode (Write):
            case 0x2:
                //Address Mode (Read):
            case 0x3:
                this.addressMode(data | 0);
                break;
                //Write Mode:
            case 0x4:
                this.writeMode(data | 0);
                break;
                //Ending bit of addressing:
            case 0x5:
            case 0x6:
                this.endAddressing();
                break;
                //Read Mode:
            default:
                this.resetMode();
        }
    }
}
GameBoyAdvanceEEPROMChip.prototype.write32 = function (data) {
    //Fails on hardware
}
GameBoyAdvanceEEPROMChip.prototype.selectMode = function (data) {
    data = data | 0;
    //Reset our address:
    this.address = 0;
    //Reset our bits counter:
    this.bitsProcessed = 0;
    //Read the mode bit:
    this.mode = 0x2 | data;
}
GameBoyAdvanceEEPROMChip.prototype.addressMode = function (data) {
    data = data | 0;
    //Shift in our address bit:
    this.address = (this.address << 1) | data;
    //Increment our bits counter:
    this.bitsProcessed = ((this.bitsProcessed | 0) + 1) | 0;
    //Check for how many bits we've shifted in:
    switch (this.bitsProcessed | 0) {
        //6 bit address mode:
        case 0x6:
            if ((this.IOCore.dma.channels[3].wordCountShadow | 0) >= (((this.mode | 0) == 2) ? 0x4A : 0xA)) {
                this.largestSizePossible = 0x2000;
                this.allocate();
                break;
            }
        //14 bit address mode:
        case 0xE:
            this.changeModeToActive();
    }
}
GameBoyAdvanceEEPROMChip.prototype.changeModeToActive = function () {
    //Ensure the address range:
    this.address &= 0x3FF;
    //Addressing in units of 8 bytes:
    this.address <<= 3;
    //Reset our bits counter:
    this.bitsProcessed = 0;
    //Change to R/W Mode:
    this.mode = ((this.mode | 0) + 2) | 0;
}
GameBoyAdvanceEEPROMChip.prototype.writeMode = function (data) {
    data = data | 0;
    //Push a bit into the buffer:
    this.pushBuffer(data | 0);
    //Save on last write bit push:
    if ((this.bitsProcessed | 0) == 0x40) {
        //64 bits buffered, so copy our buffer to the save data:
        this.copyBuffer();
        this.mode = 6;
    }
}
GameBoyAdvanceEEPROMChip.prototype.pushBuffer = function (data) {
    data = data | 0;
    //Push a bit through our serial buffer:
    var bufferPosition = this.bitsProcessed >> 3;
    this.buffer[bufferPosition & 0x7] = ((this.buffer[bufferPosition & 0x7] << 1) & 0xFE) | data;
    this.bitsProcessed = ((this.bitsProcessed | 0) + 1) | 0;
}
GameBoyAdvanceEEPROMChip.prototype.copyBuffer = function () {
    //Copy 8 bytes from buffer to EEPROM save data starting at address offset:
    for (var index = 0; (index | 0) < 8; index = ((index | 0) + 1) | 0) {
        this.saves[this.address | index] = this.buffer[index & 0x7] & 0xFF;
    }
}
GameBoyAdvanceEEPROMChip.prototype.endAddressing = function () {
    this.mode = ((this.mode | 0) + 2) | 0;
}
GameBoyAdvanceEEPROMChip.prototype.resetMode = function () {
    //Reset back to idle:
    this.mode = 0;
}/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
function Resampler(fromSampleRate, toSampleRate, channels, outputBufferSize, noReturn) {
	this.fromSampleRate = fromSampleRate;
	this.toSampleRate = toSampleRate;
	this.channels = channels | 0;
	this.outputBufferSize = outputBufferSize;
	this.noReturn = !!noReturn;
	this.initialize();
}
Resampler.prototype.initialize = function () {
	//Perform some checks:
	if (this.fromSampleRate > 0 && this.toSampleRate > 0 && this.channels > 0) {
		if (this.fromSampleRate == this.toSampleRate) {
			//Setup a resampler bypass:
			this.resampler = this.bypassResampler;		//Resampler just returns what was passed through.
            this.ratioWeight = 1;
		}
		else {
            this.ratioWeight = this.fromSampleRate / this.toSampleRate;
			if (this.fromSampleRate < this.toSampleRate) {
				/*
					Use generic linear interpolation if upsampling,
					as linear interpolation produces a gradient that we want
					and works fine with two input sample points per output in this case.
				*/
				this.compileLinearInterpolationFunction();
				this.lastWeight = 1;
			}
			else {
				/*
					Custom resampler I wrote that doesn't skip samples
					like standard linear interpolation in high downsampling.
					This is more accurate than linear interpolation on downsampling.
				*/
				this.compileMultiTapFunction();
				this.tailExists = false;
				this.lastWeight = 0;
			}
			this.initializeBuffers();
		}
	}
	else {
		throw(new Error("Invalid settings specified for the resampler."));
	}
}
Resampler.prototype.compileLinearInterpolationFunction = function () {
	var toCompile = "var bufferLength = buffer.length;\
	var outLength = this.outputBufferSize;\
	if ((bufferLength % " + this.channels + ") == 0) {\
		if (bufferLength > 0) {\
			var weight = this.lastWeight;\
			var firstWeight = 0;\
			var secondWeight = 0;\
			var sourceOffset = 0;\
			var outputOffset = 0;\
			var outputBuffer = this.outputBuffer;\
			for (; weight < 1; weight += " + this.ratioWeight + ") {\
				secondWeight = weight % 1;\
				firstWeight = 1 - secondWeight;";
	for (var channel = 0; channel < this.channels; ++channel) {
		toCompile += "outputBuffer[outputOffset++] = (this.lastOutput[" + channel + "] * firstWeight) + (buffer[" + channel + "] * secondWeight);";
	}
	toCompile += "}\
			weight -= 1;\
			for (bufferLength -= " + this.channels + ", sourceOffset = Math.floor(weight) * " + this.channels + "; outputOffset < outLength && sourceOffset < bufferLength;) {\
				secondWeight = weight % 1;\
				firstWeight = 1 - secondWeight;";
	for (var channel = 0; channel < this.channels; ++channel) {
		toCompile += "outputBuffer[outputOffset++] = (buffer[sourceOffset" + ((channel > 0) ? (" + " + channel) : "") + "] * firstWeight) + (buffer[sourceOffset + " + (this.channels + channel) + "] * secondWeight);";
	}
	toCompile += "weight += " + this.ratioWeight + ";\
				sourceOffset = Math.floor(weight) * " + this.channels + ";\
			}";
	for (var channel = 0; channel < this.channels; ++channel) {
		toCompile += "this.lastOutput[" + channel + "] = buffer[sourceOffset++];";
	}
	toCompile += "this.lastWeight = weight % 1;\
			return this.bufferSlice(outputOffset);\
		}\
		else {\
			return (this.noReturn) ? 0 : [];\
		}\
	}\
	else {\
		throw(new Error(\"Buffer was of incorrect sample length.\"));\
	}";
	this.resampler = Function("buffer", toCompile);
}
Resampler.prototype.compileMultiTapFunction = function () {
	var toCompile = "var bufferLength = buffer.length;\
	var outLength = this.outputBufferSize;\
	if ((bufferLength % " + this.channels + ") == 0) {\
		if (bufferLength > 0) {\
			var weight = 0;";
	for (var channel = 0; channel < this.channels; ++channel) {
		toCompile += "var output" + channel + " = 0;"
	}
	toCompile += "var actualPosition = 0;\
			var amountToNext = 0;\
			var alreadyProcessedTail = !this.tailExists;\
			this.tailExists = false;\
			var outputBuffer = this.outputBuffer;\
			var outputOffset = 0;\
			var currentPosition = 0;\
			do {\
				if (alreadyProcessedTail) {\
					weight = " + this.ratioWeight + ";";
	for (channel = 0; channel < this.channels; ++channel) {
		toCompile += "output" + channel + " = 0;"
	}
	toCompile += "}\
				else {\
					weight = this.lastWeight;";
	for (channel = 0; channel < this.channels; ++channel) {
		toCompile += "output" + channel + " = this.lastOutput[" + channel + "];"
	}
	toCompile += "alreadyProcessedTail = true;\
				}\
				while (weight > 0 && actualPosition < bufferLength) {\
					amountToNext = 1 + actualPosition - currentPosition;\
					if (weight >= amountToNext) {";
	for (channel = 0; channel < this.channels; ++channel) {
		toCompile += "output" + channel + " += buffer[actualPosition++] * amountToNext;"
	}
	toCompile += "currentPosition = actualPosition;\
						weight -= amountToNext;\
					}\
					else {";
	for (channel = 0; channel < this.channels; ++channel) {
		toCompile += "output" + channel + " += buffer[actualPosition" + ((channel > 0) ? (" + " + channel) : "") + "] * weight;"
	}
	toCompile += "currentPosition += weight;\
						weight = 0;\
						break;\
					}\
				}\
				if (weight <= 0) {";
	for (channel = 0; channel < this.channels; ++channel) {
		toCompile += "outputBuffer[outputOffset++] = output" + channel + " / " + this.ratioWeight + ";"
	}
	toCompile += "}\
				else {\
					this.lastWeight = weight;";
	for (channel = 0; channel < this.channels; ++channel) {
		toCompile += "this.lastOutput[" + channel + "] = output" + channel + ";"
	}
	toCompile += "this.tailExists = true;\
					break;\
				}\
			} while (actualPosition < bufferLength && outputOffset < outLength);\
			return this.bufferSlice(outputOffset);\
		}\
		else {\
			return (this.noReturn) ? 0 : [];\
		}\
	}\
	else {\
		throw(new Error(\"Buffer was of incorrect sample length.\"));\
	}";
	this.resampler = Function("buffer", toCompile);
}
Resampler.prototype.bypassResampler = function (buffer) {
	if (this.noReturn) {
		//Set the buffer passed as our own, as we don't need to resample it:
		this.outputBuffer = buffer;
		return buffer.length;
	}
	else {
		//Just return the buffer passsed:
		return buffer;
	}
}
Resampler.prototype.bufferSlice = function (sliceAmount) {
	if (this.noReturn) {
		//If we're going to access the properties directly from this object:
		return sliceAmount;
	}
	else {
		//Typed array and normal array buffer section referencing:
		try {
			return this.outputBuffer.subarray(0, sliceAmount);
		}
		catch (error) {
			try {
				//Regular array pass:
				this.outputBuffer.length = sliceAmount;
				return this.outputBuffer;
			}
			catch (error) {
				//Nightly Firefox 4 used to have the subarray function named as slice:
				return this.outputBuffer.slice(0, sliceAmount);
			}
		}
	}
}
Resampler.prototype.initializeBuffers = function () {
	//Initialize the internal buffer:
	try {
		this.outputBuffer = new Float32Array(this.outputBufferSize);
		this.lastOutput = new Float32Array(this.channels);
	}
	catch (error) {
		this.outputBuffer = [];
		this.lastOutput = [];
	}
}//2010-2013 Grant Galitz - XAudioJS realtime audio output compatibility library:
var XAudioJSscriptsHandle = document.getElementsByTagName("script");
var XAudioJSsourceHandle = XAudioJSscriptsHandle[XAudioJSscriptsHandle.length-1].src;
function XAudioServer(channels, sampleRate, minBufferSize, maxBufferSize, underRunCallback, volume, failureCallback) {
	XAudioJSChannelsAllocated = Math.max(channels, 1);
	this.XAudioJSSampleRate = Math.abs(sampleRate);
	XAudioJSMinBufferSize = (minBufferSize >= (XAudioJSSamplesPerCallback * XAudioJSChannelsAllocated) && minBufferSize < maxBufferSize) ? (minBufferSize & (-XAudioJSChannelsAllocated)) : (XAudioJSSamplesPerCallback * XAudioJSChannelsAllocated);
	XAudioJSMaxBufferSize = (Math.floor(maxBufferSize) > XAudioJSMinBufferSize + XAudioJSChannelsAllocated) ? (maxBufferSize & (-XAudioJSChannelsAllocated)) : (XAudioJSMinBufferSize * XAudioJSChannelsAllocated);
	this.underRunCallback = (typeof underRunCallback == "function") ? underRunCallback : function () {};
	XAudioJSVolume = (volume >= 0 && volume <= 1) ? volume : 1;
	this.failureCallback = (typeof failureCallback == "function") ? failureCallback : function () { throw(new Error("XAudioJS has encountered a fatal error.")); };
	this.initializeAudio();
}
XAudioServer.prototype.MOZWriteAudioNoCallback = function (buffer) {
    //Resample before passing to the moz audio api:
    var bufferLength  = buffer.length;
    for (var bufferIndex = 0; bufferIndex < bufferLength;) {
        var sliceLength = Math.min(bufferLength - bufferIndex, XAudioJSMaxBufferSize);
        for (var sliceIndex = 0; sliceIndex < sliceLength; ++sliceIndex) {
            XAudioJSAudioContextSampleBuffer[sliceIndex] = buffer[bufferIndex++];
        }
        var resampleLength = XAudioJSResampleControl.resampler(XAudioJSGetArraySlice(XAudioJSAudioContextSampleBuffer, sliceIndex));
        if (resampleLength > 0) {
            var resampledResult = XAudioJSResampleControl.outputBuffer;
            var resampledBuffer = XAudioJSGetArraySlice(resampledResult, resampleLength);
            this.samplesAlreadyWritten += this.audioHandleMoz.mozWriteAudio(resampledBuffer);
        }
    }
}
XAudioServer.prototype.callbackBasedWriteAudioNoCallback = function (buffer) {
	//Callback-centered audio APIs:
	var length = buffer.length;
	for (var bufferCounter = 0; bufferCounter < length && XAudioJSAudioBufferSize < XAudioJSMaxBufferSize;) {
		XAudioJSAudioContextSampleBuffer[XAudioJSAudioBufferSize++] = buffer[bufferCounter++];
	}
}
/*Pass your samples into here!
Pack your samples as a one-dimenional array
With the channel samples packed uniformly.
examples:
    mono - [left, left, left, left]
    stereo - [left, right, left, right, left, right, left, right]
*/
XAudioServer.prototype.writeAudio = function (buffer) {
	switch (this.audioType) {
		case 0:
			this.MOZWriteAudioNoCallback(buffer);
			this.MOZExecuteCallback();
			break;
		case 2:
			this.checkFlashInit();
		case 1:
		case 3:
			this.callbackBasedWriteAudioNoCallback(buffer);
			this.callbackBasedExecuteCallback();
			break;
		default:
			this.failureCallback();
	}
}
/*Pass your samples into here if you don't want automatic callback calling:
Pack your samples as a one-dimenional array
With the channel samples packed uniformly.
examples:
    mono - [left, left, left, left]
    stereo - [left, right, left, right, left, right, left, right]
Useful in preventing infinite recursion issues with calling writeAudio inside your callback.
*/
XAudioServer.prototype.writeAudioNoCallback = function (buffer) {
	switch (this.audioType) {
		case 0:
			this.MOZWriteAudioNoCallback(buffer);
			break;
		case 2:
			this.checkFlashInit();
		case 1:
		case 3:
			this.callbackBasedWriteAudioNoCallback(buffer);
			break;
		default:
			this.failureCallback();
	}
}
//Developer can use this to see how many samples to write (example: minimum buffer allotment minus remaining samples left returned from this function to make sure maximum buffering is done...)
//If null is returned, then that means metric could not be done.
XAudioServer.prototype.remainingBuffer = function () {
	switch (this.audioType) {
		case 0:
			return Math.floor((this.samplesAlreadyWritten - this.audioHandleMoz.mozCurrentSampleOffset()) * XAudioJSResampleControl.ratioWeight / XAudioJSChannelsAllocated) * XAudioJSChannelsAllocated;
		case 2:
			this.checkFlashInit();
		case 1:
		case 3:
			return (Math.floor((XAudioJSResampledSamplesLeft() * XAudioJSResampleControl.ratioWeight) / XAudioJSChannelsAllocated) * XAudioJSChannelsAllocated) + XAudioJSAudioBufferSize;
		default:
			this.failureCallback();
			return null;
	}
}
XAudioServer.prototype.MOZExecuteCallback = function () {
	//mozAudio:
	var samplesRequested = XAudioJSMinBufferSize - this.remainingBuffer();
	if (samplesRequested > 0) {
		this.MOZWriteAudioNoCallback(this.underRunCallback(samplesRequested));
	}
}
XAudioServer.prototype.callbackBasedExecuteCallback = function () {
	//WebKit /Flash Audio:
	var samplesRequested = XAudioJSMinBufferSize - this.remainingBuffer();
	if (samplesRequested > 0) {
		this.callbackBasedWriteAudioNoCallback(this.underRunCallback(samplesRequested));
	}
}
//If you just want your callback called for any possible refill (Execution of callback is still conditional):
XAudioServer.prototype.executeCallback = function () {
	switch (this.audioType) {
		case 0:
			this.MOZExecuteCallback();
			break;
		case 2:
			this.checkFlashInit();
		case 1:
		case 3:
			this.callbackBasedExecuteCallback();
			break;
		default:
			this.failureCallback();
	}
}
//DO NOT CALL THIS, the lib calls this internally!
XAudioServer.prototype.initializeAudio = function () {
    try {
        this.initializeMozAudio();
    }
    catch (error) {
        try {
            this.initializeWebAudio();
        }
        catch (error) {
            try {
                this.initializeMediaStream();
            }
            catch (error) {
                try {
                    this.initializeFlashAudio();
                }
                catch (error) {
                    this.audioType = -1;
                    this.failureCallback();
                }
            }
        }
    }
}
XAudioServer.prototype.initializeMediaStream = function () {
	this.audioHandleMediaStream = new Audio();
	this.resetCallbackAPIAudioBuffer(XAudioJSMediaStreamSampleRate);
	if (XAudioJSMediaStreamWorker) {
		//WebWorker is not GC'd, so manually collect it:
		XAudioJSMediaStreamWorker.terminate();
	}
	XAudioJSMediaStreamWorker = new Worker(XAudioJSsourceHandle.substring(0, XAudioJSsourceHandle.length - 3) + "MediaStreamWorker.js");
	this.audioHandleMediaStreamProcessing = new ProcessedMediaStream(XAudioJSMediaStreamWorker, XAudioJSMediaStreamSampleRate, XAudioJSChannelsAllocated);
	this.audioHandleMediaStream.src = this.audioHandleMediaStreamProcessing;
	this.audioHandleMediaStream.volume = XAudioJSVolume;
	XAudioJSMediaStreamWorker.onmessage = XAudioJSMediaStreamPushAudio;
	XAudioJSMediaStreamWorker.postMessage([1, XAudioJSResampleBufferSize, XAudioJSChannelsAllocated]);
	this.audioHandleMediaStream.play();
	this.audioType = 3;
}
XAudioServer.prototype.initializeMozAudio = function () {
    this.audioHandleMoz = new Audio();
	this.audioHandleMoz.mozSetup(XAudioJSChannelsAllocated, XAudioJSMozAudioSampleRate);
	this.audioHandleMoz.volume = XAudioJSVolume;
	this.samplesAlreadyWritten = 0;
	this.audioType = 0;
	//if (navigator.platform != "MacIntel" && navigator.platform != "MacPPC") {
		//Add some additional buffering space to workaround a moz audio api issue:
		var bufferAmount = (this.XAudioJSSampleRate * XAudioJSChannelsAllocated / 10) | 0;
		bufferAmount -= bufferAmount % XAudioJSChannelsAllocated;
		this.samplesAlreadyWritten -= bufferAmount;
	//}
    this.initializeResampler(XAudioJSMozAudioSampleRate);
}
XAudioServer.prototype.initializeWebAudio = function () {
    if (!XAudioJSWebAudioLaunchedContext) {
        try {
            XAudioJSWebAudioContextHandle = new AudioContext();								//Create a system audio context.
        }
        catch (error) {
            XAudioJSWebAudioContextHandle = new webkitAudioContext();							//Create a system audio context.
        }
        XAudioJSWebAudioLaunchedContext = true;
    }
    if (XAudioJSWebAudioAudioNode) {
        XAudioJSWebAudioAudioNode.disconnect();
        XAudioJSWebAudioAudioNode.onaudioprocess = null;
        XAudioJSWebAudioAudioNode = null;
    }
    try {
        XAudioJSWebAudioAudioNode = XAudioJSWebAudioContextHandle.createScriptProcessor(XAudioJSSamplesPerCallback, 0, XAudioJSChannelsAllocated);	//Create the js event node.
    }
    catch (error) {
        XAudioJSWebAudioAudioNode = XAudioJSWebAudioContextHandle.createJavaScriptNode(XAudioJSSamplesPerCallback, 0, XAudioJSChannelsAllocated);	//Create the js event node.
    }
    XAudioJSWebAudioAudioNode.onaudioprocess = XAudioJSWebAudioEvent;																			//Connect the audio processing event to a handling function so we can manipulate output
    XAudioJSWebAudioAudioNode.connect(XAudioJSWebAudioContextHandle.destination);																//Send and chain the output of the audio manipulation to the system audio output.
    this.resetCallbackAPIAudioBuffer(XAudioJSWebAudioContextHandle.sampleRate);
    this.audioType = 1;
}
XAudioServer.prototype.initializeFlashAudio = function () {
	var existingFlashload = document.getElementById("XAudioJS");
	this.flashInitialized = false;
	this.resetCallbackAPIAudioBuffer(44100);
	switch (XAudioJSChannelsAllocated) {
		case 1:
			XAudioJSFlashTransportEncoder = XAudioJSGenerateFlashMonoString;
			break;
		case 2:
			XAudioJSFlashTransportEncoder = XAudioJSGenerateFlashStereoString;
			break;
		default:
			XAudioJSFlashTransportEncoder = XAudioJSGenerateFlashSurroundString;
	}
	if (existingFlashload == null) {
		this.audioHandleFlash = null;
		var thisObj = this;
		var mainContainerNode = document.createElement("div");
		mainContainerNode.setAttribute("style", "position: fixed; bottom: 0px; right: 0px; margin: 0px; padding: 0px; border: none; width: 8px; height: 8px; overflow: hidden; z-index: -1000; ");
		var containerNode = document.createElement("div");
		containerNode.setAttribute("style", "position: static; border: none; width: 0px; height: 0px; visibility: hidden; margin: 8px; padding: 0px;");
		containerNode.setAttribute("id", "XAudioJS");
		mainContainerNode.appendChild(containerNode);
		document.getElementsByTagName("body")[0].appendChild(mainContainerNode);
		swfobject.embedSWF(
			XAudioJSsourceHandle.substring(0, XAudioJSsourceHandle.length - 9) + "JS.swf",
			"XAudioJS",
			"8",
			"8",
			"9.0.0",
			"",
			{},
			{"allowscriptaccess":"always"},
			{"style":"position: static; visibility: hidden; margin: 8px; padding: 0px; border: none"},
			function (event) {
				if (event.success) {
					thisObj.audioHandleFlash = event.ref;
					thisObj.checkFlashInit();
				}
				else {
					thisObj.failureCallback();
					thisObj.audioType = -1;
				}
			}
		);
	}
	else {
		this.audioHandleFlash = existingFlashload;
		this.checkFlashInit();
	}
	this.audioType = 2;
}
XAudioServer.prototype.changeVolume = function (newVolume) {
	if (newVolume >= 0 && newVolume <= 1) {
		XAudioJSVolume = newVolume;
		switch (this.audioType) {
			case 0:
				this.audioHandleMoz.volume = XAudioJSVolume;
			case 1:
				break;
			case 2:
				if (this.flashInitialized) {
					this.audioHandleFlash.changeVolume(XAudioJSVolume);
				}
				else {
					this.checkFlashInit();
				}
				break;
			case 3:
				this.audioHandleMediaStream.volume = XAudioJSVolume;
				break;
			default:
				this.failureCallback();
		}
	}
}
//Checks to see if the NPAPI Adobe Flash bridge is ready yet:
XAudioServer.prototype.checkFlashInit = function () {
	if (!this.flashInitialized) {
		try {
			if (this.audioHandleFlash && this.audioHandleFlash.initialize) {
				this.flashInitialized = true;
				this.audioHandleFlash.initialize(XAudioJSChannelsAllocated, XAudioJSVolume);
			}
		}
		catch (error) {
			this.flashInitialized = false;
		}
	}
}
//Set up the resampling:
XAudioServer.prototype.resetCallbackAPIAudioBuffer = function (APISampleRate) {
	XAudioJSAudioBufferSize = XAudioJSResampleBufferEnd = XAudioJSResampleBufferStart = 0;
    this.initializeResampler(APISampleRate);
    XAudioJSResampledBuffer = this.getFloat32(XAudioJSResampleBufferSize);
}
XAudioServer.prototype.initializeResampler = function (sampleRate) {
    XAudioJSAudioContextSampleBuffer = this.getFloat32(XAudioJSMaxBufferSize);
    XAudioJSResampleBufferSize = Math.max(XAudioJSMaxBufferSize * Math.ceil(sampleRate / this.XAudioJSSampleRate) + XAudioJSChannelsAllocated, XAudioJSSamplesPerCallback * XAudioJSChannelsAllocated);
	XAudioJSResampleControl = new Resampler(this.XAudioJSSampleRate, sampleRate, XAudioJSChannelsAllocated, XAudioJSResampleBufferSize, true);
}
XAudioServer.prototype.getFloat32 = function (size) {
	try {
		return new Float32Array(size);
	}
	catch (error) {
		return [];
	}
}
function XAudioJSFlashAudioEvent() {		//The callback that flash calls...
	XAudioJSResampleRefill();
	return XAudioJSFlashTransportEncoder();
}
function XAudioJSGenerateFlashSurroundString() {	//Convert the arrays to one long string for speed.
	var XAudioJSTotalSamples = XAudioJSSamplesPerCallback << 1;
	if (XAudioJSBinaryString.length > XAudioJSTotalSamples) {
		XAudioJSBinaryString = [];
	}
	XAudioJSTotalSamples = 0;
	for (var index = 0; index < XAudioJSSamplesPerCallback && XAudioJSResampleBufferStart != XAudioJSResampleBufferEnd; ++index) {
		//Sanitize the buffer:
		XAudioJSBinaryString[XAudioJSTotalSamples++] = String.fromCharCode(((Math.min(Math.max(XAudioJSResampledBuffer[XAudioJSResampleBufferStart++] + 1, 0), 2) * 0x3FFF) | 0) + 0x3000);
		XAudioJSBinaryString[XAudioJSTotalSamples++] = String.fromCharCode(((Math.min(Math.max(XAudioJSResampledBuffer[XAudioJSResampleBufferStart++] + 1, 0), 2) * 0x3FFF) | 0) + 0x3000);
		XAudioJSResampleBufferStart += XAudioJSChannelsAllocated - 2;
		if (XAudioJSResampleBufferStart == XAudioJSResampleBufferSize) {
			XAudioJSResampleBufferStart = 0;
		}
	}
	return XAudioJSBinaryString.join("");
}
function XAudioJSGenerateFlashStereoString() {	//Convert the arrays to one long string for speed.
	var XAudioJSTotalSamples = XAudioJSSamplesPerCallback << 1;
	if (XAudioJSBinaryString.length > XAudioJSTotalSamples) {
		XAudioJSBinaryString = [];
	}
	for (var index = 0; index < XAudioJSTotalSamples && XAudioJSResampleBufferStart != XAudioJSResampleBufferEnd;) {
		//Sanitize the buffer:
		XAudioJSBinaryString[index++] = String.fromCharCode(((Math.min(Math.max(XAudioJSResampledBuffer[XAudioJSResampleBufferStart++] + 1, 0), 2) * 0x3FFF) | 0) + 0x3000);
		XAudioJSBinaryString[index++] = String.fromCharCode(((Math.min(Math.max(XAudioJSResampledBuffer[XAudioJSResampleBufferStart++] + 1, 0), 2) * 0x3FFF) | 0) + 0x3000);
		if (XAudioJSResampleBufferStart == XAudioJSResampleBufferSize) {
			XAudioJSResampleBufferStart = 0;
		}
	}
	return XAudioJSBinaryString.join("");
}
function XAudioJSGenerateFlashMonoString() {	//Convert the array to one long string for speed.
	if (XAudioJSBinaryString.length > XAudioJSSamplesPerCallback) {
		XAudioJSBinaryString = [];
	}
	for (var index = 0; index < XAudioJSSamplesPerCallback && XAudioJSResampleBufferStart != XAudioJSResampleBufferEnd;) {
		//Sanitize the buffer:
		XAudioJSBinaryString[index++] = String.fromCharCode(((Math.min(Math.max(XAudioJSResampledBuffer[XAudioJSResampleBufferStart++] + 1, 0), 2) * 0x3FFF) | 0) + 0x3000);
		if (XAudioJSResampleBufferStart == XAudioJSResampleBufferSize) {
			XAudioJSResampleBufferStart = 0;
		}
	}
	return XAudioJSBinaryString.join("");
}
//Some Required Globals:
var XAudioJSWebAudioContextHandle = null;
var XAudioJSWebAudioAudioNode = null;
var XAudioJSWebAudioLaunchedContext = false;
var XAudioJSAudioContextSampleBuffer = [];
var XAudioJSResampledBuffer = [];
var XAudioJSMinBufferSize = 15000;
var XAudioJSMaxBufferSize = 25000;
var XAudioJSChannelsAllocated = 1;
var XAudioJSVolume = 1;
var XAudioJSResampleControl = null;
var XAudioJSAudioBufferSize = 0;
var XAudioJSResampleBufferStart = 0;
var XAudioJSResampleBufferEnd = 0;
var XAudioJSResampleBufferSize = 0;
var XAudioJSMediaStreamWorker = null;
var XAudioJSMediaStreamBuffer = [];
var XAudioJSMediaStreamSampleRate = 44100;
var XAudioJSMozAudioSampleRate = 44100;
var XAudioJSSamplesPerCallback = 2048;			//Has to be between 2048 and 4096 (If over, then samples are ignored, if under then silence is added).
var XAudioJSFlashTransportEncoder = null;
var XAudioJSMediaStreamLengthAliasCounter = 0;
var XAudioJSBinaryString = [];
function XAudioJSWebAudioEvent(event) {		//Web Audio API callback...
	//Find all output channels:
	for (var bufferCount = 0, buffers = []; bufferCount < XAudioJSChannelsAllocated; ++bufferCount) {
		buffers[bufferCount] = event.outputBuffer.getChannelData(bufferCount);
	}
	//Make sure we have resampled samples ready:
	XAudioJSResampleRefill();
	//Copy samples from XAudioJS to the Web Audio API:
	for (var index = 0; index < XAudioJSSamplesPerCallback && XAudioJSResampleBufferStart != XAudioJSResampleBufferEnd; ++index) {
		for (bufferCount = 0; bufferCount < XAudioJSChannelsAllocated; ++bufferCount) {
			buffers[bufferCount][index] = XAudioJSResampledBuffer[XAudioJSResampleBufferStart++] * XAudioJSVolume;
		}
		if (XAudioJSResampleBufferStart == XAudioJSResampleBufferSize) {
			XAudioJSResampleBufferStart = 0;
		}
	}
	//Pad with silence if we're underrunning:
	while (index < XAudioJSSamplesPerCallback) {
		for (bufferCount = 0; bufferCount < XAudioJSChannelsAllocated; ++bufferCount) {
			buffers[bufferCount][index] = 0;
		}
		++index;
	}
}
//MediaStream API buffer push
function XAudioJSMediaStreamPushAudio(event) {
	var index = 0;
	var audioLengthRequested = event.data;
	var samplesPerCallbackAll = XAudioJSSamplesPerCallback * XAudioJSChannelsAllocated;
	var XAudioJSMediaStreamLengthAlias = audioLengthRequested % XAudioJSSamplesPerCallback;
	audioLengthRequested = audioLengthRequested - (XAudioJSMediaStreamLengthAliasCounter - (XAudioJSMediaStreamLengthAliasCounter % XAudioJSSamplesPerCallback)) - XAudioJSMediaStreamLengthAlias + XAudioJSSamplesPerCallback;
	XAudioJSMediaStreamLengthAliasCounter -= XAudioJSMediaStreamLengthAliasCounter - (XAudioJSMediaStreamLengthAliasCounter % XAudioJSSamplesPerCallback);
	XAudioJSMediaStreamLengthAliasCounter += XAudioJSSamplesPerCallback - XAudioJSMediaStreamLengthAlias;
	if (XAudioJSMediaStreamBuffer.length != samplesPerCallbackAll) {
		XAudioJSMediaStreamBuffer = new Float32Array(samplesPerCallbackAll);
	}
	XAudioJSResampleRefill();
	while (index < audioLengthRequested) {
		var index2 = 0;
		while (index2 < samplesPerCallbackAll && XAudioJSResampleBufferStart != XAudioJSResampleBufferEnd) {
			XAudioJSMediaStreamBuffer[index2++] = XAudioJSResampledBuffer[XAudioJSResampleBufferStart++];
			if (XAudioJSResampleBufferStart == XAudioJSResampleBufferSize) {
				XAudioJSResampleBufferStart = 0;
			}
		}
		XAudioJSMediaStreamWorker.postMessage([0, XAudioJSMediaStreamBuffer]);
		index += XAudioJSSamplesPerCallback;
	}
}
function XAudioJSResampleRefill() {
	if (XAudioJSAudioBufferSize > 0) {
		//Resample a chunk of audio:
		var resampleLength = XAudioJSResampleControl.resampler(XAudioJSGetBufferSamples());
		var resampledResult = XAudioJSResampleControl.outputBuffer;
		for (var index2 = 0; index2 < resampleLength;) {
			XAudioJSResampledBuffer[XAudioJSResampleBufferEnd++] = resampledResult[index2++];
			if (XAudioJSResampleBufferEnd == XAudioJSResampleBufferSize) {
				XAudioJSResampleBufferEnd = 0;
			}
			if (XAudioJSResampleBufferStart == XAudioJSResampleBufferEnd) {
				XAudioJSResampleBufferStart += XAudioJSChannelsAllocated;
				if (XAudioJSResampleBufferStart == XAudioJSResampleBufferSize) {
					XAudioJSResampleBufferStart = 0;
				}
			}
		}
		XAudioJSAudioBufferSize = 0;
	}
}
function XAudioJSResampledSamplesLeft() {
	return ((XAudioJSResampleBufferStart <= XAudioJSResampleBufferEnd) ? 0 : XAudioJSResampleBufferSize) + XAudioJSResampleBufferEnd - XAudioJSResampleBufferStart;
}
function XAudioJSGetBufferSamples() {
    return XAudioJSGetArraySlice(XAudioJSAudioContextSampleBuffer, XAudioJSAudioBufferSize);
}
function XAudioJSGetArraySlice(buffer, lengthOf) {
	//Typed array and normal array buffer section referencing:
	try {
		return buffer.subarray(0, lengthOf);
	}
	catch (error) {
		try {
			//Regular array pass:
			buffer.length = lengthOf;
			return buffer;
		}
		catch (error) {
			//Nightly Firefox 4 used to have the subarray function named as slice:
			return buffer.slice(0, lengthOf);
		}
	}
};
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
function keyDown(e) {
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
function keyUp(e) {
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
function keyUpPreprocess(e) {
    switch (e.keyCode) {
        case 68:
            lowerVolume();
            break;
        case 82:
            raiseVolume();
            break;
        case 51:
            Iodine.incrementSpeed(0.10);
            break;
        case 52:
            Iodine.incrementSpeed(-0.10);
            break;
        default:
            //Control keys / other
            keyUp(e);
    }
};
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
function ImportSaveCallback(name) {
    try {
        var save = findValue("SAVE_" + name);
        if (save != null) {
            writeRedTemporaryText("Loaded save.");
            return base64ToArray(save);
        }
    }
    catch (error) {
        writeRedTemporaryText("Could not read save: " + error.message);
    }
    return null;
}
function ExportSave() {
    Iodine.exportSave();
}
function ExportSaveCallback(name, save) {
    if (name != "") {
        try {
            setValue("SAVE_" + name, arrayToBase64(save));
        }
        catch (error) {
            writeRedTemporaryText("Could not store save: " + error.message);
        }
    }
}
function registerSaveHandlers() {
    Iodine.attachSaveExportHandler(ExportSaveCallback);
    Iodine.attachSaveImportHandler(ImportSaveCallback);
}
function import_save(blobData) {
    blobData = decodeBlob(blobData);
    if (blobData && blobData.blobs) {
        if (blobData.blobs.length > 0) {
            for (var index = 0; index < blobData.blobs.length; ++index) {
                writeRedTemporaryText("Importing blob \"" + blobData.blobs[index].blobID + "\"");
                if (blobData.blobs[index].blobContent) {
                    setValue(blobData.blobs[index].blobID, JSON.parse(blobData.blobs[index].blobContent));
                }
                else if (blobData.blobs[index].blobID) {
                    writeRedTemporaryText("Save file imported had blob \"" + blobData.blobs[index].blobID + "\" with no blob data interpretable.");
                }
                else {
                    writeRedTemporaryText("Blob chunk information missing completely.");
                }
            }
        }
        else {
            writeRedTemporaryText("Could not decode the imported file.");
        }
    }
    else {
        writeRedTemporaryText("Could not decode the imported file.");
    }
}
function generateBlob(keyName, encodedData) {
    //Append the file format prefix:
    var saveString = "EMULATOR_DATA";
    var consoleID = "GameBoyAdvance";
    //Figure out the length:
    var totalLength = (saveString.length + 4 + (1 + consoleID.length)) + ((1 + keyName.length) + (4 + encodedData.length));
    //Append the total length in bytes:
    saveString += to_little_endian_word(totalLength);
    //Append the console ID text's length:
    saveString += to_byte(consoleID.length);
    //Append the console ID text:
    saveString += consoleID;
    //Append the blob ID:
    saveString += to_byte(keyName.length);
    saveString += keyName;
    //Now append the save data:
    saveString += to_little_endian_word(encodedData.length);
    saveString += encodedData;
    return saveString;
}
function generateMultiBlob(blobPairs) {
    var consoleID = "GameBoyAdvance";
    //Figure out the initial length:
    var totalLength = 13 + 4 + 1 + consoleID.length;
    //Append the console ID text's length:
    var saveString = to_byte(consoleID.length);
    //Append the console ID text:
    saveString += consoleID;
    var keyName = "";
    var encodedData = "";
    //Now append all the blobs:
    for (var index = 0; index < blobPairs.length; ++index) {
        keyName = blobPairs[index][0];
        encodedData = blobPairs[index][1];
        //Append the blob ID:
        saveString += to_byte(keyName.length);
        saveString += keyName;
        //Now append the save data:
        saveString += to_little_endian_word(encodedData.length);
        saveString += encodedData;
        //Update the total length:
        totalLength += 1 + keyName.length + 4 + encodedData.length;
    }
    //Now add the prefix:
    saveString = "EMULATOR_DATA" + to_little_endian_word(totalLength) + saveString;
    return saveString;
}
function decodeBlob(blobData) {
    /*Format is as follows:
     - 13 byte string "EMULATOR_DATA"
     - 4 byte total size (including these 4 bytes).
     - 1 byte Console type ID length
     - Console type ID text of 8 bit size
     blobs {
     - 1 byte blob ID length
     - blob ID text (Used to say what the data is (SRAM/freeze state/etc...))
     - 4 byte blob length
     - blob length of 32 bit size
     }
     */
    var length = blobData.length;
    var blobProperties = {};
    blobProperties.consoleID = null;
    var blobsCount = -1;
    blobProperties.blobs = [];
    if (length > 17) {
        if (blobData.substring(0, 13) == "EMULATOR_DATA") {
            var length = Math.min(((blobData.charCodeAt(16) & 0xFF) << 24) | ((blobData.charCodeAt(15) & 0xFF) << 16) | ((blobData.charCodeAt(14) & 0xFF) << 8) | (blobData.charCodeAt(13) & 0xFF), length);
            var consoleIDLength = blobData.charCodeAt(17) & 0xFF;
            if (length > 17 + consoleIDLength) {
                blobProperties.consoleID = blobData.substring(18, 18 + consoleIDLength);
                var blobIDLength = 0;
                var blobLength = 0;
                for (var index = 18 + consoleIDLength; index < length;) {
                    blobIDLength = blobData.charCodeAt(index++) & 0xFF;
                    if (index + blobIDLength < length) {
                        blobProperties.blobs[++blobsCount] = {};
                        blobProperties.blobs[blobsCount].blobID = blobData.substring(index, index + blobIDLength);
                        index += blobIDLength;
                        if (index + 4 < length) {
                            blobLength = ((blobData.charCodeAt(index + 3) & 0xFF) << 24) | ((blobData.charCodeAt(index + 2) & 0xFF) << 16) | ((blobData.charCodeAt(index + 1) & 0xFF) << 8) | (blobData.charCodeAt(index) & 0xFF);
                            index += 4;
                            if (index + blobLength <= length) {
                                blobProperties.blobs[blobsCount].blobContent =  blobData.substring(index, index + blobLength);
                                index += blobLength;
                            }
                            else {
                                writeRedTemporaryText("Blob length check failed, blob determined to be incomplete.");
                                break;
                            }
                        }
                        else {
                            writeRedTemporaryText("Blob was incomplete, bailing out.");
                            break;
                        }
                    }
                    else {
                        writeRedTemporaryText("Blob was incomplete, bailing out.");
                        break;
                    }
                }
            }
        }
    }
    return blobProperties;
}
function refreshStorageListing() {
    ExportSave();
    var keys = getLocalStorageKeys();
    var blobPairs = [];
    for (var index = 0; index < keys.length; ++index) {
        blobPairs[index] = [keys[index], JSON.stringify(findValue(keys[index]))];
    }
    this.href = "data:application/octet-stream;base64," + base64(generateMultiBlob(blobPairs));
    this.download = "gameboy_advance_saves_" + ((new Date()).getTime()) + ".export";
}
function checkStorageLength() {
    try {
        return window.localStorage.length;
    }
    catch (error) {
        //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
        return window.globalStorage[location.hostname].length;
    }
}
function getLocalStorageKeys() {
    var storageLength = checkStorageLength();
    var keysFound = [];
    var index = 0;
    var nextKey = null;
    while (index < storageLength) {
        nextKey = findKey(index++);
        if (nextKey !== null && nextKey.length > 0) {
            if (nextKey.substring(0,5) == "SAVE_") {
                keysFound.push(nextKey);
            }
        }
        else {
            break;
        }
    }
    return keysFound;
}
function findKey(keyNum) {
    try {
        return window.localStorage.key(keyNum);
    }
    catch (error) {
        //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
        return window.globalStorage[location.hostname].key(keyNum);
    }
    return null;
}
function to_little_endian_word(str) {
    return to_little_endian_hword(str) + to_little_endian_hword(str >> 16);
}
function to_little_endian_hword(str) {
    return to_byte(str) + to_byte(str >> 8);
}
function to_byte(str) {
    return String.fromCharCode(str & 0xFF);
}
//Wrapper for localStorage getItem, so that data can be retrieved in various types.
function findValue(key) {
    try {
        if (window.localStorage.getItem(key) != null) {
            return JSON.parse(window.localStorage.getItem(key));
        }
    }
    catch (error) {
        //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
        if (window.globalStorage[location.hostname].getItem(key) != null) {
            return JSON.parse(window.globalStorage[location.hostname].getItem(key));
        }
    }
    return null;
}
//Wrapper for localStorage setItem, so that data can be set in various types.
function setValue(key, value) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
    catch (error) {
        //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
        window.globalStorage[location.hostname].setItem(key, JSON.stringify(value));
    }
}
//Wrapper for localStorage removeItem, so that data can be set in various types.
function deleteValue(key) {
    try {
        window.localStorage.removeItem(key);
    }
    catch (error) {
        //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
        window.globalStorage[location.hostname].removeItem(key);
    }
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GlueCodeGfx() {
    this.didRAF = false;                      //Set when rAF has been used.
    this.graphicsFound = 0;                   //Do we have graphics output sink found yet?
    this.offscreenWidth = 240;                //Width of the GBA screen.
    this.offscreenHeight = 160;               //Height of the GBA screen.
    this.doSmoothing = true;
    //Cache some frame buffer lengths:
    var offscreenRGBCount = this.offscreenWidth * this.offscreenHeight * 3;
    this.swizzledFrameFree = [getUint8Array(offscreenRGBCount), getUint8Array(offscreenRGBCount)];
    this.swizzledFrameReady = [];
    this.initializeGraphicsBuffer();          //Pre-set the swizzled buffer for first frame.
}
GlueCodeGfx.prototype.attachCanvas = function (canvas) {
    this.canvas = canvas;
    this.graphicsFound = this.initializeCanvasTarget();
    this.setSmoothScaling(this.doSmoothing);
}
GlueCodeGfx.prototype.detachCanvas = function () {
    this.canvas = null;
}
GlueCodeGfx.prototype.recomputeDimension = function () {
    //Cache some dimension info:
    this.canvasLastWidth = this.canvas.clientWidth;
    this.canvasLastHeight = this.canvas.clientHeight;
    if (window.mozRequestAnimationFrame) {    //Sniff out firefox for selecting this path.
        //Set target as unscaled:
        this.onscreenWidth = this.canvas.width = this.offscreenWidth;
        this.onscreenHeight = this.canvas.height = this.offscreenHeight;
    }
    else {
        //Set target canvas as scaled:
        this.onscreenWidth = this.canvas.width = this.canvas.clientWidth;
        this.onscreenHeight = this.canvas.height = this.canvas.clientHeight;
    }
}
GlueCodeGfx.prototype.initializeCanvasTarget = function () {
    try {
        //Obtain dimensional information:
        this.recomputeDimension();
        //Get handles on the canvases:
        this.canvasOffscreen = document.createElement("canvas");
        this.canvasOffscreen.width = this.offscreenWidth;
        this.canvasOffscreen.height = this.offscreenHeight;
        this.drawContextOffscreen = this.canvasOffscreen.getContext("2d");
        this.drawContextOnscreen = this.canvas.getContext("2d");
        //Get a CanvasPixelArray buffer:
        this.canvasBuffer = this.getBuffer(this.drawContextOffscreen, this.offscreenWidth, this.offscreenHeight);
        //Initialize Alpha Channel:
        this.initializeAlpha(this.canvasBuffer.data);
        //Draw swizzled buffer out as a test:
        this.requestDraw();
        this.checkRAF();
        //Success:
        return true;
    }
    catch (error) {
        //Failure:
        return false;
    }
}
GlueCodeGfx.prototype.setSmoothScaling = function (doSmoothing) {
    this.doSmoothing = doSmoothing;
    if (this.graphicsFound) {
        this.canvas.setAttribute("style", (this.canvas.getAttribute("style") || "") + "; image-rendering: " + ((doSmoothing) ? "auto" : "-webkit-optimize-contrast") + ";" +
            "image-rendering: " + ((doSmoothing) ? "optimizeQuality" : "-o-crisp-edges") + ";" +
            "image-rendering: " + ((doSmoothing) ? "optimizeQuality" : "-moz-crisp-edges") + ";" +
            "-ms-interpolation-mode: " + ((doSmoothing) ? "bicubic" : "nearest-neighbor") + ";");
        this.drawContextOnscreen.mozImageSmoothingEnabled = doSmoothing;
        this.drawContextOnscreen.webkitImageSmoothingEnabled = doSmoothing;
        this.drawContextOnscreen.imageSmoothingEnabled = doSmoothing;
    }
}
GlueCodeGfx.prototype.initializeAlpha = function (canvasData) {
    var length = canvasData.length;
    for (var indexGFXIterate = 3; indexGFXIterate < length; indexGFXIterate += 4) {
        canvasData[indexGFXIterate] = 0xFF;
    }
}
GlueCodeGfx.prototype.getBuffer = function (canvasContext, width, height) {
    //Get a CanvasPixelArray buffer:
    var buffer = null;
    try {
        buffer = this.drawContextOffscreen.createImageData(width, height);
    }
    catch (error) {
        buffer = this.drawContextOffscreen.getImageData(0, 0, width, height);
    }
    return buffer;
}
GlueCodeGfx.prototype.copyBuffer = function (buffer) {
    if (this.graphicsFound) {
        if (this.swizzledFrameFree.length == 0) {
            if (this.didRAF) {
                this.requestDrawSingle();
            }
            else {
                this.swizzledFrameFree.push(this.swizzledFrameReady.shift());
            }
        }
        var swizzledFrame = this.swizzledFrameFree.shift();
        var length = swizzledFrame.length;
        if (buffer.buffer) {
            swizzledFrame.set(buffer);
        }
        else {
            for (var bufferIndex = 0; bufferIndex < length; ++bufferIndex) {
                swizzledFrame[bufferIndex] = buffer[bufferIndex];
            }
        }
        this.swizzledFrameReady.push(swizzledFrame);
        if (!window.requestAnimationFrame) {
            this.requestDraw();
        }
        else if (!this.didRAF) {
            //Prime RAF draw:
            var parentObj = this;
            window.requestAnimationFrame(function () {
                if (parentObj.canvas) {
                    parentObj.requestRAFDraw();
                }
            });
        }
    }
}
GlueCodeGfx.prototype.requestRAFDraw = function () {
    this.didRAF = true;
    this.requestDraw();
}
GlueCodeGfx.prototype.requestDrawSingle = function () {
    if (this.swizzledFrameReady.length > 0) {
        var canvasData = this.canvasBuffer.data;
        var bufferIndex = 0;
        var swizzledFrame = this.swizzledFrameReady.shift();
        var length = canvasData.length;
        for (var canvasIndex = 0; canvasIndex < length; ++canvasIndex) {
            canvasData[canvasIndex++] = swizzledFrame[bufferIndex++];
            canvasData[canvasIndex++] = swizzledFrame[bufferIndex++];
            canvasData[canvasIndex++] = swizzledFrame[bufferIndex++];
        }
        this.swizzledFrameFree.push(swizzledFrame);
        this.graphicsBlit();
    }
}
GlueCodeGfx.prototype.requestDraw = function () {
    this.requestDrawSingle();
    if (this.didRAF) {
        var parentObj = this;
        window.requestAnimationFrame(function () {
            if (parentObj.canvas) {
                parentObj.requestDraw();
            }
        });
    }
}
GlueCodeGfx.prototype.graphicsBlit = function () {
    if (this.canvasLastWidth != this.canvas.clientWidth || this.canvasLastHeight != this.canvas.clientHeight) {
        this.recomputeDimension();
        this.setSmoothScaling(this.doSmoothing);
    }
    if (this.offscreenWidth == this.onscreenWidth && this.offscreenHeight == this.onscreenHeight) {
        //Canvas does not need to scale, draw directly to final:
        this.drawContextOnscreen.putImageData(this.canvasBuffer, 0, 0);
    }
    else {
        //Canvas needs to scale, draw to offscreen first:
        this.drawContextOffscreen.putImageData(this.canvasBuffer, 0, 0);
        //Scale offscreen canvas image onto the final:
        this.drawContextOnscreen.drawImage(this.canvasOffscreen, 0, 0, this.onscreenWidth, this.onscreenHeight);
    }
}
GlueCodeGfx.prototype.initializeGraphicsBuffer = function () {
    //Initialize the first frame to a white screen:
    var swizzledFrame = this.swizzledFrameFree.shift();
    var length = swizzledFrame.length;
    for (var bufferIndex = 0; bufferIndex < length; ++bufferIndex) {
        swizzledFrame[bufferIndex] = 0xF8;
    }
    this.swizzledFrameReady.push(swizzledFrame);
}
GlueCodeGfx.prototype.checkRAF = function () {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
};
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
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
function GlueCodeMixer() {
    var parentObj = this;
    // this.audio = new XAudioServer(2, this.sampleRate, 0, this.bufferAmount, null, 1, function () {
    //                 //Disable audio in the callback here:
    //                 parentObj.disableAudio();
    //});
    this.outputUnits = [];
    this.outputUnitsValid = [];
    setInterval(function(){parentObj.checkAudio();}, 16);
    this.initializeBuffer();
}
GlueCodeMixer.prototype.sampleRate = 44100;
GlueCodeMixer.prototype.bufferAmount = 44100;
GlueCodeMixer.prototype.channelCount = 2;
GlueCodeMixer.prototype.initializeBuffer = function () {
    this.buffer = new AudioSimpleBuffer(this.channelCount,
                                         this.bufferAmount);
}
GlueCodeMixer.prototype.appendInput = function (inUnit) {
    if (this.audio) {
        for (var index = 0; index < this.outputUnits.length; index++) {
            if (!this.outputUnits[index]) {
                break;
            }
        }
        this.outputUnits[index] = inUnit;
        this.outputUnitsValid.push(inUnit);
        inUnit.registerStackPosition(index);
    }
    else if (typeof inUnit.errorCallback == "function") {
        inUnit.errorCallback();
    }
}
GlueCodeMixer.prototype.unregister = function (stackPosition) {
    this.outputUnits[stackPosition] = null;
    this.outputUnitsValid = [];
    for (var index = 0, length = this.outputUnits.length; index < length; ++index) {
        if (this.outputUnits[index]) {
            this.outputUnitsValid.push(this.outputUnits);
        }
    }
}
GlueCodeMixer.prototype.checkAudio = function () {
    if (this.audio) {
        var inputCount = this.outputUnitsValid.length;
        for (var inputIndex = 0, output = 0; inputIndex < inputCount; ++inputIndex) {
            this.outputUnitsValid[inputIndex].prepareShift();
        }
        for (var count = 0, requested = this.findLowestBufferCount(); count < requested; ++count) {
            for (var inputIndex = 0, output = 0; inputIndex < inputCount; ++inputIndex) {
                output += this.outputUnitsValid[inputIndex].shift();
            }
            this.buffer.push(output);
        }
        this.audio.writeAudioNoCallback(this.buffer.getSlice());
    }
}
GlueCodeMixer.prototype.findLowestBufferCount = function () {
    var count = 0;
    for (var inputIndex = 0, inputCount = this.outputUnitsValid.length; inputIndex < inputCount; ++inputIndex) {
        var tempCount = this.outputUnitsValid[inputIndex].buffer.remainingBuffer();
        if (tempCount > 0) {
            if (count > 0) {
                count = Math.min(count, tempCount);
            }
            else {
                count = tempCount;
            }
        }
    }
    return count;
}
GlueCodeMixer.prototype.disableAudio = function () {
    this.audio = null;
}
function GlueCodeMixerInput(mixer) {
    this.mixer = mixer;
}
GlueCodeMixerInput.prototype.initialize = function (channelCount, sampleRate, bufferAmount, startingVolume, errorCallback) {
    this.channelCount = channelCount;
    this.sampleRate = sampleRate;
    this.bufferAmount = bufferAmount;
    this.volume = startingVolume;
    this.errorCallback = errorCallback;
    this.buffer = new AudioBufferWrapper(this.channelCount,
                                         this.mixer.channelCount,
                                         this.bufferAmount,
                                         this.sampleRate,
                                         this.mixer.sampleRate);
    
}
GlueCodeMixerInput.prototype.register = function (volume) {
    this.mixer.appendInput(this);
}
GlueCodeMixerInput.prototype.changeVolume = function (volume) {
    this.volume = volume;
}
GlueCodeMixerInput.prototype.prepareShift = function () {
    this.buffer.resampleRefill();
}
GlueCodeMixerInput.prototype.shift = function () {
    return this.buffer.shift() * this.volume;
}
GlueCodeMixerInput.prototype.push = function (buffer) {
    this.buffer.push(buffer);
    this.mixer.checkAudio();
}
GlueCodeMixerInput.prototype.remainingBuffer = function () {
    return this.buffer.remainingBuffer() + (Math.floor((this.mixer.audio.remainingBuffer() * this.sampleRate / this.mixer.sampleRate) / this.mixer.channelCount) * this.mixer.channelCount);
}
GlueCodeMixerInput.prototype.registerStackPosition = function (stackPosition) {
    this.stackPosition = stackPosition;
}
GlueCodeMixerInput.prototype.unregister = function () {
    this.mixer.unregister(this.stackPosition);
}
function AudioBufferWrapper(channelCount,
                            mixerChannelCount,
                            bufferAmount,
                            sampleRate,
                            mixerSampleRate) {
    this.channelCount = channelCount;
    this.mixerChannelCount = mixerChannelCount;
    this.bufferAmount = bufferAmount;
    this.sampleRate = sampleRate;
    this.mixerSampleRate = mixerSampleRate;
    this.initialize();
}
AudioBufferWrapper.prototype.initialize = function () {
    this.inBufferSize = this.bufferAmount * this.mixerChannelCount;
    this.inBuffer = getFloat32Array(this.inBufferSize);
    this.outBufferSize = (Math.ceil(this.inBufferSize * this.mixerSampleRate / this.sampleRate / this.mixerChannelCount) * this.mixerChannelCount) + this.mixerChannelCount;
    this.outBuffer = getFloat32Array(this.outBufferSize);
    this.resampler = new Resampler(this.sampleRate, this.mixerSampleRate, this.mixerChannelCount, this.outBufferSize, true);
    this.inputOffset = 0;
    this.resampleBufferStart = 0;
    this.resampleBufferEnd = 0;
}
AudioBufferWrapper.prototype.push = function (buffer) {
    var length  = buffer.length;
    if (this.channelCount < this.mixerChannelCount) {
        for (var bufferCounter = 0; bufferCounter < length && this.inputOffset < this.inBufferSize;) {
            for (var index = this.channelCount; index < this.mixerChannelCount; ++index) {
                this.inBuffer[this.inputOffset++] = buffer[bufferCounter];
            }
            for (index = 0; index < this.channelCount && bufferCounter < length; ++index) {
                this.inBuffer[this.inputOffset++] = buffer[bufferCounter++];
            }
        }
    }
    else if (this.channelCount == this.mixerChannelCount) {
        for (var bufferCounter = 0; bufferCounter < length && this.inputOffset < this.inBufferSize;) {
            this.inBuffer[this.inputOffset++] = buffer[bufferCounter++];
        }
    }
    else {
        for (var bufferCounter = 0; bufferCounter < length && this.inputOffset < this.inBufferSize;) {
            for (index = 0; index < this.mixerChannelCount && bufferCounter < length; ++index) {
                this.inBuffer[this.inputOffset++] = buffer[bufferCounter++];
            }
            bufferCounter += this.channelCount - this.mixerChannelCount;
        }
    }
}
AudioBufferWrapper.prototype.shift = function () {
    var output = 0;
    if (this.resampleBufferStart != this.resampleBufferEnd) {
        output = this.outBuffer[this.resampleBufferStart++];
        if (this.resampleBufferStart == this.outBufferSize) {
            this.resampleBufferStart = 0;
        }
    }
    return output;
}
AudioBufferWrapper.prototype.resampleRefill = function () {
    if (this.inputOffset > 0) {
        //Resample a chunk of audio:
        var resampleLength = this.resampler.resampler(this.getSlice(this.inBuffer, this.inputOffset));
        var resampledResult = this.resampler.outputBuffer;
        for (var index2 = 0; index2 < resampleLength;) {
            this.outBuffer[this.resampleBufferEnd++] = resampledResult[index2++];
            if (this.resampleBufferEnd == this.outBufferSize) {
                this.resampleBufferEnd = 0;
            }
            if (this.resampleBufferStart == this.resampleBufferEnd) {
                this.resampleBufferStart += this.mixerChannelCount;
                if (this.resampleBufferStart == this.outBufferSize) {
                    this.resampleBufferStart = 0;
                }
            }
        }
        this.inputOffset = 0;
    }
}
AudioBufferWrapper.prototype.remainingBuffer = function () {
    return (Math.floor((this.resampledSamplesLeft() * this.resampler.ratioWeight) / this.mixerChannelCount) * this.mixerChannelCount) + this.inputOffset;
}
AudioBufferWrapper.prototype.resampledSamplesLeft = function () {
    return ((this.resampleBufferStart <= this.resampleBufferEnd) ? 0 : this.outBufferSize) + this.resampleBufferEnd - this.resampleBufferStart;
}
AudioBufferWrapper.prototype.getSlice = function (buffer, lengthOf) {
    //Typed array and normal array buffer section referencing:
    try {
        return buffer.subarray(0, lengthOf);
    }
    catch (error) {
        try {
            //Regular array pass:
            buffer.length = lengthOf;
            return buffer;
        }
        catch (error) {
            //Nightly Firefox 4 used to have the subarray function named as slice:
            return buffer.slice(0, lengthOf);
        }
    }
}
function AudioSimpleBuffer(channelCount, bufferAmount) {
    this.channelCount = channelCount;
    this.bufferAmount = bufferAmount;
    this.outBufferSize = this.channelCount * this.bufferAmount;
    this.stackLength = 0;
    this.buffer = getFloat32Array(this.outBufferSize);
}
AudioSimpleBuffer.prototype.push = function (data) {
    if (this.stackLength < this.outBufferSize) {
        this.buffer[this.stackLength++] = data;
    }
}
AudioSimpleBuffer.prototype.getSlice = function () {
    var lengthOf = this.stackLength;
    this.stackLength = 0;
    //Typed array and normal array buffer section referencing:
    try {
        return this.buffer.subarray(0, lengthOf);
    }
    catch (error) {
        try {
            //Regular array pass:
            this.buffer.length = lengthOf;
            return this.buffer;
        }
        catch (error) {
            //Nightly Firefox 4 used to have the subarray function named as slice:
            return this.buffer.slice(0, lengthOf);
        }
    }
}

function setup(canvas) {
    var Iodine = new GameBoyAdvanceEmulator();
    registerBlitterHandler(canvas, Iodine);
    registerAudioHandler(Iodine);
    return Iodine
}

function registerBlitterHandler(canvas, Iodine) {
    var Blitter = new GlueCodeGfx();
    Blitter.attachCanvas(canvas);
    Iodine.attachGraphicsFrameHandler(function (buffer) {Blitter.copyBuffer(buffer);});
}

function registerAudioHandler(Iodine) {
    var Mixer = new GlueCodeMixer();
    var MixerInput = new GlueCodeMixerInput(Mixer);
    Iodine.attachAudioHandler(MixerInput);
    Iodine.enableAudio();
}

module.exports = setup
