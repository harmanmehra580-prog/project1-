const StatCard = ({
  title,
  value,
  percentage,
  icon
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      
      <div className="flex justify-between">

        <div>
          <p className="text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold">
            {value}
          </h2>

          <p className="text-green-600">
            ↑ {percentage}% from last month
          </p>
        </div>

        <div>
          {icon}
        </div>

      </div>

    </div>
  );
};

export default StatCard;