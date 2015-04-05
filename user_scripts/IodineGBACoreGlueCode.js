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
var GlueCodeSaves = require('./IodineGBASavesGlueCode.js');
var GlueCodeROMLoad = require('./IodineGBAROMLoadGlueCode.js');
function startDemo(rootElement) {
  var gba = new GameBoyAdvanceEmulator();
  //Initialize the graphics:
  var blitter = registerBlitterHandler(gba, rootElement.querySelector('canvas[data-emulator-target]'));
  //Initialize the audio:
  registerAudioHandler(gba);
  //Register the save handler callbacks:
  GlueCodeSaves.register(gba);
  //Hook the GUI controls.
  registerGUIEvents(gba, blitter, rootElement);
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
function registerGUIEvents(gba, blitter, rootElement) {
    var input = getInputFunctions(gba);
    addEvent("keydown", rootElement, input.keyDown);
    addEvent("keyup", rootElement, input.keyUpPreprocess);
    addEvent("change", rootElement.querySelector("[name=rom_load]"), function () {
        GlueCodeROMLoad.uploadFile(this.files, function(data) {
            resetPlayButton();
            try {
                gba.attachROM(new Uint8Array(data));
            }
            catch (error) {
                gba.attachROM(data);
            }
        });
    });
    addEvent("change", rootElement.querySelector("[name=bios_load]"), function (data) {
        GlueCodeROMLoad.uploadFile(this.files, function(data) {
            resetPlayButton();
            try {
                gba.attachBIOS(new Uint8Array(data));
            }
            catch (error) {
                gba.attachBIOS(data);
            }
        });
    });
    var playBtn = rootElement.querySelector("[name=play]");
    var pauseBtn = rootElement.querySelector("[name=pause]");
    var restartBtn = rootElement.querySelector("[name=restart]");
    var skipBootBtn = rootElement.querySelector("[name=skip_boot]");
    var soundBtn = rootElement.querySelector("[name=sound]");
    addEvent("click", playBtn, function (e) {
        e.preventDefault();
        gba.play();
        this.style.display = "none";
        pauseBtn.style.display = "inline";
    });
    addEvent("click", pauseBtn, function (e) {
        gba.pause();
        this.style.display = "none";
        playBtn.style.display = "inline";
        e.preventDefault();
    });
    addEvent("click", restartBtn, function (e) {
        gba.restart();
        e.preventDefault();
    });
    soundBtn.checked = true;
    addEvent("click", soundBtn, function () {
        if (this.checked) {
            gba.enableAudio();
        }
        else {
            gba.disableAudio();
        }
    });
    skipBootBtn.checked = false;
    addEvent("click", skipBootBtn, function () {
             if (this.checked) {
                gba.enableSkipBootROM();
             }
             else {
                gba.disableSkipBootROM();
             }
    });
    var toggleSmoothScalingBtn = rootElement.querySelector('[name=toggleSmoothScaling]');
    toggleSmoothScalingBtn.checked = true;
    addEvent("click", toggleSmoothScalingBtn, function () {
            blitter.setSmoothScaling(this.checked);
    });
    var toggleDynamicSpeedBtn = rootElement.querySelector('[name=toggleDynamicSpeed]');
    toggleDynamicSpeedBtn.checked = true;
    addEvent("click", toggleDynamicSpeedBtn, function () {
             if (this.checked) {
                gba.enableDynamicSpeed();
             }
             else {
                gba.disableDynamicSpeed();
             }
    });
    var importBtn = rootElement.querySelector('[name=import]');
    var exportBtn = rootElement.querySelector('[name=export]');
    addEvent("change", importBtn, function (e) {
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
    addEvent("click", exportBtn, GlueCodeSaves.refresh);
    addEvent("unload", window, function() {
        gba.exportSave();
    });
    gba.attachSpeedHandler(function (speed) {
        var speedDOM = rootElement.querySelector("[data-name=speed]");
        speedDOM.textContent = "Speed: " + speed;
    });
    //setInterval(ExportSave, 60000); //Do periodic saves.
    function resetPlayButton() {
        pauseBtn.style.display = "none";
        playBtn.style.display = "inline";
    }
}
function writeRedTemporaryText(textString) {
    if (writeRedTemporaryText.timerID) {
        clearTimeout(writeRedTemporaryText.timerID);
    }
    document.getElementById("tempMessage").style.display = "block";
    document.getElementById("tempMessage").textContent = textString;
    writeRedTemporaryText.timerID = setTimeout(clearTempString, 5000);
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
