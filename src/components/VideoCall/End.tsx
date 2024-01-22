interface EndProps {
  callEnded: boolean;
}

export default function End({ callEnded }: EndProps) {
  return (
    <>
      {callEnded ? (
        <div className="flex h-full text-center items-center justify-center">
          <span className="text-center">Call has been ended</span>
          <button className="ml-2 flex flex-col rounded-md px-6 py-[2px] bg-black text-white items-center justify-center">
            Redidal
          </button>
        </div>
      ) : null}
    </>
  );
}
