import { ReactNode, useEffect, useRef } from 'react';

interface IProps {
  children: ReactNode;
  onContentEndVisible: () => void;
}

export function Observer({ children, onContentEndVisible }: IProps) {
  const endContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      rootMargin: '0px',
      threshold: 1.0,
      root: null,
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          onContentEndVisible();
          observer.disconnect();
        }
      });
    }, options);

    if (endContentRef.current) {
      observer.observe(endContentRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [onContentEndVisible]);

  return (
    <div>
      {children}
      <div ref={endContentRef} />
    </div>
  );
}
