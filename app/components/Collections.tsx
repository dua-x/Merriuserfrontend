
import React from "react";
import Link from "next/link";
import { getCollections } from "@/lib/action"


const Collections = async () => {
  const collections = await getCollections();

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5 text-center">
      <h1 className="text-3xl font-bold text-[#857B74] drop-shadow-lg">Collections</h1>
      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No collection found</p>
      ) : (
        <div className="flex items-center justify-center gap-8">
          {collections.map((collection: CollectionType) => (
            <Link href={`/collections/${collection._id}`} key={collection._id}>
              <div className="text-center">
                <img
                  src={collection.icon}
                  alt={collection.name}
                  className="rounded-lg"
                  width={150}
                  height={150}
                />
                <p className="mt-2 text-body">{collection.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
