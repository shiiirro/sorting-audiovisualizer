# Sorting Audio-Visualizer using React

A relatively simple starting project to learn native React and Javascript that dynamically visualizes popular sorting algorithms with programmically generated sounds.

See a online version at [https://shiiirro.github.io/sorting-audiovisualizer](https://shiiirro.github.io/sorting-audiovisualizer/ (Please excuse the basic UI, this was my first time using both React and Javascript at all.)

## Features
- Real-time visualizations of Bubble Sort, Merge Sort and Heap Sort.
- Dynamic array state updates through React Hooks and asynchronous functions, allowing real-time shuffle, stop, and start functionality.
- Array access operations auralized through frequency updates of an oscillator array.
- Sorting algorithms implemented as generator functions that yield a sequence of color and value changes at specific indices for efficiency.

## Notes
The visualization operates on a dynamically updated array whenever 'start' is pressed. 'Stop' will halt the currently running algorithm, providing a snapshot of the array at its current point in the algorithm. 'Shuffle' does what you expect. The 'speed' slider modifies the visualization's delay between renders, with higher settings giving a faster animation.

During the visualization, certain bars will change colors to represent some internal mechanism in the running algorithm. Generally, any colored bar means that the algorithm is accessing the value at the corresponding index, with red bars indicating comparisons, while green bars indicating assignment. Bubble sort is the exception; here red bars indicate comparisons and swapping until the end index of an iteration is reached, which is marked green. Colored bars also yield sound output according to their current numeric value. The waveform used is the standard "triangle" waveform provided by default in Javascript oscillators with frequency modified and linearly-scaled between 54hz-1074hz.

Inspired by [The Sound of Sorting](https://panthema.net/2013/sound-of-sorting/) by Timo Bingmann.

**Everything below this line was automatically generated by React.**

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
