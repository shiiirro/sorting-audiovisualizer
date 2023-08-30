import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { mergeSort } from '../algorithms/mergeSort';
import { bubbleSort } from '../algorithms/bubbleSort';
import { heapSort } from '../algorithms/heapSort';
import { quickSort } from '../algorithms/quickSort';
import './Visualizer.css'

const NUMBER_OF_BARS = 256;

export default function Visualizer() {
    const [nodes, setNodes] = useState([]);
    const [active, setActive] = useState(false);
    const [selectedSort, setSelectedSort] = useState('heap');
    const timeoutIds = useRef([]);
    const audioContext = useRef(null);
    const gainNode = useRef(null);
    const oscillators = useRef([]);
    const checkpoint = useRef(null);
    const delayRef = useRef(1);
    const [sliderVal, setSliderVal] = useState(4999);

    useEffect(() => {
        document.title = 'sorting-audiovisualizer';

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
        setNodes(nodes => shuffleArray(nodes.slice()));

        return () => {
            g.disconnect();
            context.close();
        };
    }, []);

    useEffect(() => {
        let currentValues = nodes.map(bar => bar.value);
        for (let i = 1; i <= NUMBER_OF_BARS; ++i) {
            if (currentValues.find(element => element === i * 4) === undefined) {
                return;
            }
        }
        checkpoint.current = nodes.slice();
    }, [nodes]);

    function shuffle() {
        stop();
        setNodes(checkpoint.current);
        clearColors();
        setNodes(nodes => shuffleArray(nodes.slice()));
    }

    function clearColors() {
        setNodes(nodes => nodes.map(bar => {
            if (bar.color !== 'white') {
                return { ...bar, color: 'white' };
            } else {
                return bar;
            }
        }));
    }

    function genBars() {
        const newBars = [];
        for (let i = 1; i <= NUMBER_OF_BARS; ++i) {
            newBars.push({ value: i * 4, color: 'white' });
        }
        setNodes(newBars);
    }

    function stop() {
        clearTimeouts();
        if (audioContext.current.state === "running") audioContext.current.suspend();
        setActive(false);
    }

    function updateNodes(currNodes, step) {
        step.forEach((update) => {
            currNodes[update.index] = { value: update.value, color: update.color };
        });
        return currNodes;
    }

    async function processStep(step) {
        setNodes(nodes => updateNodes(nodes, step));

        for (let i = 0; i < 8; ++i) {
            oscillators.current[i].frequency.value = step[i % step.length].value + 50;
        }

        await delay(delayRef.current);
        clearColors();
    }

    function sortFunctionOf(name) {
        switch (name) {
            case 'merge':
                return mergeSort;
            case 'heap':
                return heapSort;
            case 'bubble':
                return bubbleSort;
            case 'quick':
                return quickSort;
            default:
                return heapSort;
        }
    }

    async function stepThroughSort() {
        if (active) return;
        // timeoutIds.current.push(setInterval(() => {setNumber(number => (number + 1) % 3);}, 1000));
        setActive(true);
        setNodes(checkpoint.current); // checkpoint ensures that all values are present (issue with desynced mergesort visualization, see mergesort for more)
        clearColors();
        audioContext.current.resume();
        for (const step of sortFunctionOf(selectedSort)(checkpoint.current.map(bar => bar.value))) {
            await processStep(step);
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

    function changeSelectedSort(newSort) {
        if (active) stop();
        setSelectedSort(newSort);
    }


    return (
        <>
            <div className="sort-selection-bar">
                <div className='sort-button-combo'>
                    <button className="button" onClick={() => changeSelectedSort('merge')}>merge sort</button>
                    <div className='button-select-ind' style={{
                        backgroundColor: selectedSort === 'merge' ? 'white' : 'black'
                    }}></div>
                </div>
                <div className='sort-button-combo'>
                    <button className="button" onClick={() => changeSelectedSort('heap')}>heap sort</button>
                    <div className='button-select-ind' style={{
                        backgroundColor: selectedSort === 'heap' ? 'white' : 'black'
                    }}></div>
                </div>
                <div className='sort-button-combo'>
                    <button className="button" onClick={() => changeSelectedSort('quick')}>quick sort</button>
                    <div className='button-select-ind' style={{
                        backgroundColor: selectedSort === 'quick' ? 'white' : 'black'
                    }}></div>
                </div>
                <div className='sort-button-combo'>
                    <button className="button" onClick={() => changeSelectedSort('bubble')}>bubble sort</button>
                    <div className='button-select-ind' style={{
                        backgroundColor: selectedSort === 'bubble' ? 'white' : 'black'
                    }}></div>
                </div>
            </div>
            <div className="container">
                {nodes.map((bar, idx) => (
                    <div
                        className="bar"
                        key={`${idx}_${bar.value}`}
                        style={{
                            backgroundColor: bar.color,
                            height: `${bar.value / NUMBER_OF_BARS / 4 * 40}vh`,
                        }}></div>
                ))}
            </div>
            <div className="button-bar">
                <button className="button" onClick={shuffle}>shuffle</button>
                <button className="button" onClick={stop}>stop</button>
                <button className="button" onClick={stepThroughSort}>start</button>
            </div>
            <Box sx={{alignItems: 'center', width: `30vw`, margin: `auto`}}>
                <div className='general-text'>speed</div>
                <Slider
                    min={1}
                    step={1}
                    max={900}
                    value={sliderVal} onChange={(event, value) => {
                        delayRef.current = 900 === value ? 0 : Math.floor(5042.810832 * Math.pow(Math.E, -0.00852572 * value));
                        setSliderVal(value);
                    }}
                    sx={{color: 'white'}}
                />
            </Box>
        </>
    );
}

// From https://bost.ocks.org/mike/shuffle/
function shuffleArray(array) {
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