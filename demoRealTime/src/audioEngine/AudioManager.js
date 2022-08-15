// import AudioDegradation from '../../../js/audioDegradation.js'
import {emitter} from "../emitter";

class AudioManager {
    constructor(audioURL = './src/assets/audio/cello.wav') {
        this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.oAudioContext ||
            window.msAudioContext)();
        console.log('AudioContext created');
        this.audioURL = audioURL;
        this.audioWithHarmonicDist = [];
        this.audioDegradation = null;
        this.audioChannels = [];
        this.audioBuffer = null;
        this.audioSource = null;
        this.audioWorklet = this.audioContext.audioWorklet;
        this.gainNode = this.audioContext.createGain();
        this.harmonicDistNode = null;
        this.loadAudio();
    }

    async loadAudio() {
        this.audioBuffer = await this.loadAudioTrack();
        // this.audioBuffer = await this.loadAudioTrack().then(() => {
        //     // console.log(this.audioBuffer);
        //     // this.connectHarmonicDistPipeline();
        // });
        if(this.audioBuffer){
            console.log("AudioBuffer created");
            this.audioSource = this.audioContext.createBufferSource();
            this.audioSource.buffer = this.audioBuffer;
            this.connectHarmonicDistPipeline();
            // emitter.emit('buffer_loaded');
        }
        // await this.getAudioData().then(() => {
        //     this.audioDegradation = new AudioDegradation(this.audioChannels);
        // });
    }

    async connectHarmonicDistPipeline() {
        await this.audioWorklet.addModule('./src/audioEngine/harmonicDistortionProcessor.js', {}).then(() => {
            this.harmonicDistNode = new AudioWorkletNode(this.audioContext, 'harmonicDistortionProcessor');
            console.log(this.audioBuffer);
            this.audioSource.connect(this.gainNode).connect(this.harmonicDistNode).connect(this.audioContext.destination);
        });
    }

    play() {
        this.audioBuffer.start();
    }

    stop() {
        this.audioBuffer.stop();
    }

    // addHarmonicDistortion(){
    //     let dataHarmonicDist = this.audioDegradation.addHarmonicDistortion(3);
    //     this.audioWithHarmonicDist = this.audioContext.createBuffer(this.audioBuffer.numberOfChannels, this.audioBuffer.length, this.audioBuffer.sampleRate);
    //     for (let i = 0; i < this.audioBuffer.numberOfChannels; i++){
    //         this.audioWithHarmonicDist.copyToChannel(dataHarmonicDist[i], i);
    //     }
    //     return this.audioWithHarmonicDist;
    // }

    // async getAudioData(){
    //     this.audioChannels = Array.from({length: this.audioBuffer.numberOfChannels});
    //     this.audioChannels.map((channel, index) => this.audioChannels[index] = this.audioBuffer.getChannelData(index));
    // }

    async loadAudioTrack() {
        const response = await fetch(this.audioURL);
        this.arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(this.arrayBuffer);
    }
}

export const audioManager = new AudioManager();
