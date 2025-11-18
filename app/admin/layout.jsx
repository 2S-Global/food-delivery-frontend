export const metadata = {
  title: "GEISIL-Admin",
  description: "GEISIL-Admin",
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
