import AudioDegradation from '../../../js/audioDegradation.js'

class HarmonicDistortionProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.audioDegradation = new AudioDegradation();
    }
    process (inputs, outputs, parameters) {
        this.audioDegradation.addHarmonicDistortion(inputs[0], 3);
        return true;
    }
}

registerProcessor('harmonicDistortionProcessor', HarmonicDistortionProcessor);
