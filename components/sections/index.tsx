import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import PriceList from "./PriceList";
import Gallery from "./Gallery";
import Hours from "./Hours";
import Reviews from "./Reviews";
import FAQ from "./FAQ";
import Contact from "./Contact";
import CTABanner from "./CTABanner";
import Footer from "./Footer";

export const sectionRegistry: Record<string, React.ComponentType<any>> = {
  Navbar,
  Hero,
  About,
  Services,
  PriceList,
  Gallery,
  Hours,
  Reviews,
  FAQ,
  Contact,
  CTABanner,
  Footer,
};
