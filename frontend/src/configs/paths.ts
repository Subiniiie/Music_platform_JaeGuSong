const PATH = {
  root: "/",
  community: "/community",
  divider: "/divider",
  workspace: "/ws",
  game: "/game",
};

const paths = {
  root: PATH.root,
  main: `${PATH.community}/main`,

  // auth
  auth: {
    signIn: "/signin",
    signUp: "/signup",
  },

  // divider
  divider: {
    upload: `${PATH.divider}/upload`,
    announcement: `${PATH.divider}/announcement`,
  },

  // workspace
  workspace: {
    list: `${PATH.workspace}/list`,
    detail: (workspaceId: number) => `${PATH.workspace}/list/${workspaceId}`, // 워크스페이스 상세 페이지
  },

  // community
  community: {
    main: "/",
  },

  // game
  game: {
    home: `${PATH.game}/home`,
    drum: `${PATH.game}/drum`,
    keyboards: `${PATH.game}/keyboards`,
    vocal: `${PATH.game}/vocal`,
  },

  // PATH 는 크게 기능 기준으로 나누고,
  // paths 로 세부 페이지 경로 설정해뒀습니다.
  // auth 는 일반적으로 주소가 단순한게 익숙하다고 생각해서
  // PATH 따로 설정 안해뒀습니다.
};

export default paths;
