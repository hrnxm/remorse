const LoadingPulser = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <span className="relative flex h-14 w-14">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex h-14 w-14 rounded-full bg-slate-300"></span>
      </span>
    </div>
  );
};

export default LoadingPulser;
