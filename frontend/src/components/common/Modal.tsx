import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "30px",
    textAlign: "center",
    maxWidth: "800px",
    maxHeight: "1200px",
    position: "relative",
  };

  const closeButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "30px",
    right: "30px",
    background: "none",
    border: "none",
    color: "black",
    fontSize: "24px",
    cursor: "pointer",
  };

  // React Portal을 사용하여 모달을 body 바로 아래 렌더링
  return ReactDOM.createPortal(
    <div style={overlayStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        {children}
        <button style={closeButtonStyle} onClick={onClose}>
          X
        </button>
      </div>
    </div>,
    document.body // body 아래에 렌더링
  );
};

export default Modal;
