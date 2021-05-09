import React from "react";

export default function App({ data }: { data: any[] }) {
  if (!data) {
    return null;
  }
  let abv: string = "Hello world";
  return <div>{data.length}</div>;
}
