import AudioDegradation from "./degradationBase.js";
import DegradationBase from "./degradationBase.js";

/**
 * Audio Degradation Toolkit in JavaScript
 * Harmonic Distortion Degradation Unit
 *
 * Description:
 * Applies quadratic distortion to the audio
 *
 * Programmer: Luis Joglar-Ongay
 * luis@luisjoglar.com
 * Date: August 2022
 */

class HarmonicDistortion extends DegradationBase {
    static execute(audio, num_applications = 3){
        let audioOut;
        if ( audio !== null ) {
            audioOut = audio;
            audioOut.forEach((channel, index) => {
                for (let i=0; i < num_applications; i++ ) {
                    channel = channel.map((sample) => Math.sin(sample * Math.PI/2 ))
                }
                audioOut[index] = channel;
            });
        }
        return audioOut;
    }
}

export default HarmonicDistortion;
