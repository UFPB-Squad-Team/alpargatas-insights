const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <div className="flex items-center justify-center space-x-2">
        <span className="sr-only">Analisando Dados...</span>{' '}
        <div
          className="h-8 w-2 bg-brand-primary rounded-full animate-wave"
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className="h-8 w-2 bg-brand-primary rounded-full animate-wave"
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div
          className="h-8 w-2 bg-brand-primary rounded-full animate-wave"
          style={{ animationDelay: '0.3s' }}
        ></div>
      </div>
      <p className="text-sm font-medium text-brand-text-secondary">
        Analisando Dados...
      </p>
    </div>
  );
};

export default Spinner;
