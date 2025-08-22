const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <div className="w-20 h-20 border-4 border-transparent border-t-brand-orange-light animate-spin rounded-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-transparent border-t-brand-orange-dark animate-spin rounded-full"></div>
      </div>
    </div>
  );
};

export default Spinner;
