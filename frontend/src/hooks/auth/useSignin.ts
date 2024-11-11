// 일단은 필요 없는 코드

import { useState } from "react";

const UseSingnin = () => {
  const [signined, setSignined] = useState<boolean>(false);

  return {
    setSignined,
    signined,
  };
};

export default UseSingnin;
