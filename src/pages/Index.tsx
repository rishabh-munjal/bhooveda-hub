
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import WebScraper from '../components/WebScraper';
import ContributeForm from '../components/ContributeForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Mail, Github } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Navbar with Glassmorphism */}
      <nav className="py-6 px-4 border-b border-white/10 bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-playfair font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Bhooveda
          </a>
          <div className="space-x-8">
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
        
        {/* Tools Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Property Information Tools
            </h2>
            
            <Tabs defaultValue="search" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="search">Search Properties</TabsTrigger>
                <TabsTrigger value="scraper">Web Scraper</TabsTrigger>
                <TabsTrigger value="contribute">Contribute Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="search" className="animate-fadeIn">
                <SearchBar />
              </TabsContent>
              
              <TabsContent value="scraper" className="animate-fadeIn">
                <WebScraper />
              </TabsContent>
              
              <TabsContent value="contribute" className="animate-fadeIn">
                <ContributeForm />
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* About Section with Cards */}
        <section id="about" className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              About Bhooveda
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-xl bg-gradient-to-br from-secondary/5 to-primary/5 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 text-secondary">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  Bhooveda is a community-driven platform that provides comprehensive property information for locations across India. Our mission is to make land and property data more accessible and transparent.
                </p>
              </div>
              <div className="p-8 rounded-xl bg-gradient-to-br from-secondary/5 to-primary/5 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 text-secondary">Community Impact</h3>
                <p className="text-gray-600 leading-relaxed">
                  Whether you're a real estate developer, investor, or simply looking to understand property regulations and costs in different areas, Bhooveda gives you the insights you need.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 bg-gradient-to-br from-secondary/5 to-primary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Contact Us
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Have questions or feedback about Bhooveda? We'd love to hear from you!
            </p>
            <div className="inline-flex items-center justify-center gap-6">
              <a 
                href="mailto:contact@bhooveda.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-300 text-secondary"
              >
                <Mail className="h-5 w-5" />
                <span>Email Us</span>
              </a>
              <a 
                href="https://github.com/bhooveda"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-white hover:bg-secondary/90 transition-all duration-300"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
