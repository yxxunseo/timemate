import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function AppShell() {
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 86 }}>
      <Outlet />
      <BottomNav />
    </div>
  );
}
