import { useRouter } from "next/router";

const useBack = () => {
  const router = useRouter();

  const handleBack = () => {
    if (history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return {
    handleBack,
  };
};

export default useBack;
