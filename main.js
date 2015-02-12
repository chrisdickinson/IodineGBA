module.exports = setup

function setup(canvas) {
    var Iodine = new GameBoyAdvanceEmulator();
    registerBlitterHandler(canvas);
    registerAudioHandler();
    registerSaveHandlers();
    
    return Iodine
}

function registerBlitterHandler(canvas) {
    Blitter = new GlueCodeGfx();
    Blitter.attachCanvas(canvas);
    Iodine.attachGraphicsFrameHandler(function (buffer) {Blitter.copyBuffer(buffer);});
}

function registerAudioHandler() {
    Mixer = new GlueCodeMixer();
    MixerInput = new GlueCodeMixerInput(Mixer);
    Iodine.attachAudioHandler(MixerInput);
    Iodine.enableAudio();
}
