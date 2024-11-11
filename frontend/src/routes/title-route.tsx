import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import paths from "../configs/paths";
import DividerUploadView from "../pages/divider/upload-view";
// import CommunityView from "@/pages/community/community-view";
import WsListView from "@/pages/workspace/ws-list-view";
import WsDetailView from "@/pages/workspace/ws-detail-view";
import DividerAnnouncementView from "@/pages/divider/announcement-view";

const titleRoute: RouteObject[] = [
  {
    path: paths.root,
    // 메인 경로로 설정할 페이지는 나중에 element를 지정할 수 있음
    children: [
      {
        path: "community",
        element: <Navigate to={`${paths.main}`} replace />,
      },
      {
        path: paths.divider.upload,
        element: <DividerUploadView />,
      },
      {
        path: paths.divider.announcement,
        element: <DividerAnnouncementView />,
      },
      {
        path: paths.workspace.list,
        element: <WsListView />, // 나중에 추가 가능
      },
      {
        path: `${paths.workspace.list}/:workspaceSeq`, // 워크스페이스 상세 페이지 라우트
        element: <WsDetailView />, // 상세 페이지 컴포넌트 렌더링
      },
    ],
  },
];

export default titleRoute;
