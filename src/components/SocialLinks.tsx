import React from 'react';
import { Linkedin, Github, User } from 'lucide-react';

export const SocialLinks: React.FC = () => {
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/samp2310',
      icon: Linkedin,
      color: 'hover:text-blue-600 hover:bg-blue-50',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/SamP231004',
      icon: Github,
      color: 'hover:text-gray-900 hover:bg-gray-100',
    },
    {
      name: 'Portfolio',
      url: 'https://samp231004.github.io/Portfolio/',
      icon: User,
      color: 'hover:text-purple-600 hover:bg-purple-50',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 hidden md:flex flex-col gap-3 z-50">
      {socialLinks.map((link) => {
        const IconComponent = link.icon;
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              group flex items-center justify-center w-12 h-12 
              bg-white rounded-full shadow-lg border border-gray-200
              transition-all duration-300 ease-in-out
              hover:shadow-xl hover:scale-110 ${link.color}
            `}
            title={link.name}
          >
            <IconComponent className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform duration-200" />
          </a>
        );
      })}
    </div>
  );
};