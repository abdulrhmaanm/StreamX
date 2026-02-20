import Hero from "@/components/examples/carousel/standard/carousel-standard-4";
import FeaturedBanner from "@/components/FeaturedBanner";
import PopularOfWeek from "@/components/PopularOfWeek";
import PopularShowsOfWeek from "@/components/PopularShowsofWeek";
import  JustReleased  from "@/components/releaseCard";
import DefaultLayout from "@/layouts/default";
import { Navbar } from '@/components/navbar';


export default function IndexPage() {
  return (
    <DefaultLayout>
      <div >
        <Navbar/>
        <Hero />  
        <JustReleased/>
        <div className="mt-20">
        <FeaturedBanner/>
        <PopularOfWeek/>
        <PopularShowsOfWeek/>
        </div>

      </div>
    </DefaultLayout>
  );
}
