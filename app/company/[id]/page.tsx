import path from "path";
import fs from "fs";
import { CompanyData } from "../../../lib/types";
import { formatCompanyName } from "@/utils/companyUtils";
import { EthnicityStats } from "@/app/components/stats/EthnicityStats";
import { GenderStats } from "@/app/components/stats/GenderStats";
import { LGBTQIAStats } from "@/app/components/stats/LGBTQIAStats";
import { DisabilityStats } from "@/app/components/stats/DisabilityStats";
import PayGapBarChart from "@/app/components/charts/PayGapBarChart";

const fetchData = async () => {
  const filePath = path.join(
    process.cwd(),
    "/lib/database/",
    "PayGapData.json",
  );

  const jsonData = await fs.promises.readFile(filePath, "utf8");
  const database: CompanyData[] = JSON.parse(jsonData);
  return database;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CompanyProfile = async ({ params }: { params: any }) => {
  const { id } = await params;
  const data = await fetchData();

  // Handle if object not found
  const companyData = data.find((item: CompanyData) => item.EmployerId == id);
  if (!companyData) {
    return <p>Company not found</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <h1 className="text-center p-4 text-3xl font-bold">
        {formatCompanyName(companyData.EmployerName)}
      </h1>
      <div className="text-center p-4">
        <p>{companyData.overview}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-200px)]">
        {/* House Container */}
        <div className="w-full md:w-1/2 h-40 md:h-full">
          <div className="grid grid-cols-2 gap-4 w-full h-full">
            <div className="bg-orange-500 rounded-lg"></div>
            <div className="bg-green-600 rounded-lg"></div>
            <div className="bg-red-500 rounded-lg"></div>
            <div className="bg-green-400 rounded-lg"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-col space-y-4 w-full md:w-1/2 h-full overflow-y-auto">
          <GenderStats companyData={companyData} />

          <EthnicityStats companyData={companyData} />

          <LGBTQIAStats companyData={companyData} />

          <DisabilityStats companyData={companyData} />
        </div>
        {/* Graph*/}
      </div>

      <div className="text-center mt-16 mb-16">
        <h2 className="text-center p-4 text-3xl font-bold">
          Gender Pay Gap Over Time
        </h2>
        <PayGapBarChart companyData={companyData} />
      </div>

      <div className="text-center mt-16 mb-16">
        <h2 className="text-center p-4 text-3xl font-bold">Ask a question</h2>
        <p className="text-sm font-medium">
          Not found what you are looking for? Ask an employee anonymously
        </p>
        <button className="m-4 bg-white hover:bg-gray-200 dark:bg-gray-800 p-5 rounded-xl border border-black dark:border-gray-700">
          Ask a question
        </button>
      </div>
    </div>
  );
};

export default CompanyProfile;
