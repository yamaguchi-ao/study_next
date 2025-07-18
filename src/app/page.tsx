'use client'

import Image from "next/image";
import LocalImage from "@/public/next.svg";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src={LocalImage}
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div>
          <Button className="mt-4 w-full" onClick={() => {
            router.push('/login');
          }}>
            Log in
          </Button>
        </div>
      </main>
    </div>
  );
}