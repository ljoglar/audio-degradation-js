import AudioDegradation from '../../../js/audioDegradation.js'
import {emitter} from "../emitter";

class AudioManager {
    constructor(audioURL = '/assets/audio/cello.wav') {
        this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.oAudioContext ||
            window.msAudioContext)();
        console.log('AudioContext created');
        this.audioURL = audioURL;
        this.audioWithHarmonicDist = [];
        this.harmonicDistortionLevel = 3;
        this.audioDegradation = null;
        this.audioChannels = [];
        this.loadAudio();
    }

    async loadAudio() {
        this.audioBuffer = await this.loadAudioTrack();
        if(this.audioBuffer){
            console.log("AudioBuffer created");
            emitter.emit('audioLoaded');
        }
        await this.getAudioData().then(() => {
            this.audioDegradation = new AudioDegradation([...this.audioChannels]);
        });
    }

    async getAudioData(){
        this.audioChannels = Array.from({length: this.audioBuffer.numberOfChannels});
        this.audioChannels.map((channel, index) => this.audioChannels[index] = this.audioBuffer.getChannelData(index));
    }

    addHarmonicDistortion(){
        let dataHarmonicDist = this.audioDegradation.addHarmonicDistortion(undefined, this.harmonicDistortionLevel);
        this.audioWithHarmonicDist = this.audioContext.createBuffer(this.audioBuffer.numberOfChannels, this.audioBuffer.length, this.audioBuffer.sampleRate);
        for (let i = 0; i < this.audioBuffer.numberOfChannels; i++){
            this.audioWithHarmonicDist.copyToChannel(dataHarmonicDist[i], i);
        }
        return this.audioWithHarmonicDist;
    }

    updateHarmonicDistortionValue(value){
        this.harmonicDistortionLevel = value;
    }

    async loadAudioTrack() {
        const response = await fetch(this.audioURL);
        this.arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(this.arrayBuffer);
    }
}

export const audioManager = new AudioManager();
