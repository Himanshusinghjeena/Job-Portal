// import React from 'react'

import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import './styles.css';

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const testimonials = [
    {
      name: "Aisha M., HR Professional",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Connecting with top employers has never been easier. Lamar opened doors to exclusive opportunities with renowned companies. I'm proud to be a part of the Lamar community.",
    },
    {
      name: "Rahul K., Developer",
      image: "https://randomuser.me/api/portraits/men/31.jpg",
      text: "Lamar helped me land my dream job! The interface is intuitive, and the opportunities are incredible.",
    },
    {
      name: "Sara D., Designer",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      text: "I love the experience on Lamar! It made job hunting a lot more human and accessible.",
    },
    {
      name: "Daniel R., Marketing Specialist",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      text: "The platform's user-friendly design and curated job matches saved me so much time. I found my perfect role within weeks.",
    },
    {
      name: "Emily N., Content Writer",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
      text: "Lamar felt like a personal job assistant! It was so easy to connect with companies that matched my skillset.",
    },
    {
      name: "Mohammed A., Data Analyst",
      image: "https://randomuser.me/api/portraits/men/54.jpg",
      text: "Highly recommend Lamar to any job seeker out there. It's efficient, smart, and connects you to real opportunities.",
    },
    {
      name: "Tina L., UX Researcher",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      text: "A friend recommended Lamar and I couldn't be more grateful. The job matches are accurate and the application process is simple.",
    },
  ];
  

const Testimonial = () => {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        // navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {
            testimonials.map((item,index)=>(
                
                <SwiperSlide className="mb-20">
                <div className="p-5 flex flex-col md:flex-row items-center justify-center gap-6 bg-white sm:p-10 rounded-lg sm:shadow-md max-w-5xl mx-auto transition-all duration-500 ease-in-out" key={index}>
                  {/* Image Section */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className=" w-45 h-45 sm:w-64 sm:h-64 object-cover rounded-xl"
                    />
                  </div>
      
                  {/* Text Section */}
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <h2 className=" text-2xl sm:text-3xl font-bold">
                      What Our Users Say About{" "}
                      <span className="text-blue-500"> HireSmart</span>
                    </h2>
                    <p className="text-gray-600">{item.text}</p>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ) )
        }
       
       

      </Swiper>
    </>
  );
};

export default Testimonial;
