console.log("asdasd");

let App = {};
App.audioCtx = null
App.audioBuffer = null

App.init = function () {
    console.log('Initializing App...');
    this.options = {...this.options, ...options};
    this.loadEvents();
}

App.loadEvents = function() {
    document.querySelector('#loadText').addEventListener('click', this.createAudioContext.bind(this));
}

App.createAudioContext = async function(){
    console.log('Creating AudioContext...');
    if (this.audioCtx !== null) {
        console.log('AudioContext already exists');
        return;
    }
    let contextClass = (window.AudioContext ||
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.oAudioContext ||
        window.msAudioContext);
    if (contextClass) {
        this.audioCtx = new contextClass();
        console.log('AudioContext created');
        this.audioBuffer = await this.loadAudioTrack();
        this.track = Array.from({ length: this.audioBuffer.numberOfChannels});
        this.track.map((channel, index) => this.track[index] = this.audioBuffer.getChannelData(channel));
        console.log(this.track[0]);
    } else {
        alert('Your browser does not support web audio api');
    }
    this.audioWithDistortion = this.addHarmonicDistortion();
}

App.loadAudioTrack = async function() {
    const response = await fetch(this.options.audioURL);
    const arrayBuffer = await response.arrayBuffer();
    console.log('Track loaded');
    return await this.audioCtx.decodeAudioData(arrayBuffer);
}

App.addHarmonicDistortion = async function(){
    this.harmonicDist = new HarmonicDistortion(this.track, this.audioBuffer.sampleRate, 3, false);
    return this.harmonicDist.execute();
}

window.App = App || {};
let options = {
    audioURL: '../assets/audio/cello.wav',
};

App.init(options);
