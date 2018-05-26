const $ = document.querySelector.bind(document);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const cE = (element) => document.createElement(element);


// ===== GLOBALS, ELEMENTS AND EVENTLISTENERS ===== //


const audioCtx = new AudioContext();

const wrapperEl = $('.wrapper');
const keysWrapperEl = $('.keys');
const selectedOctaveMinEl = $('.js-octave-min');
const selectedOctaveMaxEl = $('.js-octave-max');
const octaveDecrementButtonEl = $('.js-octave-decrement');
const octaveIncrementButtonEl = $('.js-octave-increment');

octaveDecrementButtonEl.addEventListener('click', handleOctaveDecrementClick);
octaveIncrementButtonEl.addEventListener('click', handleOctaveIncrementClick);


// ===== DATA ===== //


const OCTAVE_MIN = 0;
const OCTAVE_MAX = 9;

let selectedOctaveMin = 4;
let selectedOctaveMax = 5;
let selectedWaveform = "sine";

const frequencyColors = ["#ff0000", "#ff4e00", "#db7b01", "#ffcd01", "#e4ed00", "#81d700", "#02feb4", "#01ffeb", "#01baff", "#3c00ff", "#a801ff", "#fe00fd", "#ff0000", "#ff4e00", "#db7b01", "#ffcd01", "#e4ed00", "#81d700", "#02feb4", "#01ffeb", "#01baff", "#3c00ff", "#a801ff", "#fe00fd"];

const keys = ['c', 'cis', 'd', 'dis', 'e', 'f', 'fis', 'g', 'gis', 'a', 'ais', 'b'];


// ===== LOGIC ===== //


function drawKeys() {
    keysWrapperEl.innerHTML = '';
    
    const frequenciesToDraw = getFreqs(selectedOctaveMin, selectedOctaveMax);
    
    frequenciesToDraw.forEach(freqObj => {
        Object.keys(freqObj).forEach((freqKey, freqIndex) => {
            const freq = freqObj[freqKey];
            const keyEl = cE('div');
            let keyClassName = 'key key--';
            
            if (freqKey.indexOf('is') > -1) {
                keyClassName += 'black';
            } else {
                keyClassName += 'white';
            }
            keyEl.className = keyClassName;
            
            keyEl.innerHTML = `${formatFrequency(freq)}<br>${freqKey}`;
            
            keyEl.addEventListener('click', () => handleKeyClick(keyEl, freq, freqIndex));
            
            keysWrapperEl.appendChild(keyEl);
        });
    });
}

function playSound(freq) {
    // oscillator controls frequency input, gain controls volume (amplitude)
    const oscillatorNode = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillatorNode.type = selectedWaveform;
    oscillatorNode.frequency.value = freq;

    oscillatorNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillatorNode.start();
    gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 1.5
    );
}

function handleOctaveChange(e, posneg) {
    e.preventDefault();
    selectedOctaveMin += posneg;
    selectedOctaveMax += posneg;
    updateBackground();
    drawKeys();
}

function handleOctaveDecrementClick(e) {
    e.preventDefault();
    selectedOctaveMin--;
    selectedOctaveMax--;
    updateControlEls();
    drawKeys();
}

function handleOctaveIncrementClick(e) {
    e.preventDefault();
    selectedOctaveMin++;
    selectedOctaveMax++;
    updateControlEls();
    drawKeys();
}


// ===== HELPERS ===== //


function handleKeyClick(keyEl, freq, ind) {
    playSound(freq);
    updateBackground(keyEl, ind);
}

function updateBackground(key, index) {
    wrapperEl.style.backgroundColor = frequencyColors[index];
}

function updateControlEls() {
    selectedOctaveMinEl.innerHTML = selectedOctaveMin;
    selectedOctaveMaxEl.innerHTML = selectedOctaveMax;
}

function formatFrequency(f) {
    return String(f).split('.')[0];
}

function getFreq(keyIndex) {
	return 440 * (2 ** ((keyIndex - 58) / 12));
}

function getFreqs(min, max) {
	const result = [];
	let keyIndex = 12 * min;
	
	for (let o = min; o <= max; o++) {
		const freqObj = {};
		keys.forEach((key, index) => {
			keyIndex++;
			freqObj[key + o] = getFreq(keyIndex);
		});
		result.push(freqObj);
	}
	
	return result;
};


// ===== DRAW EVENTS ===== //


updateControlEls();
drawKeys();
