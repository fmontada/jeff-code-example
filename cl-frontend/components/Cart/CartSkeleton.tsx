import { OzSkeletonBox, SKELETON_BOX_SIZE } from '@omaze/omaze-ui';

export function CartSkeleton() {
    return (
        <div className="flex flex-col w-full mb-4">
            <div className="flex w-full mb-1">
                <div className="w-1/3 md:w-1/6 max-w-[108px]">
                    <OzSkeletonBox size={SKELETON_BOX_SIZE.SIZE_8} />
                </div>
                <div className="w-2/3 md:w-full pl-2">
                    <OzSkeletonBox size={SKELETON_BOX_SIZE.SIZE_8} />
                </div>
            </div>
            <div className="flex justify-between w-full">
                <div className="w-1/3 md:w-1/6 max-w-[108px]">
                    <OzSkeletonBox size={SKELETON_BOX_SIZE.SIZE_5} />
                </div>
                <div className="w-2/3 md:w-full pl-2">
                    <OzSkeletonBox size={SKELETON_BOX_SIZE.SIZE_5} />
                </div>
            </div>
        </div>
    );
}
