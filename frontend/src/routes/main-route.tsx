import type { RouteObject } from "react-router-dom";
import paths from "../configs/paths";
import SignInView from "../pages/auth/signin-view";
import SignUpView from "../pages/auth/signup-view";
import CommunityView from "@/pages/community/community-view";
import CommunityMainView from "@/pages/community/community-main-view";
import CommunityMyCommunityView from "@/pages/community/community-my-community-view";
import CommunityCreateView from "@/pages/community/community-create-view";
import CommunityDetailView from "@/pages/community/community-detail-view";
import CommunityUpdateView from "@/pages/community/community-update-view";
import CommunityRecommendView from "@/pages/community/community-recommend-view";
import GameView from "../pages/game/home/game-view";
import DrumView from "../sections/game/drum/game-drum";
import KeyboardsView from "../sections/game/keyboards/game-keyboards";
import VocalView from "../sections/game/vocal/game-vocal";
import MyPageView from "@/pages/setting/mypage-view";
import PrivateRoute from "./private-route";
import { Navigate } from "react-router-dom";

const mainRoute: RouteObject[] = [
  {
    path: paths.auth.signIn,
    element: <SignInView />, // 로그인 페이지
  },
  {
    path: paths.auth.signUp,
    element: <SignUpView />, // 회원가입 페이지
  },
  // {
  //   path: paths.root,
  //   element: <Navigate to={paths.auth.signIn} replace />, // 처음에 로그인 페이지로 리다이렉트
  // },
  {
    path: paths.root,
    element: (
      <PrivateRoute>
        <CommunityView />
      </PrivateRoute>
    ),
    // 메인 경로로 설정할 페이지는 나중에 element를 지정할 수 있음
    children: [
      {
        path: "",
        element: <CommunityView />,
      },
      {
        path: "community",
        element: <CommunityView />, // 나중에 추가 가능
        children: [
          {
            path: "",
            element: <CommunityRecommendView />,
          },
          {
            path: "main",
            element: <CommunityRecommendView />,
          },
          {
            path: "my-community",
            element: <CommunityMyCommunityView />,
          },
          {
            path: ":id",
            element: <CommunityMainView />,
          },
          {
            path: "create",
            element: <CommunityCreateView />,
          },
          {
            path: "detail/:id",
            element: <CommunityDetailView />,
          },
          {
            path: "update/:id",
            element: <CommunityUpdateView />,
          },
        ],
      },
      // 게임 경로
      {
        path: paths.game.drum,
        element: <DrumView />,
      },
      {
        path: paths.game.keyboards,
        element: <KeyboardsView />,
      },
      {
        path: paths.game.vocal,
        element: <VocalView />,
      },
      {
        path: paths.game.home,
        element: <GameView />,
      },
      // 마이페이지 경로
      {
        path: paths.setting.mypage,
        element: <MyPageView />,
      },
    ],
  },
];

export default mainRoute;
