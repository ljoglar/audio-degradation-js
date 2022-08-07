/**
 * Audio Degradation Toolkit in JavaScript
 * Degradation Base Class
 *
 * Description:
 * Common elements for degradation units
 *
 * Programmer: Luis Joglar-Ongay
 * luis@luisjoglar.com
 * Date: August 2022
 */

class DegradationBase {
    /**
     * @param audio
     */
    constructor(audio) {
        this.audio = audio;
    }
}

export default DegradationBase;
