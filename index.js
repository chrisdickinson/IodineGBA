module.exports = setup;

var Emulator = require('./IodineGBA/IodineGBA/GameBoyAdvanceEmulatorCore.js');
var Graphics = require('./user_scripts/IodineGBAGraphicsGlueCode.js');
var Audio = require('./user_scripts/IodineGBAAudioGlueCode.js');

setup.Emulator = Emulator;

function setup(canvas, opts) {
    var gba = new Emulator();
    registerBlitterHandler(canvas, gba);
    registerAudioHandler(gba);
    return gba;
}

function registerBlitterHandler(canvas, gba) {
    var Blitter = new Graphics();
    Blitter.attachCanvas(canvas);
    gba.attachGraphicsFrameHandler(function (buffer) {
      Blitter.copyBuffer(buffer);
    });
}

function registerAudioHandler(gba) {
    var Mixer = new Audio.Mixer();
    var MixerInput = new Audio.Input(Mixer);
    gba.attachAudioHandler(MixerInput);
    gba.enableAudio();
}

