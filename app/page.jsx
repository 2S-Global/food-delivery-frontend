import Wrapper from "@/layout/Wrapper";
import Home from "@/components/home-1";
import LogIn from "@/components/pages-menu/login";

export const metadata = {
  title: "FOOD GO",
  description: "FOOD GO",
};

export default function page() {
  return (
    <Wrapper>
      <LogIn />
    </Wrapper>
  );
}