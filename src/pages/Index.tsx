
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import WebScraper from '../components/WebScraper';
import ContributeForm from '../components/ContributeForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            <h2 className="text-3xl font-bold text-center mb-8">Property Information Tools</h2>
            
            <Tabs defaultValue="search" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="search">Search Properties</TabsTrigger>
                <TabsTrigger value="scraper">Web Scraper</TabsTrigger>
                <TabsTrigger value="contribute">Contribute Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="search">
                <SearchBar />
              </TabsContent>
              
              <TabsContent value="scraper">
                <WebScraper />
              </TabsContent>
              
              <TabsContent value="contribute">
                <ContributeForm />
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        <section id="about" className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-6 text-center">About Bhooveda</h2>
            <div className="prose prose-lg mx-auto">
              <p className="text-gray-600 mb-4">
                Bhooveda is a community-driven platform that provides comprehensive property information for locations across India. Our mission is to make land and property data more accessible and transparent.
              </p>
              <p className="text-gray-600 mb-4">
                Whether you're a real estate developer, investor, or simply looking to understand property regulations and costs in different areas, Bhooveda gives you the insights you need.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">How You Can Help</h3>
              <p className="text-gray-600 mb-4">
                The power of Bhooveda comes from its community. You can contribute to our database by sharing property information you have access to. Each contribution helps make the platform more valuable for everyone.
              </p>
              <p className="text-gray-600">
                Use our Contribute tool to add information about property locations, zoning regulations, building restrictions, and land costs in your area.
              </p>
            </div>
          </div>
        </section>
        
        <section id="contact" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Have questions or feedback about Bhooveda? We'd love to hear from you!
            </p>
            <div className="inline-block bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-700 font-medium">Email us at:</p>
              <p className="text-primary text-lg font-semibold mt-1">contact@bhooveda.com</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
