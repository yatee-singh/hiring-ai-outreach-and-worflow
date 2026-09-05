import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

import ProtectedRoute from "./components/ProtectedRoute";
import CampaignLayout from "./components/CampaignLayout";

import JobDescriptionPage from "./pages/campaign/JobDescriptionPage";
import PeopleSearchPage from "./pages/campaign/PeopleSearchPage";
import SourcesPage from "./pages/campaign/SourcesPage";
import CallDashboard from "./pages/campaign/CallDashboard";

// import ApplicantsPage from "./pages/campaign/hiring-ai/ApplicantsPage";
// import Round1Page from "./pages/campaign/hiring-ai/Round1Page";
// import FinalRoundPage from "./pages/campaign/hiring-ai/FinalRoundPage";
// import CallDashboardPage from "./pages/campaign/hiring-ai/CallDashboardPage";

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job-campaigns/:campaignId"
          element={
            <ProtectedRoute>
              <CampaignLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<JobDescriptionPage />} />

          <Route
            path="job-description"
            element={<JobDescriptionPage />}
          />

          <Route
            path="people-search"
            element={<PeopleSearchPage />}
          />

          <Route
            path="call-dashboard"
            element={<CallDashboard />}
          />

          {/* <Route
            path="hiring-ai/applicants"
            element={<ApplicantsPage />}
          />

          <Route
            path="hiring-ai/round-1"
            element={<Round1Page />}
          />

          <Route
            path="hiring-ai/final-round"
            element={<FinalRoundPage />}
          />

          <Route
            path="hiring-ai/call-dashboard"
            element={<CallDashboardPage />}
          /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}