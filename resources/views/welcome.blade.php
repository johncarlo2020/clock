<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clock animation</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>

    <style>
        @import "../../node_modules/bootstrap/scss/bootstrap";
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap');


        @font-face {
            font-family: 'DS-Digital';
            src: url('../fonts/DS-DIGI.TTF') format('truetype');
        }

        @font-face {
            font-family: 'radio';
            src: url('../fonts/RADIOLANDSLIM.ttf') format('truetype');
        }

        @font-face {
            font-family: 'radio-regular';
            src: url('../fonts/RADIOLAND.TTF') format('truetype');
        }

        @font-face {
            font-family: 'digital-dismay';
            src: url('../fonts/Digital-Dismay.otf') format('opentype');
        }


        body {
            background-color: #D0C5B1;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100vw;
            height: 100vh;
            position: relative;
        }

        div {
            box-sizing: border-box;
            display: block;
        }

        #toggle-broken {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
        }

        .clocks-container {
            width: 1080px; // scaled up from 720px
            height: 1920px; // scaled up from 1230px
            position: relative;
            border: 2px solid red;

            .clock-hand-wrapper {
                &::before {
                    content: "";
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 7%;
                    height: 7%;
                    background-color: rgb(255, 255, 255);
                    border-radius: 50%;
                    z-index: 10;
                }
            }

            .clock-item {
                position: absolute;
                overflow: hidden;
                .digital-clock {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 2em;

                    .date {
                        position: absolute;
                        bottom: -21%;
                        left: -30%;
                        width: 173%;
                        font-size: 1rem;
                        text-align: center;
                        font-family: Arial, Helvetica, sans-serif;
                        margin-left: 0 !important;
                        display: block;
                    }
                }

                &.foggy-effect-added {
                    opacity: 0.8;
                    filter: brightness(0.9);

                    .glass-image {
                        position: absolute;
                        top: 0;
                        left: 0;
                        opacity: 0.3;
                        width: 100%;
                        height: 100%;
                        transition: all 0.5s;
                    }
                }

                .raindrop {
                    position: absolute;
                    top: -10px;
                    width: 2px;
                    height: 10px;
                    background: rgba(255, 255, 255, 0.6);
                    animation: fall 1s linear infinite;
                }

                @keyframes fall {
                    to {
                        transform: translateY(100vh);
                    }
                }


                .fog-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    transform: translateX(-50%) scale(0);
                    opacity: 0.2;
                    animation: foggyEffect 50s forwards, moveFog 100s 5s infinite; // Increased duration to 15s
                }

                @keyframes foggyEffect {
                    0% {
                        transform: translateX(-50%) scale(0);
                        opacity: 0.2;
                    }

                    100% {
                        transform: translateX(-50%) scale(1);
                        opacity: 0.6;
                    }
                }

                @keyframes moveFog {
                    0% {
                        transform: translateX(-50%) scale(1);
                    }
                    50% {
                        transform: translateX(-40%) scale(1);
                    }
                    100% {
                        transform: translateX(-50%) scale(1);
                    }
                }

                &:nth-child(1) {
                top: 148px;
            left: 141px;
            width: 490px;
            height: 490px;
                }

                &:nth-child(2) {
                    top: 618px;
            left: 0px;
            width: 324px;
            height: 341px;
                }

                &:nth-child(3) {
                top: 337px;
            right: 41px;
            width: 290px;
            height: 290px;
                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                    font-family: "DS-Digital", sans-serif;
                    font-size: 3rem;
                    color: yellow;

                    .date {
                        display: none;
                    }
                }

                &:nth-child(4) {
                    top: 655px;
            right: 35px;
            width: 600px;
            height: 600px;
                    background-color: gray;
                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                }

                &:nth-child(5) {
                    top: 1005px;
            left: 62px;
            width: 322px;
            height: 322px;
                    color: white;
                    font-size: 2.5rem;
                    font-weight: 700;

                    img {
                        border-radius: 10px;
                    }
                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

                    .digital-clock {
                        line-height: 1;
                        font-family: 'digital-dismay', sans-serif;
                        letter-spacing: 14px;
                        span.minute {
                            display: block;
                            line-height: 1;
                            margin: 0;
                            padding: 0;
                            margin-left: -2px;
                        }
                    }
                }

                &:nth-child(6) {
                    top: 1395px;
            left: 125px;
            width: 390px;
            height: 390px;
                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                }

                &:nth-child(7) {
                    top: 1370px;
            right: 87px;
            width: 344px;
            height: 344px;
                    border-radius: 0px;

                    .clock-hand-wrapper {
                        &::before {
                            content: "";
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 7%;
                            height: 7%;
                            background-color: rgb(0, 0, 0);
                            border-radius: 50%;
                            z-index: 10;
                        }
                    }

                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

                    img {
                        border-radius: 10px;
                    }
                }
            }
        }

        button {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 1em;
        }


        @keyframes blink {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

        #startContainer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: #D0C5B1;
            z-index: 10;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 20px;
        }
    </style>
<body>
    <video id="webcam" autoplay playsinline style="display: none;"></video>
    <canvas id="canvas" style="display: none;"></canvas>

    <div class="clocks-container" id="clocksContainer">
        @foreach ($clocks as $index => $item)
        <div class="clock-item" id="clock-{{ $index+1 }}" style="
                    top: {{ is_numeric($item->top) ? $item->top . 'px' : $item->top }};
                    left: {{ is_numeric($item->left) ? $item->left . 'px' : $item->left }};
                    width: {{ is_numeric($item->width) ? $item->width . 'px' : $item->width }};
                    height: {{ is_numeric($item->height) ? $item->height . 'px' : $item->height }};
                    {{ $item->extra_styles ?? '' }}
                ">
        </div>
        @endforeach

        </div>

    <script src="assets/js/clock.js" defer></script>
    <script src="assets/js/adapter.js" defer></script>
    <script src="assets/js/newCamera.js" defer></script>
</body>

</html>
