import React, { useEffect, useRef } from "react";

interface VisualizerProps {
  stream: MediaStream | null;
  isActive: boolean;
  color?: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  stream,
  isActive,
  color = "#3b82f6",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Fix: Added an initial value to useRef to satisfy TypeScript requirements on line 12 (approx)
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isActive || !stream || !canvasRef.current) return;

    // Use robust cross-browser AudioContext initialization
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextClass();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, "#8b5cf6");
      gradient.addColorStop(1, "#ec4899");

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        const opacity = Math.max(0.3, dataArray[i] / 255);

        ctx.globalAlpha = opacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Standard roundRect check for cross-browser safety
        if (ctx.roundRect) {
          ctx.roundRect(
            x,
            canvas.height - barHeight,
            barWidth - 2,
            barHeight,
            3
          );
        } else {
          ctx.rect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        }
        ctx.fill();
        x += barWidth;
      }

      ctx.globalAlpha = 1;
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      audioContext.close();
    };
  }, [stream, isActive, color]);

  return (
    <div className="w-full bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl p-3 shadow-inner border border-slate-300/50">
      <canvas
        ref={canvasRef}
        width={300}
        height={60}
        className="w-full h-16 rounded-lg"
      />
    </div>
  );
};
