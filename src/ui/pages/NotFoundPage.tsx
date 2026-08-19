import { Link } from 'react-router';
import { Button } from '../components/Button.tsx';
import { StatusMessage } from '../components/StatusMessage.tsx';

export function NotFoundPage() {
  return (
    <div className="grid gap-4">
      <StatusMessage
        title="Not found"
        body="That page is not in this static app."
      />
      <Button asChild variant="ghost" className="justify-self-start px-0">
        <Link to="/">Back home</Link>
      </Button>
    </div>
  );
}
