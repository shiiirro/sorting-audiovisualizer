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
        genBars()
    }

    function genBars() {
        const newBars = [];
        for (let i = 0; i < 256; ++i) {
            newBars.push({ value: randomIntFromInterval(1, 1000), color: 'white' });
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
        const newBars = bars.slice();
        for (let i = 0; i < newBars.length; ++i) {
            if (newBars[i].color !== 'white') newBars[i].color = 'white';
        }
        setBars(newBars);
    }

    async function processStep(bars, step) {
        const newBars = bars.slice();
        step.forEach((update, idx) => {
            if (update.value != null) {
                newBars[update.index].value = update.value;
            }
            newBars[update.index].color = update.color;
        });

        for (let i = 0; i < 8; ++i) {
            oscillators.current[i].frequency.value = newBars[step[i % step.length].index].value + 50;
        }

        setBars(newBars);
        await delay(1);
        step.forEach((update) => {
            newBars[update.index].color = 'white';
        });
        setBars(newBars);
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
                <button className="tmp" onClick={stop}>stop</button>
                <button className="tmp" onClick={stepThroughMergeSort}>merge sort</button>
                <button className="tmp" onClick={stepThroughBubbleSort}>bubble sort</button>
                <button className="tmp" onClick={stepThroughHeapSort}>heap sort</button>
            </div>
        </>
    );
}

// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}