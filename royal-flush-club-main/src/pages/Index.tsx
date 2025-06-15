
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Tournaments from '@/components/Tournaments';
import HallOfFame from '@/components/HallOfFame';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-green-black text-white">
      <Header />
      <Hero />
      <About />
      <Tournaments />
      <HallOfFame />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
