
import SearchBar from './SearchBar';

const Hero = () => {
  return (
    <div className="relative py-20 overflow-hidden bg-gradient-to-b from-secondary/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="font-playfair mb-4 text-4xl md:text-5xl lg:text-6xl font-bold text-secondary">
            Discover Land Insights
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Get comprehensive information about building restrictions, land costs, and regulatory requirements for any location.
          </p>
        </div>
        <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <SearchBar />
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          {['Building Restrictions', 'Land Costs', 'Government Processes'].map((feature) => (
            <div
              key={feature}
              className="p-6 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-secondary mb-2">{feature}</h3>
              <p className="text-muted-foreground">
                Access detailed information about {feature.toLowerCase()} in your area of interest.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
