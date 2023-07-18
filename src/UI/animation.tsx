import "./animation.css"; // CSS file for styling the animation

const JumpingDotsAnimation: React.FC = () => {
  return (
    <div className="flex">
      <div className="jumping-dots">
        <span className="dot" style={{ '--delay': '200ms' } as React.CSSProperties}></span>
        <span className="dot" style={{ '--delay': '300ms' } as React.CSSProperties}></span>
        <span className="dot" style={{ '--delay': '400ms' } as React.CSSProperties}></span>
      </div>
    </div>
  );
};

export default JumpingDotsAnimation;