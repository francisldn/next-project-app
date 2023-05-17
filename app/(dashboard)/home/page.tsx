import { delay } from "@/lib/async";
import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import Greeting from "@/components/Greeting";
import GreetingsSkeleton from "@/components/GreetingsSkeleton";
import ProjectCard from "@/components/ProjectCard";
import NewProject from "@/components/NewProject";

const getData = async () => {
    await delay(2000);
    const user = getUserFromCookie(cookies());

    /** can't use fetch -> this is server side, need to reload server to get the data */
    const projects = await db.project.findMany({
        where: {
            ownerId: user?.id,
        },
        include: {
            tasks: true,
        }
    })

    return { projects };
};
export default async function Page() {
    const {projects } = await getData();
  return (
    <div className="h-full overflow-y-auto pr-6 w-full">
      <div className=" h-full  items-stretch justify-center min-h-[content]">
        <div className="flex-1 grow flex ml-6 mt-3">
            <Suspense fallback={<GreetingsSkeleton/>}>
                <Greeting />
            </Suspense>
            
        </div>
        <div className="flex flex-2 grow items-center flex-wrap mt-3 ml-3">
          <div className="w-full p-3 flex flex-1 gap-3 flex-wrap">
            {
                projects.map((project) => (
                    <Link href={`/project/${project.id}`} key={project.id}>
                        <ProjectCard project={project}/>
                    </Link>))
            }
          </div>
        </div>
        <div className="mt-6 flex-2 grow w-full flex">
          <div className="w-full" id="modal">
            <NewProject  />
          </div>
        </div>
      </div>
    </div>
  );
}