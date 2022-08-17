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
        this.audioBuffer = null;
        this.audioSource = null;
        this.currentTime = 0;
        this.audioWorklet = this.audioContext.audioWorklet;
        this.gainNode = this.audioContext.createGain();
        this.harmonicDistNode = null;
        this.loadAudio();
    }

    async loadAudio() {
        this.audioBuffer = await this.loadAudioTrack();
        if(this.audioBuffer){
            console.log("AudioBuffer created");
            this.audioSource = this.audioContext.createBufferSource();
            this.audioSource.buffer = this.audioBuffer;
            await this.connectHarmonicDistPipeline();
        }
    }

    async connectHarmonicDistPipeline() {
        await this.audioWorklet.addModule('./src/audioEngine/harmonicDistortionProcessor.js', {}).then(() => {
            this.harmonicDistNode = new AudioWorkletNode(this.audioContext, 'harmonicDistortionProcessor');
            this.audioSource.connect(this.gainNode).connect(this.harmonicDistNode).connect(this.audioContext.destination);
        });
    }

    playOrPause(state) {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        console.log(state);
        if (state === true) {
            this.audioSource = this.audioContext.createBufferSource();
            this.audioSource.start(this.currentTime);
            emitter.emit('playSound');
            console.log("play");
        } else if (state === false) {
            this.currentTime = this.audioContext.currentTime;
            emitter.emit('pauseSound');
            this.audioSource.stop();
            console.log("pause");
        }
    }

    stop() {
        this.currentTime = this.audioContext.currentTime;
        this.audioSource.stop();
        emitter.emit('stopSound');
        console.log("stop");
    }

    async loadAudioTrack() {
        const response = await fetch(this.audioURL);
        this.arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(this.arrayBuffer);
    }
}

export const audioManager = new AudioManager();
