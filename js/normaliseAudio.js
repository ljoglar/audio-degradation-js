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

class normaliseAudio extends DegradationBase{
    /**
     * @param {audio}
     * @param {number} fs
     * @param {number} max_amplitude
     */
    constructor(audio, fs, max_amplitude = 0.999) {
        super(audio, fs);
        this.max_amplitude = max_amplitude;
    }

    execute(){
        if (this.audio !== null) {
            const maxValueInAudio = Math.max(Math.max(Math.max(Math.abs(this.audio))));
            this.audio.forEach((channel) => {
                this.audioOut.push(channel.map((sample) => this.max_amplitude * sample / maxValueInAudio, MIN_VALUE));
            });

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

let NormaliseAudio = function (audio){
    if (typeof audio !== "object"){
        throw new TypeError();
    }
    let audioNormalised;
    if (this.audio !== null) {
        const maxValueInAudio = Math.max(Math.max(Math.max(Math.abs(this.audio))));
        audio.forEach((channel) => {
            audioNormalised.push(channel.map((sample) => this.max_amplitude * sample / maxValueInAudio, MIN_VALUE));
        });
    }
    return audioNormalised;
}