import { useState } from "react";
import Header from "@/components/Header";
import BannerSlider from "@/components/BannerSlider";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import FarmerStory from "@/components/FarmerStory";
import OnlineStore from "@/components/OnlineStore";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="min-h-screen bg-background">      
      <BannerSlider />
      <Categories selected={selectedCategory} onSelect={setSelectedCategory} />
      <FeaturedProducts selectedCategory={selectedCategory} />
      <OnlineStore/>
      <FarmerStory/>
      <WhyChooseUs />        
    </div>
  );
};

export default Index;
