// pages/index.js
import Head from 'next/head';
import CameraCapture from './CameraCapture';

const Home = () => {
    return (
        <div>
            <Head>
                <title>Camera Capture Example</title>
                <meta name="description" content="Example of capturing and processing image from webcam." />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <main>
                <h1>Camera Capture</h1>
                {/* <button onClick={CameraCapture}>click koooon</button> */}
                <CameraCapture />
            </main>
        </div>
    );
};

export default Home;
