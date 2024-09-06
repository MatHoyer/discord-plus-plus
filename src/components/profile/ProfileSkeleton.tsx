import { Skeleton } from '../ui/skeleton';

const ProfileSkeleton = () => {
  return (
    <div className="flex items-center p-2 cursor-pointer rounded-md hover:bg-[#35373c] transition-colors">
      <Skeleton className="h-5 w-5 md:w-8 md:h-8 rounded-full" />
      <div className="flex flex-col justify-center ml-2 max-w-[66%] gap-1">
        <Skeleton className="h-3 w-[52px]" />
        <Skeleton className="h-3 w-[52px]" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
