interface GameTimerProps {
  timeLeft: number;
}

export default function GameTimer({ timeLeft }: GameTimerProps) {
  const percentage = (timeLeft / 10) * 100;
  const isUrgent = timeLeft <= 3;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className={`text-4xl font-bold mb-4 ${
        isUrgent ? 'text-red-600 animate-pulse' : 'text-gray-800'
      }`}>
        {timeLeft}s
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all duration-1000 ${
            isUrgent ? 'bg-red-500' : 'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}