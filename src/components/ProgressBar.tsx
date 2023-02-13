let supportedBgs = 'bg-red-500 bg-blue-500';

export default function ProgressBar({ current, max, color }: { current: number, max: number, color: string }) {
  let bg = `bg-${color}-500`;
  let percent = Math.max(0, Math.min(100, Math.round(current / max * 100)));
  return <div className="w-full h-6 bg-stone-700 flex outline outline-2 outline-black relative">
    <div className={`h-6 justify-start absolute -z-1 ${bg}`} style={{ width: `${percent}%` }}></div>
    <span className="w-full h-3 -z-0 text-center">{current}/{max}</span>
  </div>
}