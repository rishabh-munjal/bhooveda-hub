
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
      </main>
    </div>
  );
};

export default Index;
