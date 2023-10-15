let supportedBgs = 'bg-red-800 bg-blue-800 bg-green-800 bg-red-600 bg-blue-600 bg-green-600';

export type ProgressBarProps = {
  current: number;
  max: number;
  color: string;
  text?: string;
  title?: string;
}

export default function ProgressBar({ current, max, color, text }: ProgressBarProps) {
  let bg = `bg-${color}-800`;
  let percent = Math.max(0, Math.min(100, Math.round(current / max * 100)));
  return <div className={`w-full h-fit bg-${color}-600 flex outline outline-2 outline-black relative text-shadow place-items-center`}>
    <div className={`h-full justify-start absolute ${bg}`} style={{ width: `${percent}%` }}></div>
    <span className="w-full h-max text-center relative pb-0.5">{text && text || <>{current} / {max}</>}</span>
  </div>
}