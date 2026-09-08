type SpacerProps = {
  spacing: number | string;
};

export default function Spacer({ spacing }: SpacerProps) {
  return <div className={`m-${spacing}`} />;
}
