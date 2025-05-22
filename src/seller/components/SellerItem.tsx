import { useState } from "react";

export default function SellerItem({ name }: { name: string }) {
  const [showName, setShowName] = useState(false);

  return (
    <div
      className="flex h-16 flex-col items-center justify-center"
      onClick={() => setShowName(!showName)}
      onMouseEnter={() => setShowName(true)}
      onMouseLeave={() => setShowName(false)}
    >
      {showName && <p className="opacity-30">{name}</p>}
      <div className="flex h-10 w-10 items-center justify-center rounded-full border">
        {name[0]}
      </div>
      {/* <hr className="mx-2 mt-1  w-full" /> */}
    </div>
  );
}
