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
            const maxValueInAudio = this.getMaxSampleValueInAudio(audio);
            // console.log('maxValueInAudio');
            // console.log(maxValueInAudio);
            const normCoeff = max_amplitude / maxValueInAudio;
            // console.log('normCoeff');
            // console.log(normCoeff);
            audioOut.forEach((channel, index) => {
                channel = channel.map((sample) => normCoeff * sample <= 0.999 ? normCoeff * sample : 0.999);
                // console.log(channel);
                // channel = channel.map((sample) => 1 * sample);
                audioOut[index] = channel;
            });
            return audioOut;
        }
    }

    static getMaxSampleValueInAudio(audio) {
        let maxSamples = [];
        audio.forEach((channel, index) => {
            // console.log(channel);
            const channelAbs = channel.map((sample) => Math.abs(sample));
            // console.log(channelAbs);
            // console.log(Math.max(...channelAbs));

            maxSamples.push(Math.max(...channelAbs));
            // console.log(maxSamples);
        });
        return Math.max(maxSamples) > 0 ? Math.max(maxSamples) : Number.MIN_VALUE;
        // Math.max(Math.max(Math.max(Math.abs(audio))));
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