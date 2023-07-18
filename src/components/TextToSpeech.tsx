import React, { useState, useEffect } from "react";



interface TextToSpeechProps {
  convertedText: string;

}

const TextToSpeech:React.FC<TextToSpeechProps> = ({ convertedText }) => {
  const [show, setShow] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voice, setVoice] = useState<null | SpeechSynthesisVoice>(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(0.9);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (convertedText) {
        const synth = window.speechSynthesis;
        const u = new SpeechSynthesisUtterance(convertedText);
        setUtterance(u);
        setShow(true)
    
        // Add an event listener to the speechSynthesis object to listen for the voices changed event
        synth.addEventListener("voiceschanged", () => {
          const voices = synth.getVoices();
          setVoice(voices[0]);
        });
    
        return () => {
          synth.cancel();
          synth.removeEventListener("voiceschanged", () => {
            setVoice(null);
          });
        };
    }

  }, [convertedText]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
    } else {
      if (utterance) {
      utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = volume;
      synth.speak(utterance);
      }
    }

    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    setIsPaused(true);
    synth.pause();
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    setIsPaused(false);
    synth.cancel();
  };

//   const handleVoiceChange = (event) => {
//     const voices = window.speechSynthesis.getVoices();
//     setVoice(voices.find((v) => v.name === event.target.value));
//   };

  // const handlePitchChange = (event) => {
  //   setPitch(parseFloat(event.target.value));
  // };

  // const handleRateChange = (event) => {
  //   setRate(parseFloat(event.target.value));
  // };

  // const handleVolumeChange = (event) => {
  //   setVolume(parseFloat(event.target.value));
  // };



  return (
    <>
    {show ? 
<>
    <div className="w-2/3 flex flex-row gap-2 ">
    <div className='text-xxs text-gray-600 text-right ml-'>
    <button
        onClick={handlePlay}>{isPaused ? "Resume" : "Play"}
        </button>
    </div>
      
     <div className='text-xxs text-gray-600 text-right'>
     <button
      onClick={handleStop}>Stop
      </button>
     </div>
     </div>
    
</>
      : null
    }
    </>
  );
};

export default TextToSpeech;
