// script.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('meme-canvas');
    const ctx = canvas.getContext('2d');

    const topLeftInput = document.getElementById('topLeftText');
    const middleInput = document.getElementById('middleText');
    const bottomRightInput = document.getElementById('bottomRightText');
    const downloadBtn = document.getElementById('download-btn');

    // Text positions (relative to image size)
    let positions = {
        topLeft: { x: 0.05, y: 0.2 },      // 5% from left, 10% from top
        middle: { x: 0.4, y: 0.6 },        // Center
        bottomRight: { x: 0.95, y: 0.9 }   // 95% from left, 90% from top
    };

    // Load the base image
    const baseImage = new Image();
    baseImage.src = 'images/base-image.png'; // Ensure this path is correct

    baseImage.onload = () => {
        // Set canvas size to image size
        canvas.width = baseImage.width;
        canvas.height = baseImage.height;

        // Initial drawing
        drawMeme();
    };

    // Draw the meme
    function drawMeme() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the base image
        ctx.drawImage(baseImage, 0, 0);

        // Text properties
        const fontSize = Math.floor(canvas.width * 0.05); // 5% of canvas width
        ctx.font = `${fontSize}px Arial`;
        ctx.textBaseline = 'middle';

        // Text inputs
        const texts = [
            { text: "  " + topLeftInput.value, position: positions.topLeft, align: 'left' },
            { text: middleInput.value, position: positions.middle, align: 'center' },
            { text: bottomRightInput.value + "  ", position: positions.bottomRight, align: 'right' }
        ];

        texts.forEach(item => {
            drawText(item.text, item.position, item.align);
        });
    }

    // Draw text with background
    function drawText(text, position, align) {
        if (!text) return;

        ctx.textAlign = align;

        // Calculate position
        const x = canvas.width * position.x;
        const y = canvas.height * position.y;

        // Measure text
        const textMetrics = ctx.measureText(text);
        const paddingX = 10; // Horizontal padding
        const paddingY = 5;  // Vertical padding
        const textWidth = textMetrics.width + paddingX * 2;
        const textHeight = parseInt(ctx.font, 10) + paddingY * 2;

        // Set background style
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.lineJoin = 'round';
        ctx.lineWidth = textHeight / 2;

        // Draw rounded rectangle background
        let rectX;
        if (align === 'center') {
            rectX = x - textWidth / 2;
        } else if (align === 'right') {
            rectX = x - textWidth;
        } else {
            rectX = x;
        }
        const rectY = y - textHeight / 2;

        roundRect(ctx, rectX, rectY, textWidth, textHeight, textHeight / 4, true, false);

        // Draw text
        ctx.fillStyle = 'black';
        ctx.fillText(text, x, y);
    }

    // Utility function to draw rounded rectangles
    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
            const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
            for (let side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    }

    // Event listeners for live update
    [topLeftInput, middleInput, bottomRightInput].forEach(input => {
        input.addEventListener('input', drawMeme);
    });

    // Download button
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});
