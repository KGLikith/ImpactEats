
import React from "react";


type Params = {
  id: string;
};

type Props = {
  params: Promise<Params>;
};

export default async function page({params}: Props) {
    const {id} =await params;
    console.log(id);
  return <div>page</div>;
}
