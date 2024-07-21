import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronDown } from 'lucide-react';

// Utility functions
const generateRandomArray = (length) => {
  return Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Sorting algorithms
const bubbleSort = async (arr, setArray, speed, shouldContinue) => {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (!shouldContinue.current) return;
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        setArray([...arr]);
        await sleep(speed);
      }
    }
  }
};

const quickSort = async (arr, low, high, setArray, speed, shouldContinue) => {
  if (low < high) {
    const pi = await partition(arr, low, high, setArray, speed, shouldContinue);
    if (!shouldContinue.current) return;
    await quickSort(arr, low, pi - 1, setArray, speed, shouldContinue);
    if (!shouldContinue.current) return;
    await quickSort(arr, pi + 1, high, setArray, speed, shouldContinue);
  }
};

const partition = async (arr, low, high, setArray, speed, shouldContinue) => {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (!shouldContinue.current) return;
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      setArray([...arr]);
      await sleep(speed);
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  setArray([...arr]);
  await sleep(speed);
  return i + 1;
};

const mergeSort = async (arr, setArray, speed, shouldContinue) => {
  const merge = async (left, right) => {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (!shouldContinue.current) return;
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
      setArray([...result, ...left.slice(leftIndex), ...right.slice(rightIndex)]);
      await sleep(speed);
    }
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  };

  const sort = async (arr) => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    return merge(await sort(left), await sort(right));
  };

  const sorted = await sort(arr);
  setArray(sorted);
};

const selectionSort = async (arr, setArray, speed, shouldContinue) => {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (!shouldContinue.current) return;
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      setArray([...arr]);
      await sleep(speed);
    }
  }
};

const insertionSort = async (arr, setArray, speed, shouldContinue) => {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      if (!shouldContinue.current) return;
      arr[j + 1] = arr[j];
      j = j - 1;
      setArray([...arr]);
      await sleep(speed);
    }
    arr[j + 1] = key;
    setArray([...arr]);
    await sleep(speed);
  }
};

const radixSort = async (arr, setArray, speed, shouldContinue) => {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    if (!shouldContinue.current) return;
    await countingSort(arr, exp, setArray, speed, shouldContinue);
  }
};

const countingSort = async (arr, exp, setArray, speed, shouldContinue) => {
  const n = arr.length;
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) {
    count[Math.floor(arr[i] / exp) % 10]++;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
    count[Math.floor(arr[i] / exp) % 10]--;
  }

  for (let i = 0; i < n; i++) {
    if (!shouldContinue.current) return;
    arr[i] = output[i];
    setArray([...arr]);
    await sleep(speed);
  }
};

const shellSort = async (arr, setArray, speed, shouldContinue) => {
  const n = arr.length;
  for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j;
      for (j = i; j >= gap && arr[j-gap] > temp; j -= gap) {
        if (!shouldContinue.current) return;
        arr[j] = arr[j-gap];
        setArray([...arr]);
        await sleep(speed);
      }
      arr[j] = temp;
      setArray([...arr]);
      await sleep(speed);
    }
  }
};

const heapSort = async (arr, setArray, speed, shouldContinue) => {
  const heapify = async (n, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      await sleep(speed);
      await heapify(n, largest);
    }
  };

  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (!shouldContinue.current) return;
    await heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    if (!shouldContinue.current) return;
    [arr[0], arr[i]] = [arr[i], arr[0]];
    setArray([...arr]);
    await sleep(speed);
    await heapify(i, 0);
  }
};

const combSort = async (arr, setArray, speed, shouldContinue) => {
  const n = arr.length;
  let gap = n;
  let swapped = true;

  while (gap !== 1 || swapped === true) {
    gap = Math.floor(gap / 1.3);
    if (gap < 1) gap = 1;
    swapped = false;

    for (let i = 0; i < n - gap; i++) {
      if (!shouldContinue.current) return;
      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        swapped = true;
        setArray([...arr]);
        await sleep(speed);
      }
    }
  }
};

const randomizedQuickSort = async (arr, low, high, setArray, speed, shouldContinue) => {
  const partition = async (low, high) => {
    const pivotIndex = Math.floor(Math.random() * (high - low + 1)) + low;
    [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (!shouldContinue.current) return;
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await sleep(speed);
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await sleep(speed);
    return i + 1;
  };

  if (low < high) {
    const pi = await partition(low, high);
    await randomizedQuickSort(arr, low, pi - 1, setArray, speed, shouldContinue);
    await randomizedQuickSort(arr, pi + 1, high, setArray, speed, shouldContinue);
  }
};

const bucketSort = async (arr, setArray, speed, shouldContinue) => {
  const n = arr.length;
  const buckets = Array.from({ length: n }, () => []);

  for (let i = 0; i < n; i++) {
    const bucketIndex = Math.floor(arr[i] / 101 * n);
    buckets[bucketIndex].push(arr[i]);
  }

  for (let i = 0; i < n; i++) {
    buckets[i].sort((a, b) => a - b);
  }

  let index = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < buckets[i].length; j++) {
      if (!shouldContinue.current) return;
      arr[index++] = buckets[i][j];
      setArray([...arr]);
      await sleep(speed);
    }
  }
};

const cubeSort = async (arr, setArray, speed, shouldContinue) => {
  const n = arr.length;
  let done = false;

  while (!done) {
    done = true;
    for (let i = 0; i < n - 1; i += 2) {
      if (!shouldContinue.current) return;
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        done = false;
      }
      setArray([...arr]);
      await sleep(speed);
    }
    for (let i = 1; i < n - 1; i += 2) {
      if (!shouldContinue.current) return;
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        done = false;
      }
      setArray([...arr]);
      await sleep(speed);
    }
  }
};

const AlgorithmDescription = ({ algorithm }) => {
  const descriptions = {
    bubble: {
      name: "Bubble Sort",
      description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
    },
    quick: {
      name: "Quick Sort",
      description: "Picks an element as pivot and partitions the given array around the picked pivot.",
      timeComplexity: "O(n log n) average, O(n²) worst case",
      spaceComplexity: "O(log n)",
    },
    merge: {
      name: "Merge Sort",
      description: "Divides the input array into two halves, recursively sorts them, and then merges the two sorted halves.",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
    },
    selection: {
      name: "Selection Sort",
      description: "Repeatedly selects the smallest element from the unsorted portion and puts it at the beginning.",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
    },
    insertion: {
      name: "Insertion Sort",
      description: "Builds the final sorted array one item at a time, by repeatedly inserting a selected element into its correct position.",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
    },
    radix: {
      name: "Radix Sort",
      description: "Sorts integers by processing each digit, from least significant to most significant.",
      timeComplexity: "O(nk) where k is the number of digits",
      spaceComplexity: "O(n + k)",
    },
    shell: {
      name: "Shell Sort",
      description: "An extension of insertion sort that allows the exchange of items that are far apart.",
      timeComplexity: "O(n log n) to O(n²) depending on gap sequence",
      spaceComplexity: "O(1)",
    },
    heap: {
      name: "Heap Sort",
      description: "Builds a max-heap and repeatedly extracts the maximum element to sort the array.",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(1)",
    },
    comb: {
      name: "Comb Sort",
      description: "An improvement over Bubble Sort, using a gap sequence to eliminate small values near the end of the list.",
      timeComplexity: "O(n²) worst case, O(n log n) on average",
      spaceComplexity: "O(1)",
    },
    randomQuick: {
      name: "Randomized Quick Sort",
      description: "A variation of Quick Sort that picks a random element as pivot, reducing the chance of worst-case scenarios.",
      timeComplexity: "O(n log n) expected",
      spaceComplexity: "O(log n)",
    },
    bucket: {
      name: "Bucket Sort",
      description: "Distributes elements into a number of buckets, then sorts the buckets individually.",
      timeComplexity: "O(n + k) average case, O(n²) worst case",
      spaceComplexity: "O(n + k)",
    },
    cube: {
      name: "Cube Sort",
      description: "A parallel sorting algorithm that divides the array into 'cubes' and sorts them recursively.",
      timeComplexity: "O(n log n) expected",
      spaceComplexity: "O(n)",
    },
  };

  const info = descriptions[algorithm];

  return (
    <div className="bg-blue-50 p-4 rounded-md mt-4 text-left">
      <h3 className="text-lg font-semibold text-blue-800">{info.name}</h3>
      <p className="text-sm text-blue-600 mt-2">{info.description}</p>
      <div className="mt-2">
        <p className="text-sm"><strong>Time Complexity:</strong> {info.timeComplexity}</p>
        <p className="text-sm"><strong>Space Complexity:</strong> {info.spaceComplexity}</p>
      </div>
    </div>
  );
};

const AnimatedHeader = () => {
  const [bars, setBars] = useState([]);
  const [sorting, setSorting] = useState(false);

  useEffect(() => {
    const generateBars = () => {
      const newBars = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 10);
      setBars(newBars);
    };

    generateBars();
    const interval = setInterval(() => {
      if (!sorting) {
        generateBars();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sorting]);

  useEffect(() => {
    if (sorting) {
      const sortedBars = [...bars].sort((a, b) => a - b);
      let i = 0;
      const interval = setInterval(() => {
        if (i < sortedBars.length) {
          setBars(prev => {
            const newBars = [...prev];
            newBars[i] = sortedBars[i];
            return newBars;
          });
          i++;
        } else {
          setSorting(false);
          clearInterval(interval);
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [sorting, bars]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <svg viewBox="0 0 300 100" className="w-full">
        {bars.map((height, index) => (
          <rect
            key={index}
            x={index * 30}
            y={100 - height}
            width="25"
            height={height}
            fill="#4299e1"
            className="transition-all duration-300 ease-in-out"
          />
        ))}
      </svg>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={() => setSorting(true)}
      >
        Sort
      </button>
    </div>
  );
};

const App = () => {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(20);
  const shouldContinue = useRef(true);
  const visualizerRef = useRef(null);

  useEffect(() => {
    resetArray();
  }, [arraySize]);

  const resetArray = useCallback(() => {
    setArray(generateRandomArray(arraySize));
    setSorting(false);
    shouldContinue.current = true;
  }, [arraySize]);

  const startSorting = useCallback(async () => {
    if (sorting) {
      shouldContinue.current = false;
      setSorting(false);
      return;
    }

    setSorting(true);
    shouldContinue.current = true;

    switch (algorithm) {
      case 'bubble':
        await bubbleSort([...array], setArray, 101 - speed, shouldContinue);
        break;
      case 'quick':
        await quickSort([...array], 0, array.length - 1, setArray, 101 - speed, shouldContinue);
        break;
      case 'merge':
        await mergeSort([...array], setArray, 101 - speed, shouldContinue);
        break;
      case 'selection':
        await selectionSort([...array], setArray, 101 - speed, shouldContinue);
        break;
      case 'insertion':
        await insertionSort([...array], setArray, 101 - speed, shouldContinue);
        break;
      case 'radix':
        await radixSort([...array], setArray, 101 - speed, shouldContinue);
        break;
      case 'shell':
        await shellSort([...array], setArray, 101 - speed, shouldContinue);
        break;
      case 'heap':
        await heapSort([...array], setArray, 101 - speed, shouldContinue);
        break;
      case 'comb':
        await combSort([...array], setArray, 101 - speed, shouldContinue);
        break;
      case 'randomQuick':
        await randomizedQuickSort([...array], 0, array.length - 1, setArray, 101 - speed, shouldContinue);
        break;
      case 'bucket':
        await bucketSort([...array], setArray, 101 - speed, shouldContinue);
        break;
      case 'cube':
        await cubeSort([...array], setArray, 101 - speed, shouldContinue);
        break;
      default:
        break;
    }

    setSorting(false);
  }, [algorithm, array, speed, sorting]);

  const scrollToVisualizer = () => {
    visualizerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-blue-100">
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-5xl font-bold mb-8 text-blue-800">Sorting Visualizer</h1>
        <AnimatedHeader />
        <p className="text-xl mb-8 max-w-3xl">
          Welcome! This tool helps you understand how different sorting algorithms work by visualizing the process. Watch as the bars rearrange themselves according to the chosen algorithm. Adjust the array size and sorting speed to see how these factors affect the sorting process.
        </p>
        <button
          onClick={scrollToVisualizer}
          className="bg-blue-500 text-white px-6 py-3 rounded-full flex items-center hover:bg-blue-600 transition-colors"
        >
          Try it out <ChevronDown className="ml-2" />
        </button>
      </div>
      <div ref={visualizerRef} className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
          <div className="flex justify-center items-end h-64 mb-8">
            {array.map((value, index) => (
              <div
                key={index}
                style={{
                  height: `${value * 2}px`,
                  width: `${Math.max(2, 600 / array.length - 1)}px`,
                  backgroundColor: '#4299e1',
                  margin: '0 1px',
                }}
              ></div>
            ))}
          </div>
          <div className="flex space-x-4 mb-4">
            <select
              className="p-2 border border-blue-300 rounded"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={sorting}
            >
              <option value="bubble">Bubble Sort</option>
              <option value="quick">Quick Sort</option>
              <option value="merge">Merge Sort</option>
              <option value="selection">Selection Sort</option>
              <option value="insertion">Insertion Sort</option>
              <option value="radix">Radix Sort</option>
              <option value="shell">Shell Sort</option>
              <option value="heap">Heap Sort</option>
              <option value="comb">Comb Sort</option>
              <option value="randomQuick">Randomized Quick Sort</option>
              <option value="bucket">Bucket Sort</option>
              <option value="cube">Cube Sort</option>
            </select>
            <button
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              onClick={startSorting}
            >
              {sorting ? <Pause size={20} /> : <Play size={20} />}
              <span className="ml-2">{sorting ? 'Pause' : 'Start'} Sorting</span>
            </button>
            <button
              className="p-2 bg-blue-300 text-blue-800 rounded hover:bg-blue-400 flex items-center"
              onClick={resetArray}
            >
              <RotateCcw size={20} />
              <span className="ml-2">Reset Array</span>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Array Size: {arraySize}</label>
              <input
                type="range"
                min="5"
                max="100"
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                className="w-full"
                disabled={sorting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Speed: {speed}</label>
              <input
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <AlgorithmDescription algorithm={algorithm} />
        </div>
      </div>
    </div>
  );
};

export default App;