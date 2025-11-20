export const metadata = {
  title: "Food Go-Admin",
  description: "Food Go-Admin",
};
import AuthWrapper from "./AuthWrapper";
export default function Layout({ children }) {
  return (
    <>
      <AuthWrapper>
        <div className="container shadow-lg">{children}</div>
      </AuthWrapper>
    </>
  );
}
