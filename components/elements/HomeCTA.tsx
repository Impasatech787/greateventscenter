import { Button } from "@/components/ui/button";

const HomeCTA = () => {
  return (
    <section className="px-4 py-12">
      <div className="container">
        <div
          className="relative overflow-hidden rounded-3xl bg-gray-900"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center right",
          }}
        >
          <div className="px-8 md:px-12 py-12 md:py-16 max-w-md">
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              Ready to elevate
              <br />
              <span className="text-gray-400">your next event?</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              From intimate gatherings to grand celebrations, create
              unforgettable memories in our award-winning spaces.
            </p>
            <Button
              variant="outline"
              className="rounded-full px-6 py-5 bg-white text-gray-900 border-white hover:bg-gray-100 hover:text-gray-900 font-medium"
            >
              Secure Your Space
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
