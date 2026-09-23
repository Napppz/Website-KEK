import { LoadingState } from "@/components/common/states";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <LoadingState message="Memuat informasi portal KEK Indonesia..." />
    </div>
  );
}
