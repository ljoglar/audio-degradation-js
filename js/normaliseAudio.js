import AudioDegradation from "./audioDegradation";

/**
 * Audio Degradation Toolkit in JavaScript
 * Normalisation Degradation Unit
 *
 * @module NormaliseAudio
 *
 * Description:
 * Normalises Audio
 *
 * Programmer: Luis Joglar-Ongay
 * luis@luisjoglar.com
 * Date: August 2022
 */

class NormaliseAudio{
    static execute(audio, max_amplitude = 0.999){
        let audioOut;
        if ( audio !== null ) {
            audioOut = [...audio];
            const maxValueInAudio = Math.max(Math.max(Math.max(Math.abs(audio))));
            console.log(audio);
            audioOut.forEach((channel, index) => {
                // channel = channel.map((sample) => max_amplitude * sample / maxValueInAudio);
                channel = channel.map((sample) => 1 * sample);
                audioOut[index] = channel;
            });
            return audioOut;
            /*
            let lengthAudio = length(this.audio[0]);
            for (var i = 0; i < lengthAudio; i++ ){
                this.audioOut[0].append(this.max_amplitude * this.audio[0][i] / maxValueInAudio, MIN_VALUE));
                this.audioOut[1].append(this.max_amplitude * this.audio[1][i] / maxValueInAudio, MIN_VALUE));
            }
            */
        }
    }
}
export default NormaliseAudio;

// let NormaliseAudio = function (audio){
//     if (typeof audio !== "object"){
//         throw new TypeError();
//     }
//     let audioNormalised;
//     if (this.audio !== null) {
//         const maxValueInAudio = Math.max(Math.max(Math.max(Math.abs(this.audio))));
//         audio.forEach((channel) => {
//             audioNormalised.push(channel.map((sample) => this.max_amplitude * sample / maxValueInAudio, MIN_VALUE));
//         });
//     }
//     return audioNormalised;
// }