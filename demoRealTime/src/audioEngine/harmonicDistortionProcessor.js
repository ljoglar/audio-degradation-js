import AudioDegradation from '../../../js/audioDegradation.js'

class HarmonicDistortionProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors () {
        return [{
            name: 'numApplications',
            defaultValue: 3,
            minValue: 0,
            maxValue: 10
        }]
    }

    constructor() {
        super();
        this.audioDegradation = new AudioDegradation();
    }
    process (inputs, outputs, parameters) {
        let audioReturned = this.audioDegradation.addHarmonicDistortion(inputs[0], parameters['numApplications'][0]);
        audioReturned.forEach((channel, i) => {
           channel.forEach((sample, j) => {
               outputs[0][i][j] = sample;
           })
        });
        return true;
    }
}

registerProcessor('harmonicDistortionProcessor', HarmonicDistortionProcessor);
