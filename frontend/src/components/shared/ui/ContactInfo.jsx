import React from 'react';
import { Mail, Phone, Github, Linkedin } from 'lucide-react';

const ContactInfo = ({ email, phone, github, linkedin }) => {
  const contactItems = [
    {
      icon: <Mail className="text-blue-500 h-5 w-5 flex-shrink-0" />,
      label: "Email",
      value: email,
      type: "text"
    },
    {
      icon: <Phone className="text-blue-500 h-5 w-5 flex-shrink-0" />,
      label: "Phone",
      value: phone,
      type: "text"
    },
    {
      icon: <Github className="text-gray-700 h-5 w-5 flex-shrink-0" />,
      label: "GitHub",
      value: github,
      type: "link"
    },
    {
      icon: <Linkedin className="text-blue-600 h-5 w-5 flex-shrink-0" />,
      label: "LinkedIn",
      value: linkedin,
      type: "link"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {contactItems.map((item, index) => (
        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-100">
          {item.icon}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">{item.label}</span>
            {item.value ? (
              item.type === "link" ? (
                <a
                  href={item.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-base hover:underline break-words"
                >
                  {item.value}
                </a>
              ) : (
                <span className="text-base text-gray-800 break-words">
                  {item.value}
                </span>
              )
            ) : (
              <span className="text-base text-gray-800">N/A</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactInfo; 