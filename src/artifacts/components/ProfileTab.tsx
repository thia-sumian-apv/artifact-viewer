import { User, Save, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";

const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    traineeId: "TD-2025-0042",
    cohort: "Commando 2025 Batch",
    age: 24,
    weight: 72,
    height: 178,
    bmi: 22.7,
    restingHeartRate: 64,
    vo2Max: 48.2,
    benchPress: 85,
    squat: 120,
  });

  // Calculate BMI whenever height or weight changes
  useEffect(() => {
    const heightInMeters = profile.height / 100;
    const calculatedBMI = profile.weight / (heightInMeters * heightInMeters);
    setProfile((prev) => ({
      ...prev,
      bmi: Number.parseFloat(calculatedBMI.toFixed(1)),
    }));
  }, [profile.height, profile.weight]);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]:
        name === "height" || name === "weight" || name === "age"
          ? Number.parseFloat(value) || 0
          : value,
    }));
  };

  const handleSave = () => {
    // Here you would typically save to a backend
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Bio Data & Profile
        </h2>
        <button
          type="button"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex items-center px-3 py-1.5 text-sm rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-1.5" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-1.5" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center mb-6">
          <div className="h-20 w-20 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
            <User className="h-10 w-10 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="mt-4 md:mt-0 md:ml-6 flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs text-gray-500 dark:text-gray-400"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full md:w-1/2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs text-gray-500 dark:text-gray-400"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full md:w-1/2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  {profile.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profile.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Trainee ID: {profile.traineeId}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Cohort: {profile.cohort}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Personal Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Age</p>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={profile.age}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {profile.age} years
                  </p>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Weight
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    name="weight"
                    value={profile.weight}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {profile.weight} kg
                  </p>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Height
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    name="height"
                    value={profile.height}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {profile.height} cm
                  </p>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">BMI</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile.bmi} ({getBMICategory(profile.bmi)})
                </p>
                {isEditing && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                    Auto-calculated
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fitness Metrics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Resting Heart Rate
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile.restingHeartRate} bpm
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  VO2 Max
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile.vo2Max} ml/kg/min
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Bench Press (1RM)
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile.benchPress} kg
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Squat (1RM)
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile.squat} kg
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileTab;
