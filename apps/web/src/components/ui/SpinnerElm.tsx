interface SpinnerProps {
  text: string;
}

export default function SpinnerElm({ text }: SpinnerProps) {
  return (
    <div className="flex flex-col space-y-4 items-center justify-center h-full w-full">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-ox-purple"
        role="status"
      ></div>
      <div>
        <span className="text-sm font-semibold dark:text-ox-white">{text}</span>
      </div>
    </div>
  );
}
