let faceapi;
let detections = [];

let video;
let canvas;

function setup() {
    canvas = createCanvas(480, 360);
    video = createCapture(VIDEO);
    video.size(width, height);

    const faceOptions = {
        withLandmarks: true,
        withExpressions: true,
        withDescriptors: false,
        minConfidence: 0.5
    };

    faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function faceReady() {
    faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
    if (error) {
        console.log(error);
        return;
    }
    detections = result;
    faceapi.detect(gotFaces);
}

// function draw() {
//     clear();
//     image(video, 0, 0, width, height); // Draw the video feed

//     if (detections.length > 0) {
//         for (let f = 0; f < detections.length; f++) {
//             let landmarks = detections[f].landmarks._positions;
            
//             // Calculate the bounding box around the face using landmarks
//             let minX = Infinity;
//             let minY = Infinity;
//             let maxX = -Infinity;
//             let maxY = -Infinity;

//             for (let i = 0; i < landmarks.length; i++) {
//                 let x = landmarks[i]._x;
//                 let y = landmarks[i]._y;

//                 minX = min(minX, x);
//                 minY = min(minY, y);
//                 maxX = max(maxX, x);
//                 maxY = max(maxY, y);
//             }

//             stroke(44, 169, 225);
//             strokeWeight(1);
//             noFill();
//             rect(minX, minY, maxX - minX, maxY - minY);
//         }
//     }
// }

function draw() {
    clear();
    image(video, 0, 0, width, height); // Draw the video feed

    if (detections.length > 0) {
        for (let f = 0; f < detections.length; f++) {
            let landmarks = detections[f].landmarks._positions;

            // Calculate the bounding box around the face using landmarks
            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;

            for (let i = 0; i < landmarks.length; i++) {
                let x = landmarks[i]._x;
                let y = landmarks[i]._y;

                minX = min(minX, x);
                minY = min(minY, y);
                maxX = max(maxX, x);
                maxY = max(maxY, y);
            }

            // Get the region of interest (ROI) - the face
            let roi = video.get(minX, minY, maxX - minX, maxY - minY);

            // Apply blur only to the face
            roi.filter(BLUR, 10); // You can adjust the blur amount (10 in this case)

            // Draw the original video feed
            image(video, 0, 0, width, height);

            // Draw the blurred face
            image(roi, minX, minY, maxX - minX, maxY - minY);
        }
    }
}
