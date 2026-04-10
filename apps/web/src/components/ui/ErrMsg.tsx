export const ErrMsg = ({ text }: { text: string }) => {
  return (
    <div className="flex text-xs md:text-sm font-bold md:font-semibold items-center justify-center text-center text-gray-500">
      <p>{text}</p>
    </div>
  );
};