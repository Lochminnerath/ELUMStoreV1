import { useEffect } from 'react';
import { checkSignedInElsewhere } from '../lib/elum';
import { useAuth } from './AuthProvider';

/** Signs people in here when they are already signed in to another ELUM app (see checkSignedInElsewhere). */
export function QuietSignIn() {
  const { status } = useAuth();
  useEffect(() => {
    if (status === 'signed-out') checkSignedInElsewhere();
  }, [status]);
  return null;
}
