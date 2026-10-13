import Image from "next/image";
import { teamMembers } from "@/lib/team";

export function TeamGrid() {
  if (teamMembers.length === 0) return null;

  return (
    <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {teamMembers.map((member) => (
        <li
          key={member.name}
          className="overflow-hidden rounded-lg border border-line bg-page"
        >
          <Image
            src={member.photo}
            alt=""
            width={640}
            height={640}
            className="aspect-square w-full object-cover"
          />
          <div className="p-5">
            <h2 className="font-display text-xl font-semibold text-navy">
              {member.name}
            </h2>
            <p className="mt-1 text-sm text-graphite">{member.role}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
