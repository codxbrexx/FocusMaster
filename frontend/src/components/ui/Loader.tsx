import loaderSvg from '@/assets/loader.svg';

interface LoaderProps {
  message?: string;
  size?: number;
}

export function Loader({ message = 'Loading...', size = 40 }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <img
        src={loaderSvg}
        alt="Loading"
        style={{ width: size, height: size }}
        className="animate-spin"
      />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
