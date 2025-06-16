'use client';

import { useParams, useSearchParams } from 'next/navigation';
import GameRoom from '@/components/GameRoom';

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.id as string;
  const playerName = searchParams.get('name') || 'Anonymous';

  return <GameRoom roomId={roomId} playerName={playerName} />;
}