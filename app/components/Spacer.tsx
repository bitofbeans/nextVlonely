type SpacerProps = {
  spacing: number | string;
};

export default function Spacer({ spacing }: SpacerProps) {
  // Uses Tailwind's --spacing variable to preserve its spacing scale without dynamic class names.
  return <div aria-hidden="true" style={{ margin: `calc(var(--spacing) * ${spacing})` }} />;
}
