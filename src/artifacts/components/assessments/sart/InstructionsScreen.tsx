import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronRight } from "lucide-react";

interface InstructionsScreenProps {
  onContinue: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const InstructionsScreen: React.FC<InstructionsScreenProps> = ({
  onContinue,
}) => {
  return (
    <div className="max-w-xl mx-auto w-full flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <Brain className="mx-auto mb-4 text-teal-500" size={48} />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Sustained Attention Response Assessment
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Test your ability to stay focused over time
        </p>
      </div>

      <Card className="mb-6 w-full">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="rounded-full px-3 py-1 mt-1">
                1
              </Badge>
              <div>
                <p className="font-medium">Watch for numbers</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Numbers from 1 to 9 will appear one at a time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="rounded-full px-3 py-1 mt-1">
                2
              </Badge>
              <div>
                <p className="font-medium">
                  Press{" "}
                  <kbd className="px-2 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                    SPACEBAR
                  </kbd>{" "}
                  quickly
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Press for every number{" "}
                  <span className="text-md font-semibold text-red-600 dark:text-red-400 mt-2">
                    except 3
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="rounded-full px-3 py-1 mt-1">
                3
              </Badge>
              <div>
                <p className="font-medium">Be fast and accurate</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Try to maintain both speed and accuracy
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          You'll start with a practice round before the real test
        </p>
      </div>

      <Button onClick={onContinue} className="px-8 py-2 w-full md:w-auto">
        Start <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default InstructionsScreen;
