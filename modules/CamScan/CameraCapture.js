// components/CameraCapture.js
import React, { useRef, useEffect, useState } from 'react';

const CameraCapture = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isOpenCVReady, setIsOpenCVReady] = useState(false);

    useEffect(() => {
        // Load OpenCV.js
        const script = document.createElement('script');
        script.src = 'https://docs.opencv.org/4.x/opencv.js';
        script.async = true;
        script.onload = () => setIsOpenCVReady(true);
        script.onerror = () => console.error('Failed to load OpenCV.js');
        document.body.appendChild(script);
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
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                };
                videoRef.current.onerror = (e) => console.error('Error with video stream: ', e);
            }
        } catch (err) {
            console.error("Error accessing webcam: ", err);
        }
    };

    useEffect(() => {
        const processFrame = () => {
            if (window.cv && videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                if (video.videoWidth > 0 && video.videoHeight > 0) {
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
                    for (let i = 0; i < contours.size(); i++) {
                        let color = new cv.Scalar(255, 0, 0, 255); // Red color
                        cv.drawContours(canvas, contours, i, color, 2, cv.LINE_8, hierarchy, 100);
                    }
                    
                    src.delete();
                    dst.delete();
                    edges.delete();
                    contours.delete();
                    hierarchy.delete();
                } else {
                    console.error('Invalid video dimensions');
                }
            }
            requestAnimationFrame(processFrame);
        };

        processFrame();
    }, [isOpenCVReady]);

    return (
        <div>
            <video ref={videoRef} style={{ display: 'none' }} />
            <canvas ref={canvasRef} />
        </div>
    );
};

export default CameraCapture;
