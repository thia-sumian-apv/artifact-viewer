import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toggle } from "@/components/ui/toggle";
import {
  Activity,
  Award,
  BarChart2,
  Brain,
  ChevronRight,
  Clock,
  Dumbbell,
  FileText,
  Moon,
  Play,
  Sun,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

// Import CSS first
// You would need to import the CSS file in your actual project:
// import './neurovibes-styles.css';

interface Assessment {
  id: string;
  title: string;
  description: string;
  duration?: string;
  status: string;
  progress?: number;
  score?: number;
  date?: string;
  icon: JSX.Element;
}

const NeuroVibesPortal = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      return savedMode === "true";
    }
    // Default to dark mode
    return true;
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSidebar, setShowSidebar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<{
    cognitive: Assessment[];
    psychological: Assessment[];
    physical: Assessment[];
  }>({
    cognitive: [],
    psychological: [],
    physical: [],
  });

  useEffect(() => {
    // Simulate API call to fetch available assessments
    setTimeout(() => {
      setAssessments({
        cognitive: [
          {
            id: "sart",
            title: "Sustained Attention Response Task (SART)",
            description:
              "Measures your ability to maintain focus and suppress impulsive responses over time.",
            duration: "10-12 mins",
            status: "completed",
            progress: 100,
            score: 87,
            icon: <Brain className="h-6 w-6" data-oid="w80wks6" />,
          },
          {
            id: "vrxn",
            title: "Visual Recognition (RXN)",
            description:
              "Tests your ability to memorize and identify visual patterns under time constraints.",
            duration: "15-20 mins",
            status: "in_progress",
            progress: 60,
            icon: <Activity className="h-6 w-6" data-oid="kbi-ij3" />,
          },
          {
            id: "spatial",
            title: "Spatial Planning",
            description:
              "Evaluates your ability to visualize and strategize spatial arrangements with minimal moves.",
            duration: "12-15 mins",
            status: "available",
            progress: 0,
            icon: <Brain className="h-6 w-6" data-oid="i4364r." />,
          },
        ],

        psychological: [
          {
            id: "ml360",
            title: "Mindful Leadership Assessment (ML360)",
            description:
              "Evaluates leadership behaviors reflecting mindfulness in workplace scenarios.",
            duration: "15-20 mins",
            status: "completed",
            progress: 100,
            score: 92,
            icon: <Users className="h-6 w-6" data-oid="2woc4ge" />,
          },
          {
            id: "teamres",
            title: "Team Resilience Assessment",
            description:
              "Measures your team's ability to bounce back from challenges and adapt to change.",
            duration: "10-15 mins",
            status: "available",
            progress: 0,
            icon: <Users className="h-6 w-6" data-oid="c3oej23" />,
          },
          {
            id: "selfdet",
            title: "Self-Determination Assessment",
            description:
              "Evaluates your motivation level and sense of autonomy, competence, and relatedness.",
            duration: "10 mins",
            status: "available",
            progress: 0,
            icon: <Activity className="h-6 w-6" data-oid="nq8-ttr" />,
          },
        ],

        physical: [
          {
            id: "cardio",
            title: "Cardio-Respiratory Fitness",
            description: "Results from your VO2 Max and endurance testing.",
            status: "completed",
            date: "2 Mar 2025",
            score: 78,
            icon: <Dumbbell className="h-6 w-6" data-oid="viy99hi" />,
          },
          {
            id: "strength",
            title: "Strength Assessment",
            description: "Measurements from resistance training evaluation.",
            status: "completed",
            date: "28 Feb 2025",
            score: 82,
            icon: <Award className="h-6 w-6" data-oid="m30v7vn" />,
          },
          {
            id: "ippt",
            title: "IPPT Results",
            description:
              "Individual Physical Proficiency Test scores and analysis.",
            status: "completed",
            date: "15 Feb 2025",
            score: 85,
            icon: <Award className="h-6 w-6" data-oid="vlz431d" />,
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  // Apply dark mode class to document and body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }

    // Save preference to localStorage
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const startAssessment = (id: string) => {
    console.log(`Starting assessment: ${id}`);
    // Navigation logic would go here
  };

  const viewReport = (id: string) => {
    console.log(`Viewing report for: ${id}`);
    // Report viewing logic would go here
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Calculate progress percentages
  const getCognitiveProgress = () => {
    const completed = assessments.cognitive.filter(
      (a) => a.status === "completed",
    ).length;
    return {
      count: `${completed}/${assessments.cognitive.length}`,
      percentage:
        Math.round((completed / assessments.cognitive.length) * 100) || 0,
    };
  };

  const getPsychologicalProgress = () => {
    const completed = assessments.psychological.filter(
      (a) => a.status === "completed",
    ).length;
    return {
      count: `${completed}/${assessments.psychological.length}`,
      percentage:
        Math.round((completed / assessments.psychological.length) * 100) || 0,
    };
  };

  const getPhysicalProgress = () => {
    const completed = assessments.physical.filter(
      (a) => a.status === "completed",
    ).length;
    return {
      count: `${completed}/${assessments.physical.length}`,
      percentage:
        Math.round((completed / assessments.physical.length) * 100) || 0,
    };
  };

  const getOverallProgress = () => {
    const totalAssessments =
      assessments.cognitive.length +
      assessments.psychological.length +
      assessments.physical.length;
    const completed =
      assessments.cognitive.filter((a) => a.status === "completed").length +
      assessments.psychological.filter((a) => a.status === "completed").length +
      assessments.physical.filter((a) => a.status === "completed").length;

    return {
      count: `${completed}/${totalAssessments}`,
      percentage: Math.round((completed / totalAssessments) * 100) || 0,
    };
  };

  const renderAssessmentCard = (assessment: Assessment) => {
    const getStatusBadge = () => {
      if (assessment.status === "available") {
        return (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            data-oid="p3t-k__"
          >
            Available
          </span>
        );
      }
      if (assessment.status === "completed") {
        return (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300"
            data-oid=".oxk:3t"
          >
            Completed
          </span>
        );
      }
      if (assessment.status === "in_progress") {
        return (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
            data-oid="v3x0ous"
          >
            In Progress
          </span>
        );
      }
      // Default case without else
      return (
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
          data-oid="ksytgz2"
        >
          Unavailable
        </span>
      );
    };

    return (
      <div
        key={assessment.id}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
        data-oid="p9rka0l"
      >
        <div className="p-5" data-oid="98vo7hz">
          <div className="flex items-center" data-oid="9m4rpzy">
            <div
              className="flex-shrink-0 bg-teal-50 dark:bg-teal-900/30 rounded-lg p-2"
              data-oid="21_j_lz"
            >
              <div
                className="text-teal-600 dark:text-teal-400"
                data-oid="n10_s5d"
              >
                {assessment.icon}
              </div>
            </div>
            <div className="ml-4 flex-1" data-oid=":bazv8_">
              <div
                className="flex items-center justify-between"
                data-oid="tn1e:9g"
              >
                <h3
                  className="text-base font-medium text-gray-900 dark:text-white"
                  data-oid="_dzyi_4"
                >
                  {assessment.title}
                </h3>
                {getStatusBadge()}
              </div>
              <p
                className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                data-oid="1izb97o"
              >
                {assessment.description}
              </p>
              {assessment.duration && (
                <div
                  className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400"
                  data-oid="8o3on-s"
                >
                  <Clock
                    className="flex-shrink-0 h-3 w-3 text-gray-400 dark:text-gray-500"
                    data-oid="s4noaa2"
                  />

                  <span className="ml-1" data-oid="wn3lf.7">
                    {assessment.duration}
                  </span>
                </div>
              )}
              {assessment.date && (
                <div
                  className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400"
                  data-oid="dlhulgu"
                >
                  <Clock
                    className="flex-shrink-0 h-3 w-3 text-gray-400 dark:text-gray-500"
                    data-oid="0nrp1q:"
                  />

                  <span className="ml-1" data-oid=":1jeg:r">
                    Completed: {assessment.date}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3" data-oid="xiwrfft">
            {(assessment.progress ?? 0) > 0 && (
              <div
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3"
                data-oid="b..c23r"
              >
                <div
                  className={`h-1.5 rounded-full ${
                    assessment.progress === 100
                      ? "bg-teal-500 dark:bg-teal-400"
                      : "bg-blue-500 dark:bg-blue-400"
                  }`}
                  style={{ width: `${assessment.progress}%` }}
                  data-oid="1tp6w__"
                />
              </div>
            )}
            {assessment.score && (
              <div className="flex items-center mb-3" data-oid="q.:kplb">
                <div
                  className="text-xs font-medium text-gray-500 dark:text-gray-400"
                  data-oid="-3e-zfl"
                >
                  Score:
                </div>
                <div
                  className="ml-2 text-sm font-medium text-teal-600 dark:text-teal-400"
                  data-oid="suj5-x3"
                >
                  {assessment.score}/100
                </div>
              </div>
            )}
            <div className="flex space-x-2" data-oid="_g5rjak">
              {assessment.status === "completed" ? (
                <button
                  type="button"
                  onClick={() => viewReport(assessment.id)}
                  className="flex-1 flex justify-center items-center px-3 py-1.5 border border-transparent rounded-md text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
                  data-oid="4iemuq2"
                >
                  <FileText className="h-3 w-3 mr-1" data-oid="uf:oj7d" />
                  View Report
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => startAssessment(assessment.id)}
                  className="flex-1 flex justify-center items-center px-3 py-1.5 border border-transparent rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                  data-oid="9782inn"
                >
                  <Play className="h-3 w-3 mr-1" data-oid="00bifgl" />
                  {assessment.status === "in_progress"
                    ? "Continue"
                    : "Start Assessment"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const cognitiveProgress = getCognitiveProgress();
  const psychologicalProgress = getPsychologicalProgress();
  const physicalProgress = getPhysicalProgress();
  const overallProgress = getOverallProgress();

  return (
    <div
      className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}
      data-oid="710d6tq"
    >
      <SidebarProvider defaultOpen={showSidebar} data-oid="xvt24as">
        <div className="flex" data-oid="q9u3qax">
          <Sidebar
            className="border-r border-gray-200 dark:border-gray-700"
            collapsible="icon"
            data-oid="ge2-ei2"
          >
            <SidebarHeader className="p-4" data-oid="mer1_.r">
              <div className="flex items-center" data-oid="fv_ajxe">
                <div className="w-8 h-8 overflow-hidden" data-oid="4g:g1fw">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                    data-oid="vpn63t8"
                  >
                    <title id="logoTitle" data-oid="9w5yw_z">
                      NeuroVibes Logo
                    </title>
                    <path
                      d="M10,50 Q30,10 50,50 T90,50"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="15"
                      strokeLinecap="round"
                      data-oid="1lc_obt"
                    />

                    <defs data-oid="x.we2g.">
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                        data-oid="n447__m"
                      >
                        <stop
                          offset="0%"
                          stopColor="#0D5E7E"
                          data-oid="tn2o-z_"
                        />

                        <stop
                          offset="100%"
                          stopColor="#4CD4D9"
                          data-oid="_gsxy.:"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h1
                  className="ml-2 text-xl font-bold text-gray-900 dark:text-white data-[collapsed=true]:hidden"
                  data-oid="pu_6c59"
                >
                  NeuroVibes
                </h1>
              </div>
            </SidebarHeader>

            <SidebarContent data-oid="g4gb0wy">
              <SidebarMenu className="px-2 py-4 space-y-2" data-oid="j:y0ih4">
                <SidebarMenuItem data-oid="0wbqwkc">
                  <SidebarMenuButton
                    tooltip="Dashboard"
                    isActive={activeTab === "dashboard"}
                    onClick={() => setActiveTab("dashboard")}
                    className="w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    data-[active=true]:bg-teal-50 dark:data-[active=true]:bg-teal-900/30
                    data-[active=true]:text-teal-600 dark:data-[active=true]:text-teal-400"
                    data-oid="5oct6r."
                  >
                    <BarChart2 className="w-5 h-5" data-oid="5rtrd24" />
                    <span className="font-normal" data-oid="4pn-sm9">
                      Dashboard
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem data-oid="-62167m">
                  <SidebarMenuButton
                    tooltip="Physical"
                    isActive={activeTab === "physical"}
                    onClick={() => setActiveTab("physical")}
                    className="w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    data-[active=true]:bg-teal-50 dark:data-[active=true]:bg-teal-900/30
                    data-[active=true]:text-teal-600 dark:data-[active=true]:text-teal-400"
                    data-oid="t2axnle"
                  >
                    <Dumbbell data-oid="yf-odb:" />
                    <span className="font-normal" data-oid="-w6k39q">
                      Physical
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem data-oid="lfhp97s">
                  <SidebarMenuButton
                    tooltip="Psychological"
                    isActive={activeTab === "psychological"}
                    onClick={() => setActiveTab("psychological")}
                    className="w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    data-[active=true]:bg-teal-50 dark:data-[active=true]:bg-teal-900/30
                    data-[active=true]:text-teal-600 dark:data-[active=true]:text-teal-400"
                    data-oid="ausjfnh"
                  >
                    <Activity data-oid="jgfrslh" />
                    <span className="font-normal" data-oid="futl-1l">
                      Psychological
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem data-oid="qaqhl-3">
                  <SidebarMenuButton
                    tooltip="Cognitive"
                    isActive={activeTab === "cognitive"}
                    onClick={() => setActiveTab("cognitive")}
                    className="w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    data-[active=true]:bg-teal-50 dark:data-[active=true]:bg-teal-900/30
                    data-[active=true]:text-teal-600 dark:data-[active=true]:text-teal-400"
                    data-oid="i::gl6_"
                  >
                    <Brain data-oid="5vo16t3" />
                    <span className="font-normal" data-oid="r1purkr">
                      Cognitive
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem data-oid="3.jjc50">
                  <SidebarMenuButton
                    tooltip="Reports"
                    isActive={activeTab === "reports"}
                    onClick={() => setActiveTab("reports")}
                    className="w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    data-[active=true]:bg-teal-50 dark:data-[active=true]:bg-teal-900/30
                    data-[active=true]:text-teal-600 dark:data-[active=true]:text-teal-400"
                    data-oid=":2nwhj2"
                  >
                    <FileText data-oid="1g4zrfl" />
                    <span className="font-normal" data-oid="ol:0s1_">
                      Reports
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem data-oid="z2cgapc">
                  <SidebarMenuButton
                    tooltip="Profile"
                    isActive={activeTab === "profile"}
                    onClick={() => setActiveTab("profile")}
                    className="w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    data-[active=true]:bg-teal-50 dark:data-[active=true]:bg-teal-900/30
                    data-[active=true]:text-teal-600 dark:data-[active=true]:text-teal-400"
                    data-oid="fnm_hxj"
                  >
                    <User data-oid="2e5-8ir" />
                    <span className="font-normal" data-oid="blvnnzd">
                      Profile
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>

              {/* Dark mode toggle in sidebar footer */}
              <div
                className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700"
                data-oid="z3:jb5x"
              >
                <div
                  className="flex items-center justify-between px-3 py-2"
                  data-oid="syzda7s"
                >
                  <span
                    className="text-sm text-gray-600 dark:text-gray-300"
                    data-oid="p5noij4"
                  >
                    Dark Mode
                  </span>
                  <Toggle
                    pressed={darkMode}
                    onPressedChange={toggleDarkMode}
                    size="sm"
                    className="data-[state=on]:bg-teal-600 data-[state=on]:text-white"
                    data-oid="of-m5yl"
                  >
                    {darkMode ? (
                      <Moon className="h-4 w-4" data-oid="xznw81p" />
                    ) : (
                      <Sun className="h-4 w-4" data-oid="x7ngmln" />
                    )}
                  </Toggle>
                </div>
              </div>
            </SidebarContent>
          </Sidebar>

          {/* Main Content Area */}
          <div
            className="flex-1 flex flex-col h-screen overflow-hidden"
            data-oid="0hc5f61"
          >
            {/* Top Bar with Toggle and Breadcrumbs */}
            <div
              className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full"
              data-oid="yfvjvko"
            >
              <div
                className="items-center h-16 px-4 flex justify-start w-full"
                data-oid="4xvu34l"
              >
                <SidebarTrigger className="mr-4" data-oid="2h:f8.3" />
                <nav
                  className="flex"
                  aria-label="Breadcrumb"
                  data-oid="uwm77tq"
                >
                  <ol
                    className="flex items-center space-x-2"
                    data-oid="ujd7e09"
                  >
                    <li data-oid=".wbag7r">
                      <div className="flex items-center" data-oid="c9nolj7">
                        <span
                          className="text-gray-500 dark:text-gray-400"
                          data-oid="qaevq1q"
                        >
                          NeuroVibes Portal
                        </span>
                        <ChevronRight
                          className="h-4 w-4 text-gray-400 mx-2"
                          data-oid="b8uu93y"
                        />
                      </div>
                    </li>
                    <li data-oid="xystyoh">
                      <span
                        className="text-gray-900 dark:text-white font-medium"
                        data-oid="dms7n7_"
                      >
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                      </span>
                    </li>
                  </ol>
                </nav>

                {/* User Profile Section */}
                <div
                  className="ml-auto flex items-center space-x-4"
                  data-oid="vusv4kl"
                >
                  <div className="relative" data-oid="-jffe8v">
                    <span
                      className="inline-block h-8 w-8 rounded-full overflow-hidden bg-teal-100 dark:bg-teal-900"
                      data-oid="eo0lw5i"
                    >
                      <User
                        className="h-5 w-5 text-teal-600 dark:text-teal-400 m-1.5"
                        data-oid="2-7:-jw"
                      />
                    </span>
                    <span
                      className="absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-gray-800 bg-green-400"
                      data-oid="yq58vb8"
                    />
                  </div>
                  <span
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    data-oid="8cr9rv5"
                  >
                    Trainee
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <main
              className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto"
              data-oid="ts1trb0"
            >
              {/* Assessment Progress - Only show on dashboard tab */}
              {activeTab === "dashboard" && (
                <div
                  className="mb-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700"
                  data-oid="6khcrkz"
                >
                  <div className="p-4" data-oid="-9nzvhy">
                    <h2
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                      data-oid="9lc.gj0"
                    >
                      Assessment Progress
                    </h2>
                    <div className="grid grid-cols-3 gap-3" data-oid="0z5tf13">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-lg p-3 text-white"
                        data-oid="-2jagrp"
                      >
                        <div
                          className="flex justify-between"
                          data-oid="-ldvtlg"
                        >
                          <div data-oid="j7qd8qx">
                            <p
                              className="text-xs font-medium"
                              data-oid="dseyl2:"
                            >
                              Physical
                            </p>
                            <p
                              className="text-lg font-semibold"
                              data-oid="g49rigf"
                            >
                              {physicalProgress.count}
                            </p>
                          </div>
                          <Dumbbell
                            className="h-6 w-6 text-white/80"
                            data-oid="q6gfiiu"
                          />
                        </div>
                        <div className="mt-2" data-oid="ism7.9u">
                          <div
                            className="w-full bg-white/30 rounded-full h-1"
                            data-oid="h9ph75w"
                          >
                            <div
                              className="bg-white h-1 rounded-full"
                              style={{
                                width: `${physicalProgress.percentage}%`,
                              }}
                              data-oid="3siqes6"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 rounded-lg p-3 text-white"
                        data-oid="hlpe9gr"
                      >
                        <div
                          className="flex justify-between"
                          data-oid="e.794gr"
                        >
                          <div data-oid="p8thjgw">
                            <p
                              className="text-xs font-medium"
                              data-oid="3--c5_6"
                            >
                              Psychological
                            </p>
                            <p
                              className="text-lg font-semibold"
                              data-oid="xbv4-4o"
                            >
                              {psychologicalProgress.count}
                            </p>
                          </div>
                          <Activity
                            className="h-6 w-6 text-white/80"
                            data-oid="ky-wnen"
                          />
                        </div>
                        <div className="mt-2" data-oid="i6dusyh">
                          <div
                            className="w-full bg-white/30 rounded-full h-1"
                            data-oid="0o8m09_"
                          >
                            <div
                              className="bg-white h-1 rounded-full"
                              style={{
                                width: `${psychologicalProgress.percentage}%`,
                              }}
                              data-oid="q12:rpm"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="bg-gradient-to-r from-teal-500 to-blue-500 dark:from-teal-600 dark:to-blue-600 rounded-lg p-3 text-white"
                        data-oid="11j--gn"
                      >
                        <div
                          className="flex justify-between"
                          data-oid="60.7rh4"
                        >
                          <div data-oid="z:8uom4">
                            <p
                              className="text-xs font-medium"
                              data-oid="3z-ronm"
                            >
                              Cognitive
                            </p>
                            <p
                              className="text-lg font-semibold"
                              data-oid="taxq-q4"
                            >
                              {cognitiveProgress.count}
                            </p>
                          </div>
                          <Brain
                            className="h-6 w-6 text-white/80"
                            data-oid="ad3n35m"
                          />
                        </div>
                        <div className="mt-2" data-oid="3.:mua_">
                          <div
                            className="w-full bg-white/30 rounded-full h-1"
                            data-oid="avj6btd"
                          >
                            <div
                              className="bg-white h-1 rounded-full"
                              style={{
                                width: `${cognitiveProgress.percentage}%`,
                              }}
                              data-oid="aje_4gb"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Overall Status Text Section */}
                    <div
                      className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
                      data-oid="v.4fjxe"
                    >
                      <div
                        className="flex justify-between items-center mb-3"
                        data-oid="qy38151"
                      >
                        <h3
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          data-oid="9rog8d-"
                        >
                          Overall Assessment Status
                        </h3>
                        <span
                          className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 m-0"
                          data-oid="4nlmo6u"
                        >
                          {overallProgress.percentage}% Complete
                        </span>
                      </div>
                      <p
                        className="text-sm text-gray-600 dark:text-gray-400 mb-4"
                        data-oid="t22qp7."
                      >
                        You have completed {overallProgress.count} assessments
                        across all categories.
                        {overallProgress.percentage < 100
                          ? " Continue with your remaining assessments to get a comprehensive evaluation."
                          : " All assessments are complete. View your comprehensive report for detailed insights."}
                      </p>
                      <div className="flex space-x-3" data-oid="4smxwqs">
                        <button
                          type="button"
                          onClick={() => setActiveTab("reports")}
                          className="px-3 py-2 text-xs rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 flex items-center"
                          data-oid="wqlyi.4"
                        >
                          <FileText
                            className="h-3.5 w-3.5 mr-1.5"
                            data-oid="b44lzfe"
                          />
                          View Overall Report
                        </button>
                        <button
                          type="button"
                          className="px-3 py-2 text-xs rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center"
                          data-oid="wqdqcdk"
                        >
                          <FileText
                            className="h-3.5 w-3.5 mr-1.5"
                            data-oid="fwd-xzd"
                          />
                          Trainer Notes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Assessment List */}
              {loading ? (
                <div
                  className="flex justify-center items-center h-64"
                  data-oid="wppeb_f"
                >
                  <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 dark:border-teal-400"
                    data-oid="-1l87z9"
                  />
                </div>
              ) : (
                <>
                  {activeTab === "dashboard" && (
                    <>
                      <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                        data-oid="t1if_s_"
                      >
                        {/* Psychological Assessment Launch Card */}
                        <div
                          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-200 border border-gray-100 dark:border-gray-700"
                          data-oid="bthu2az"
                        >
                          <div
                            className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative overflow-hidden"
                            data-oid="zp69wzg"
                          >
                            <div
                              className="absolute inset-0 opacity-20"
                              style={{
                                backgroundImage:
                                  "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                              data-oid="g85_pnw"
                            />

                            <div
                              className="absolute bottom-4 left-6"
                              data-oid="pyhu5s8"
                            >
                              <h3
                                className="text-2xl font-bold text-white"
                                data-oid="hvzui6n"
                              >
                                Psychological
                              </h3>
                              <p
                                className="text-white/80 text-sm"
                                data-oid="cad8ith"
                              >
                                Assessment
                              </p>
                            </div>
                            <Activity
                              className="absolute top-4 right-4 h-8 w-8 text-white/80"
                              data-oid="c4grfeh"
                            />
                          </div>
                          <div className="p-6" data-oid="1mm.e9p">
                            <p
                              className="text-gray-600 dark:text-gray-300 text-sm mb-6"
                              data-oid="zhejl:i"
                            >
                              Evaluate your leadership behaviors, team
                              resilience, and personal motivation levels through
                              comprehensive self-assessment surveys.
                            </p>
                            <div
                              className="flex justify-between items-center"
                              data-oid="ubbc6cj"
                            >
                              <div data-oid="u1i8:su">
                                <span
                                  className="text-xs font-medium text-gray-500 dark:text-gray-400"
                                  data-oid="0lo-13w"
                                >
                                  Completed: {psychologicalProgress.count}
                                </span>
                                <div
                                  className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1.5"
                                  data-oid="adrs6vw"
                                >
                                  <div
                                    className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full"
                                    style={{
                                      width: `${psychologicalProgress.percentage}%`,
                                    }}
                                    data-oid="u1qzib1"
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setActiveTab("psychological")}
                                className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600"
                                data-oid="w9tirkg"
                              >
                                Start Assessment
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Cognitive Assessment Launch Card */}
                        <div
                          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-200 border border-gray-100 dark:border-gray-700"
                          data-oid="bfdyv02"
                        >
                          <div
                            className="h-40 bg-gradient-to-r from-teal-500 to-blue-600 relative overflow-hidden"
                            data-oid="p5l83vp"
                          >
                            {/* This would be replaced with an actual image in production */}
                            <div
                              className="absolute inset-0 opacity-20 rounded-none"
                              style={{
                                backgroundImage:
                                  "url('https://images.unsplash.com/photo-1571310100246-e0676f359b42?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                              data-oid="uvvd33u"
                            />

                            <div
                              className="absolute bottom-4 left-6"
                              data-oid="4x.1cm8"
                            >
                              <h3
                                className="text-2xl font-bold text-white"
                                data-oid="2biv-1r"
                              >
                                Cognitive
                              </h3>
                              <p
                                className="text-white/80 text-sm"
                                data-oid="h68mfj8"
                              >
                                Assessment
                              </p>
                            </div>
                            <Brain
                              className="absolute top-4 right-4 h-8 w-8 text-white/80"
                              data-oid="yv:t.xj"
                            />
                          </div>
                          <div className="p-6" data-oid="7an8wpp">
                            <p
                              className="text-gray-600 dark:text-gray-300 text-sm mb-6"
                              data-oid="g09-5kf"
                            >
                              Measure your cognitive abilities including
                              attention, visual recognition, and spatial
                              planning through interactive, gamified exercises.
                            </p>
                            <div
                              className="flex justify-between items-center"
                              data-oid="30qeenz"
                            >
                              <div data-oid="6m4i-_y">
                                <span
                                  className="text-xs font-medium text-gray-500 dark:text-gray-400"
                                  data-oid="7139kra"
                                >
                                  Completed: {cognitiveProgress.count}
                                </span>
                                <div
                                  className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1.5"
                                  data-oid="zcnfk.-"
                                >
                                  <div
                                    className="bg-teal-600 dark:bg-teal-500 h-1.5 rounded-full"
                                    style={{
                                      width: `${cognitiveProgress.percentage}%`,
                                    }}
                                    data-oid="ix78fs."
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setActiveTab("cognitive")}
                                className="px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-md text-sm font-medium hover:bg-teal-700 dark:hover:bg-teal-600"
                                data-oid="hvam78j"
                              >
                                Start Assessment
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Physical Training Results Card */}
                      <div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                        data-oid="7l4tf4g"
                      >
                        <div className="p-6" data-oid="q1:vzi0">
                          <div
                            className="flex items-center justify-between mb-4"
                            data-oid=".m:7k3r"
                          >
                            <h3
                              className="text-lg font-semibold text-gray-900 dark:text-white"
                              data-oid="mq896zp"
                            >
                              Physical Training Results
                            </h3>
                            <Dumbbell
                              className="h-6 w-6 text-gray-400 dark:text-gray-500"
                              data-oid="6ndzgrv"
                            />
                          </div>

                          <div
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            data-oid="-xkwukw"
                          >
                            {assessments.physical.map((assessment) => (
                              <div
                                key={assessment.id}
                                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                                data-oid=".j._nwn"
                              >
                                <div data-oid="b5v0hx-">
                                  <h4
                                    className="text-sm font-medium text-gray-900 dark:text-white"
                                    data-oid="_m:jjcu"
                                  >
                                    {assessment.title}
                                  </h4>
                                  <p
                                    className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                                    data-oid=".a4wj2s"
                                  >
                                    {assessment.date}
                                  </p>
                                </div>
                                <div
                                  className="flex items-center"
                                  data-oid="t9-ww_0"
                                >
                                  <span
                                    className="text-lg font-bold text-teal-600 dark:text-teal-400 mr-2"
                                    data-oid="_swskld"
                                  >
                                    {assessment.score}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => viewReport(assessment.id)}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                    data-oid="0gcarqc"
                                  >
                                    <FileText
                                      className="h-4 w-4"
                                      data-oid="k6p5l.y"
                                    />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveTab("physical")}
                            className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center hover:text-blue-800 dark:hover:text-blue-300"
                            data-oid="5_3fht8"
                          >
                            View all physical results
                            <ChevronRight
                              className="h-4 w-4 ml-1"
                              data-oid="o5x36_b"
                            />
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "physical" && (
                    <>
                      <h2
                        className="text-lg font-medium text-gray-900 dark:text-white mb-4"
                        data-oid="cp0uyl_"
                      >
                        Physical Assessments
                      </h2>
                      <div
                        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                        data-oid="9.obvtl"
                      >
                        {assessments.physical.map((assessment) =>
                          renderAssessmentCard(assessment),
                        )}
                      </div>
                    </>
                  )}

                  {activeTab === "psychological" && (
                    <>
                      <h2
                        className="text-lg font-medium text-gray-900 dark:text-white mb-4"
                        data-oid="f._l6vr"
                      >
                        Psychological Assessments
                      </h2>
                      <div
                        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                        data-oid=":u1:h4_"
                      >
                        {assessments.psychological.map((assessment) =>
                          renderAssessmentCard(assessment),
                        )}
                      </div>
                    </>
                  )}

                  {activeTab === "cognitive" && (
                    <>
                      <h2
                        className="text-lg font-medium text-gray-900 dark:text-white mb-4"
                        data-oid="xsnjvy6"
                      >
                        Cognitive Assessments
                      </h2>
                      <div
                        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                        data-oid="kjzclqx"
                      >
                        {assessments.cognitive.map((assessment) =>
                          renderAssessmentCard(assessment),
                        )}
                      </div>
                    </>
                  )}

                  {activeTab === "reports" && (
                    <>
                      <h2
                        className="text-lg font-medium text-gray-900 dark:text-white mb-4"
                        data-oid="lb5gypv"
                      >
                        Assessment Reports
                      </h2>
                      <div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full"
                        data-oid="a8y53yc"
                      >
                        <div className="mb-6" data-oid="z:ov7ya">
                          <h3
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="17czf1v"
                          >
                            Completed Assessments
                          </h3>
                          <div className="space-y-3" data-oid="4cnrm_c">
                            {[
                              ...assessments.cognitive,
                              ...assessments.psychological,
                            ]
                              .filter((a) => a.status === "completed")
                              .map((assessment) => (
                                <div
                                  key={assessment.id}
                                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex items-center justify-between"
                                  data-oid="ba-yvfv"
                                >
                                  <div
                                    className="flex items-center"
                                    data-oid="5p8_h9j"
                                  >
                                    <div
                                      className="text-teal-500 dark:text-teal-400 mr-3"
                                      data-oid="n0xqiut"
                                    >
                                      {assessment.icon}
                                    </div>
                                    <div data-oid="x02zkdx">
                                      <h4
                                        className="text-sm font-medium text-gray-900 dark:text-white"
                                        data-oid="yf9.vvw"
                                      >
                                        {assessment.title}
                                      </h4>
                                      <p
                                        className="text-xs text-gray-500 dark:text-gray-400"
                                        data-oid="a7l9o.7"
                                      >
                                        Score: {assessment.score}/100
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => viewReport(assessment.id)}
                                    className="px-3 py-1 text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-md hover:bg-teal-100 dark:hover:bg-teal-900/50"
                                    data-oid="vi6vccr"
                                  >
                                    View Report
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div data-oid="ftuh0g-">
                          <h3
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="dyiunws"
                          >
                            Physical Training Reports
                          </h3>
                          <div className="space-y-3" data-oid="i_7.pd-">
                            {assessments.physical.map((assessment) => (
                              <div
                                key={assessment.id}
                                className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex items-center justify-between"
                                data-oid="1xq.u6t"
                              >
                                <div
                                  className="flex items-center"
                                  data-oid="kemv9u:"
                                >
                                  <div
                                    className="text-teal-500 dark:text-teal-400 mr-3"
                                    data-oid="t45dzoi"
                                  >
                                    {assessment.icon}
                                  </div>
                                  <div data-oid="ag2.r5b">
                                    <h4
                                      className="text-sm font-medium text-gray-900 dark:text-white"
                                      data-oid="mv6zb-3"
                                    >
                                      {assessment.title}
                                    </h4>
                                    <p
                                      className="text-xs text-gray-500 dark:text-gray-400"
                                      data-oid="1tg0_hx"
                                    >
                                      Completed: {assessment.date}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => viewReport(assessment.id)}
                                  className="px-3 py-1 text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-md hover:bg-teal-100 dark:hover:bg-teal-900/50"
                                  data-oid="mzjew.f"
                                >
                                  View Report
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "profile" && (
                    <>
                      <h2
                        className="text-lg font-medium text-gray-900 dark:text-white mb-4"
                        data-oid="o8-_7jd"
                      >
                        Bio Data & Profile
                      </h2>
                      <div
                        className="flex-1 grid grid-cols-1 gap-6"
                        data-oid="ciwyhiv"
                      >
                        <div
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700"
                          data-oid="d3gggwk"
                        >
                          <div
                            className="flex items-center mb-6"
                            data-oid="nxjqye9"
                          >
                            <div
                              className="h-20 w-20 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center"
                              data-oid="er7tg6y"
                            >
                              <User
                                className="h-10 w-10 text-teal-600 dark:text-teal-400"
                                data-oid="7d5yxq7"
                              />
                            </div>
                            <div className="ml-6" data-oid="jtfj83i">
                              <h3
                                className="text-xl font-medium text-gray-900 dark:text-white"
                                data-oid="47oculo"
                              >
                                John Doe
                              </h3>
                              <p
                                className="text-sm text-gray-500 dark:text-gray-400"
                                data-oid="qzv8uws"
                              >
                                Trainee ID: TD-2025-0042
                              </p>
                              <p
                                className="text-sm text-gray-500 dark:text-gray-400"
                                data-oid="t4x2nti"
                              >
                                Cohort: Commando 2025 Batch
                              </p>
                            </div>
                          </div>

                          <div className="space-y-6" data-oid="l6zywk0">
                            <div data-oid="gy_8v54">
                              <h4
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                data-oid=":.-tqql"
                              >
                                Personal Details
                              </h4>
                              <div
                                className="grid grid-cols-2 gap-4"
                                data-oid="zaetl2i"
                              >
                                <div
                                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                                  data-oid="-ra.5tp"
                                >
                                  <p
                                    className="text-xs text-gray-500 dark:text-gray-400"
                                    data-oid="x1t:48e"
                                  >
                                    Age
                                  </p>
                                  <p
                                    className="text-sm font-medium text-gray-900 dark:text-white"
                                    data-oid="p1xyuo6"
                                  >
                                    24 years
                                  </p>
                                </div>
                                <div
                                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                                  data-oid="px2pra9"
                                >
                                  <p
                                    className="text-xs text-gray-500 dark:text-gray-400"
                                    data-oid="uizbkru"
                                  >
                                    Weight
                                  </p>
                                  <p
                                    className="text-sm font-medium text-gray-900 dark:text-white"
                                    data-oid="uh43u4-"
                                  >
                                    72 kg
                                  </p>
                                </div>
                                <div
                                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                                  data-oid="pb60agt"
                                >
                                  <p
                                    className="text-xs text-gray-500 dark:text-gray-400"
                                    data-oid="l5a2v1t"
                                  >
                                    Height
                                  </p>
                                  <p
                                    className="text-sm font-medium text-gray-900 dark:text-white"
                                    data-oid="q4e9iu0"
                                  >
                                    178 cm
                                  </p>
                                </div>
                                <div
                                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                                  data-oid="heck_pk"
                                >
                                  <p
                                    className="text-xs text-gray-500 dark:text-gray-400"
                                    data-oid="jeqrouc"
                                  >
                                    BMI
                                  </p>
                                  <p
                                    className="text-sm font-medium text-gray-900 dark:text-white"
                                    data-oid="mp.po7d"
                                  >
                                    22.7 (Normal)
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div data-oid="nq8bu2m">
                              <h4
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                data-oid="s6t62m4"
                              >
                                Fitness Metrics
                              </h4>
                              <div
                                className="grid grid-cols-2 gap-4"
                                data-oid="p.uf5hh"
                              >
                                <div
                                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                                  data-oid="tvg362b"
                                >
                                  <p
                                    className="text-xs text-gray-500 dark:text-gray-400"
                                    data-oid="ptkh.h7"
                                  >
                                    Resting Heart Rate
                                  </p>
                                  <p
                                    className="text-sm font-medium text-gray-900 dark:text-white"
                                    data-oid="hh3u46:"
                                  >
                                    64 bpm
                                  </p>
                                </div>
                                <div
                                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                                  data-oid="yn2pbci"
                                >
                                  <p
                                    className="text-xs text-gray-500 dark:text-gray-400"
                                    data-oid="wih_g-j"
                                  >
                                    VO2 Max
                                  </p>
                                  <p
                                    className="text-sm font-medium text-gray-900 dark:text-white"
                                    data-oid="wdebvod"
                                  >
                                    48.2 ml/kg/min
                                  </p>
                                </div>
                                <div
                                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                                  data-oid="5j4w6sv"
                                >
                                  <p
                                    className="text-xs text-gray-500 dark:text-gray-400"
                                    data-oid="ss2gk91"
                                  >
                                    Bench Press (1RM)
                                  </p>
                                  <p
                                    className="text-sm font-medium text-gray-900 dark:text-white"
                                    data-oid="0sbuscc"
                                  >
                                    85 kg
                                  </p>
                                </div>
                                <div
                                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                                  data-oid="jwj_4_3"
                                >
                                  <p
                                    className="text-xs text-gray-500 dark:text-gray-400"
                                    data-oid="r2m76i:"
                                  >
                                    Squat (1RM)
                                  </p>
                                  <p
                                    className="text-sm font-medium text-gray-900 dark:text-white"
                                    data-oid="8nw8r3t"
                                  >
                                    120 kg
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </main>

            {/* Footer */}
            <footer
              className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
              data-oid="vqqtrje"
            >
              <div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
                data-oid="d7fy09r"
              >
                <div
                  className="flex justify-between items-center"
                  data-oid="810hjs6"
                >
                  <div
                    className="text-xs text-gray-500 dark:text-gray-400"
                    data-oid="8gchnf6"
                  >
                    © 2025 NeuroVibes. All rights reserved.
                  </div>
                  <div
                    className="text-xs text-gray-500 dark:text-gray-400"
                    data-oid="kon25:s"
                  >
                    Version 1.0
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default NeuroVibesPortal;
