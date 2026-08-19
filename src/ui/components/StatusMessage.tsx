type Props = {
  title: string;
  body?: string;
};

export function StatusMessage({ title, body }: Props) {
  return (
    <div className="py-6">
      <p className="font-semibold">{title}</p>
      {body ? <p className="mt-2 text-muted">{body}</p> : null}
    </div>
  );
}
