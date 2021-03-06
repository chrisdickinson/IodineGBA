"use strict";
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2015 Grant Galitz
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
module.exports = GameBoyAdvanceDMA;
function GameBoyAdvanceDMA(IOCore) {
    this.IOCore = IOCore;
}
GameBoyAdvanceDMA.prototype.initialize = function () {
    this.dmaChannel0 = this.IOCore.dmaChannel0;
    this.dmaChannel1 = this.IOCore.dmaChannel1;
    this.dmaChannel2 = this.IOCore.dmaChannel2;
    this.dmaChannel3 = this.IOCore.dmaChannel3;
    this.currentMatch = -1;
    this.fetch = 0;
}
GameBoyAdvanceDMA.prototype.getCurrentFetchValue = function () {
    return this.fetch | 0;
}
GameBoyAdvanceDMA.prototype.gfxHBlankRequest = function () {
    //Pass H-Blank signal to all DMA channels:
    this.requestDMA(0x4);
}
GameBoyAdvanceDMA.prototype.gfxVBlankRequest = function () {
    //Pass V-Blank signal to all DMA channels:
    this.requestDMA(0x2);
}
GameBoyAdvanceDMA.prototype.requestDMA = function (DMAType) {
    DMAType = DMAType | 0;
    this.dmaChannel0.requestDMA(DMAType | 0);
    this.dmaChannel1.requestDMA(DMAType | 0);
    this.dmaChannel2.requestDMA(DMAType | 0);
    this.dmaChannel3.requestDMA(DMAType | 0);
}
GameBoyAdvanceDMA.prototype.findLowestDMA = function () {
    if ((this.dmaChannel0.getMatchStatus() | 0) != 0) {
        return 0;
    }
    if ((this.dmaChannel1.getMatchStatus() | 0) != 0) {
        return 1;
    }
    if ((this.dmaChannel2.getMatchStatus() | 0) != 0) {
        return 2;
    }
    if ((this.dmaChannel3.getMatchStatus() | 0) != 0) {
        return 3;
    }
    return 4;
}
GameBoyAdvanceDMA.prototype.update = function () {
    var lowestDMAFound = this.findLowestDMA();
    if ((lowestDMAFound | 0) < 4) {
        //Found an active DMA:
        if ((this.currentMatch | 0) == -1) {
            this.IOCore.flagDMA();
        }
        if ((this.currentMatch | 0) != (lowestDMAFound | 0)) {
            //Re-broadcasting on address bus, so non-seq:
            this.IOCore.wait.NonSequentialBroadcast();
            this.currentMatch = lowestDMAFound | 0;
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
    switch (this.currentMatch | 0) {
        case 0:
            this.dmaChannel0.handleDMACopy();
            break;
        case 1:
            this.dmaChannel1.handleDMACopy();
            break;
        case 2:
            this.dmaChannel2.handleDMACopy();
            break;
        default:
            this.dmaChannel3.handleDMACopy();
    }
}
GameBoyAdvanceDMA.prototype.updateFetch = function (data) {
    data = data | 0;
    this.fetch = data | 0;
}
GameBoyAdvanceDMA.prototype.nextEventTime = function () {
    var clocks = this.dmaChannel0.nextEventTime() | 0;
    var workbench = this.dmaChannel1.nextEventTime() | 0;
    if ((clocks | 0) >= 0) {
        if ((workbench | 0) >= 0) {
            clocks = Math.min(clocks | 0, workbench | 0) | 0;
        }
    }
    else {
        clocks = workbench | 0;
    }
    workbench = this.dmaChannel2.nextEventTime() | 0;
    if ((clocks | 0) >= 0) {
        if ((workbench | 0) >= 0) {
            clocks = Math.min(clocks | 0, workbench | 0) | 0;
        }
    }
    else {
        clocks = workbench | 0;
    }
    workbench = this.dmaChannel3.nextEventTime() | 0;
    if ((clocks | 0) >= 0) {
        if ((workbench | 0) >= 0) {
            clocks = Math.min(clocks | 0, workbench | 0) | 0;
        }
    }
    else {
        clocks = workbench | 0;
    }
    return clocks | 0;
}
