import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import Clients from "@/components/Clients";
import KnowledgeBase from "@/components/KnowledgeBase";
import Conversations from "@/components/Conversations";
import PdfConverter from "@/components/PdfConverter";
import Settings from "@/components/Settings";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "clients":
        return <Clients />;
      case "knowledge":
        return <KnowledgeBase />;
      case "conversations":
        return <Conversations />;
      case "converter":
        return <PdfConverter />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
