
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <nav className="py-6 px-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-playfair font-bold text-secondary">
            Bhooveda
          </a>
          <div className="space-x-6">
            <a href="#about" className="text-muted-foreground hover:text-secondary transition-colors">
              About
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-secondary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </nav>
      <main className="pt-24">
        <Hero />
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Find Property Information</h2>
            <SearchBar />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
