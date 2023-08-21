import React, { useState, useRef, useEffect } from 'react';
import { mergeSort } from '../algorithms/mergeSort';
import './Visualizer.css'

const AudioContext = window.AudioContext || window.webkitAudioContext;

export default function Visualizer() {
    const [bars, setBars] = useState([]);
    const [active, setActive] = useState(false);
    const timeoutIds = useRef([]);
    const audioContext = useRef();
    const oscillators = useRef([]);

    useEffect(() => {
        const context = new AudioContext();
        const o1 = context.createOscillator();
        const g1 = context.createGain();
        const o2 = context.createOscillator();
        const g2 = context.createGain();

        o1.type = "triangle";
        o1.frequency.value = 87;
        o2.type = "triangle";
        o2.frequency.value = 87;

        o1.connect(g1);
        g1.connect(context.destination);
        o1.start();
        o2.connect(g2);
        g2.connect(context.destination);
        o2.start();

        g1.gain.setValueAtTime(0.5, 0);
        g2.gain.setValueAtTime(0.5, 0);

        audioContext.current = context;
        let nodes = [o1, o2];
        oscillators.current = nodes;
        context.suspend();

        return () => {
            g1.disconnect(context.destination);
            g2.disconnect(context.destination);
        };
    }, []);

    function reset() {
        stop();
        const newBars = [];
        for (let i = 0; i < 256; ++i) {
            newBars.push({ value: randomIntFromInterval(1, 1000), color: 'white' });
        }
        setBars(newBars);
    }

    function stop() {
        clearTimeouts();
        audioContext.current.suspend();
        setActive(false);
    }

    async function stepThroughMergeSort() {
        if (active) return;
        setActive(true);
        audioContext.current.resume();
        for (const step of mergeSort(bars.map(bar => bar.value), 0, bars.length)) {
            let newBars = bars.slice();
            if (step.operation === 'comparison') {
                newBars[step.indices[0]].color = step.color;
                newBars[step.indices[1]].color = step.color;
                oscillators.current[0].frequency.value = newBars[step.indices[0]].value / 1000 * 800;
                oscillators.current[1].frequency.value = newBars[step.indices[1]].value / 1000 * 800;
                setBars(newBars);
                await delay(1);
                newBars[step.indices[0]].color = 'white';
                newBars[step.indices[1]].color = 'white';
                setBars(newBars);
                await delay(1);
            } else {
                newBars[step.index].value = step.value;
                newBars[step.index].color = step.color;
                oscillators.current[0].frequency.value = step.value / 1000 * 800;
                oscillators.current[1].frequency.value = step.value / 1000 * 800;
                setBars(newBars);
                await delay(1);
                newBars[step.index].color = 'white';
                setBars(newBars);
                await delay(1);
            }
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
            <button className="tmp" onClick={reset}>reset</button>
            <button className="tmp" onClick={stepThroughMergeSort}>sort</button>
        </>
    );
}

// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}