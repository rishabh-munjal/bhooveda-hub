
import { ArrowRight, MapPin, Building, DollarSign, Compass } from 'lucide-react';
import SearchBar from './SearchBar';

const Hero = () => {
  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-secondary via-secondary/95 to-primary/90">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
      
      <div className="container mx-auto px-4 relative">
        <div className="pt-32 pb-20 md:pt-40 md:pb-28">
          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="font-playfair mb-6 text-4xl md:text-6xl lg:text-7xl font-bold text-white animate-fadeIn">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Discover Land Insights
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              Access comprehensive information about building restrictions, land costs, and regulatory requirements for any location.
            </p>
            
            {/* Search Bar Section */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <SearchBar />
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            {[
              {
                icon: Building,
                title: "Building Restrictions",
                description: "Access detailed zoning and building regulations",
                color: "from-orange-500/20 to-orange-600/20"
              },
              {
                icon: MapPin,
                title: "Location Analysis",
                description: "Get insights about any property location",
                color: "from-blue-500/20 to-blue-600/20"
              },
              {
                icon: DollarSign,
                title: "Land Costs",
                description: "Compare property values and market trends",
                color: "from-green-500/20 to-green-600/20"
              },
              {
                icon: Compass,
                title: "Future Development",
                description: "Explore upcoming development plans",
                color: "from-purple-500/20 to-purple-600/20"
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl bg-gradient-to-br border border-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-300"
                style={{ 
                  animationDelay: `${0.8 + index * 0.1}s`,
                  background: `linear-gradient(to bottom right, ${feature.color})`
                }}
              >
                <feature.icon className="h-8 w-8 text-white mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/80 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8F9FA] to-transparent" />
    </div>
  );
};

export default Hero;
