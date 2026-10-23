import { Card, PageHeader } from "../ui";

export default function ComingSoon({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} />
      <Card className="mt-10 p-10 text-center text-sm text-muted">This screen is coming in the next step.</Card>
    </div>
  );
}