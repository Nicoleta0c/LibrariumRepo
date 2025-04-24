import '../App.css';
import Card from '../components/Card';
import brown from '../assets/images/Brown.png';
import gameOfThrone from '../assets/images/gameOfThrones.jpg';
import berserk from '../assets/images/berserk.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

function Cards() {
  const slides = [
    {
      imageUrl: berserk,
      title: "Lost",
      author: "James Patterson",
    },
    {
      imageUrl: gameOfThrone,
      title: "The Sixth Extinction",
      author: "Elizabeth Kolbert",
    },
    {
      imageUrl: brown,
      title: "The Last Day",
      author: "Andrew Hunter Murray",
    },
    {
      imageUrl: brown,
      title: "The Last Day",
      author: "Andrew Hunter Murray",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-8">
      <div className="flex justify-between items-center w-full max-w-6xl mb-6">
        <h1 className="text-3xl font-bold text-cyan-700">Featured Books</h1>
        <a href="#" className="text-red-500 text-sm">View All Books</a>
      </div>
      <div className="relative w-full max-w-6xl">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="flex justify-center">
                <Card
                  imageUrl={slide.imageUrl}
                  title={slide.title}
                  author={slide.author}
                  className="w-full h-auto md:w-[250px] lg:w-[300px] shadow-lg transition-transform duration-300 hover:scale-105" price={''}                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-button-prev absolute left-[-30px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"></div>
        <div className="swiper-button-next absolute right-[-30px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"></div>
      </div>
    </div>
  );
}

export default Cards;
