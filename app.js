const visualiser = document.getElementById("visualiser");
let dataArray = [];
const btnList = document.querySelectorAll('.btn_selector');
const speed = document.querySelector("#selection");
const randomizeButton = document.querySelector(".randomize_btn");
const startButton = document.querySelector(".start_btn");
const timeStamp = document.querySelector("#time");
const interpolations = document.querySelector("#interpolations");
const range = document.querySelector("#range");
const visualiserWidth = visualiser.innerWidth || visualiser.clientWidth;
const visualiserHeight = visualiser.innerHeight || visualiser.clientHeight;
let selectedOption = 0;
let timeCounter = 0;


function toggleSelection(btnList) {
    btnList[selectedOption].classList.add('selected')
    for (let btn of btnList) {
        btn.addEventListener('click', (e) => {
            for (let otherBtn of btnList) {
                otherBtn.classList.remove('selected');
            }
            btn.classList.add('selected');
            selectedOption = btn.tabIndex;
        })
    }
}


function drawCharts(dataArray, i, min) {

    if (dataArray == undefined || dataArray.length === 0) return;
    visualiser.innerHTML = ''
    const barWidth = Math.floor(visualiserWidth / dataArray.length);
    let index = 0;
    for (let item of dataArray) {
        const itemHeight = item / 100 * visualiserHeight;
        const itemDiv = document.createElement('div');
        const dataDiv = document.createElement('div');


        dataDiv.innerHTML = item;
        dataDiv.classList.add('bar_data');
        itemDiv.appendChild(dataDiv)
        visualiser.appendChild(itemDiv);
        itemDiv.classList.add('bar')
        itemDiv.style.width = `${barWidth}px`;
        itemDiv.style.height = `${itemHeight}px`;
        if (i === index || min === index) itemDiv.style.background = '#6CFF7DFF';
        index++;
    }
}

function randomizeArray(len) {
    if (len > 500) return;
    interpolations.innerHTML = '';
    timeStamp.innerHTML='';
    for (let i = 0; i < len; i++) {
        dataArray.push(Math.floor(Math.random() * 100));
    }
    drawCharts(dataArray);
}

//Sorting dependencies

async function merge(left, right, vspeed) {
    let sortedArr = [] // the sorted items will go here
    while (left.length && right.length) {
        // Insert the smallest item into sortedArr
        if (left[0] < right[0]) {
            sortedArr.push(left.shift())
        } else {
            sortedArr.push(right.shift())
        }
    }
    // Use spread operators to create a new array, combining the three arrays
    drawCharts(sortedArr);
    await new Promise(resolve => setTimeout(resolve, vspeed)); // 3 sec
}

function partition(items, left, right) {
    //rem that left and right are pointers.

    let pivot = items[Math.floor((right + left) / 2)],
        i = left, //left pointer
        j = right; //right pointer

    while (i <= j) {
        //increment left pointer if the value is less than the pivot
        while (items[i] < pivot) {
            i++;
        }

        //decrement right pointer if the value is more than the pivot
        while (items[j] > pivot) {
            j--;
        }

        //else we swap.
        if (i <= j) {
            [items[i], items[j]] = [items[j], items[i]];
            i++;
            j--;
        }
    }

    //return the left pointer
    return i;
}

function heapify(arr, N, i) {
    let largest = i; // Initialize largest as root
    const l = 2 * i + 1; // left = 2*i + 1
    const r = 2 * i + 2; // right = 2*i + 2

    // If left child is larger than root
    if (l < N && arr[l] > arr[largest])
        largest = l;

    // If right child is larger than largest so far
    if (r < N && arr[r] > arr[largest])
        largest = r;

    // If largest is not root
    if (largest != i) {
        const swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;

        // Recursively heapify the affected sub-tree
        heapify(arr, N, largest);
    }
}

function getMax(arr, n) {
    let mx = arr[0];
    for (let i = 1; i < n; i++)
        if (arr[i] > mx)
            mx = arr[i];
    return mx;
}

function countSort(arr, n, exp) {
    let output = new Array(n); // output array
    let i;
    let count = new Array(10);
    for (let i = 0; i < 10; i++)
        count[i] = 0;

    // Store count of occurrences in count[]
    for (i = 0; i < n; i++)
        count[Math.floor(arr[i] / exp) % 10]++;

    // Change count[i] so that count[i] now contains
    // actual position of this digit in output[]
    for (i = 1; i < 10; i++)
        count[i] += count[i - 1];

    // Build the output array
    for (i = n - 1; i >= 0; i--) {
        output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
        count[Math.floor(arr[i] / exp) % 10]--;
    }

    // Copy the output array to arr[], so that arr[] now
    // contains sorted numbers according to current digit
    for (i = 0; i < n; i++)
        arr[i] = output[i];
}

//Sorting functions
async function sortEngine(option) {
    let vspeed = speed.value;
    switch (option) {
        case 0 :
            await selectionSort(dataArray, vspeed);
            break;
        case 1 :
            bubbleSort(dataArray, vspeed);
            break;
        case 2 :
            await insertionSort(dataArray, vspeed);
            break;
        case 3 :
            await mergeSort(dataArray, vspeed);
            break;
        case 4 :
            await quickSort(dataArray, vspeed);
            break;
        case 5 :
            heapSort(dataArray);
            break;
        case 6 :
            countingSort(dataArray, 0, dataArray.length - 1);
            break;
        case 7:
            radixSort(dataArray);
            break;
        case 8:
            bucketSort(dataArray);
            break;
        default :
            await selectionSort(dataArray);
            break;
    }
}

async function selectionSort(parr, vspeed) {
    let counter = 0;
    let arr = [...parr];
    let date = Date.now();
    let inter = 0;
    let dateFinal;
    let min;
    for (let i = 0; i < arr.length; i++) {
        min = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[min]) {
                min = j;
            }
        }
        if (min !== i) {
            //swap
            [arr[i], arr[min]] = [arr[min], arr[i]];
                inter++;
                drawCharts(arr, i, min);
            dateFinal = Date.now();
            interpolations.innerHTML = `${inter}`
            counter = Math.abs(date - dateFinal);
            timeStamp.innerHTML = `${counter} ms (${counter / 1000} s)`
            if(vspeed !== 0) await new Promise(resolve => setTimeout(resolve, vspeed)); // 3 sec
        }
    }
    drawCharts(arr)

}

async function bubbleSort(arr, vspeed) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j + 1] < arr[j]) {
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
                drawCharts(arr, i + 1, j + 1);
                await new Promise(resolve => setTimeout(resolve, vspeed)); // 3 sec
            }
        }
    }
    drawCharts(arr);
}

async function insertionSort(arr, vspeed) {
    for (let i = 1; i < arr.length; i++) {
        for (let j = i - 1; j > -1; j--) {
            if (arr[j + 1] < arr[j]) {
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
                drawCharts(arr, i, j);
                await new Promise(resolve => setTimeout(resolve, vspeed)); // 3 sec
            }
        }
    }
    drawCharts(arr);

}

async function mergeSort(arr, vspeed) {
    // Base case
    if (arr.length <= 1) return arr
    let mid = Math.floor(arr.length / 2)
    // Recursive calls
    let left = mergeSort(arr.slice(0, mid))
    let right = mergeSort(arr.slice(mid))

    return merge(left, right)
}

async function quickSort(items, left, right, vspeed) {
    let index;

    if (items.length > 1) {
        index = partition(items, left, right); //get the left pointer returned

        if (left < index - 1) {
            //more elements on the left side
            await quickSort(items, left, index - 1);
            drawCharts(items);
            await new Promise(resolve => setTimeout(resolve, vspeed)); // 3 sec
        }

        if (index < right) {
            //more elements on the right side
            await quickSort(items, index, right);
            drawCharts(items);
            await new Promise(resolve => setTimeout(resolve, vspeed)); // 3 sec
        }
    }

    return items; //return the sorted array
}

function heapSort(arr) {
    let i;
    const N = arr.length;

    // Build heap (rearrange array)
    for (let i = Math.floor(N / 2) - 1; i >= 0; i--)
        heapify(arr, N, i);

    // One by one extract an element from heap
    for (i = N - 1; i > 0; i--) {
        // Move current root to end
        const temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;

        // call max heapify on the reduced heap
        heapify(arr, i, 0);
    }
}

function countingSort(arr, min, max) {
    let i = min,
        j = 0,
        len = arr.length,
        count = [];
    for (i; i <= max; i++) {
        count[i] = 0;
    }
    for (i = 0; i < len; i++) {
        count[arr[i]] += 1;
    }
    for (i = min; i <= max; i++) {
        while (count[i] > 0) {
            arr[j] = i;
            j++;
            count[i]--;
        }
    }
    return arr;
}

function radixSort(arr, n) {
    // Find the maximum number to know number of digits
    let m = getMax(arr, n);

    // Do counting sort for every digit. Note that
    // instead of passing digit number, exp is passed.
    // exp is 10^i where i is current digit number
    for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10)
        countSort(arr, n, exp);
}

function bucketSort(array, bucketSize) {
    if (array.length === 0) {
        return array;
    }

    // Declaring vars
    var i,
        minValue = array[0],
        maxValue = array[0],
        bucketSize = bucketSize || 5;

    // Setting min and max values
    array.forEach(function (currentVal) {
        if (currentVal < minValue) {
            minValue = currentVal;
        } else if (currentVal > maxValue) {
            maxValue = currentVal;
        }
    })

    // Initializing buckets
    const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
    const allBuckets = new Array(bucketCount);

    for (i = 0; i < allBuckets.length; i++) {
        allBuckets[i] = [];
    }

    // Pushing values to buckets
    array.forEach(function (currentVal) {
        allBuckets[Math.floor((currentVal - minValue) / bucketSize)].push(currentVal);
    });

    // Sorting buckets
    array.length = 0;

    allBuckets.forEach(function (bucket) {
        insertionSort(bucket);
        bucket.forEach(function (element) {
            array.push(element)
        });
    });

    return array;
}

randomizeButton.addEventListener("click", (e) => {
    randomizeButton.innerHTML = 'Loading ...'
    dataArray = [];
    randomizeArray(range.value);
    randomizeButton.innerHTML = 'Randomize Data'
})
startButton.addEventListener("click", async () => {
    startButton.innerHTML = 'Sorting ...'
    randomizeButton.disabled = true;
    startButton.disabled = true;
    speed.disabled = true;
    range.disabled = true;
    await sortEngine(selectedOption);
    startButton.innerHTML = 'Start Sorting'
    startButton.disabled = false;
    randomizeButton.disabled = false;
    speed.disabled = false;
    range.disabled = false;
})
randomizeArray(range.value)
toggleSelection(btnList);


