type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

export default function SpacerBlock({ data }: Props) {
  const height = typeof data.height === 'number' ? data.height : 64;

  return <div style={{ height: `${height}px` }} aria-hidden="true" />;
}
