import {
  Users,
  ShieldUser,
  Anvil,
  BrainCog,
  Shapes,
  Boxes,
} from "lucide-react";
import { Assessment } from "../AssessmentCard";

export const baseAssessments: {
  cognitive: Assessment[];
  psychological: Assessment[];
  physical: Assessment[];
} = {
  cognitive: [
    {
      id: "sart",
      title: "Sustained Attention Response Task (SART)",
      description:
        "Measures your ability to maintain focus and suppress impulsive responses over time.",
      duration: "10-12 mins",
      status: "available",
      icon: BrainCog,
      type: "cognitive",
    },
    {
      id: "vrxn",
      title: "Visual Recognition (RXN)",
      description:
        "Tests your ability to memorize and identify visual patterns under time constraints.",
      duration: "15-20 mins",
      status: "completed",
      icon: Shapes,
      type: "cognitive",
    },
    {
      id: "spatial",
      title: "Spatial Planning",
      description:
        "Evaluates your ability to visualize and strategize spatial arrangements with minimal moves.",
      duration: "12-15 mins",
      status: "available",
      icon: Boxes,
      type: "cognitive",
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
      icon: Users,
      type: "psychological",
    },
    {
      id: "teamres",
      title: "Team Resilience Assessment",
      description:
        "Measures your team's ability to bounce back from challenges and adapt to change.",
      duration: "10-15 mins",
      status: "available",
      icon: ShieldUser,
      type: "psychological",
    },
    {
      id: "selfdet",
      title: "Self-Determination Assessment",
      description:
        "Evaluates your motivation level and sense of autonomy, competence, and relatedness.",
      duration: "10 mins",
      status: "available",
      icon: Anvil,
      type: "psychological",
    },
  ],
  physical: [],
};
