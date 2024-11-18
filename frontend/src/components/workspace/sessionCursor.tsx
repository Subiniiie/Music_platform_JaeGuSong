import { Rnd } from "react-rnd";

interface SessionCursorProps {
  positionX: number; // 커서의 x축 위치
  color: string; // 커서의 색상
  bounds?: string; // Rnd의 bounds 설정
  onDragStop?: (e: any, d: any) => void; // 드래그 종료 시 호출되는 함수
  isDraggable?: boolean; // 드래그 가능 여부
}

export default function SessionCursor({
  positionX,
  color,
  bounds = "parent",
  onDragStop,
  isDraggable = true,
}: SessionCursorProps) {
  return (
    <Rnd
      bounds={bounds}
      size={{ width: 2, height: 100 }}
      position={{ x: positionX, y: 0 }}
      onDragStop={onDragStop}
      enableDragging={isDraggable}
      enableResizing={false} // 크기 조정 비활성화
      style={{ backgroundColor: "transparent", cursor: "pointer" }} // Rnd 자체 배경 제거
    >
      {/* 커서 모양을 위한 Wrapper */}
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        {/* 삼각형 부분 */}
        <div
          style={{
            position: "absolute",
            top: isDraggable ? -6 : 94, // 드래그 가능한 커서는 위쪽, 고정 커서는 아래쪽
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: isDraggable ? `10px solid ${color}` : "none", // 위쪽 삼각형
            borderBottom: !isDraggable ? `10px solid ${color}` : "none", // 아래쪽 삼각형
          }}
        ></div>

        {/* 바 부분 */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: color,
          }}
        ></div>
      </div>
    </Rnd>
  );
}
