interface StatItem {
  value: string;
  label: string;
}

const stats: StatItem[] = [
  {
    value: "500+",
    label: "Events Hosted",
  },
  {
    value: "4.9",
    label: "Average Rating",
  },
  {
    value: "100%",
    label: "Satisfaction Guarantee",
  },
];

const Stats = () => {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center py-6 md:py-0"
            >
              <span className="text-4xl md:text-6xl font-semibold text-gray-900 mb-2">
                {stat.value}
              </span>
              <span className="text-md text-gray-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
