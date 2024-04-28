interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedData: string;
}
const BlogCard = ({
  authorName,
  title,
  content
}: BlogCardProps) => {
  return (
    <div className="border-b border-slate-200 pb-3 pt-3">
      <div className="flex">
        <div className="flex justify-center items flex-col">
          <Avator name={authorName} />
        </div>
        <div className="pl-2 font-extralight flex justify-center items-center">
        {authorName}
        </div>
      </div>
      <div className="font-semibold text-xl pt-2">{title}</div>
      <div className="font-thin">{content.slice(0, 200) + "..."}</div>
      <div className="font-thin pt-2">{`${Math.ceil(content.length / 100)} Minutes`}</div>
    </div>
  );
};
export function Avator({ name }: { name: string }) {
  return (
    <div className="relative inline-flex items-center justify-center w-9 h-9 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
      <span className="font-xs text-gray-600 dark:text-gray-300">
        {name[0]}
      </span>
    </div>
  );
}
export default BlogCard;
