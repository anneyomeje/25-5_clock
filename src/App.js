import { useState, useEffect } from "react";
import "./styles.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faPlay,
  faPause,
  faRepeat
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timer, setTimer] = useState(1500);
  const [breakTimer, setBreakTimer] = useState(300);
  const [sessionTimer, setSessionTimer] = useState(sessionLength * 60);
  const [start, setStart] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const sound = "beep";
  const audio = document.getElementById(sound);

  const displayTime = () => {
    let timers = timer >= 0 ? timer : breakTimer;
    const minutes =
      timers / 60 < 10
        ? `0${Math.floor(timers / 60)}`
        : Math.floor(timers / 60);

    const seconds = timers % 60 < 10 ? `0${timers % 60}` : timers % 60;

    return `${minutes}:${seconds}`;
  };

  const makeIncrement = (state) => {
    state((value) => {
      if (value < 60) {
        if (state === setSessionLength) {
          setTimer((value + 1) * 60);
          setSessionTimer((value + 1) * 60);
        } else if (state === setBreakLength) {
          setBreakTimer((value + 1) * 60);
        }
      }

      if (value === 60) {
        return 60;
      } else {
        return (value += 1);
      }
    });
  };

  const makeDecrement = (state) => {
    state((value) => {
      if (value > 1) {
        if (state === setSessionLength) {
          setTimer((value - 1) * 60);
          setSessionTimer((value - 1) * 60);
        } else if (state === setBreakLength) {
          setBreakTimer((value - 1) * 60);
        }
      }

      if (value === 1) {
        return 1;
      } else {
        return (value -= 1);
      }
    });
  };

  const playSound = () => {
    audio.currentTime = 0;
    audio.play();
  };

  const reset = () => {
    audio.pause();
    audio.currentTime = 0;
    setStart(false);
    setSessionLength(25);
    setBreakLength(5);
    setTimer(1500);
    setOnBreak(false);
    setBreakTimer(300);
  };

  useEffect(() => {
    const delay = setInterval(() => {
      if (start) {
        setTimer((prev) => {
          if (prev <= 0 && onBreak === false) {
            playSound();
            setOnBreak(true);
            return breakTimer;
          } else if (prev <= 0 && onBreak === true) {
            playSound();
            setOnBreak(false);
            return sessionTimer;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      clearInterval(delay);
    };
  });

  return (
    <div className="container">
      <div className="main">
        <h1>25 + 5 Clock</h1>
        <div className="time-manipulation">
          <div id="break-label">Break Length</div>
          <div id="session-label">Session Length</div>

          <button
            id="break-increment"
            className="increment"
            onClick={start ? "" : () => makeIncrement(setBreakLength)}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
          <div id="break-length">{breakLength}</div>
          <button
            id="break-decrement"
            className="decrement"
            onClick={start ? "" : () => makeDecrement(setBreakLength)}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
          <button
            id="session-increment"
            className="increment"
            onClick={start ? "" : () => makeIncrement(setSessionLength)}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
          <div id="session-length">{sessionLength}</div>
          <button
            id="session-decrement"
            className="decrement"
            onClick={start ? "" : () => makeDecrement(setSessionLength)}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
        </div>
        <div className="session">
          <div id="timer-label">{onBreak ? "Break" : "Session"}</div>
          <div id="time-left">{displayTime()}</div>
        </div>
        <button id="start_stop" onClick={() => setStart((value) => !value)}>
          <FontAwesomeIcon icon={faPlay} />
          <FontAwesomeIcon icon={faPause} />
        </button>
        <button id="reset" onClick={reset}>
          <FontAwesomeIcon icon={faRepeat} />
        </button>
        <audio
          src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_de8cfb6b6e.mp3"
          id={sound}
        />
      </div>
      <p className="author">Coded by Annie</p>
    </div>
  );
}

export default App;
