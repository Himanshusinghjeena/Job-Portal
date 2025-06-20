import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/slice/jobSlice";

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Data Science",
  "Graphic Designer",
  "Machine Learning Engineer",
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
   const searchJobHandler =(query)=>{
      dispatch(setSearchedQuery(query));
      navigate("/browse");
    }
  return (
    <div>
      <Carousel className='w-full max-w-xl mx-auto my-20'>
        <CarouselContent>
          {
          category.map((cat, index) => (
            <CarouselItem className='md:basis-1/2 lg:basis-1/3' key={index}> 
                <Button onClick={()=>searchJobHandler(cat)} variant='outline' className='rounded-full'>
                {cat}
                </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious/>
        <CarouselNext/>
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
