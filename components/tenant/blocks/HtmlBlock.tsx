type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

export default function HtmlBlock({ data }: Props) {
  const code = (data.code as string) || '';

  if (!code) return null;

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div dangerouslySetInnerHTML={{ __html: code }} />
    </section>
  );
}
