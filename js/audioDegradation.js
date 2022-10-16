/**
 * Audio Degradation Toolkit in JavaScript
 *
 * Description:
 *
 *
 * Programmer: Luis Joglar-Ongay
 * luis@luisjoglar.com
 * Date: August 2022
 */
import HarmonicDistortion from "./harmonicDistortion";
import NormaliseAudio from "./normaliseAudio";

/**
 *
 */
class AudioDegradation {
    constructor(audio) {
        this.audio = audio;
    }

    normalise(audio = this.audio, max_amplitude){
        return NormaliseAudio.execute(audio, max_amplitude);
    }

    addHarmonicDistortion(audio = this.audio, num_applications){
        return HarmonicDistortion.execute(audio , num_applications);
    }
}

export default AudioDegradation;
