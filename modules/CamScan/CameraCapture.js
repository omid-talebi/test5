import React, { useRef, useState, useEffect } from 'react';

const CameraCapture = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isOpenCVReady, setIsOpenCVReady] = useState(false);

    useEffect(() => {
        // Load OpenCV.js
        if (!window.cv) {
            const script = document.createElement('script');
            script.src = 'https://docs.opencv.org/4.x/opencv.js';
            script.async = true;
            script.onload = () => {
                setIsOpenCVReady(true);
                console.log('OpenCV.js has been loaded.');
            };
            script.onerror = () => console.error('Failed to load OpenCV.js');
            document.body.appendChild(script);
        } else {
            setIsOpenCVReady(true);
        }
    }, []);

    useEffect(() => {
        if (isOpenCVReady) {
            initCamera();
        }
    }, [isOpenCVReady]);

    const initCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                videoRef.current.onloadedmetadata = () => {
                    console.log('Video metadata loaded.');
                    processFrame();
                };
                videoRef.current.onerror = (e) => console.error('Error with video stream: ', e);
            } else {
                console.error('Video reference is null');
            }
        } catch (err) {
            console.error("Error accessing webcam: ", err);
        }
    };

    const processFrame = () => {
        if (window.cv && videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            let src = cv.imread(canvas);
            let dst = new cv.Mat();
            let edges = new cv.Mat();

            if (src.empty()) {
                console.error('Image data is empty');
                return;
            }

            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
            cv.Canny(dst, edges, 50, 100);

            let contours = new cv.MatVector();
            let hierarchy = new cv.Mat();
            cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(video, 0, 0);

            let color;
            let found = false;
            // const boxSymbols = [ /* مختصات شش نماد */ ];

            const boxSymbols = [
                { x: 50, y: 43, width: 150, height: 150 }, // نقطه 1
                { x: 1165, y: 43, width: 150, height: 150 }, // نقطه 2
                { x: 2280, y: 43, width: 150, height: 150 }, // نقطه 3

                { x: 50, y: 3315, width: 150, height: 150 }, // نقطه 4
                { x: 1165, y: 3315, width: 150, height: 150 }, // نقطه 5
                { x: 2280, y: 3315, width: 150, height: 150 }, // نقطه 6
                // ادامه مختصات ...
            ];


            // شناسایی و بررسی مختصات کاغذ
            for (let i = 0; i < contours.size(); i++) {
                if (cv.contourArea(contours.get(i)) > 5000) { // Adjust this threshold as needed
                    const boundingRect = cv.boundingRect(contours.get(i));

                    // بررسی تطابق با باکس
                    let insideBox = boxSymbols.some(symbol => 
                        boundingRect.x >= symbol.x && boundingRect.x + boundingRect.width <= symbol.x + symbol.width &&
                        boundingRect.y >= symbol.y && boundingRect.y + boundingRect.height <= symbol.y + symbol.height
                    );

                    color = insideBox ? new cv.Scalar(0, 255, 0, 255) : new cv.Scalar(255, 0, 0, 255);
                    found = true;
                    break;
                }
            }

            if (!found) {
                color = new cv.Scalar(255, 0, 0, 255); // Red color if no paper detected
            }

            for (let i = 0; i < contours.size(); i++) {
                cv.drawContours(src, contours, i, color, 2, cv.LINE_8, hierarchy, 100);
            }

            // Draw result on canvas
            cv.imshow(canvas, src);

            src.delete();
            dst.delete();
            edges.delete();
            contours.delete();
            hierarchy.delete();

            requestAnimationFrame(processFrame);
        } else {
            console.error('OpenCV.js or Video/Canvas references are not ready');
        }
    };

    return (
        <div>
            <video ref={videoRef} style={{ display: 'none' }} />
            <canvas ref={canvasRef} />
        </div>
    );
};

export default CameraCapture;
