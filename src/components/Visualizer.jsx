import React, { useState, useRef, useEffect } from 'react';
import { mergeSort } from '../algorithms/mergeSort';
import { bubbleSort } from '../algorithms/bubbleSort';
import { heapSort } from '../algorithms/heapSort';
import './Visualizer.css'

const AudioContext = window.AudioContext || window.webkitAudioContext;

export default function Visualizer() {
    const [bars, setBars] = useState([]);
    const [active, setActive] = useState(false);
    const timeoutIds = useRef([]);
    const audioContext = useRef(null);
    const gainNode = useRef(null);
    const oscillators = useRef([]);

    useEffect(() => {
        const context = new AudioContext();
        const g = context.createGain();
        g.gain.setValueAtTime(0.125, 0);
        g.connect(context.destination);

        let osc = [];
        for (let i = 0; i < 8; ++i) {
            const o = context.createOscillator();
            o.type = "triangle";
            o.connect(g);
            o.start();
            osc.push(o);
        }

        audioContext.current = context;
        gainNode.current = g;
        oscillators.current = osc;
        context.suspend();

        genBars();

        return () => {
            g.disconnect();
            context.close();
        };
    }, []);

    function reset() {
        stop();
        genBars();
        setBars(bars => shuffle(bars.slice()));
    }

    function clearColors() {
        setBars(bars => bars.map(bar => {
            if (bar.color !== 'white') {
                return {...bar, color: 'white'};
            } else {
                return bar;
            }
        }));
    }

    function genBars() {
        const newBars = [];
        for (let i = 0; i < 256; ++i) {
            newBars.push({ value: i * 4, color: 'white' });
        }
        setBars(newBars);
    }

    function stop() {
        clearTimeouts();
        if (audioContext.current.state === "running") audioContext.current.suspend();
        setActive(false);
    }

    function prep() {
        setActive(true);
        audioContext.current.resume();
        clearColors();
    }

    async function processStep(bars, step) {
        step.forEach((update, idx) => {
            setBars(bars => bars.map((bar, idx) => {
                if (idx == update.index) {
                    return {...bar, value: update.value, color: update.color};
                } else {
                    return bar;
                }
            }));
        });

        for (let i = 0; i < 8; ++i) {
            oscillators.current[i].frequency.value = step[i % step.length].value + 50;
        }

        await delay(1);
        clearColors();
    }

    async function stepThroughMergeSort() {
        if (active) return;
        prep();
        for (const step of mergeSort(bars.map(bar => bar.value), 0, bars.length)) {
            await processStep(bars, step);
        }
        stop();
    }

    async function stepThroughBubbleSort() {
        if (active) return;
        prep();
        for (const step of bubbleSort(bars.map(bar => bar.value), 0, bars.length)) {
            await processStep(bars, step);
        }
        stop();
    }

    async function stepThroughHeapSort() {
        if (active) return;
        prep();
        for (const step of heapSort(bars.map(bar => bar.value), 0, bars.length)) {
            await processStep(bars, step);
        }
        stop();
    }

    function clearTimeouts() {
        timeoutIds.current.forEach((timeoutId) =>
            clearTimeout(timeoutId)
        );
        timeoutIds.current = [];
        setActive(false);
    }

    function delay(ms) {
        return new Promise(resolve => {
            let timeoutId = setTimeout(resolve, ms);
            timeoutIds.current.push(timeoutId);
        });
    }

    return (
        <>
            <div className="container">
                {bars.map((bar, idx) => (
                    <div
                        className="bar"
                        key={`${idx}_${bar.value}`}
                        style={{
                            backgroundColor: bar.color,
                            height: `${bar.value / 1000 * 40}vh`,
                        }}></div>
                ))}
            </div>
            <div className="button-bar">
                <button className="tmp" onClick={reset}>reset</button>
                <button className="tmp" onClick={stepThroughMergeSort}>merge sort</button>
                <button className="tmp" onClick={stepThroughBubbleSort}>bubble sort</button>
                <button className="tmp" onClick={stepThroughHeapSort}>heap sort</button>
            </div>
        </>
    );
}

// From https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
  }