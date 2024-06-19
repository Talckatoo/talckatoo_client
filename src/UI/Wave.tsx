const WaveformAnimation = () => {
    return (
      <div className="items-center justify-center flex mb-[-14px] mx-[-14px] border-transparentx  rounded-lg">
        <div className="flex h-1 rotate-180 gap-1">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`w-[2px] bg-slate-100 animate-wave animation-delay-${i % 8}`}
            ></div>
          ))}
        </div>
      </div>
    );
  };
  
  export default WaveformAnimation;
  