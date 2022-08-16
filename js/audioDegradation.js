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
// import NormaliseAudio from "./normaliseAudio";

/**
 *
 */
class AudioDegradation {
    constructor(audio) {
        this.audio = audio;
    }

    addHarmonicDistortion(audio, num_applications){
        return HarmonicDistortion.execute(audio, num_applications);
    }
}

export default AudioDegradation;