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
module.exports = startDemo;
var GameBoyAdvanceEmulator = require('../IodineGBA/IodineGBA/GameBoyAdvanceEmulatorCore.js');
var getInputFunctions = require('./IodineGBAJoyPadGlueCode.js');
var GlueCodeGfx = require('./IodineGBAGraphicsGlueCode.js');
var GlueCodeAudio = require('./IodineGBAAudioGlueCode.js');
function startDemo(rootElement) {
  var gba = new GameBoyAdvanceEmulator();
  registerBlitterHandler(gba, rootElement.querySelector('canvas[data-emulator-target]'));
  //Initialize the graphics:
  var blitter = registerBlitterHandler(gba);
  //Initialize the audio:
  registerAudioHandler(gba);
  //Register the save handler callbacks:
  registerSaveHandlers(gba);
  //Hook the GUI controls.
  registerGUIEvents(gba, blitter);
}

function registerBlitterHandler(gba, canvas) {
    var blitter = new GlueCodeGfx();
    blitter.attachCanvas(canvas);
    gba.attachGraphicsFrameHandler(function (buffer) {
      blitter.copyBuffer(buffer);
    });
    return blitter;
}
function registerAudioHandler(gba) {
    var Mixer = new GlueCodeAudio.Mixer();
    var MixerInput = new GlueCodeAudio.Input(Mixer);
    gba.attachAudioHandler(MixerInput);
    gba.enableAudio();
}
function registerGUIEvents(gba, blitter) {
    var input = getInputFunctions(gba);
    addEvent("keydown", document, input.keyDown);
    addEvent("keyup", document, input.keyUpPreprocess);
    addEvent("change", document.getElementById("rom_load"), fileLoadROM);
    addEvent("change", document.getElementById("bios_load"), fileLoadBIOS);
    addEvent("click", document.getElementById("play"), function (e) {
        gba.play();
        this.style.display = "none";
        document.getElementById("pause").style.display = "inline";
        e.preventDefault();
    });
    addEvent("click", document.getElementById("pause"), function (e) {
        gba.pause();
        this.style.display = "none";
        document.getElementById("play").style.display = "inline";
        e.preventDefault();
    });
    addEvent("click", document.getElementById("restart"), function (e) {
        gba.restart();
        e.preventDefault();
    });
    document.getElementById("sound").checked = true;
    addEvent("click", document.getElementById("sound"), function () {
        if (this.checked) {
            gba.enableAudio();
        }
        else {
            gba.disableAudio();
        }
    });
    document.getElementById("skip_boot").checked = false;
    addEvent("click", document.getElementById("skip_boot"), function () {
             if (this.checked) {
                gba.enableSkipBootROM();
             }
             else {
                gba.disableSkipBootROM();
             }
    });
    document.getElementById("toggleSmoothScaling").checked = true;
    addEvent("click", document.getElementById("toggleSmoothScaling"), function () {
            blitter.setSmoothScaling(this.checked);
    });
    document.getElementById("toggleDynamicSpeed").checked = true;
    addEvent("click", document.getElementById("toggleDynamicSpeed"), function () {
             if (this.checked) {
                gba.enableDynamicSpeed();
             }
             else {
                gba.disableDynamicSpeed();
             }
    });
    addEvent("change", document.getElementById("import"), function (e) {
             if (typeof this.files != "undefined") {
                try {
                    if (this.files.length >= 1) {
                        writeRedTemporaryText("Reading the local file \"" + this.files[0].name + "\" for importing.");
                        try {
                            //Gecko 1.9.2+ (Standard Method)
                            var binaryHandle = new FileReader();
                            binaryHandle.onload = function () {
                                if (this.readyState == 2) {
                                    writeRedTemporaryText("file imported.");
                                    try {
                                        import_save(this.result);
                                    }
                                    catch (error) {
                                        writeRedTemporaryText(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
                                    }
                                }
                                else {
                                    writeRedTemporaryText("importing file, please wait...");
                                }
                            }
                            binaryHandle.readAsBinaryString(this.files[this.files.length - 1]);
                        }
                        catch (error) {
                            //Gecko 1.9.0, 1.9.1 (Non-Standard Method)
                            var romImageString = this.files[this.files.length - 1].getAsBinary();
                            try {
                                import_save(romImageString);
                            }
                            catch (error) {
                                writeRedTemporaryText(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
                            }
                        }
                    }
                    else {
                        writeRedTemporaryText("Incorrect number of files selected for local loading.");
                    }
                }
                catch (error) {
                    writeRedTemporaryText("Could not load in a locally stored ROM file.");
                }
             }
             else {
                writeRedTemporaryText("could not find the handle on the file to open.");
             }
             e.preventDefault();
    });
    addEvent("click", document.getElementById("export"), refreshStorageListing);
    addEvent("unload", window, ExportSave);
    gba.attachSpeedHandler(function (speed) {
        var speedDOM = document.getElementById("speed");
        speedDOM.textContent = "Speed: " + speed;
    });
    //setInterval(ExportSave, 60000); //Do periodic saves.
}
function resetPlayButton() {
    document.getElementById("pause").style.display = "none";
    document.getElementById("play").style.display = "inline";
}
function writeRedTemporaryText(textString) {
    if (timerID) {
        clearTimeout(timerID);
    }
    document.getElementById("tempMessage").style.display = "block";
    document.getElementById("tempMessage").textContent = textString;
    timerID = setTimeout(clearTempString, 5000);
}
function clearTempString() {
    document.getElementById("tempMessage").style.display = "none";
}
//Some wrappers and extensions for non-DOM3 browsers:
function addEvent(sEvent, oElement, fListener) {
    try {    
        oElement.addEventListener(sEvent, fListener, false);
    }
    catch (error) {
        oElement.attachEvent("on" + sEvent, fListener);    //Pity for IE.
    }
}
function removeEvent(sEvent, oElement, fListener) {
    try {    
        oElement.removeEventListener(sEvent, fListener, false);
    }
    catch (error) {
        oElement.detachEvent("on" + sEvent, fListener);    //Pity for IE.
    }
}
