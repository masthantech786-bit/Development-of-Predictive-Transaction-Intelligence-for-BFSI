import React from "react";
import sindhura from "../assets/sindhura.jpg"
import vansh from "../assets/vansh.jpg";
import riaz from "../assets/riaz.jpg"
import faizan from "../assets/faizan.jpg"
import akanksha from "../assets/akanksha.jpg"
import maha from "../assets/maha.jpg"
import bidwattam from "../assets/bidwattam.jpg"
import masthan from "../assets/masthan.jpg"
import deepak from "../assets/deepak.jpg"

import { FaLinkedin } from "react-icons/fa";

interface TeamMember {
  name: string;
  role: string;
  linkedin: string;
  image: string;
}

interface TeamPageProps {
  darkModeTheme?: "default" | "custom";
}

const frontendTeam: TeamMember[] = [
  {
    name: "Sindhura Karumuri",
    role: "Frontend Developer",
    linkedin: "https://www.linkedin.com/in/karumuri-sindhura/",
    image: sindhura,
  },
  {
    name: "Vansh D.",
    role: "Frontend Developer",
    linkedin: "https://www.linkedin.com/in/vansh-d-064688265?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    image: vansh,
  },
  {
    name: "Deepak N",
    role: "Frontend Developer",
    linkedin: "https://www.linkedin.com/in/deepakn2005/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    image: deepak,
  },
];

const backendTeam: TeamMember[] = [
  {
    name: "Faizan Md",
    role: "Backend Developer",
    linkedin: "https://www.linkedin.com/in/faizan-md-11b043252/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    image: faizan,
  },
  {
    name: "Kalluru Masthan",
    role: "Backend Developer",
    linkedin: "https://www.linkedin.com/in/kalluru-masthan-3501a1361/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    image: masthan,
  },
  {
    name: "Sk Riazuddin",
    role: "Backend Developer",
    linkedin: "https://www.linkedin.com/in/sk-riazuddin-708967304?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    image: riaz,
  },
  {
    name: "Akanksha Kunapareddy",
    role: "Backend Developer",
    linkedin: "https://www.linkedin.com/in/akanksha-kunapareddy-a7b51625a/",
    image: akanksha,
  },
  {
    name: "Mahalakshmi K",
    role: "Backend Developer",
    linkedin: "https://www.linkedin.com/in/mahalakshmi-082b4626b/",
    image: maha,
  },
    {
    name: "Bidwattam Datta",
    role: "Backend Developer",
    linkedin: "https://www.linkedin.com/in/bidwattam-datta-39389428b/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    image: bidwattam,
  },
];

const TeamPage: React.FC<TeamPageProps> = ({ darkModeTheme = "default" }) => {
  const renderMembers = (members: TeamMember[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {members.map((member, idx) => (
        <div
          key={idx}
          className={`p-6 rounded-xl shadow-md space-y-3 transform transition-all duration-300 hover:scale-105 hover:shadow-xl
            ${
              darkModeTheme === "custom"
                ? "bg-blue-900 text-white"
                : "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-white"
            }`}
        >
          <div className="flex items-center space-x-4">
            <img
              src={member.image}
              alt={member.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-lg hover:text-yellow-300 transition-colors flex items-center space-x-2"
              >
                <span>{member.name}</span>
                <FaLinkedin className="text-blue-600 dark:text-blue-400 text-xl" />
              </a>
              <p className="text-sm hover:text-green-300 transition-colors">
                {member.role}
              </p>
            </div>
          </div>

          {member.joined && (
            <div className="pl-20">
              <p>
                <span className="font-semibold">Joined:</span>{" "}
                <span className="hover:text-orange-300 transition-colors">
                  {member.joined}
                </span>
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-10 p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-8">
        Team Members
      </h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Frontend Team
        </h2>
        {renderMembers(frontendTeam)}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Backend Team
        </h2>
        {renderMembers(backendTeam)}
      </section>
    </div>
  );
};

export default TeamPage;
