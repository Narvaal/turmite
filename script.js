// Initialize matrix
const matrix = Array.from({ length: 100 }, () => Array(100).fill(0));

// Spawn a turmite object
const spawTurminte = (x, y, direction) => {
    return { x, y, direction };
}

// Get the turmite's vision (not used yet, but available)
const turmiteVision = (x, y) => {
    return [
        { direction: "up", value: matrix[x - 1]?.[y] || 0 },
        { direction: "right", value: matrix[x][y + 1] || 0 },
        { direction: "down", value: matrix[x + 1]?.[y] || 0 },
        { direction: "left", value: matrix[x][y - 1] || 0 },
    ];
}

// Encode color values to CSS color strings
const colorEncoder = (value) => {
    if (value === 99) return 'black';
    if (value === 1) return 'red';
    if (value === 2) return 'green';
    if (value === 3) return 'blue';
    if (value === 4) return 'yellow';
    return 'gray'; 
}

// Decode CSS color strings to numeric values
const colorDecoder = (color) => {
    if (color === 'black') return 99;
    if (color === 'red') return 1;
    if (color === 'green') return 2;
    if (color === 'blue') return 3;
    if (color === 'yellow') return 4;
    return 0;
}

// Draw a square of given size and color on the matrix
const drawSquare = (x, y, size, color) => {
    const value = colorDecoder(color);
    for (let i = x; i < x + size; i++) {
        for (let j = y; j < y + size; j++) {
            if (i >= 0 && i < matrix.length && j >= 0 && j < matrix[0].length) {
                matrix[i][j] = value;
            }
        }
    }
}

// Convert direction to x/y movement
const movementEncoder = (direction) => {
    if (direction === "up") return { x: -1, y: 0 };
    if (direction === "right") return { x: 0, y: 1 };
    if (direction === "down") return { x: 1, y: 0 };
    if (direction === "left") return { x: 0, y: -1 };
    return { x: 0, y: 0 };
}

// Draw the matrix and all turmites
const drawMatrix = () => {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            ctx.fillStyle = colorEncoder(matrix[i][j]);
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }

    for (const t of turmites) {
        ctx.fillStyle = "black";
        ctx.fillRect(t.y * cellSize, t.x * cellSize, cellSize, cellSize);
    }
}

// Move a single turmite
const moveTurmite = (turmite) => {
    const currentValue = matrix[turmite.x][turmite.y];
    const rule = rules[turmite.direction][currentValue];

    // Update direction and paint cell
    turmite.direction = rule.turn;
    matrix[turmite.x][turmite.y] = rule.color;

    // Move turmite
    turmite.x += movementEncoder(turmite.direction).x;
    turmite.y += movementEncoder(turmite.direction).y;

    // Wrap around edges
    turmite.x = (turmite.x + matrix.length) % matrix.length;
    turmite.y = (turmite.y + matrix[0].length) % matrix[0].length;
}

// Randomly color some cells
const spawColors = (number, color) => {
    for (let i = 0; i < number; i++) {
        const x = Math.floor(Math.random() * matrix.length);
        const y = Math.floor(Math.random() * matrix[0].length);
        matrix[x][y] = colorDecoder(color);
    }
}

// Define rules
const rules = {
    "up": {
        "0": { "turn": "right", "color": 1 },
        "1": { "turn": "right", "color": 2 },
        "2": { "turn": "left", "color": 3 },
        "3": { "turn": "down", "color": 0 }
    },
    "right": {
        "0": { "turn": "down", "color": 2 },
        "1": { "turn": "left", "color": 3 },
        "2": { "turn": "up", "color": 0 },
        "3": { "turn": "right", "color": 1 }
    },
    "down": {
        "0": { "turn": "left", "color": 3 },
        "1": { "turn": "down", "color": 0 },
        "2": { "turn": "right", "color": 1 },
        "3": { "turn": "up", "color": 2 }
    },
    "left": {
        "0": { "turn": "up", "color": 0 },
        "1": { "turn": "right", "color": 1 },
        "2": { "turn": "down", "color": 2 },
        "3": { "turn": "left", "color": 3 }
    }
}

// --- INITIALIZATION ---

// Spawn multiple turmites
const turmites = [
    spawTurminte(20, 20, "down"),
    spawTurminte(50, 50, "up"),
    spawTurminte(70, 30, "right"),
    spawTurminte(10, 80, "left")
];


// Animate everything
const animate = () => {
    for (const t of turmites) {
        moveTurmite(t);
    }
    drawMatrix();
    requestAnimationFrame(animate);
}

animate();