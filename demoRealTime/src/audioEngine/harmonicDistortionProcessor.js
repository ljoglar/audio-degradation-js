import AudioDegradation from '../../../js/audioDegradation.js'

class HarmonicDistortionProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.audioDegradation = new AudioDegradation();
    }
    process (inputs, outputs, parameters) {
        // input is 128 frames
        // console.log(inputs[0][0]);
        // this.audioDegradation.addHarmonicDistortion.calculateSample(inputs[0], 3);
        return true;
    }
}

registerProcessor('harmonicDistortionProcessor', HarmonicDistortionProcessor);
